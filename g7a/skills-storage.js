// 保留 v1 数据。第一次写入新题号时，把仍在使用的记录迁移到 v2。
const prefix = 'g7a-skills-v2:';
const legacyPrefix = 'g7a-skills-v1:';
const emptyRecord = () => ({ data: {}, version: null, sequence: 0 });
const forkPrefix = (key) => prefix + 'snapshot:' + encodeURIComponent(key) + ':';
const backupPrefix = (key) => prefix + 'conflict:' + encodeURIComponent(key) + ':';
const forkMarker = (key) => prefix + 'has-snapshots:' + key;

function parseObject(raw) {
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function recordsUnder(storage, start) {
  const records = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(start)) continue;
    const record = parseObject(storage.getItem(key));
    if (record?.data && typeof record.data === 'object') records.push({ ...record, backupKey: key });
  }
  return records;
}

function isVersioned(record) {
  return typeof record?.version === 'string' && Number.isSafeInteger(record.sequence)
    && record.sequence > 0 && record.data && typeof record.data === 'object';
}

function attemptNumber(data) {
  return Number.isSafeInteger(data.attempt) && data.attempt > 0 ? data.attempt : 1;
}

function newerRecord(current, candidate) {
  const currentAttempt = attemptNumber(current.data);
  const candidateAttempt = attemptNumber(candidate.data);
  if (currentAttempt !== candidateAttempt) return candidateAttempt > currentAttempt;
  if (Boolean(current.data.submitted) !== Boolean(candidate.data.submitted)) return !!candidate.data.submitted;
  if (current.sequence !== candidate.sequence) return candidate.sequence > current.sequence;
  return candidate.version > current.version;
}

function readCurrent(storage, key, legacyKey) {
  const primary = parseObject(storage.getItem(prefix + key));
  const old = isVersioned(primary) || legacyKey === null ? null : storage.getItem(legacyPrefix + legacyKey);
  const legacy = parseObject(old);
  let current = isVersioned(primary) ? primary
    : legacy ? { data: legacy, version: 'legacy:' + old, sequence: 0 } : emptyRecord();

  if (storage.getItem(forkMarker(key))) {
    for (const candidate of recordsUnder(storage, forkPrefix(key))) {
      if (isVersioned(candidate) && newerRecord(current, candidate)) current = candidate;
    }
  }
  return current;
}

export function loadRecord(key, legacyKey = key) {
  try {
    const { data, version } = readCurrent(localStorage, key, legacyKey);
    return { data, version };
  } catch {
    return { data: {}, version: null };
  }
}

// 订正可以继续改。只有完整归档旧作答，才允许开始下一次初答。
function keepsSubmittedRecord(current, incoming) {
  const previous = current.history ?? [];
  const retained = Array.isArray(incoming.history) ? incoming.history : [];
  if (Array.isArray(previous) && !previous.every((entry, i) =>
    JSON.stringify(entry) === JSON.stringify(retained[i]))) return false;
  if (!current.submitted) return true;

  if (attemptNumber(incoming) === attemptNumber(current)) {
    return incoming.submitted === true && incoming.draft === current.draft;
  }
  if (attemptNumber(incoming) !== attemptNumber(current) + 1 || incoming.submitted !== false) return false;

  const archived = retained[Array.isArray(previous) ? previous.length : 0];
  if (!archived || attemptNumber(archived) !== attemptNumber(current)) return false;
  return ['draft', 'revision'].every((field) => (archived[field] ?? '') === (current[field] ?? ''))
    && ['submitted', 'usedHint', 'viewedExample', 'revisionDone', 'keptOriginal']
      .every((field) => Boolean(archived[field]) === Boolean(current[field]));
}

