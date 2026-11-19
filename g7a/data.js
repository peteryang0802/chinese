/* ============================================================
   统编版（人教版）2024 七年级上册 · 数据
   目录与课文内容集中管理，供目录页与课文页渲染使用
   ============================================================ */

var BOOK_G7A = {
  id: 'g7a',
  title: '七年级上册',
  units: [
    {
      id:1, color:'var(--u1)', title:'四季之景', theme:'阅读',
      lessons:[
        {no:1, star:false, title:'春', author:'朱自清', type:'写景散文', id:'l1'},
        {no:2, star:false, title:'济南的冬天', author:'老舍', type:'写景散文', id:'l2'},
        {no:3, star:true,  title:'雨的四季', author:'刘湛秋', type:'写景散文', id:'l3'},
        {no:4, star:false, title:'古代诗歌四首', author:'曹操·王湾·李白·马致远', type:'古诗词', id:'l4'}
      ],
      extras:[
        {label:'阅读综合实践 · 朗读的重音与停连', href:'practice-1.html'},
        {label:'写作 · 热爱写作，学会观察', href:'writing-1.html'}
      ]
    },
    {
      id:2, color:'var(--u2)', title:'亲情与友情', theme:'阅读',
      lessons:[
        {no:5, star:false, title:'秋天的怀念', author:'史铁生', type:'叙事散文', id:'l5'},
        {no:6, star:false, title:'散步', author:'莫怀戚', type:'叙事散文', id:'l6'},
        {no:7, star:true,  title:'散文诗二首', author:'泰戈尔·冰心', type:'散文诗', id:'l7'},
        {no:8, star:false, title:'《世说新语》二则', author:'刘义庆（组织编写）', type:'文言文', id:'l8'}
      ],
      extras:[
        {label:'阅读综合实践 · 语气语调与词语的妙处', href:'practice-2.html'},
        {label:'写作 · 学会记事', href:'writing-2.html'},
        {label:'专题学习活动 · 有朋自远方来', href:'topic-2.html'}
      ]
    },
    {
      id:3, color:'var(--u3)', title:'成长与学习', theme:'阅读',
      lessons:[
        {no:9, star:false, title:'从百草园到三味书屋', author:'鲁迅', type:'叙事散文', id:'l9'},
        {no:10, star:false, title:'往事依依', author:'于漪', type:'叙事散文', id:'l10'},
        {no:11, star:true,  title:'再塑生命的人', author:'海伦·凯勒', type:'叙事散文', id:'l11'},
        {no:12, star:false, title:'《论语》十二章', author:'孔子及其弟子', type:'文言文', id:'l12'}
      ],
      extras:[
        {label:'阅读综合实践 · 梳理文章中心', href:'practice-3.html'},
        {label:'写作 · 如何突出中心', href:'writing-3.html'},
        {label:'整本书阅读 ·《朝花夕拾》', href:'book-3.html'},
        {label:'课外古诗词诵读（4首）', href:'poems-3.html'}
      ]
    },
    {
      id:4, color:'var(--u4)', title:'人生之舟', theme:'阅读',
      lessons:[
        {no:13, star:false, title:'纪念白求恩', author:'毛泽东', type:'议论文', id:'l13'},
        {no:14, star:false, title:'回忆我的母亲', author:'朱德', type:'叙事散文', id:'l14'},
        {no:15, star:true,  title:'梅岭三章', author:'陈毅', type:'现代诗', id:'l15'},
        {no:16, star:false, title:'诫子书', author:'诸葛亮', type:'文言文', id:'l16'}
      ],
      extras:[
        {label:'阅读综合实践 · 理清文章思路', href:'practice-4.html'},
        {label:'写作 · 思路要清晰', href:'writing-4.html'},
        {label:'专题学习活动 · 少年正是读书时', href:'topic-4.html'}
      ]
    },
    {
      id:5, color:'var(--u5)', title:'人与动物', theme:'活动·探究',
      lessons:[
        {no:17, star:false, title:'猫', author:'郑振铎', type:'叙事散文', id:'l17'},
        {no:18, star:false, title:'我的白鸽', author:'陈忠实', type:'叙事散文', id:'l18'},
        {no:19, star:false, title:'大雁归来', author:'利奥波德', type:'说明散文', id:'l19'},
        {no:20, star:false, title:'狼', author:'蒲松龄', type:'文言文', id:'l20'}
      ],
      extras:[
        {label:'任务二 · 亲近动物，丰富生命体验', href:'task-5b.html'},
        {label:'任务三 · 记叙与动物的相处', href:'task-5c.html'}
      ]
    },
    {
      id:6, color:'var(--u6)', title:'想象之翼', theme:'阅读',
      lessons:[
        {no:21, star:false, title:'小圣施威降大圣', author:'吴承恩', type:'古典小说', id:'l21'},
        {no:22, star:false, title:'皇帝的新装', author:'安徒生', type:'童话', id:'l22'},
        {no:23, star:true,  title:'女娲造人', author:'袁珂', type:'神话', id:'l23'},
        {no:24, star:false, title:'寓言四则', author:'《伊索寓言》（罗念生等译）、《吕氏春秋》、《列子》', type:'寓言', id:'l24'}
      ],
      extras:[
        {label:'阅读综合实践 · 想象与联想', href:'practice-6.html'},
        {label:'写作 · 发挥联想和想象', href:'writing-6.html'},
        {label:'整本书阅读 ·《西游记》', href:'book-6.html'},
        {label:'课外古诗词诵读（4首）', href:'poems-6.html'}
      ]
    }
  ]
};