function token() {
  return Date.now().toString(36) + '-' + (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
}

function storeConflict(storage, key, data, backupKey) {
  const start = backupPrefix(key);
  const target = typeof backupKey === 'string' && backupKey.startsWith(start)
    ? backupKey : start + token();
  storage.setItem(target, JSON.stringify({ data, createdAt: Date.now() }));
  return target;
}

export function saveConflictDraft(key, data, backupKey) {
  try {
    return storeConflict(localStorage, key, data, backupKey);
  } catch {
    return null;
  }
}

function conflict(storage, key, incoming, current, existingBackup) {
  let backupKey = existingBackup;
  if (!backupKey) {
    try {
      backupKey = storeConflict(storage, key, incoming);
    } catch {
      // 页面仍可显示并复制未保存的内容。
    }
  }
  return { status: 'conflict', data: current.data, version: current.version, backupKey, backupData: incoming };
}

function save(key, data, expectedVersion, legacyKey, locked) {
  try {
    const storage = localStorage;
    const current = readCurrent(storage, key, legacyKey);
    if (current.version !== expectedVersion || !keepsSubmittedRecord(current.data, data)) {
      return conflict(storage, key, data, current);
    }

    const version = token();
    const record = {
      data, version, sequence: current.sequence + 1, createdAt: Date.now(),
      parent: current.version,
      fallbackBase: current.backupKey ? current.version : current.fallbackBase,
    };
    if (locked) {
      storage.setItem(prefix + key, JSON.stringify(record));
    } else {
      // 没有跨页锁时，各页写入独立快照，避免两页刚好同时保存时
      // 直接覆盖另一份稿。优先显示同一次练习已提交的记录。
      const backupKey = forkPrefix(key) + version;
      storage.setItem(forkMarker(key), '1');
      storage.setItem(backupKey, JSON.stringify(record));
    }
    return { status: 'saved', data, version };
  } catch {
    return { status: 'unavailable', data, version: expectedVersion };
  }
}

export async function saveRecord(key, data, expectedVersion, legacyKey = key) {
  try {
    // 提交到队列前拍下这一版，以免等待锁期间接着输入改动它。
    const snapshot = JSON.parse(JSON.stringify(data));
    try {
      const locks = globalThis.navigator?.locks;
      if (locks?.request) {
        return await locks.request(prefix + 'write:' + key, () =>
          save(key, snapshot, expectedVersion, legacyKey, true));
      }
    } catch {
      // 浏览器或权限策略可能不允许使用锁。
    }
    const tentative = save(key, snapshot, expectedVersion, legacyKey, false);
    if (tentative.status !== 'saved') return tentative;
    // 给其它页面同一时刻的写入一次同步机会。若更晚到达，
    // 两份快照仍都保留，可由下一次读取或保存检测。
    await new Promise((resolve) => setTimeout(resolve, 50));
    const storage = localStorage;
    const latest = readCurrent(storage, key, legacyKey);
    return latest.version === tentative.version ? tentative
      : conflict(storage, key, snapshot, latest, forkPrefix(key) + tentative.version);
  } catch {
    return { status: 'unavailable', data, version: expectedVersion };
  }
}

export function loadConflict(backupKey) {
  if (!backupKey?.startsWith(prefix + 'conflict:') && !backupKey?.startsWith(prefix + 'snapshot:')) return null;
  try {
    const record = parseObject(localStorage.getItem(backupKey));
    return record?.data ? { backupKey, data: record.data, createdAt: record.createdAt } : null;
  } catch {
    return null;
  }
}

export function listConflicts(key, legacyKey = key) {
  try {
    const storage = localStorage;
    const explicit = recordsUnder(storage, backupPrefix(key));
    const snapshots = recordsUnder(storage, forkPrefix(key)).filter(isVersioned);
    const ancestors = new Set();
    const head = readCurrent(storage, key, legacyKey);
    const byVersion = new Map(snapshots.map((record) => [record.version, record]));

    for (let record = head; record && !ancestors.has(record.version);) {
      ancestors.add(record.version);
      record = byVersion.get(record.parent) ?? byVersion.get(record.fallbackBase);
    }
    return [...explicit, ...snapshots.filter((record) => !ancestors.has(record.version))]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ backupKey, data, createdAt }) => ({ backupKey, data, createdAt }));
  } catch {
    return [];
  }
}