/* 课文内容：按 l1..l24 索引，逐单元填充 */
var LESSONS_G7A = {
  l1: {
    kind:'写景散文', author:'朱自清',
    lead:'全文六百多字，写盼春、绘春、赞春，绘春里藏着五幅春日小图。先从一个字看起。',
    prep:{
      title:'课前看一眼 · 先说说春天',
      blocks:[
        {t:'html', h:'<p class="guess-ask">还没读课文，提到“春天”，你最先想到下面哪一样？点一下就行，不用打字。</p>'},
        {t:'choices', id:'l1-warm', save:'l1-warm', options:[
          {v:'green', label:'一片新绿'},
          {v:'flower', label:'花开'},
          {v:'wind', label:'暖风'},
          {v:'rain', label:'细雨'}
        ]},
        {t:'buttons', buttons:[
          {label:'我选好了，进课文看朱自清怎么写', kind:'primary', post:true}
        ]}
      ]
    },
    read:{
      title:'读懂 · 一个字，一幅图',
      blocks:[
        {t:'html', h:'<p class="step-hint">先看朱自清怎么写第一棵小草。下面两个字，点标签切换，同屏看两幅图。</p>'},
        {t:'compare', id:'l1-cmp', options:[
          {v:'zuan', label:'钻', svg:'<svg viewBox="0 0 360 170" role="img" aria-label="小草使着劲钻破泥土"><line x1="20" y1="130" x2="340" y2="130" stroke="#5d6763" stroke-width="2"/><path d="M120 95 q20 -14 40 0 q20 -12 40 2 q18 -10 36 2 l4 18 h-124 z" fill="#c07a3e" opacity="0.9"/><path d="M150 92 l6 14 M200 90 l4 16" stroke="#8a5a2e" stroke-width="2" fill="none"/><path d="M140 130 q-2 -28 4 -40 M140 100 q-10 -8 -16 -6 M140 100 q10 -10 16 -6" stroke="#4a7c59" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M200 130 q0 -30 6 -42 M206 96 q-10 -8 -16 -4 M206 96 q10 -8 14 -2" stroke="#4a7c59" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M180 58 l-8 10 8 10 M180 68 l14 0" stroke="#a84b43" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>', note:'“钻”：小草使着劲，把头顶的土块都顶裂了，有一股冲劲。'},
          {v:'chang', label:'长', svg:'<svg viewBox="0 0 360 170" role="img" aria-label="小草静静长高"><line x1="20" y1="130" x2="340" y2="130" stroke="#5d6763" stroke-width="2"/><path d="M120 130 q-2 -34 4 -48 M124 88 q-10 -8 -16 -4 M124 88 q10 -8 16 -2" stroke="#4a7c59" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M180 130 q0 -36 6 -50 M186 84 q-10 -6 -16 -2 M186 84 q10 -6 14 0" stroke="#4a7c59" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M240 130 q2 -32 -4 -46 M236 90 q10 -8 16 -4 M236 90 q-10 -8 -14 -2" stroke="#4a7c59" stroke-width="4" fill="none" stroke-linecap="round"/></svg>', note:'“长”：小草静静长高，没有土块、没有那股顶裂泥土的冲劲。'}
        ]},
        {t:'html', h:'<p class="guess-ask">哪个字写出了小草使着劲、压不住的生命力？</p>'},
        {t:'choices', id:'l1-zuan', save:'l1-zuan', options:[
          {v:'zuan', label:'钻'},
          {v:'chang', label:'长'},
          {v:'unsure', label:'还说不准'}
        ]},
        {t:'html', h:'<p class="step-hint">绘春一共五幅图。每幅的原文都在下面，你选哪一幅，都能在这儿找到那几个字。</p>'},
        {t:'prose', noteId:'l1-pics', paras:[
          '<strong>春草图：</strong>小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。',
          '<strong>春花图：</strong>桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。',
          '<strong>春风图：</strong>“吹面不寒杨柳风”，不错的，像母亲的手抚摸着你。',
          '<strong>春雨图：</strong>雨是最寻常的，一下就是三两天。可别恼。看，像牛毛，像花针，像细丝，密密地斜织着，人家屋顶上全笼着一层薄烟。',
          '<strong>迎春图：</strong>城里乡下，家家户户，老老小小，他们也赶趟儿似的，一个个都出来了。舒活舒活筋骨，抖擞抖擞精神，各做各的一份事去。“一年之计在于春”，刚起头儿，有的是工夫，有的是希望。'
        ]},
        {t:'prose', noteId:'l1-note', paras:[
          '小草<span class="word w-green" data-note="拟人：小草像调皮的孩子，悄没声儿就冒出来了。">偷偷地</span>从土里<span class="word w-green" data-note="一个“钻”字，写出小草使着劲、冲破泥土的生命力。">钻</span>出来，嫩嫩的，绿绿的。',
          '花下成千成百的蜜蜂嗡嗡地<span class="word w-gold" data-note="拟人：“闹”字既有声音又有热闹劲儿，比“叫”鲜活。">闹</span>着，大小的蝴蝶飞来飞去。<span class="excerpt">（节选自春花图一段）</span>',
          '“吹面不寒杨柳风”，不错的，<span class="word w-key" data-note="比喻，从触觉写春风，又轻又软。">像母亲的手抚摸着你</span>。'
        ]},
        {t:'compare', id:'l1-touch', options:[
          {v:'plain', label:'直说', note:'“春风吹在脸上很暖。”——意思清楚，但只有一个“暖”，感觉不到风是怎么碰到你的。'},
          {v:'metaphor', label:'比喻', note:'“像母亲的手抚摸着你。”——“抚摸”让风有了动作和温度，像被人轻轻碰，更软、更亲。'}
        ]},
        {t:'cards', items:[
          {front:'拟人', back:'把物当人写。如“春天的脚步近了”“小草偷偷地”，让景物有了人的动作和脾气。'},
          {front:'比喻', back:'打比方。如把春风比作母亲的手，抽象的风变得可感可触。'},
          {front:'排比', back:'三句结构相近的话排一起。如“山朗润起来了，水涨起来了，太阳的脸红起来了”，有气势。'},
          {front:'叠词', back:'嫩嫩的、绿绿的、轻悄悄、软绵绵，读起来有节奏，也更显柔和。'}
        ]}
      ]
    },
    back:{
      title:'课后想一想 · 把文字读成自己的',
      blocks:[
        {t:'bigq', q:'五幅图里你最喜欢哪一幅？回到上面那幅的原文，找出你最有感觉的那几个字，写下来。', save:'l1-back1'},
        {t:'bigq', q:'抬头看看窗外，用一句话写“我眼里的春”，可以学着用一个比喻或拟人。', save:'l1-back2'}
      ]
    }
  },

  l2: {
    kind:'写景散文', author:'老舍',
    lead:'抓住一个“温晴”写济南的冬天——又暖和又晴朗，山水都带着人情味。',
    prep:{
      title:'热身 · 先猜一个字',
      blocks:[
        {t:'bigq', q:'你印象里冬天是什么感觉？如果只用一个字形容，你会用哪个字？', save:'l2-prep'}
      ]
    },
    read:{
      title:'读懂 · 四幅图，都围着“温晴”转',
      blocks:[
        {t:'timeline', items:[
          {t:'阳光朗照的山', d:'小山像摇篮，把济南护在里头'},
          {t:'薄雪覆盖的山', d:'矮松像看护妇，雪像害羞的少女'},
          {t:'城外远山', d:'小村庄卧着，像一张小水墨画'},
          {t:'冬天的水', d:'水舍不得冻上，全城像块蓝水晶'}
        ]},
        {t:'prose', noteId:'l2-note', paras:[
          '在北中国的冬天，而能有<span class="word w-gold" data-note="文眼：又暖和又晴朗，全文都围着这两个字。">温晴</span>的天气，济南真得算个宝地。',
          '这一圈小山在冬天特别可爱，好像是把济南放在一个<span class="word w-key" data-note="比喻加拟人：小山像摇篮护着济南，看着就暖和。">小摇篮</span>里，他们全安静不动地低声地说：“你们放心吧，这儿准保暖和。”',
          '等到快日落的时候，微黄的阳光斜射在山腰上，那点儿薄雪好像忽然<span class="word w-red" data-note="拟人：薄雪像害羞的少女，露出一点粉色。">害了羞</span>，微微露出点儿粉色。',
          '就凭这些绿的精神，水也<span class="word w-green" data-note="拟人：水也有了善心，舍不得冻上，处处是春意。">不忍得</span>冻上；况且那长枝的垂柳还要在水里照个影儿呢。',
          '看吧，由澄清的河水慢慢往上看吧，空中，半空中，天上，自上而下全是那么清亮，那么蓝汪汪的，整个的是块空灵的<span class="word w-purple" data-note="比喻：全城清亮通透，像一块蓝水晶。">蓝水晶</span>。'
        ]},
        {t:'cards', items:[
          {front:'对比', back:'拿北平的风、伦敦的雾、热带的烈日跟济南比，一对比，温晴就显出来了。'},
          {front:'拟人', back:'山会说话、雪会害羞、水不忍得冻上，景物都有了人的脾气。'},
          {front:'比喻', back:'小山像摇篮、矮松像看护妇、全城像蓝水晶，样子一下就具体了。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪个词最让你觉得暖',
      blocks:[
        {t:'bigq', q:'全文里最让你觉得“暖”的是哪个词或哪句话？你是从哪几个字感觉到的？', save:'l2-back1'}
      ]
    }
  },

  l3: {
    kind:'自读 · 写景散文', author:'刘湛秋',
    lead:'这是一篇自读课文，不用逐句讲，自己读、自己品。一年四季的雨，脾气各不相同。',
    prep:{
      title:'热身 · 先说你和雨',
      blocks:[
        {t:'bigq', q:'你喜欢下雨天吗？下雨的时候你最爱做什么？', save:'l3-prep'}
      ]
    },
    read:{
      title:'读懂 · 四季的雨，四种脾气',
      blocks:[
        {t:'timeline', items:[
          {t:'春雨', d:'娇媚，水珠比少女的眼泪还柔'},
          {t:'夏雨', d:'热烈而又粗犷，来得痛快'},
          {t:'秋雨', d:'不再有春的娇媚和夏的粗犷，显出端庄与沉静'},
          {t:'冬雨', d:'自然平静，常变成雪花飘下来'}
        ]},
        {t:'prose', noteId:'l3-note', paras:[
          '水珠子从花苞里滴下来，<span class="word w-red" data-note="比喻：把水珠比作少女的眼泪，娇媚，惹人怜爱。">比少女的眼泪还娇媚</span>。',
          '夏天的雨也有夏天的性格，<span class="word w-gold" data-note="夏雨的性格：来得猛、来得痛快，不遮不掩。">热烈而又粗犷</span>。',
          '雨，似乎不再有春的娇媚和夏的粗犷，而显出秋的<span class="word w-purple" data-note="拟人：秋雨端庄、沉静，像安静下来的人。">端庄与沉静</span>了。',
          '但在南国，雨仍然偶尔造访大地，但它变得更<span class="word w-key" data-note="拟人：冬雨下雨少了，轻轻的、不张扬。">吝啬</span>了。'
        ]}
      ]
    },
    back:{
      title:'回味 · 自己读出来的味道',
      blocks:[
        {t:'bigq', q:'四季的雨你最喜欢哪一季？把让你心动的那几个字摘下来，说说为什么。', save:'l3-back1'}
      ]
    }
  },

  l4: {
    kind:'古诗词', author:'曹操·王湾·李白·马致远',
    lead:'四首诗，四种心境。先让文字在脑子里变成画面，再读背后的情感。',
    prep:{
      title:'课前看一眼 · 先选一首',
      blocks:[
        {t:'html', h:'<p class="guess-ask">把一首诗看成一段小视频，你最想先“看见”哪一首？点一下就行。</p>'},
        {t:'choices', id:'l4-warm', save:'l4-warm', options:[
          {v:'canghai', label:'大海（观沧海）'},
          {v:'beigu', label:'行舟（次北固山下）'},
          {v:'mingyue', label:'明月（闻王昌龄）'},
          {v:'qiusi', label:'秋日黄昏（天净沙）'}
        ]},
        {t:'buttons', buttons:[
          {label:'我选好了，进课文', kind:'primary', post:true}
        ]}
      ]
    },
    read:{
      title:'读懂 · 一首一首读出画面',
      blocks:[
        {t:'verse', noteId:'l4-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">观沧海 · 曹操</span>',
          '东临碣石，以<span class="word w-key" data-note="诗眼：全诗由这个“观”字统领，下面都是他看到、想到的。">观</span>沧海。',
          '水何澹澹，山岛竦峙。',
          '树木丛生，百草丰茂。',
          '秋风萧瑟，洪波涌起。',
          '日月之行，<span class="word w-gold" data-note="虚景、想象：日月星辰像从大海里起落，写出大海吞吐天地的气魄。">若出其中</span>；星汉灿烂，若出其里。',
          '幸甚至哉，歌以咏志。'
        ]},
        {t:'verse', noteId:'l4-n3', lines:[
          '<span style="font-size:.78em;color:var(--muted)">次北固山下 · 王湾</span>',
          '客路青山外，行舟绿水前。',
          '潮平两岸阔，风正一帆悬。',
          '<span class="word w-gold" data-note="“生”“入”是拟人：新日新春从旧夜里冒出来，新旧交替，积极有力量。">海日生残夜，江春入旧年</span>。',
          '乡书何处达，<span class="word w-green" data-note="想托北归的大雁捎一封家书，思乡落在这两个字上。">归雁</span>洛阳边。'
        ]},
        {t:'verse', noteId:'l4-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">闻王昌龄左迁龙标遥有此寄 · 李白</span>',
          '<span class="word w-red" data-note="杨花漂泊、子规啼“不如归去”，一开篇就染上离别和牵挂。">杨花落尽子规啼</span>，闻道龙标过五溪。',
          '<span class="word w-key" data-note="拟人：把明月当成懂心事的信使，陪朋友一路到远方。">我寄愁心与明月</span>，随君直到夜郎西。'
        ]},
        {t:'step', id:'l4-qiu', blocks:[
          {t:'html', h:'<h3 class="step-title">天净沙 · 秋思 · 马致远</h3>'},
          {t:'verse', noteId:'l4-n4', lines:[
            '<span class="word w-red" data-note="藤是干枯的，没有一点生气。">枯藤</span><span class="word w-red" data-note="树是苍老的，不是葱茏的新树。">老树</span><span class="word w-red" data-note="黄昏归巢的乌鸦，天色一点点暗下来。">昏鸦</span>，',
            '小桥流水人家，',
            '古道西风<span class="word w-red" data-note="马是瘦的，走了很远的路；骑马的人也一样疲惫。">瘦马</span>。'
          ]},
          {t:'html', h:'<p class="guess-ask">先不看最后一句。这几样东西里，哪个字让你觉得画面有点凉、有点冷清？</p>'},
          {t:'choices', id:'l4-cold', save:'l4-cold', options:[
            {v:'ku', label:'枯'},
            {v:'lao', label:'老'},
            {v:'hun', label:'昏'},
            {v:'shou', label:'瘦'}
          ]},
          {t:'html', h:'<p class="step-hint">中间还夹着一句“小桥流水人家”——别人家里有水有桥，暖暖地住着。它和旁边的枯藤、瘦马放在一起，你读着是什么感觉？</p>'},
          {t:'choices', id:'l4-home', save:'l4-home', options:[
            {v:'contrast', label:'越看别人的家，越觉得自己孤单'},
            {v:'warm', label:'路上也有一点暖，不全是冷'},
            {v:'unsure', label:'还说不准'}
          ]},
          {t:'buttons', buttons:[
            {label:'展开最后一句，看看人在哪儿', kind:'primary', show:'#l4-last'}
          ]},
          {t:'step', id:'l4-last', hidden:true, blocks:[
            {t:'verse', noteId:'l4-n4last', lines:[
              '夕阳西下，<span class="word w-red" data-note="“断肠”是夸张，形容愁到极点、思乡到心痛。">断肠</span>人在天涯。'
            ]},
            {t:'html', h:'<p class="step-hint">读到这儿再回看：枯、老、昏、瘦，加上“小桥流水人家”，都在烘托这个漂泊在外、回不了家的人。</p>'},
            {t:'bigq', q:'哪个字最改变你对这幅画面的感觉？把它写下来，说说为什么。', save:'l4-qiu-turn'}
          ]}
        ]}
      ]
    },
    back:{
      title:'课后想一想 · 读出你自己的感受',
      blocks:[
        {t:'bigq', q:'四首诗里哪一句最让你有画面感？把那几个字抄下来，说说你看见了什么。', save:'l4-back1'},
        {t:'bigq', q:'同一句诗，不同人读感受可能不一样。选一首，用一句话写下你自己的读法。', save:'l4-back2'}
      ]
    }
  },

  l5: {
    kind:'叙事散文', author:'史铁生',
    lead:'作者双腿瘫痪后脾气暴躁，母亲身患重病还小心照顾他。全文用“看花”串起三次往事。',
    prep:{
      title:'热身 · 先说说你自己',
      blocks:[
        {t:'bigq', q:'你有没有过特别难受、忍不住想发脾气的时候？那会儿你最希望身边的人怎么对你？', save:'l5-prep'}
      ]
    },
    read:{
      title:'读懂 · 一个个动作里的母爱',
      blocks:[
        {t:'timeline', items:[
          {t:'第一次提看花', d:'母亲劝“我”去北海走走，“我”暴怒拒绝，没去成'},
          {t:'第二次提看花', d:'“我”答应明天去，母亲却突然病逝，没能成行'},
          {t:'终于去看花', d:'又是秋天，妹妹陪“我”看菊花，懂了“好好儿活”'}
        ]},
        {t:'prose', noteId:'l5-note', paras:[
          '母亲就<span class="word w-key" data-note="让“我”痛快发泄，又偷偷听着怕“我”出事，爱是体谅和小心。">悄悄地躲出去</span>，在我看不见的地方偷偷地听着我的动静。',
          '母亲<span class="word w-red" data-note="她比“我”还痛，却先忍住哭声撑住“我”。">扑过来抓住我的手，忍住哭声</span>说：“咱娘儿俩在一块儿，<span class="word w-gold" data-note="母亲反复说的话，要“我”坚强活下去，也是她自己在跟命较劲。">好好儿活</span>，好好儿活……”',
          '母亲进来了，<span class="word w-green" data-note="怕“我”看见落叶触景伤情，一个动作全是细心。">挡在窗前</span>：“北海的菊花开了，我推着你去看看吧。”'
        ]},
        {t:'cards', items:[
          {front:'细节描写', back:'躲、扑、抓、忍、挡，小动作写出母亲的细心和深情，比直接说“妈妈很爱我”更动人。'},
          {front:'插叙', back:'中间插入母亲病重、邻居的话，让我们知道她忍着多大的痛还在照顾儿子。'},
          {front:'景物衬托', back:'结尾烂漫的菊花，衬托“我”走出低谷、要好好活下去，也象征母亲的精神。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪个细节最戳你',
      blocks:[
        {t:'bigq', q:'全文哪个细节最让你心里一动？把那几个字摘下来，说说你读出了什么。', save:'l5-back1'}
      ]
    }
  },

  l6: {
    kind:'叙事散文', author:'莫怀戚',
    lead:'一家四口初春散步，为走大路还是小路起了“分歧”。一件小事，写出中年人的责任。',
    prep:{
      title:'热身 · 先说说散步',
      blocks:[
        {t:'bigq', q:'你家一起散步或出门时，有没有谁迁就谁的小事？简单说说。', save:'l6-prep'}
      ]
    },
    read:{
      title:'读懂 · 小事里读出大道理',
      blocks:[
        {t:'dots', items:[
          '一家四口：我、母亲、妻子、儿子',
          '分歧：母亲要走大路，儿子要走小路',
          '我决定走大路，因为陪母亲的日子已短',
          '母亲改走小路，难走的地方我背她、妻子背儿子'
        ]},
        {t:'prose', noteId:'l6-note', paras:[
          '今年的春天来得太迟，太迟了，有一些老人挺不住，在清明将到的时候去世了。但是春天总算来了。我的母亲又<span class="word w-gold" data-note="写出冬天的难，也写出“我”庆幸母亲挺过来了。">熬</span>过了一个严冬。',
          '后来发生了<span class="word w-red" data-note="大词小用：把走哪条路说成“分歧”，幽默里见郑重。">分歧：我的母亲要走大路，大路平顺；我的儿子要走小路，小路有意思</span>……一霎时，我感到了<span class="word w-key" data-note="人到中年上有老下有小，一个选择背后是责任。">责任的重大</span>，就像领袖人物在严重关头时那样。',
          '好像我背上的同她背上的加起来，就是<span class="word w-purple" data-note="母亲代表过去、儿子代表未来，加起来就是整个世界。">整个世界</span>。'
        ]},
        {t:'cards', items:[
          {front:'以小见大', back:'借一次散步写亲情和责任，小事里藏着大主题。'},
          {front:'大词小用', back:'把“分歧”“责任”“整个世界”用在散步上，既幽默又显得郑重。'},
          {front:'对称句', back:'“前面也是妈妈和儿子，后面也是妈妈和儿子”，句式整齐，有对称美和情趣。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 你怎么理解“整个世界”',
      blocks:[
        {t:'bigq', q:'结尾的“整个世界”你怎么理解？你是从哪几个字读出来的？', save:'l6-back1'}
      ]
    }
  },

  l7: {
    kind:'散文诗', author:'泰戈尔·冰心',
    lead:'两首诗都写母爱：一首是孩子变成花悄悄陪妈妈，一首是荷叶为红莲挡风雨。',
    prep:{
      title:'热身 · 先放飞一下想象',
      blocks:[
        {t:'bigq', q:'如果你能变成一样东西，悄悄守在妈妈身边，你想变成什么？想做什么？', save:'l7-prep'}
      ]
    },
    read:{
      title:'读懂 · 藏起来的爱',
      blocks:[
        {t:'dots', items:[
          '金色花·三次嬉戏：让妈妈嗅到花香、把影子投在书页上、黄昏落回地上',
          '荷叶·母亲：雨中大荷叶倾侧下来，盖住被雨打斜的红莲'
        ]},
        {t:'prose', noteId:'l7-note', paras:[
          '你要是叫道：“孩子，你在哪里呀？”我暗暗地在那里<span class="word w-gold" data-note="偷偷地笑，孩子的调皮。">匿笑</span>，却一声儿不响。',
          '我便要<span class="word w-key" data-note="把影子投在妈妈正读的书页上，是悄悄陪着妈妈；是不是替她遮阳，是我们的推断。">投我的小小的影子在你的书页上，正投在你所读的地方</span>。但是你会猜得出这就是你的孩子的小小影子吗？',
          '“你到哪里去了，你这<span class="word w-red" data-note="贬词褒用：妈妈又急又喜，这是疼爱的嗔怪，不是真的责怪。">坏孩子</span>？”',
          '母亲啊！你是荷叶，我是红莲。<span class="word w-green" data-note="“心中的雨点”指人生的磨难，只有妈妈会替“我”遮挡。">心中的雨点来了，除了你，谁是我在无遮拦天空下的荫蔽</span>？'
        ]},
        {t:'cards', items:[
          {front:'想象', back:'《金色花》假想孩子变成花，用儿童的视角写爱，新奇又有童趣。'},
          {front:'借物喻人', back:'《荷叶·母亲》借荷叶护红莲，写妈妈保护孩子，托物言情。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 读出“坏”里的爱',
      blocks:[
        {t:'bigq', q:'妈妈说的“坏孩子”是真的坏吗？你是从哪几个字听出她的心情的？', save:'l7-back1'}
      ]
    }
  },

  l8: {
    kind:'文言文', author:'刘义庆（组织编写）',
    lead:'《世说新语》是南朝宋刘义庆组织编写的志人小说集。下面两个小故事，一个比谁的比喻妙，一个看七岁孩子怎么讲道理。字词在上下文里猜。',
    prep:{
      title:'热身 · 先说一件身边事',
      blocks:[
        {t:'bigq', q:'朋友约好中午见面却迟到很久，你会怎么想、怎么办？', save:'l8-prep'}
      ]
    },
    read:{
      title:'读懂 · 一则一则来',
      blocks:[
        {t:'verse', noteId:'l8-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">咏雪</span>',
          '谢太傅寒雪日内集，与儿女讲论文义。俄而雪骤，公欣然曰：“白雪纷纷<span class="word w-key" data-note="像什么。">何所似</span>？”',
          '兄子胡儿曰：“撒盐空中<span class="word w-gold" data-note="大体可以相比。">差可拟</span>。”',
          '兄女曰：“<span class="word w-red" data-note="不如。">未若</span>柳絮<span class="word w-red" data-note="趁着风飘起来。“因”是趁、乘。">因风起</span>。”公大笑乐。',
          '即公大兄无奕女，左将军王凝之妻也。'
        ]},
        {t:'choices', id:'l8c1', options:[
          {v:'salt', label:'撒盐更像'},
          {v:'catkin', label:'柳絮更妙'},
          {v:'both', label:'各有各的好'}
        ]},
        {t:'verse', noteId:'l8-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">陈太丘与友期行</span>',
          '陈太丘与友<span class="word w-key" data-note="约定，不是今天说的“日期”。">期</span>行，期日中。过中不至，太丘<span class="word w-gold" data-note="不再等候，丢下他走了。">舍去</span>，去后乃至。',
          '元方时年七岁，门外戏。客问元方：“<span class="word w-purple" data-note="尊君：敬称对方的父亲；家君：谦称自己的父亲。">尊君</span>在不？”答曰：“待君久不至，已去。”',
          '友人便怒曰：“非人哉！与人期行，相委而去。”',
          '元方曰：“<span class="word w-purple" data-note="家君：谦称自己的父亲。">君与家君</span>期日中。日中不至，则是<span class="word w-red" data-note="“无信”：正午没到、说话不算数，是不讲信用，对应失约。">无信</span>；对子骂父，则是<span class="word w-gold" data-note="“无礼”：当着孩子的面骂他父亲，是没有礼貌。">无礼</span>。”友人惭，下车引之。元方入门不<span class="word w-green" data-note="回头看。">顾</span>。'
        ]},
        {t:'cards', items:[
          {front:'古今异义', back:'儿女（古义泛指家里小辈，包括侄儿侄女）、期（约定）、去（离开）、顾（回头看），跟今天的意思不一样。'},
          {front:'谦辞敬辞', back:'尊君敬称别人父亲，家君谦称自己父亲，古人说话很讲分寸。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 你站谁这边',
      blocks:[
        {t:'bigq', q:'友人“惭，下车引之”，这两个动作表明什么？元方“入门不顾”，你觉得他失礼吗？从哪几个字看出来的？', save:'l8-back1'}
      ]
    }
  },

  l9: {
    kind:'回忆性散文', author:'鲁迅',
    lead:'前半写百草园里的自由童年，后半写三味书屋的读书日子，两个地方两种味道。',
    prep:{
      title:'热身 · 先说说你的乐园',
      blocks:[
        {t:'bigq', q:'你小时候有没有一个地方，一去就觉得好玩、舍不得走？简单说说。', save:'l9-prep'}
      ]
    },
    read:{
      title:'读懂 · 从“乐园”到“书屋”',
      blocks:[
        {t:'dots', items:[
          '百草园三件趣事：看各种小生物、听美女蛇的传说、雪地捕鸟',
          '三味书屋：见先生、读书、课间溜到后园偷玩'
        ]},
        {t:'prose', noteId:'l9-note', paras:[
          '<span class="word w-key" data-note="两个“不必说”写整体，“单是”突出局部：光这一点就趣味无穷，别处更不用说。">不必说碧绿的菜畦，光滑的石井栏，高大的皂荚树，紫红的桑椹；也不必说鸣蝉在树叶里长吟，肥胖的黄蜂伏在菜花上，轻捷的叫天子（云雀）忽然从草间直窜向云霄里去了。单是周围的短短的泥墙根一带，就有无限趣味</span>。',
          '油蛉在这里<span class="word w-gold" data-note="拟人：虫鸣像在开音乐会，这是孩子的耳朵。">低唱，蟋蟀们在这里弹琴</span>。',
          '雪地捕鸟：扫开一块雪，<span class="word w-red" data-note="露出地面、鸟雀下来啄食、走到竹筛底下，这些动作交代清楚，再一拉绳就罩住。">露出地面，用一枝短棒支起一面大的竹筛来，下面撒些秕谷，棒上系一条长绳，人远远地牵着，看鸟雀下来啄食，走到竹筛底下的时候，将绳子一拉，便罩住了</span>。一连串动词扫、支、撒、系、牵、拉、罩，把捕鸟写得像在眼前。',
          '我对他很恭敬，因为我早听到，他是本城中极<span class="word w-purple" data-note="鲁迅对私塾先生的评价：严厉，但值得恭敬。">方正，质朴，博学</span>的人。'
        ]},
        {t:'cards', items:[
          {front:'多感官写景', back:'颜色形状用看、虫鸣用听、覆盆子用尝，色声味俱全，画面才立体。'},
          {front:'动静结合', back:'静的菜畦石井栏、动的黄蜂叫天子，一静一动，园子活了。'},
          {front:'对比', back:'百草园的自由和书屋的规矩对照着写，童年的两种味道都出来了。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 你更想去哪儿',
      blocks:[
        {t:'bigq', q:'百草园和三味书屋，你更愿意待在哪边？你是从哪几个字读出来的？', save:'l9-back1'}
      ]
    }
  },

  l10: {
    kind:'回忆性散文', author:'于漪',
    lead:'作者回忆少年时几件跟读书有关的事，看一本书、一位老师，怎么悄悄改变了她。',
    prep:{
      title:'热身 · 先说说反复看的东西',
      blocks:[
        {t:'bigq', q:'有没有一本书、一幅画或一部片子，你反复看也不腻？为什么？', save:'l10-prep'}
      ]
    },
    read:{
      title:'读懂 · 几件往事串起成长',
      blocks:[
        {t:'timeline', items:[
          {t:'看山水画', d:'百看不厌，仿佛走进画里'},
          {t:'读《水浒传》', d:'把家乡风景当成梁山泊，读得津津有味'},
          {t:'读《千家诗》', d:'四季风光在诗句里展开'},
          {t:'听老师讲课', d:'两位老师的朗诵，让她爱上文学'}
        ]},
        {t:'prose', noteId:'l10-note', paras:[
          '读《水浒传》时，会把家乡长江边焦山一带当成梁山泊背景，似乎目睹何涛、黄安率领的官军在茫茫荡荡的焦山下，在芦苇水港中走投无路、狼狈逃窜，犹如身历其境，真是<span class="word w-gold" data-note="读书读得入迷，像亲身在故事里。">津津有味</span>。',
          '后来才懂得，这就是<span class="word w-key" data-note="生动的形象可以形成深刻的记忆，所以小时候读书记得牢。">形象思维</span>的作用，生动的形象可以形成深刻的记忆。',
          '老师入情入理的讲课也在我心上<span class="word w-red" data-note="雕镂就是雕刻，像刻在心上，几十年忘不了。">雕镂</span>下深刻的印象，培养了我课外阅读的兴趣。',
          '老师朗诵时头与肩膀左右摇摆着，真是<span class="word w-purple" data-note="老师投入的样子，把爱国情怀传给了学生。">悲歌慷慨</span>，我们这些做学生的，爱国情怀油然而生。'
        ]}
      ]
    },
    back:{
      title:'回味 · 哪件事让你共鸣',
      blocks:[
        {t:'bigq', q:'这几件往事里，哪一件最让你有共鸣？把那几个字摘下来，说说为什么。', save:'l10-back1'}
      ]
    }
  },

  l11: {
    kind:'自读 · 叙事散文', author:'海伦·凯勒',
    lead:'又盲又聋的海伦，在莎莉文老师的帮助下，从一个字开始，重新认识了世界。自己读，跟着她的心情走。',
    prep:{
      title:'热身 · 先说说一个人',
      blocks:[
        {t:'bigq', q:'有没有一个人，让你觉得“遇到他真好”？简单说说他给了你什么。', save:'l11-prep'}
      ]
    },
    read:{
      title:'读懂 · 一个词打开一扇门',
      blocks:[
        {t:'timeline', items:[
          {t:'老师到来', d:'莎莉文握住她的手，给她爱'},
          {t:'学拼字', d:'先拼娃娃 doll，又学拼针、帽子、杯子等词'},
          {t:'井房领悟', d:'清凉的水流过手，她懂了 water'},
          {t:'第一次悔恨', d:'为摔坏的娃娃掉眼泪'}
        ]},
        {t:'prose', noteId:'l11-note', paras:[
          '突然之间，我感觉到一种<span class="word w-gold" data-note="像有什么被忘记的东西又被想起，那是令人激动的记忆的回归。">模糊的意识</span>——好像有什么被忘记的东西突然之间又被想起，那是令人激动的记忆的回归，神秘的语言就这样<span class="word w-gold" data-note="教材原文是“神奇地”，写语言被理解时的奇妙。">神奇地</span>被阐释清楚了。',
          '我明白了“水”的意思，<span class="word w-key" data-note="注意主语：是“这个有生命的词”唤醒了灵魂，不是水本身；这个词给灵魂带来光明、希望和自由。">这个有生命的词唤醒了我的灵魂</span>，给我的灵魂带来了光明、希望和快乐，我的灵魂获得了自由！',
          '我想起了被我摔坏的娃娃，摸索着走到壁炉前把碎片拾起来，<span class="word w-red" data-note="拼命想把碎片拼起来，可一切只是徒劳，这才第一次感受到深深的悔恨和悲伤。">拼命想把碎片拼起来，可一切只是徒劳</span>，眼睛充满了泪水，第一次感受到深深的悔恨和悲伤。'
        ]}
      ]
    },
    back:{
      title:'回味 · 哪个瞬间最打动你',
      blocks:[
        {t:'bigq', q:'全文哪个瞬间最打动你？把那几个字摘下来，说说你看到了一个怎样的人。', save:'l11-back1'}
      ]
    }
  },

  l12: {
    kind:'文言文 · 语录体', author:'孔子及其弟子',
    lead:'《论语》是记录孔子及其弟子言行的一部书，两千多年前的话，很多今天还挂在嘴边。下面按教材顺序，一章一章读，每章标出出自哪一篇。',
    prep:{
      title:'热身 · 先听一句熟的',
      blocks:[
        {t:'bigq', q:'“温故而知新”“三人行必有我师”这类话，你在哪儿听过？知道是什么意思吗？', save:'l12-prep'}
      ]
    },
    read:{
      title:'读懂 · 十二章分三类',
      blocks:[
        {t:'verse', noteId:'l12-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第一章 · 《学而》</span>',
          '子曰：“学而时习之，不亦<span class="word w-gold" data-note="“说”同“悦”，愉快。">说</span>乎？有朋自远方来，不亦乐乎？人不知而不<span class="word w-red" data-note="生气、恼怒。">愠</span>，不亦君子乎？”'
        ]},
        {t:'verse', noteId:'l12-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第二章 · 《学而》</span>',
          '曾子曰：“吾日<span class="word w-key" data-note="“三”泛指多次，每天多次反省自己。">三省</span>吾身：为人谋而不忠乎？与朋友交而不信乎？<span class="word w-purple" data-note="“传”指老师传授的知识，动词当名词用。">传</span>不习乎？”'
        ]},
        {t:'verse', noteId:'l12-n3', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第三章 · 《为政》</span>',
          '子曰：“吾十<span class="word w-gold" data-note="“有”同“又”，用于整数和零数之间。">有</span>五而志于学，三十而立，四十而不惑，五十而知天命，六十而耳顺，七十而从心所欲，不<span class="word w-red" data-note="越过法度。">逾矩</span>。”'
        ]},
        {t:'verse', noteId:'l12-n4', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第四章 · 《为政》</span>',
          '子曰：“<span class="word w-key" data-note="温习旧知识，得到新的理解和体会。">温故而知新</span>，可以为师矣。”'
        ]},
        {t:'verse', noteId:'l12-n5', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第五章 · 《为政》</span>',
          '子曰：“学而不思则<span class="word w-red" data-note="罔：迷惑，迷茫。">罔</span>，思而不学则<span class="word w-gold" data-note="殆：疑惑。">殆</span>。”'
        ]},
        {t:'verse', noteId:'l12-n6', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第六章 · 《雍也》</span>',
          '子曰：“贤哉，回也！一<span class="word w-gold" data-note="古代盛饭的圆竹器。">箪</span>食，一瓢饮，在陋巷，人不<span class="word w-red" data-note="能忍受。">堪</span>其忧，回也不改其乐。贤哉，回也！”'
        ]},
        {t:'verse', noteId:'l12-n7', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第七章 · 《雍也》</span>',
          '子曰：“知之者不如<span class="word w-gold" data-note="好：喜爱，读 hào。">好</span>之者，好之者不如<span class="word w-key" data-note="乐：以……为快乐。">乐</span>之者。”'
        ]},
        {t:'verse', noteId:'l12-n8', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第八章 · 《述而》</span>',
          '子曰：“<span class="word w-gold" data-note="“饭”这里是动词，吃。疏食：粗粮。">饭疏食</span>，饮水，曲<span class="word w-red" data-note="胳膊。">肱</span>而枕之，乐亦在其中矣。不义而富且贵，于我如浮云。”'
        ]},
        {t:'verse', noteId:'l12-n9', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第九章 · 《述而》</span>',
          '子曰：“三人行，必有我师焉。择其<span class="word w-key" data-note="好的方面、优点。">善者</span>而从之，其不善者而改之。”'
        ]},
        {t:'verse', noteId:'l12-n10', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第十章 · 《子罕》</span>',
          '子在川上曰：“<span class="word w-gold" data-note="逝去的一切，这里指时光。">逝者</span>如<span class="word w-red" data-note="代词，这，指河水。">斯</span>夫，不<span class="word w-key" data-note="舍弃，这里指停止。">舍</span>昼夜。”'
        ]},
        {t:'verse', noteId:'l12-n11', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第十一章 · 《子罕》</span>',
          '子曰：“三军可<span class="word w-gold" data-note="改变。">夺</span>帅也，<span class="word w-red" data-note="平民中的男子，泛指平民百姓。">匹夫</span>不可夺志也。”'
        ]},
        {t:'verse', noteId:'l12-n12', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第十二章 · 《子张》</span>',
          '子夏曰：“博学而<span class="word w-key" data-note="坚定。">笃</span>志，<span class="word w-gold" data-note="恳切地发问求教。">切问</span>而近思，仁在其中矣。”'
        ]},
        {t:'cards', items:[
          {front:'通假字', back:'说同“悦”、有同“又”，是古字通用、借用，要按本字读，不是古人写的别字。'},
          {front:'古今异义', back:'可以（古义可以凭借）、君子（古义有才德的人），意思跟今天不同。'},
          {front:'词类活用', back:'“传不习乎”的“传”指传授的知识，“饭疏食”的“饭”是吃，都活用了。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪一句像说给你听',
      blocks:[
        {t:'bigq', q:'十二章里哪一句最像说给你听的？把那几个字抄下来，联系自己的学习说说。', save:'l12-back1'}
      ]
    }
  },

  l13: {
    kind:'议论文', author:'毛泽东',
    lead:'纪念一位不远万里来帮助中国的加拿大医生。文章一边讲他的事迹，一边讲道理，号召大家向他学习。',
    prep:{
      title:'热身 · 先想一个问题',
      blocks:[
        {t:'bigq', q:'一个外国人，为什么值得中国人专门写文章纪念他？先猜一猜。', save:'l13-prep'}
      ]
    },
    read:{
      title:'读懂 · 三种精神，一种写法',
      blocks:[
        {t:'dots', items:[
          '国际主义精神：把中国的事业当成自己的事业',
          '毫不利己专门利人：对工作极端负责、对同志极端热忱',
          '精益求精：作为医生，对技术不断钻研'
        ]},
        {t:'prose', noteId:'l13-note', paras:[
          '白求恩同志<span class="word w-key" data-note="文眼：一点不为自己，全为别人。">毫不利己专门利人</span>的精神，表现在他对工作的极端的负责任，对同志对人民的<span class="word w-gold" data-note="两个“极端”，把这种精神强调到极点。">极端的热忱</span>。',
          '不少的人对工作不负责任，<span class="word w-red" data-note="反面现象，跟白求恩一对比，差距就出来了。">拈轻怕重</span>，把重担子推给人家，自己挑轻的。一事当前，先替自己打算，然后再替别人打算。出了一点力就觉得了不起，喜欢自吹，生怕人家不知道。对同志对人民不是满腔热忱，而是冷冷清清，漠不关心，麻木不仁。这种人其实不是共产党员，至少不能算一个纯粹的共产党员。',
          '只要有这点精神，就是一个高尚的人，一个纯粹的人，一个有道德的人，一个脱离了低级趣味的人，<span class="word w-purple" data-note="五个“一个……的人”排比，一口气说出榜样的样子。">一个有益于人民的人</span>。'
        ]},
        {t:'cards', items:[
          {front:'夹叙夹议', back:'先讲白求恩做了什么，再讲他的精神，叙事和议论交替进行。'},
          {front:'对比论证', back:'拿白求恩跟“拈轻怕重”的人对比，正面反面一比，道理更有力。'},
          {front:'排比', back:'结尾五个“……的人”，句式整齐，有气势，也容易记住。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪一方面最打动你',
      blocks:[
        {t:'bigq', q:'结尾五个“一个……的人”，说的是同一种精神的五个方面，不是五种独立的人。哪一方面最打动你？你是从哪几个字读出来的？', save:'l13-back1'}
      ]
    }
  },

  l14: {
    kind:'叙事散文', author:'朱德',
    lead:'朱德回忆自己的母亲，用一件件小事，写出一位勤劳一生的普通农家妇女。',
    prep:{
      title:'热身 · 先说说妈妈',
      blocks:[
        {t:'bigq', q:'妈妈身上最让你佩服的一点是什么？简单说说。', save:'l14-prep'}
      ]
    },
    read:{
      title:'读懂 · 小事里看见母亲',
      blocks:[
        {t:'timeline', items:[
          {t:'勤劳的日常', d:'天不亮就起床，种田、喂猪、养蚕、纺线'},
          {t:'困苦中坚强', d:'家庭遭难、被迫分离，母亲没有灰心'},
          {t:'支持儿子', d:'不反对他参加革命，还给他慰勉'},
          {t:'晚年', d:'依旧过着勤苦的农妇生活，想念儿子'}
        ]},
        {t:'prose', noteId:'l14-note', paras:[
          '母亲是个<span class="word w-gold" data-note="劳动能手，一个词点出母亲的勤劳。">好劳动</span>。从我能记忆时起，总是天不亮就起床。',
          '<span class="word w-key" data-note="贯穿全文的线索：母亲一生都在劳动，开头那句“勤劳一生”说的就是这个。">母亲最大的特点是一生不曾脱离过劳动</span>。',
          '<span class="word w-red" data-note="第一处感谢：母亲教给“我”与困难作斗争的经验，还给了“我”强健的身体、勤劳的习惯。">我应该感谢母亲，她教给我与困难作斗争的经验</span>。母亲又给我一个强健的身体，一个勤劳的习惯，使我从来没感到过劳累。',
          '<span class="word w-red" data-note="第二处感谢：母亲教给“我”生产的知识和革命的意志，鼓励“我”走上革命道路。">我应该感谢母亲，她教给我生产的知识和革命的意志</span>，鼓励我以后走上革命的道路。',
          '只有这种知识，这种意志，才是世界上<span class="word w-purple" data-note="母亲给的东西，比任何钱财都珍贵。">最可宝贵的财产</span>。'
        ]},
        {t:'cards', items:[
          {front:'典型事例', back:'不空谈，用做饭、种田、纺线等具体小事，把母亲写得真实可感。'},
          {front:'时间顺序', back:'按母亲一生的先后写，脉络清楚。'},
          {front:'夹叙夹议', back:'边讲母亲的事，边抒发感激和敬爱，情和事融在一起。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪件小事最动人',
      blocks:[
        {t:'bigq', q:'全文哪件小事最让你动心？把那几个字摘下来，说说你读出了什么。', save:'l14-back1'}
      ]
    }
  },

  l15: {
    kind:'自读 · 诗歌', author:'陈毅',
    lead:'被围困、以为必死时写下的三首绝笔诗。读的时候注意：人在绝境里，心里装的是什么。',
    prep:{
      title:'热身 · 先设想一下',
      blocks:[
        {t:'bigq', q:'如果一个人以为自己马上要死去，提笔写“绝笔”，你觉得他会写什么？', save:'l15-prep'}
      ]
    },
    read:{
      title:'读懂 · 三首诗，一条心',
      blocks:[
        {t:'verse', noteId:'l15-n0', lines:[
          '<span style="font-size:.78em;color:var(--muted)">小序：一九三六年冬，梅山被围。余伤病伏丛莽间二十余日，虑不得脱，得诗三首留衣底。旋围解。</span>'
        ]},
        {t:'verse', noteId:'l15-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第一首</span>',
          '断头今日意如何？创业艰难百战多。',
          '此去<span class="word w-gold" data-note="想象死后到阴间召集旧部、斩杀阎罗，死了也要革命，浪漫主义。">泉台招旧部，旌旗十万斩阎罗</span>。'
        ]},
        {t:'verse', noteId:'l15-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第二首</span>',
          '南国烽烟正十年，此头须向国门悬。',
          '后死诸君多努力，<span class="word w-key" data-note="不要祭品，把胜利的捷报当成纸钱。">捷报飞来当纸钱</span>。'
        ]},
        {t:'verse', noteId:'l15-n3', lines:[
          '<span style="font-size:.78em;color:var(--muted)">第三首</span>',
          '投身革命即为家，血雨腥风应有涯。',
          '<span class="word w-red" data-note="用孔子、孟子的典故，这里指为人民解放事业勇于牺牲，不是笼统的献身。">取义成仁</span>今日事，人间遍种<span class="word w-green" data-note="比喻：未来的自由社会，像花开遍人间。">自由花</span>。'
        ]},
        {t:'cards', items:[
          {front:'革命浪漫主义', back:'明明面对死亡，却想象到阴间继续战斗，用想象把牺牲写得豪迈。'},
          {front:'用典', back:'“取义成仁”出自舍生取义、杀身成仁，这里具体指为人民解放事业勇于牺牲；“头悬国门”也借用古人故事，含义更厚。'},
          {front:'三首的层次', back:'第一首写自己视死如归，第二首叮嘱战友，第三首展望未来，合起来是一个完整的信念。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪一句最震撼',
      blocks:[
        {t:'bigq', q:'三首诗里哪一句最让你震撼？把那几个字摘下来，说说为什么。', save:'l15-back1'}
      ]
    }
  },

  l16: {
    kind:'文言文 · 家书', author:'诸葛亮',
    lead:'诸葛亮写给儿子的家书，八十六个字，核心就一个“静”字。顺着“静—学—才—志”这条链读。',
    prep:{
      title:'热身 · 先说说家长的叮嘱',
      blocks:[
        {t:'bigq', q:'如果爸爸给你写一封信，你猜他最可能叮嘱你什么？', save:'l16-prep'}
      ]
    },
    read:{
      title:'读懂 · 一个“静”字统领全篇',
      blocks:[
        {t:'verse', noteId:'l16-n1', lines:[
          '夫君子之行，<span class="word w-key" data-note="全文枢纽：宁静专一，修身、学习都靠它。">静</span>以修身，俭以养德。',
          '非<span class="word w-gold" data-note="不慕名利才能明确志向，内心宁静才能走得远。">淡泊无以明志，非宁静无以致远</span>。',
          '夫学须静也，才须学也，非学无以<span class="word w-purple" data-note="增长才干，“广”是增长。">广才</span>，非志无以成学。',
          '<span class="word w-red" data-note="淫慢是放纵懈怠，对的是“励精”（振奋精神）：懈怠了就提不起精神。">淫慢则不能励精</span>，<span class="word w-red" data-note="险躁是轻薄浮躁，注释说它跟上文“宁静”相对：浮躁了就修养不好性情。">险躁则不能治性</span>。',
          '年与时<span class="word w-green" data-note="时光飞逝，意志消磨，要珍惜时间。">驰</span>，意与日去，遂成枯落，<span class="word w-gold" data-note="意思是大多对社会没有任何贡献，不能为社会所用。">多不接世</span>，悲守穷庐，将复何及！'
        ]},
        {t:'step', id:'l16-chain', title:'成对辨析：静、学、才、志怎么连起来', blocks:[
          {t:'html', h:'<p>课文里这几句是一条链：<b>学须静</b>（学习要靠宁静专一），<b>才须学</b>（才干要靠学习），<b>非学无以广才</b>（不学就没法增长才干），<b>非志无以成学</b>（没有志向就完不成学业）。静、学、才、志一环扣一环。反面也各有各的对照：<b>淫慢</b>（放纵懈怠）对的是<b>励精</b>（振奋精神），<b>险躁</b>（轻薄浮躁）对的是<b>宁静</b>和治性。别把它俩当成同一个反义词。</p>'},
          {t:'bigq', q:'顺着“静—学—才—志”这条链，说说哪一环断了会怎样？用自己的话写。', save:'l16-chain-q'}
        ]},
        {t:'cards', items:[
          {front:'双重否定', back:'“非……无以……”意思是不这样就没办法，语气比一般说法更坚决。'},
          {front:'正反对照', back:'正面讲静、俭、学、志，反面讲淫慢、险躁，一正一反，道理更清楚。'},
          {front:'一词多义', back:'“学”可作学习（动词）或学业（名词），“志”可作志向或立志，要结合句子看。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪一句像说给你听',
      blocks:[
        {t:'bigq', q:'哪一句最像家长平时的叮嘱？把那几个字抄下来，联系自己说说感受。', save:'l16-back1'}
      ]
    }
  },

  l17: {
    kind:'叙事散文', author:'郑振铎',
    lead:'家里养过三只猫，前两只带来快乐，第三只却被“我”冤枉、打了一下，后来死了。重点读“我”的悔恨。',
    prep:{
      title:'热身 · 先说说被冤枉',
      blocks:[
        {t:'bigq', q:'你被别人冤枉过吗？当时最难受的是什么？', save:'l17-prep'}
      ]
    },
    read:{
      title:'读懂 · 三只猫，一场冤案',
      blocks:[
        {t:'timeline', items:[
          {t:'第一只', d:'活泼可爱，后来病死，一缕酸辛'},
          {t:'第二只', d:'更有趣，被路人捉走，愤恨怅然'},
          {t:'第三只', d:'忧郁难看，被冤枉吃鸟、挨打'},
          {t:'真相', d:'隔几天看见黑猫衔着黄鸟，知错，想补救'},
          {t:'猫死', d:'两个月后猫死在邻家屋脊，永无改正机会，永不养猫'}
        ]},
        {t:'prose', noteId:'l17-note', paras:[
          '它在我家仍是一只<span class="word w-key" data-note="活着却不被看见，为后来第一个被怀疑埋下伏笔。">若有若无</span>的动物。',
          '我没有判断明白，便<span class="word w-red" data-note="文眼：没弄清真相就下判断，是冤案的根源。">妄下断语</span>，冤枉了一只不能说话辩诉的动物。',
          '隔了几天，<span class="word w-gold" data-note="先有李妈在楼下喊，提醒真凶又出现了。">李妈在楼下叫道：“猫，猫！又来吃鸟了！”</span>同时我看见一只黑猫飞快地逃过露台，嘴里衔着一只黄鸟，<span class="word w-gold" data-note="到这里才发现真凶，开始觉得自己错了。">我开始觉得我是错了</span>！',
          '想到它的无抵抗的逃避，益使我感到我的暴怒、我的虐待，<span class="word w-gold" data-note="比喻，把暴怒和虐待比作针，自责尖锐而持久。">都是针，刺我良心的针！</span>',
          '我很想补救我的过失，可它不能说话。',
          '<span class="word w-purple" data-note="两个月后猫才死在邻家屋脊。">两个月后，我们的猫忽然死在邻家的屋脊上</span>，我对于它的亡失，比以前两只猫的亡失，更难过得多。',
          '<span class="word w-purple" data-note="猫死了，再也没法补救，这才说从此永不养猫。">我永无改正我的过失的机会了！自此，我家永不养猫</span>。'
        ]},
        {t:'cards', items:[
          {front:'对比', back:'三只猫的外形、性情、结局对比，第三只的悲惨更突出。'},
          {front:'伏笔', back:'猫凝望鸟笼、“若有若无”，都为后面的冤案做了铺垫。'},
          {front:'托物言情', back:'表面写猫，实际写人的自省，呼唤尊重生命、不存偏见。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪句话让你心里一紧',
      blocks:[
        {t:'bigq', q:'全文哪句话让你心里一紧？把那几个字摘下来，说说你读出了什么。', save:'l17-back1'}
      ]
    }
  },

  l18: {
    kind:'叙事散文', author:'陈忠实',
    lead:'作者养了两代白鸽，从盼望、喂养到看它们第一次飞翔，写出对生命和美的敬畏。',
    prep:{
      title:'热身 · 先说说一种小动物',
      blocks:[
        {t:'bigq', q:'有没有哪种小动物，让你第一眼就觉得“真美”？说说它哪儿打动你。', save:'l18-prep'}
      ]
    },
    read:{
      title:'读懂 · 跟着白鸽一起成长',
      blocks:[
        {t:'timeline', items:[
          {t:'白鸽到来', d:'老舅送来一对白鸽，盼望已久'},
          {t:'产卵孵化', d:'新生命诞生，欣喜又神秘'},
          {t:'幼鸽长成', d:'从丑陋的小雏变成雪白的鸽子'},
          {t:'第一次飞翔', d:'老白鸽鼓励，幼鸽终于飞上天空'}
        ]},
        {t:'prose', noteId:'l18-note', paras:[
          '小白鸽和老白鸽在那破烂失修的房脊上<span class="word w-key" data-note="姿态挺拔美好，给老房子添了生机和灵气。">亭亭玉立</span>。',
          '最美好最纯净最圣洁的比喻仍然不过是比喻，仍然不及幼鸽自身的<span class="word w-gold" data-note="任何比喻都不如白鸽本身，赞美生命本来的样子。">本真之美</span>。',
          '我扬起双手，拍出很响的掌声，激发它们飞翔。两只老白鸽先后起飞。',
          '<span class="word w-gold" data-note="小白鸽飞起来又落下，对第一次飞翔没自信，这是胆怯。">小白鸽飞起来又落下去，似乎对自己能否翱翔蓝天缺乏自信，也许是第一次飞翔的胆怯</span>。',
          '<span class="word w-red" data-note="老白鸽用绕着房子飞的行动鼓励儿女勇敢起飞，像父母陪着孩子。">两只老白鸽就绕着房子飞过来旋过去，无疑是在鼓励它们的儿女</span>勇敢地起飞。果然，两只小白鸽起飞了，跟着它们的父母彻底离开了屋脊。',
          '这一刻，<span class="word w-purple" data-note="那一刻白鸽承载了所有情感，作者完全陶醉。">世界对我来说就是白鸽</span>。'
        ]},
        {t:'cards', items:[
          {front:'细节描写', back:'对白鸽的外形、动作、神态细致刻画，写得生动传神。'},
          {front:'象征', back:'白鸽象征纯洁的生命、美和希望，不只是一只鸟。'},
          {front:'以小见大', back:'养鸽子是小事，却写出对生命、对家园的深情。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪一处让你看见美',
      blocks:[
        {t:'bigq', q:'哪一处描写最让你看见“美”？把那几个字摘下来，说说你的感受。', save:'l18-back1'}
      ]
    }
  },

  l19: {
    kind:'知识性散文', author:'利奥波德',
    lead:'一位生态学家观察大雁归来的笔记。既有大雁的习性知识，又满是喜爱，读起来像诗。',
    prep:{
      title:'热身 · 先猜一个问题',
      blocks:[
        {t:'bigq', q:'假如你看到一只大雁单独飞、一直鸣叫，哪些是你亲眼看到的？你又会怎么猜它落单的原因？', save:'l19-prep'}
      ]
    },
    read:{
      title:'读懂 · 大雁知道的事',
      blocks:[
        {t:'timeline', items:[
          {t:'归来', d:'冲破 3 月雾霭，春天来到'},
          {t:'觅食', d:'成群去玉米地，前后都有“辩论”'},
          {t:'孤雁', d:'失去亲人的幸存者，叫声忧郁'},
          {t:'集会', d:'夜里群居沼泽，喧闹又归于平静'}
        ]},
        {t:'prose', noteId:'l19-note', paras:[
          '当一群大雁冲破了 3 月暖流的雾霭时，<span class="word w-key" data-note="大雁报春，它一来，春天就到了。">春天就来到了</span>。',
          '每次出发之前，都有一场高声而有趣的<span class="word w-gold" data-note="拟人，把大雁的叫声写成辩论、发言，像人一样。">辩论</span>。',
          '孤雁飞行和鸣叫频繁、声调忧郁，人们先有两种猜想：<span class="word w-red" data-note="最初的猜想，两种可能并列。">是伤心的单身，或是寻找失散的子女的父母</span>。',
          '六年之后，从数字分析发现：六只或六的倍数组成的雁队，比偶尔出现的一只（孤雁）多得多，这才推断出<span class="word w-red" data-note="六年后的新证据：雁群是家庭，孤雁是丧失亲人的幸存者。">它们是丧失了亲人的幸存者</span>。',
          '整个大陆所获得的是<span class="word w-purple" data-note="比喻，大雁迁徙给大地带来诗意，只带来好处、没有损害。">从 3 月的天空洒下来的一首有益无损的带着野性的诗歌</span>。',
          '大雁的这种<span class="word w-green" data-note="大雁以家庭为单位、成群联合，人类都不及。">联合观念</span>已经有很长时间了。'
        ]},
        {t:'cards', items:[
          {front:'拟人', back:'把大雁当人写，有辩论、发言、低语，表达喜爱之情。'},
          {front:'知识性+抒情性', back:'既讲大雁习性，又抒发感情，是观察笔记，也是散文。'},
          {front:'对比衬托', back:'用主红雀、花鼠、乌鸦衬托大雁的坚定和飞行之直。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪句最有画面感',
      blocks:[
        {t:'bigq', q:'全文哪一句最有画面感？把那几个字摘下来，说说你看到了什么。', save:'l19-back1'}
      ]
    }
  },

  l20: {
    kind:'文言文 · 小说', author:'蒲松龄',
    lead:'晚归的屠户半路上被两只狼盯上了。他能不能脱身，先别急着知道，跟着情节，从一个分岔的地方读起。',
    prep:{
      title:'课前看一眼 · 情节分岔了',
      blocks:[
        {t:'scene', id:'l20-fork', svg:'<svg viewBox="0 0 420 200" role="img" aria-label="一只狼径直离开，一只狼像狗一样蹲坐在前面"><line x1="20" y1="165" x2="400" y2="165" stroke="#a9b6b0" stroke-width="2"/><path d="M285 165 L300 120 L315 165 Z M305 165 L325 105 L345 165 Z M335 165 L355 125 L375 165 Z" fill="#c07a3e" opacity="0.85"/><ellipse cx="95" cy="132" rx="26" ry="13" fill="#f4ecd8"/><circle cx="66" cy="122" r="11" fill="#f4ecd8"/><path d="M58 113 l4 -9 5 8 z M68 111 l3 -10 6 7 z" fill="#f4ecd8"/><path d="M118 126 q14 -2 16 -14" stroke="#f4ecd8" stroke-width="6" fill="none" stroke-linecap="round"/><line x1="80" y1="142" x2="76" y2="162" stroke="#f4ecd8" stroke-width="5" stroke-linecap="round"/><line x1="95" y1="144" x2="95" y2="163" stroke="#f4ecd8" stroke-width="5" stroke-linecap="round"/><line x1="108" y1="143" x2="114" y2="162" stroke="#f4ecd8" stroke-width="5" stroke-linecap="round"/><path d="M40 100 l-16 8 16 8 M24 108 l30 0" stroke="#a84b43" stroke-width="2.5" fill="none" stroke-linecap="round"/><text x="92" y="188" font-size="13" fill="#a9b6b0" text-anchor="middle">径去（径直走开）</text><ellipse cx="232" cy="130" rx="17" ry="28" fill="#f4ecd8"/><circle cx="218" cy="96" r="12" fill="#f4ecd8"/><path d="M210 87 l3 -9 6 8 z M220 85 l4 -9 5 8 z" fill="#f4ecd8"/><path d="M246 132 q14 0 14 -16" stroke="#f4ecd8" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="216" y="148" width="7" height="17" rx="3" fill="#f4ecd8"/><text x="232" y="188" font-size="13" fill="#a9b6b0" text-anchor="middle">犬坐（像狗一样蹲着）</text></svg>', cap:'先看清眼前的局面：一只走开，一只蹲下'},
        {t:'verse', noteId:'l20-n1', lines:[
          '一狼<span class="word w-purple" data-note="“径”是径直，直接走开，头也不回。">径去</span>，其一<span class="word w-purple" data-note="“犬”这里作状语，像狗一样蹲坐。">犬坐</span>于前。'
        ]},
        {t:'html', h:'<p class="guess-ask">走掉的那只狼，还用管吗？先凭直觉选一个，不用打字。</p>'},
        {t:'choices', id:'l20-guess', save:'l20-guess', options:[
          {v:'gone', label:'真走了，不用管'},
          {v:'trap', label:'可能有埋伏'},
          {v:'unsure', label:'证据还不够，先不下结论'}
        ]},
        {t:'buttons', buttons:[
          {label:'我猜好了，往下找线索', kind:'primary', post:true, show:'#l20s2'}
        ]}
      ]
    },
    read:{
      title:'读懂 · 一步步找线索',
      blocks:[
        {t:'step', id:'l20-start', blocks:[
          {t:'html', h:'<p class="step-hint">下面跟着原文一步步走：先看两只狼的动作，再看柴堆后面，最后看结局。</p>'},
          {t:'buttons', buttons:[
            {label:'开始一步步找线索', kind:'primary', show:'#l20s2', hide:'#l20-start'}
          ]}
        ]},
        {t:'step', id:'l20s2', hidden:true, blocks:[
          {t:'html', h:'<p class="step-hint">先别急着看下文。回头看这两个动作：一个“径去”径直走开，一个“犬坐”像狗一样蹲下。一个走、一个留，各说明什么？</p>'},
          {t:'verse', noteId:'l20-n2', lines:[
            '途中两狼，<span class="word w-red" data-note="紧跟着走，狼早就盯上了屠户。">缀行</span>甚远。',
            '屠惧，<span class="word w-gold" data-note="屠户害怕，先拿骨头哄狼。">投以骨</span>。一狼得骨止，一狼仍从。复投之，后狼止而前狼又至。',
            '骨已尽矣，而两狼之并驱如故。<span style="font-size:.82em;color:var(--muted)">（两次扔骨，一只停下另一只又跟上，骨头扔光，两狼还一起追。）</span>',
            '屠大<span class="word w-key" data-note="处境危急，屠户害怕，担心前后受敌。">窘</span>，恐前后受其<span class="word w-gold" data-note="这里“敌”是攻击，怕前后都被狼攻击。">敌</span>。',
            '<span class="word w-gold" data-note="“顾”是回头看，屠户看见野地里有个麦场。">顾野有麦场</span>，场主积薪其中，<span class="word w-gold" data-note="覆盖、遮盖成小山似的，这就是柴堆。">苫蔽成丘</span>。屠乃奔倚其下，弛担持刀。'
          ]},
          {t:'html', h:'<p class="step-hint">屠户靠在柴堆旁、持刀对峙。那只走开的狼，到底干嘛去了？</p>'},
          {t:'buttons', buttons:[
            {label:'看看柴堆后面', kind:'primary', show:'#l20s3'}
          ]}
        ]},
        {t:'step', id:'l20s3', hidden:true, blocks:[
          {t:'scene', id:'l20-hole', svg:'<svg viewBox="0 0 420 200" role="img" aria-label="走掉的那只狼正在柴堆里打洞"><line x1="20" y1="165" x2="400" y2="165" stroke="#a9b6b0" stroke-width="2"/><path d="M170 165 q10 -40 60 -40" stroke="#a9b6b0" stroke-width="2.5" stroke-dasharray="6 5" fill="none"/><path d="M150 165 L180 95 L210 165 Z M200 165 L235 80 L270 165 Z M260 165 L290 100 L320 165 Z" fill="#c07a3e" opacity="0.9"/><ellipse cx="150" cy="135" rx="20" ry="15" fill="#f4ecd8"/><line x1="140" y1="146" x2="136" y2="163" stroke="#f4ecd8" stroke-width="5" stroke-linecap="round"/><line x1="158" y1="147" x2="160" y2="163" stroke="#f4ecd8" stroke-width="5" stroke-linecap="round"/><path d="M132 128 q-14 -4 -14 -18" stroke="#f4ecd8" stroke-width="6" fill="none" stroke-linecap="round"/><text x="210" y="190" font-size="13" fill="#a9b6b0" text-anchor="middle">洞其中：在柴堆里打洞，想从背后偷袭</text></svg>', cap:'柴堆后面，那只“走开”的狼正在打洞'},
          {t:'verse', noteId:'l20-n3', lines:[
            '屠<span class="word w-red" data-note="突然。">暴</span>起，以刀劈狼首，又数刀毙之。方欲行，转视积薪后，',
            '一狼<span class="word w-purple" data-note="“洞”这里是动词，在柴堆里打洞。">洞其中</span>，意将<span class="word w-purple" data-note="“隧”这里作状语，从通道钻进去。">隧</span>入以攻其后也。',
            '身已半入，止露<span class="word w-gold" data-note="尻是屁股。“身已半入”是身子钻进去一半，只露屁股尾巴，不是大半。">尻尾</span>。屠自后断其股，亦毙之。'
          ]},
          {t:'html', h:'<p class="step-hint">这就是“径去”的真相。</p><p class="step-hint guess-recall" id="l20-guess-recall"></p>'},
          {t:'choices', id:'l20-rejudge', save:'l20-rejudge', options:[
            {v:'keep', label:'我坚持原来的判断'},
            {v:'change', label:'我改主意了'},
            {v:'unsure', label:'我还是保留不确定'}
          ]},
          {t:'bigq', q:'是哪几个字改变了你的看法？把它们写下来。', save:'l20-turn'},
          {t:'buttons', buttons:[
            {label:'看看结局', kind:'primary', show:'#l20s4'}
          ]}
        ]},
        {t:'step', id:'l20s4', hidden:true, blocks:[
          {t:'verse', noteId:'l20-n4', lines:[
            '乃悟前狼<span class="word w-key" data-note="假装睡觉。">假寐</span>，<span class="word w-gold" data-note="表示推测，相当于“大概”；一说承接上文，表示原因、理由。">盖</span>以诱敌。',
            '狼亦<span class="word w-red" data-note="狡猾。">黠</span>矣，而顷刻两毙，<span class="word w-key" data-note="禽兽的欺骗手段能有多少，结尾嘲讽。">禽兽之变诈几何哉</span>？止增笑耳。'
          ]},
          {t:'html', h:'<p class="step-hint">如果你的理由是“狼很狡猾”，这是对狼的判断。能指出文中哪个动作让你这么想吗？</p>'},
          {t:'bigq', q:'从文中找出一个动作，说说它让你看出了什么。', save:'l20-evidence'},
          {t:'buttons', buttons:[
            {label:'看一种示范读法', kind:'ghost', show:'#l20-demo'}
          ]},
          {t:'html', h:'<div class="demo-read" id="l20-demo" hidden><p><strong>一种示范读法：</strong>我从“一狼洞其中，意将隧入以攻其后”的“洞”和“隧”看出狼的狡猾——它不是真走，是假装离开、绕到柴堆后面打洞，想从背后偷袭。前面的“径去”看着像放弃，其实是在分头行动。</p></div>'}
        ]},
        {t:'cards', items:[
          {front:'词类活用', back:'犬坐（像狗一样）、洞其中（打洞）、隧入（从通道），名词当状语或动词。'},
          {front:'一词多义', back:'“敌”可作攻击或敌人，“止”通“只”，要结合句子。'},
          {front:'古今异义', back:'“股”古义是大腿，“禽兽之变诈”的“几何”古义是多少。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 回头看一眼',
      blocks:[
        {t:'bigq', q:'回头再看“一狼径去，其一犬坐于前”，你现在读出了什么？是从哪几个字发现线索的？', save:'l20-back1'}
      ]
    }
  },

  l21: {
    kind:'章回体小说（节选）', author:'吴承恩',
    lead:'《西游记》里二郎神追孙悟空，你变我也变，一口气七次变化。读的时候跟着“变”和“追”走。',
    prep:{
      title:'热身 · 先说说一场追逐',
      blocks:[
        {t:'bigq', q:'一场你追我赶的戏，为什么会让人觉得好看？先说说你的想法。', save:'l21-prep'}
      ]
    },
    read:{
      title:'读懂 · 七次变化，相生相克',
      blocks:[
        {t:'timeline', items:[
          {t:'麻雀→饿鹰', d:'大圣变麻雀，小圣变饿鹰扑'},
          {t:'大鹚老→大海鹤', d:'大圣见了，变大鹚老冲天，小圣变大海鹤'},
          {t:'鱼儿→鱼鹰', d:'大圣入水变鱼，小圣变鱼鹰等'},
          {t:'水蛇→灰鹤', d:'大圣变蛇，小圣变长嘴灰鹤'},
          {t:'花鸨→弹弓', d:'大圣变花鸨，小圣现原身打弹弓'},
          {t:'土地庙', d:'尾巴变旗杆，露出破绽，虎跳逃走'},
          {t:'隐身→灌江口', d:'大圣使隐身法，跑去灌江口假扮小圣'}
        ]},
        {t:'prose', noteId:'l21-note', paras:[
          '【原文节录】开头大圣先变麻雀，钉在树上。小圣（二郎神）这才收了法象，摇身一变，变做个饿鹰儿，抖开翅，飞将去扑打。<span class="word w-key" data-note="每一回合都是大圣先变、小圣再变个能克制他的。大圣见饿鹰扑来，立刻又变。">大圣见了</span>，搜的一翅飞起去，变做一只大鹚老，冲天而去。',
          '【原文】只有尾巴不好收拾，竖在后面，<span class="word w-gold" data-note="尾巴变旗杆、还竖在庙后，被二郎神识破。">变做一根旗竿</span>。',
          '【原文】真君撞进门，<span class="word w-red" data-note="假扮对手还耍嘴皮，猴性顽皮。">大圣见了，现出本相道：“郎君不消嚷，庙宇已姓孙了。”</span>',
          '【解读】大圣先变、小圣立刻变出能克制他的，一物降一物，这叫相生相克。',
          '【解读】一场生死大战，却像小孩捉迷藏、变戏法，是“斗”法，也是“逗”趣。'
        ]},
        {t:'cards', items:[
          {front:'奇特的想象', back:'从飞禽走兽到土地庙，变化无穷，天马行空又合乎情理。'},
          {front:'动作和心理', back:'一连串短句动词写追逐，又用“似什么”细写端详，紧张又好玩。'},
          {front:'章回体', back:'回目对仗、概括全回，是中国古典小说的特有形式。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪次变化最有趣',
      blocks:[
        {t:'bigq', q:'七次变化里哪一次最让你觉得有趣？你是从哪几个字读出来的？', save:'l21-back1'}
      ]
    }
  },

  l22: {
    kind:'童话', author:'安徒生',
    lead:'一个连小孩都看得穿的骗局，却骗过了整个国家。读的时候留意每个人心里那点“怕”。',
    prep:{
      title:'热身 · 先想一个问题',
      blocks:[
        {t:'bigq', q:'一个连小孩都看穿的骗局，凭什么能骗过全国的大人？先猜一猜。', save:'l22-prep'}
      ]
    },
    read:{
      title:'读懂 · 一个“骗”字串起全场',
      blocks:[
        {t:'timeline', items:[
          {t:'行骗', d:'骗子说蠢人看不见新衣'},
          {t:'受骗', d:'皇帝怕被说蠢、怕显得不称职，甘愿上当'},
          {t:'助骗', d:'大臣跟着夸，谁也不点破'},
          {t:'传骗', d:'百姓也跟着称赞新装'},
          {t:'揭骗', d:'小孩先喊“什么也没穿”，后来百姓都说'}
        ]},
        {t:'prose', noteId:'l22-note', paras:[
          '骗子说，<span class="word w-key" data-note="一句话利用了人的虚荣，封住所有人的嘴。">任何不称职的或者愚蠢得不可救药的人，都看不见这衣服</span>。',
          '“这布是华丽的！精致的！无双的！”每人都<span class="word w-gold" data-note="大家都跟着夸，没有一个人敢先说真话。">随声附和着</span>。每个人都有说不出的快乐。',
          '<span class="word w-red" data-note="小孩无私无畏，第一个戳穿全场。">“可是他什么衣服也没有穿啊！”</span>一个小孩子最后叫了出来。',
          '大家私下传播，“<span class="word w-red" data-note="真话传开，最后所有老百姓都跟着说。">他实在没有穿什么衣服啊</span>！”最后所有的老百姓都说。',
          '皇帝心里想“<span class="word w-purple" data-note="明知错了还硬撑，讽刺他的虚伪和外强中干。">我必须把这游行大典举行完毕。</span>”因此他摆出一副更骄傲的神气。'
        ]},
        {t:'cards', items:[
          {front:'夸张与想象', back:'不存在的衣服、裸体游行，把荒唐推到极致，却让人觉得真实。'},
          {front:'讽刺', back:'不直接骂人，只写众人的言行，让读者自己看出虚伪。'},
          {front:'心理描写', back:'皇帝、大臣心里的恐惧和嘴上的称赞形成反差，写活了人物。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 小孩为什么敢说',
      blocks:[
        {t:'bigq', q:'小孩先喊出真话，后来老百姓也跟着说了。为什么第一个开口的是小孩？你是从哪几个字看出来的？', save:'l22-back1'}
      ]
    }
  },

  l23: {
    kind:'自读 · 神话', author:'袁珂',
    lead:'古人没法科学解释“人从哪来”，就编了女娲造人的故事。自己读，看想象有多奇妙。',
    prep:{
      title:'热身 · 先想一个问题',
      blocks:[
        {t:'bigq', q:'在科学不发达的古代，你觉得古人会怎么解释“人是怎么来的”？', save:'l23-prep'}
      ]
    },
    read:{
      title:'读懂 · 女娲一步步造人',
      blocks:[
        {t:'timeline', items:[
          {t:'感到孤独', d:'世界很美，却没有像她一样的生物'},
          {t:'黄泥捏人', d:'照着自己的样子捏，一落地就活'},
          {t:'藤条甩泥', d:'泥浆点点都成人，又快又多'},
          {t:'分男女', d:'让人类自己婚配、繁衍后代'}
        ]},
        {t:'prose', noteId:'l23-note', paras:[
          '【转述】女娲行走在原野上，<span class="word w-key" data-note="世界虽美却没有像她一样的生物，这是造人的原因。">感到非常孤独</span>，想添点东西让世界热闹起来。',
          '【转述】泥捏的小家伙一落地就活了，<span class="word w-red" data-note="一个词写出生命诞生的喜悦和母子般的情感。">开口就喊“妈妈”</span>。',
          '【转述】手捏太慢，她想出<span class="word w-gold" data-note="用藤条甩泥浆，比手捏快得多，体现女娲的智慧。">用藤条甩泥浆的绝妙办法</span>，泥点都成人。',
          '【《风俗通》】课文里“女娲祷祠神、祈而为女媒、因置婚姻”不是袁珂正文，<span class="word w-purple" data-note="“神媒/婚姻”出自《风俗通》对读材料，要和袁珂改写的正文分开看。">“神媒”和婚姻的说法出自《风俗通》对读材料</span>。'
        ]},
        {t:'cards', items:[
          {front:'神话的特点', back:'用想象和幻想解释自然与人类起源，把神当人写。'},
          {front:'大胆的想象', back:'泥能成人、藤条甩泥也成人，奇特却合乎古人的心理。'},
          {front:'女娲形象', back:'既有神的威力，又有母亲般的慈爱、勤劳和智慧。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪处想象最奇妙',
      blocks:[
        {t:'bigq', q:'全文哪一处想象最让你觉得奇妙？你是从哪几个字看出来的？', save:'l23-back1'}
      ]
    }
  },

  l24: {
    kind:'寓言（含两则文言）', author:'《伊索寓言》（罗念生等译）、《吕氏春秋》、《列子》',
    lead:'寓言就是小故事藏大道理。前两则是古希腊的，后两则是中国古代文言，都很短。',
    prep:{
      title:'热身 · 先说说寓言',
      blocks:[
        {t:'bigq', q:'你读过哪些寓言？它讲了什么故事、想告诉你什么道理？', save:'l24-prep'}
      ]
    },
    read:{
      title:'读懂 · 四则故事，四个提醒',
      blocks:[
        {t:'prose', noteId:'l24-n0', paras:[
          '【赫耳墨斯和雕像者】赫耳墨斯化作凡人到雕像店，先问宙斯雕像值一个银元，又问赫拉的更贵，最后问自己的，雕像者说“你买了那两个，这个算添头，白送”。<span class="word w-gold" data-note="讽刺爱慕虚荣、自命不凡的人。">讽刺爱慕虚荣、不被重视的人</span>。',
          '【蚊子和狮子】蚊子专咬狮子鼻子没毛的地方，赢了狮子，唱着凯歌飞走，却被蜘蛛网粘住。<span class="word w-gold" data-note="打败过大人物，却被小人物打败，骄兵必败。">讽刺得意忘形、骄兵必败的人</span>。'
        ]},
        {t:'verse', noteId:'l24-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">穿井得一人（《吕氏春秋》）</span>',
          '家无井而出<span class="word w-gold" data-note="打水浇田，所以常要一个人专门在外。">溉汲</span>，常一人居外。',
          '及其家穿井，告人曰：“<span class="word w-key" data-note="丁家本意是省出一个劳力，话却被人听成井里挖出一个人。">吾穿井得一人</span>。”有闻而传之者曰：“丁氏穿井得一人。”',
          '国人道之，<span class="word w-key" data-note="使宋国国君听到，“闻”是使动用法。">闻之于宋君</span>。',
          '宋君令人问之于丁氏，<span class="word w-gold" data-note="国君没轻信传言，先派人去丁家核实，这才问出真相。">丁氏对曰</span>：“得一人之<span class="word w-red" data-note="得到一个人的劳力，不是井里挖出一个人。">使</span>，非得一人于井中也。”'
        ]},
        {t:'verse', noteId:'l24-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">杞人忧天（《列子》）</span>',
          '杞国有人忧天地崩坠，身<span class="word w-gold" data-note="“亡”同“无”，没有地方容身。">亡</span>所寄，废寝食者。',
          '【原文】因往<span class="word w-key" data-note="“晓”是告知、开导。">晓</span>之，曰：“天，积气耳，亡处亡气。若屈伸呼吸，终日在天中行止，奈何忧崩坠乎？”',
          '<span style="font-size:.82em;color:var(--muted)">（白话：你弯腰伸展、呼气吸气，整天都在这气里活动，干嘛怕天塌？）</span>',
          '【原文】其人曰：“天果积气，日月星宿，不当坠耶？”晓之者曰：“日月星宿，亦积气中之<span class="word w-red" data-note="日月星宿是气里会发光的那部分，不是普通的气；就算掉下来也砸不伤人。">有光耀者</span>，只使坠，亦不能有所中伤。”',
          '【原文】其人曰：“奈地坏何？”晓之者曰：“地，积块耳，充塞四虚，亡处亡块。若躇步跐蹈，终日在地上行止，奈何忧其坏？”',
          '<span style="font-size:.82em;color:var(--muted)">（白话：你踩踏行走，整天都在地上活动，干嘛怕地陷？）</span>',
          '其人<span class="word w-purple" data-note="消除疑虑的样子，“舍”同“释”。">舍然</span>大喜，<span class="word w-purple" data-note="不只是杞人，开导他的人也放下心、一样欢喜。">晓之者亦舍然大喜</span>。'
        ]},
        {t:'cards', items:[
          {front:'寓言的特点', back:'篇幅短小，借故事讲道理，常用拟人、夸张。'},
          {front:'古今异义', back:'“国人”古义指国都里的人，“穿井”的“穿”古义是挖掘。'},
          {front:'通假字', back:'亡同“无”、舍同“释”，要按本字读。'}
        ]}
      ]
    },
    back:{
      title:'回味 · 哪一则最像提醒你',
      blocks:[
        {t:'bigq', q:'四则里哪一则最像在提醒你？把那几个字摘下来，说说你的理解。', save:'l24-back1'}
      ]
    }
  }
};

/* ============================================================
   拓展板块 EXTRAS_G7A：实践 / 写作 / 专题 / 整本书 / 课外诗词
   文件名（不含 .html）作键，由 body[data-extra] 触发渲染
   ============================================================ */
var EXTRAS_G7A = {

  'practice-1': {
    eyebrow:'第一单元 · 阅读综合实践',
    title:'朗读的重音与停连',
    lead:'朗读不是把字念出声，是把句子里的意思和感情读出来。重音和停连，就是你手里的两个小工具。',
    sections:[
      {title:'先认识两个工具', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '重音：一句话里最关键的词，读得稍重、稍慢，让它“立”起来。',
          '停连：该停的地方停一下，该连的地方一口气带过去，句子就有了节奏。',
          '同一句话，重音落在不同的词上，意思会跟着变。'
        ]}
      ]},
      {title:'拿《春》的句子试一试', lab:'lab-read', blocks:[
        {t:'prose', noteId:'p1-note', paras:[
          '“盼望着，盼望着，东风来了，春天的脚步近了。”<br>试着把<span class="word w-key" data-note="两个“盼望着”重复，重读它，急切的心情就出来了。">盼望着</span>读重一点。',
          '“<span class="word w-gold" data-note="“脚步”把春天写成会走路的人，重读它，拟人就活了。">脚步</span>近了”，在“春天的脚步”后面轻轻停一下，再读“近了”。'
        ]},
        {t:'speak', id:'p1-speak', sentence:'盼望着，盼望着，东风来了，春天的脚步近了。', reads:[
          {em:'盼望着', label:'读法一 · 重音在“盼望着”'},
          {em:'脚步', label:'读法二 · 重音在“脚步”'}
        ]},
        {t:'bigq', q:'从《春》里再挑一句，标出你觉得该重读的词，自己读一遍听听感觉。', save:'p1-try'}
      ]}
    ]
  },

  'writing-1': {
    eyebrow:'第一单元 · 写作',
    title:'热爱写作，学会观察',
    lead:'写不出东西，常常是因为没东西可写。先学会看，写作就有了源头。',
    sections:[
      {title:'观察，不止用眼睛', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '用眼睛看：形状、颜色、动静。',
          '用耳朵听、用手摸、用鼻子闻，把别的感官也叫上。',
          '抓住它“和别的不一样”的地方，那就是特点。',
          '再往心里走一步：它让你想起什么、心里什么感觉。'
        ]}
      ]},
      {title:'先写初稿，再改一稿', lab:'lab-read', blocks:[
        {t:'twodraft', id:'w1-draft', ask:'选桌上或窗外的一样东西。在“初稿”里写，再用“修改稿”改：加一个别人可能没注意到的细节，把不顺的句子改顺。', save1:'w1-d1', save2:'w1-d2'}
      ]}
    ]
  },

  'practice-2': {
    eyebrow:'第二单元 · 阅读综合实践',
    title:'语气语调与词语的妙处',
    lead:'同一个意思，换个说法、换个语气，味道就不一样。读的时候留意词背后的感情。',
    sections:[
      {title:'语气和语调', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '语气：一句话的基本口气，有陈述、疑问、祈使、感叹。',
          '语调：语音有高低、快慢、长短、轻重的不同。升调（↗）往上扬，降调（↘）往下抑，疑问多上扬、陈述多下抑。',
          '节奏：把轻重、缓急、顿挫连起来，跟着全篇感情的起伏走。',
          '词语有感情色彩：褒义带夸奖，贬义带批评，中性不偏不倚。'
        ]}
      ]},
      {title:'词语里的感情', lab:'lab-read', blocks:[
        {t:'prose', noteId:'p2-note', paras:[
          '《秋天的怀念》里，母亲“<span class="word w-key" data-note="“悄悄”躲出去、又“悄悄”进来，重读它，读出母亲的小心翼翼和爱。">悄悄</span>地躲出去”，等一切恢复沉寂，她又“悄悄地进来”。',
          '一个<span class="word w-gold" data-note="普通的词，放在这儿，写出母亲怕刺激儿子的体贴。">悄悄</span>，比说十句“妈妈很爱你”都更有分量。'
        ]},
        {t:'bigq', q:'从第二单元里再找一个词，说说它带什么感情，你是从哪读出来的。', save:'p2-try'}
      ]}
    ]
  },

  'writing-2': {
    eyebrow:'第二单元 · 写作',
    title:'学会记事',
    lead:'记事，就是把一件事讲清楚、讲明白，让没在场的人也能看懂。',
    sections:[
      {title:'把事情写清楚', lab:'lab-prep', blocks:[
        {t:'cards', items:[
          {front:'六要素', back:'时间、地点、人物，事情的起因、经过、结果。'},
          {front:'经过是重点', back:'中间怎么发生的，一步步写，别一句“后来就好了”带过。'},
          {front:'加一点细节', back:'一个动作、一句话、一个神态，事情就活了。'}
        ]}
      ]},
      {title:'先写初稿，再改一稿', lab:'lab-read', blocks:[
        {t:'twodraft', id:'w2-draft', ask:'写一件最近发生在你身上的小事。在“初稿”里写，再用“修改稿”改：把“经过”一步步写清楚，加一个动作或神态的细节。', save1:'w2-d1', save2:'w2-d2'}
      ]}
    ]
  },

  'topic-2': {
    eyebrow:'第二单元 · 专题学习活动',
    title:'有朋自远方来',
    lead:'朋友这两个字，古人看得很重。看看他们怎么说，再想想自己。',
    sections:[
      {title:'古人眼里的朋友', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '有朋自远方来，不亦乐乎？',
          '海内存知己，天涯若比邻。',
          '君子之交淡如水。'
        ]}
      ]},
      {title:'说说你的看法', lab:'lab-read', blocks:[
        {t:'bigq', q:'你觉得什么样的朋友值得交？把那几个词写下来，说说为什么。', save:'t2-try'}
      ]}
    ]
  },

  'practice-3': {
    eyebrow:'第三单元 · 阅读综合实践',
    title:'梳理文章的中心',
    lead:'一篇文章写了那么多，到底想告诉你什么？这个“想告诉你的”，就是中心。',
    sections:[
      {title:'找中心的几个办法', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '先看标题，标题常常已经点了题。',
          '找中心句：开头、结尾，或段落里那句概括的话。',
          '没有现成的句子，就把每段的意思连起来，自己归纳。',
          '用自己归纳的中心解释前后几处重要材料。如果有材料对不上，回原文调整你的说法。'
        ]}
      ]},
      {title:'动手试试', lab:'lab-read', blocks:[
        {t:'html', h:'<p><a href="lesson-09.html#sec-read">回《从百草园到三味书屋》找材料</a></p>'},
        {t:'bigq', q:'百草园和书屋各找一处材料。试着用一句话说清，作者把这两段经历放在一起回忆，表达了怎样的感受。', save:'p3-try'},
        {t:'html', h:'<details><summary>写好后检查两点</summary><p>你的说法能解释两处材料吗？如果只写“批判私塾”，就回去看看作者对先生的评价和书屋里的趣事，再调整结论。</p><p><a href="skills.html?skill=theme#transfer">换一段，练习自己归纳中心 →</a></p></details>'}
      ]}
    ]
  },

  'writing-3': {
    eyebrow:'第三单元 · 写作',
    title:'如何突出中心',
    lead:'想清楚要说什么，再决定写什么、不写什么，中心就立住了。',
    sections:[
      {title:'让中心立起来', lab:'lab-prep', blocks:[
        {t:'cards', items:[
          {front:'先定一个中心', back:'动笔前用一句话说清：我这篇到底想表达什么。'},
          {front:'围绕中心选材', back:'和中心有关的留下，无关的再好也舍得删。'},
          {front:'有详有略', back:'最能说明中心的地方写细，其余几笔带过。'}
        ]}
      ]},
      {title:'先写初稿，再改一稿', lab:'lab-read', blocks:[
        {t:'twodraft', id:'w3-draft', ask:'以“一个让我记住的人”为题。在“初稿”里写，再用“修改稿”改：检查有没有跑题，把最能说明中心的那件事写细。', save1:'w3-d1', save2:'w3-d2'}
      ]}
    ]
  },

  'book-3': {
    eyebrow:'第三单元 · 整本书阅读',
    title:'《朝花夕拾》',
    lead:'鲁迅回忆自己小时候和年轻时的事，一共十篇。书名的意思是：早上的花，傍晚捡起来。',
    sections:[
      {title:'先认识这本书', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '回忆性散文集，写的多是真人真事。',
          '有百草园、长妈妈、藤野先生，也有看戏、迎神的童年。',
          '笔调有时温暖，有时带一点讽刺。'
        ]}
      ]},
      {title:'怎么读', lab:'lab-read', blocks:[
        {t:'cards', items:[
          {front:'不必一次读完', back:'一篇一篇来，每篇都独立，挑感兴趣的先读。'},
          {front:'结合注释', back:'年代隔得远，遇到不懂的词看注释，不硬啃。'},
          {front:'对照自己', back:'读到童年的趣事，想想自己有没有类似的经历。'}
        ]},
        {t:'bigq', q:'看篇目，你最想先读哪一篇？把题目写下来，说说为什么。', save:'b3-try'}
      ]},
      {title:'十篇，一篇一篇读', lab:'lab-read', blocks:[
        {t:'readlist', id:'b3-list', items:[
          {v:'1',label:'狗·猫·鼠'},
          {v:'2',label:'阿长与《山海经》'},
          {v:'3',label:'《二十四孝图》'},
          {v:'4',label:'五猖会'},
          {v:'5',label:'无常'},
          {v:'6',label:'从百草园到三味书屋'},
          {v:'7',label:'父亲的病'},
          {v:'8',label:'琐记'},
          {v:'9',label:'藤野先生'},
          {v:'10',label:'范爱农'}
        ]}
      ]}
    ]
  },

  'poems-3': {
    eyebrow:'第三单元 · 课外古诗词诵读',
    title:'课外古诗词四首',
    lead:'四首短诗，各有各的处境：有的将要离开故乡，有的漂泊江南，有的戍边想家。慢慢读，看每首里藏着的画面。',
    sections:[
      {title:'读一读', lab:'lab-read', blocks:[
        {t:'verse', noteId:'pm3-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">峨眉山月歌 · 李白</span>',
          '峨眉山月<span class="word w-gold" data-note="半圆的秋月挂在山头，一开篇就有画面。">半轮秋</span>，<span class="word w-key" data-note="月影倒映在江水里，跟着船一起流，化静为动。">影入平羌江水流</span>。',
          '夜发清溪向三峡，<span class="word w-red" data-note="一路五个地名，最后落在“思”字，思念友人。">思君</span>不见下渝州。'
        ]},
        {t:'verse', noteId:'pm3-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">江南逢李龟年 · 杜甫</span>',
          '岐王宅里<span class="word w-gold" data-note="“寻常”是当年常常相见，写昔日繁华。">寻常</span>见，崔九堂前几度闻。',
          '正是江南好风景，<span class="word w-red" data-note="既写暮春落花，也暗指两人老去、盛世落幕。">落花时节</span>又逢君。'
        ]},
        {t:'verse', noteId:'pm3-n3', lines:[
          '<span style="font-size:.78em;color:var(--muted)">行军九日思长安故园 · 岑参</span>',
          '强欲登高去，<span class="word w-gold" data-note="化用陶渊明重阳有人送酒的典故，这里却没人送，写孤单。">无人送酒来</span>。',
          '遥怜<span class="word w-key" data-note="“应”是料想、应该，故乡菊花傍着战场开放是诗人的设想，不是亲眼看见的实景，寄托对和平的渴望。">故园菊</span>，应傍战场开。'
        ]},
        {t:'verse', noteId:'pm3-n4', lines:[
          '<span style="font-size:.78em;color:var(--muted)">夜上受降城闻笛 · 李益</span>',
          '回乐烽前<span class="word w-gold" data-note="沙白如雪、月冷如霜，两个比喻写出边塞的凄清。">沙似雪</span>，受降城外月如霜。',
          '不知何处吹芦管，一夜征人<span class="word w-red" data-note="“尽”是所有人，一声笛，勾起全军的乡愁。">尽望乡</span>。'
        ]}
      ]},
      {title:'说一说', lab:'lab-back', blocks:[
        {t:'bigq', q:'四首里哪一首最有画面感？把那几个字摘下来，说说你看见了什么。', save:'pm3-try'}
      ]}
    ]
  },

  'practice-4': {
    eyebrow:'第四单元 · 阅读综合实践',
    title:'理清文章的思路',
    lead:'好文章不是想到哪写到哪，它有一条清楚的路。找到这条路，就理清了思路。',
    sections:[
      {title:'怎么理清思路', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '找线索：有的按时间，有的按地点，有的围着一个人或一件事，有的跟着感情走。',
          '先概括自然段：每个自然段用一句话写主要内容。再划分层次：合并讲同一件事或起同一作用的相邻段，说清分界的依据。',
          '把这些概括排起来，文章先写什么、再写什么就清楚了。'
        ]}
      ]},
      {title:'动手试试', lab:'lab-read', blocks:[
        {t:'html', h:'<p><a href="lesson-14.html#sec-read">回《回忆我的母亲》核对段落</a></p>'},
        {t:'bigq', q:'用三句话写开头怎样引出回忆、中间怎样组织往事、结尾怎样写感谢。再指出一处你划分层次的依据。', save:'p4-try'},
        {t:'html', h:'<details><summary>写好后检查分界</summary><p>你有没有区分往事的大体先后和结尾转入的感谢？可以回去找开始反复说“我应该感谢母亲”的地方。</p><p><a href="skills.html?skill=structure#transfer">换一段，自己试着分层 →</a></p></details>'},
        {t:'prose', noteId:'p4-speech-note', paras:[
          '教材 p.93 还有一个口头任务：从白求恩、锺太夫人、陈毅里选一位，先弄清他的生平，再以“<span class="word w-key" data-note="横线上填你选的人物，这是要讲给那个人听的演讲。">＿＿，我想对您说</span>”为题，做一次 3 分钟演讲，说说你从他身上学到了什么。',
          '下面先把演讲要点列出来，再试着讲出声。'
        ]},
        {t:'bigq', q:'你选谁？想对他说哪三句话？先写要点，再自己掐 3 分钟讲一遍。', save:'p4-speech'}
      ]}
    ]
  },

  'writing-4': {
    eyebrow:'第四单元 · 写作',
    title:'思路要清晰',
    lead:'动笔前先想清楚顺序，读者才跟得上，自己也不会写着写着卡住。',
    sections:[
      {title:'让思路清楚', lab:'lab-prep', blocks:[
        {t:'cards', items:[
          {front:'先列提纲', back:'把要写的几点按顺序列出来，像盖房前先搭架子。'},
          {front:'一段围绕一个重点', back:'一段里可以有几件有关联的小事。读一遍，想想每个细节是否都在帮助说明这一段的重点。'},
          {front:'用好过渡', back:'“先、后来、还有”这些词，让段落之间接得上。'}
        ]}
      ]},
      {title:'先写初稿，再改一稿', lab:'lab-read', blocks:[
        {t:'twodraft', id:'w4-draft', ask:'以“我家的一天”为题。在“初稿”里写，再用“修改稿”改：按时间顺序排，加好过渡词，让段落接得上。', save1:'w4-d1', save2:'w4-d2'}
      ]}
    ]
  },

  'topic-4': {
    eyebrow:'第四单元 · 专题学习活动',
    title:'少年正是读书时',
    lead:'少年时读的书，会陪你很久。看看古人怎么说，也看看自己。',
    sections:[
      {title:'关于读书', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '黑发不知勤学早，白首方悔读书迟。',
          '读书破万卷，下笔如有神。',
          '书犹药也，善读之可以医愚。'
        ]}
      ]},
      {title:'说说你自己', lab:'lab-read', blocks:[
        {t:'bigq', q:'你最近在读什么书？或者最想读哪一本？写几句你想从书里找到什么。', save:'t4-try'}
      ]}
    ]
  },

  'task-5b': {
    eyebrow:'第五单元 · 活动·探究（任务二）',
    title:'亲近动物，丰富生命体验',
    lead:'动物不会说话，但它有自己的脾气和习惯。靠近它，安静地看，你会发现很多。',
    sections:[
      {title:'怎么和动物相处', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '先安静观察：它在做什么、怎么吃东西、怎么回应周围。',
          '不吓唬、不勉强，尊重它的节奏。',
          '随手记下：一个动作、一个眼神、一件让你意外的小事。',
          '把它当一个有感受的生命，而不是一个玩具。'
        ]}
      ]},
      {title:'记录一下', lab:'lab-read', blocks:[
        {t:'bigq', q:'写一次你和动物相处的经历：它做了什么，你当时什么感觉？', save:'t5b-try'}
      ]}
    ]
  },

  'task-5c': {
    eyebrow:'第五单元 · 活动·探究（任务三）',
    title:'记叙与动物的相处',
    lead:'把你和动物之间的事写下来，重点是真实的细节和你心里的感受。',
    sections:[
      {title:'怎么写好', lab:'lab-prep', blocks:[
        {t:'cards', items:[
          {front:'选一件真事', back:'一件具体的小事，比泛泛说“我很喜欢它”更打动人。'},
          {front:'写细节', back:'它的动作、眼神、声音，还有你当时的动作。'},
          {front:'落到感受', back:'这件事让你对它、对生命有了什么不一样的看法。'}
        ]}
      ]},
      {title:'小练习', lab:'lab-read', blocks:[
        {t:'buttons', buttons:[
          {kind:'solid', label:'把上次的观察记录调进来', bring:'t5b-try', bringTo:'t5c-try'}
        ]},
        {t:'html', h:'<div class="ref-panel" id="t5c-try-ref" hidden></div>'},
        {t:'bigq', q:'列一个小故事提纲：你和动物之间最难忘的一件事，写清起因、经过和你的感受。', save:'t5c-try'}
      ]}
    ]
  },

  'practice-6': {
    eyebrow:'第六单元 · 阅读综合实践',
    title:'想象与联想',
    lead:'这两个词常一起出现，其实不是一回事。分清它们，你读小说、写作文都会更清楚。',
    sections:[
      {title:'先分清', lab:'lab-prep', blocks:[
        {t:'cards', items:[
          {front:'联想', back:'由一个事物想到另一个和它有关的事物，两者本来就有联系。比如看到月亮想到家乡。'},
          {front:'想象', back:'在脑子里创造出原本没有的新画面、新故事。比如孙悟空七十二变。'},
          {front:'常常一起用', back:'先由联想打开，再靠想象把画面补完整。'}
        ]}
      ]},
      {title:'动手试试', lab:'lab-read', blocks:[
        {t:'bigq', q:'从《小圣施威降大圣》或《皇帝的新装》里找一处，说说它是想象还是联想，你从哪几个字判断的。', save:'p6-try'}
      ]}
    ]
  },

  'writing-6': {
    eyebrow:'第六单元 · 写作',
    title:'发挥联想和想象',
    lead:'想象可以天马行空，但好的想象不是乱编，它让读者愿意信。',
    sections:[
      {title:'怎么写好', lab:'lab-prep', blocks:[
        {t:'cards', items:[
          {front:'大胆但合理', back:'再新奇，也要有自己的逻辑，读者才信。'},
          {front:'补细节', back:'新的世界长什么样、人物怎么说话，细节让它可信。'},
          {front:'为中心服务', back:'想象不是为了炫，要帮你表达想讲的东西。'}
        ]}
      ]},
      {title:'先写初稿，再改一稿', lab:'lab-read', blocks:[
        {t:'twodraft', id:'w6-draft', ask:'接着开头往下写：“那天，我家的猫突然开口说话了……”在“初稿”里写，再用“修改稿”改：补细节，让新奇的故事也合乎情理。', save1:'w6-d1', save2:'w6-d2'}
      ]}
    ]
  },

  'book-6': {
    eyebrow:'第六单元 · 整本书阅读',
    title:'《西游记》',
    lead:'唐僧师徒四人去西天取经，一路降妖除魔，一共一百回。这是中国最有名的神魔小说。',
    sections:[
      {title:'先认识这本书', lab:'lab-prep', blocks:[
        {t:'dots', items:[
          '作者吴承恩，明代小说家。',
          '主要人物：唐僧、孙悟空、猪八戒、沙和尚。',
          '一个个降妖故事串起来，也是师徒四人慢慢成长、齐心的过程。'
        ]}
      ]},
      {title:'怎么读', lab:'lab-read', blocks:[
        {t:'cards', items:[
          {front:'抓主要情节', back:'挑大闹天宫、三打白骨精这些经典故事先读。'},
          {front:'看人物', back:'孙悟空的勇、猪八戒的懒、唐僧的固执，都写得很活。'},
          {front:'可跳读', back:'有些重复的诗词和套路可以略过，不影响懂故事。'}
        ]},
        {t:'bigq', q:'师徒四人里你最喜欢谁？把那几个描写他的字摘下来，说说为什么。', save:'b6-try'}
      ]}
    ]
  },

  'poems-6': {
    eyebrow:'第六单元 · 课外古诗词诵读',
    title:'课外古诗词四首',
        lead:'四首诗，情境各不相同：有晴空里的乐观，有雨夜的思念，有寒冬梦里的报国，有山河间的少年意气。读的时候留意那个“我”，也留意每首写的是哪个时节。',
    sections:[
      {title:'读一读', lab:'lab-read', blocks:[
        {t:'verse', noteId:'pm6-n1', lines:[
          '<span style="font-size:.78em;color:var(--muted)">秋词（其一）· 刘禹锡</span>',
          '自古逢秋<span class="word w-gold" data-note="古人写秋多是悲叹冷清寂寞，诗人偏要反着来。">悲寂寥</span>，我言秋日<span class="word w-red" data-note="偏说秋天比春天还好，一反常调，写出乐观。">胜春朝</span>。',
          '晴空一鹤<span class="word w-key" data-note="“排”是推开云层，仙鹤冲天，画面开阔有力量。">排云上</span>，便引诗情到碧霄。'
        ]},
        {t:'verse', noteId:'pm6-n2', lines:[
          '<span style="font-size:.78em;color:var(--muted)">夜雨寄北 · 李商隐</span>',
          '君问归期<span class="word w-gold" data-note="想回家却定不下日子，一句写尽无奈。">未有期</span>，巴山夜雨涨秋池。',
          '<span class="word w-key" data-note="想象将来重逢时一起剪烛夜谈，再回头说今夜的雨。">何当共剪西窗烛</span>，却话巴山夜雨时。'
        ]},
        {t:'verse', noteId:'pm6-n3', lines:[
          '<span style="font-size:.78em;color:var(--muted)">十一月四日风雨大作（其二）· 陆游</span>',
          '<span style="font-size:.76em;color:var(--muted)">（农历十一月，已是冬天，不是秋天。）</span>',
          '僵卧孤村<span class="word w-red" data-note="虽困在孤村，却不为自己哀伤，先见气节。">不自哀</span>，尚思为国<span class="word w-key" data-note="“戍轮台”是守卫边疆，到老还想着报国。">戍轮台</span>。',
          '夜阑卧听风吹雨，<span class="word w-gold" data-note="风雨声里梦见战马踏过冰河，把现实和梦连起来。">铁马冰河入梦来</span>。'
        ]},
        {t:'verse', noteId:'pm6-n4', lines:[
          '<span style="font-size:.78em;color:var(--muted)">潼关 · 谭嗣同</span>',
          '终古高云<span class="word w-gold" data-note="“簇”是簇拥、聚集，写潼关地势高峻。">簇此城</span>，秋风吹散马蹄声。',
          '河流大野犹<span class="word w-key" data-note="黄河嫌原野拘束、群山不懂平坦，借山河写少年不甘束缚的胸襟。">嫌束</span>，山入潼关不解平。'
        ]}
      ]},
      {title:'说一说', lab:'lab-back', blocks:[
        {t:'bigq', q:'四首里哪一首的“我”最像你某一刻的心情？把那几个字摘下来，说说为什么。', save:'pm6-try'}
      ]}
    ]
  }
};
