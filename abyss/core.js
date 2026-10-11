(function(){
var ABY=window.ABY=window.ABY||{};

const G=2200,JV=-600,JV2=-560,HAX=3900;
const SPB=176,SPG=6,SPMX=180,MAXS=8,FORM=52;
const CS=1/120,PD=22,PC=0.34,PS=60,PR=14;
const IT=1.1,GB=260,HK=10;
const PN=35,LO=-60;

const STN={P:0,R:1,T:2,D:3,S:4,M:5};
const ENMX=100,EN_HIT=6,EN_KIL=14,EN_TAKE=10,EN_PICK=3;
const CHG_T=0.38;
const FTL=0.045,FTK=0.09;
const CB_T=1.6;
const CRT=0.08,CRD=2.0;

const KC=['#2ee6a8','#5ad1ff','#ffd60a','#ff7a6b','#c8a84a','#9ad1ff','#e6edef','#7ad08a'];
const MTL=[['铁屑','m_iron'],['硫砂','s_sulfur'],['水银','s_mercury'],['岩盐','s_salt'],
  ['木炭','e_fire'],['铜髓','m_copper'],['萤石','h_frost'],['磷火','h_rose']];

const PM=[
 {n:'石卫',hp:34,d:5,sp:72,r:13,min:1,cl:'#ff5c7a'},
 {n:'浮灯',hp:20,d:4,sp:70,r:12,min:1,cl:'#5ad1ff'},
 {n:'铜弩',hp:26,d:4,sp:18,r:12,min:1,cl:'#c8a84a'},
 {n:'冲锤',hp:46,d:8,sp:96,r:15,min:2,cl:'#ff7a6b',ch:1},
 {n:'裂孢',hp:30,d:5,sp:60,r:14,min:3,cl:'#7ad08a',sp2:1},
 {n:'渊骸',hp:96,d:9,sp:80,r:18,min:4,cl:'#e6edef',el:1}
];
const EL_HP=2.0,EL_D=1.35;

const BOSS=[
 {n:'渊主·始',hp:300,d:8,sp:66,r:30,cl:'#ff5c7a',ph:1},
 {n:'熔核·炉心',hp:380,d:9,sp:60,r:32,cl:'#ff7a6b',ph:2},
 {n:'裂界·母体',hp:460,d:10,sp:70,r:34,cl:'#7ad08a',ph:2},
 {n:'沉渊·终末',hp:560,d:11,sp:74,r:38,cl:'#e6edef',ph:3}
];
const BOSSEV=5,GOLD_KILL=3,GOLD_ELITE=9,GOLD_BOSS=60;
const SHOP=[
 {k:'heal',n:'全愈之泉',c:25,d:'立刻回满生命'},
 {k:'maxhp',n:'血脉刻印',c:40,d:'生命上限 +20 并回复 20'},
 {k:'life',n:'命脉刻印',c:70,d:'生命上限 +25 并回满'},
 {k:'power',n:'深渊刻印',c:45,d:'本局挥砍伤害 +8'},
 {k:'wpn',n:'武器淬炼',c:60,d:'本局武器伤害 +6'},
 {k:'speed',n:'疾行符',c:35,d:'本局移速 +30'},
 {k:'energy',n:'核心电池',c:30,d:'立刻充满能量并上限 +20'},
 {k:'potion',n:'药剂补给',c:30,d:'随机补 2 瓶已持有药剂'},
 {k:'shield',n:'常驻护盾',c:55,d:'本局受伤永久 -15%'},
 {k:'repair',n:'重铸炉火',c:40,d:'修复武器耐久至满'},
 {k:'slot',n:'法术刻槽',c:80,d:'法杖槽位 +1（上限 8）'},
 {k:'skill',n:'技能重铸',c:50,d:'随机更换一个技能'},
 {k:'wash',n:'深渊洗练',c:45,d:'清空本次强化并立即重抽三选一'}
];

const SK=[
 {k:'dash',n:'突进斩',e:25,cd:5,key:'e',d:'向朝向瞬移 190px，沿途多段斩击，命中回能'},
 {k:'wave',n:'三段剑气',e:30,cd:4,key:'e',d:'横向三连剑气贯穿，远程清场'},
 {k:'quake',n:'震地波',e:35,cd:6,key:'e',d:'落地冲击波向两侧扩散，强击退'},
 {k:'guard',n:'铁壁',e:30,cd:8,key:'q',d:'3.2 秒内受到伤害降至 25%'},
 {k:'heal',n:'治愈',e:45,cd:10,key:'q',d:'立刻回复 35 点生命并清空灼烧'},
 {k:'slow',n:'时缓',e:40,cd:12,key:'q',d:'2.6 秒内全局时间减速，你的动作不变'}
];
const OFF=['dash','wave','quake'];
const DEF=['guard','heal','slow'];

const UP=[
 {k:'atk',n:'锐化',m:6,d:'挥砍伤害 +{v}',mx:8},
 {k:'spd',n:'疾风',m:5,d:'攻击冷却 -{v}%',mx:6},
 {k:'vit',n:'铁血',m:6,d:'生命上限 +{v}',mx:8},
 {k:'lch',n:'汲血',m:5,d:'击杀回复 +{v} 点生命',mx:6},
 {k:'inv',n:'残影',m:4,d:'受击无敌 +{v} 秒',mx:5},
 {k:'mov',n:'疾行',m:4,d:'移动速度 +{v}',mx:6},
 {k:'jmp',n:'跃空',m:1,d:'二段跳次数 +{v}',mx:3},
 {k:'rng',n:'延锋',m:8,d:'挥砍范围 +{v}',mx:6},
 {k:'nrg',n:'聚能',m:8,d:'能量获取 +{v}%',mx:7},
 {k:'crt',n:'要害',m:5,d:'暴击率 +{v}%',mx:8},
 {k:'crd',n:'绝命',m:10,d:'暴击伤害 +{v}%',mx:6},
 {k:'kb',n:'震荡',m:5,d:'击退与顿帧强化 +{v}%',mx:6},
 {k:'rgn',n:'调息',m:2,d:'每秒回血 +{v}',mx:6},
 {k:'cdr',n:'专注',m:4,d:'技能冷却 -{v}%',mx:7}
];

const ABY_KEY='wz_abyss';
const PEND_KEY='wz_abyss_pend';
const POT_KEY='wz_abyss_pots';
const FORGE_KEY='wz_abyss_forge';
const POTS=[{k:'pot_heat',n:'炽热药剂',ef:'fire'},{k:'pot_flow',n:'流动药剂',ef:'flow'},
  {k:'pot_ward',n:'坚固药剂',ef:'ward'},{k:'pot_elixir',n:'万能灵药',ef:'elixir'}];
const FIRE_T=6,FLOW_T=5,WARD_T=7;

const MPMX=60,MPREG=7;
const SPL=[
 {k:'ice',n:'冰锥',c:14,d:'穿透冰锥，命中减速',t:'atk'},
 {k:'fire',n:'火球',c:18,d:'抛射火球，落点爆炸并点燃',t:'atk'},
 {k:'bolt',n:'雷击',c:22,d:'瞬发闪电，连锁最多 3 个目标',t:'atk'}
];
const MOD=[
 {k:'heavy',n:'沉重',c:0,d:'下一发伤害 ×1.8、体积更大',t:'mod'},
 {k:'split',n:'分裂',c:4,d:'下一发变为 3 连发',t:'mod'},
 {k:'pierce',n:'穿透',c:3,d:'下一发可穿透 3 个目标',t:'mod'},
 {k:'homing',n:'追踪',c:5,d:'下一发会追踪最近的敌人',t:'mod'}
];
const UNLOCK={
 ice:{src:'基础',c:'#8a9499'},
 heavy:{src:'基础',c:'#8a9499'},
 fire:{src:'炽热药剂',c:'#ff7a6b'},
 homing:{src:'流动药剂',c:'#9ad1ff'},
 pierce:{src:'坚固药剂',c:'#2ee6a8'},
 bolt:{src:'万能灵药',c:'#ffd60a'},
 split:{src:'万能灵药',c:'#ffd60a'}
};
const SLOT_BASE=2,SLOT_MAX=8,SLOT_PER=26;

const INK='#e6edef',INK3='#6a767d',GOLD='#ffd60a',CYN='#5ad1ff',GRA='#7ad08a',RED='#ff5c7a';

const PT_R=36,PT_D=0.55,GATE_W=54;


const EVT=[
 {k:'rich',n:'富矿层',d:'材料掉落翻倍',c:'#ffd60a'},
 {k:'elite',n:'精英层',d:'全部为精英怪物',c:'#ff7a6b'},
 {k:'swift',n:'疾行层',d:'移动速度 +30%',c:'#5ad1ff'},
 {k:'fog',n:'迷雾层',d:'视野受限',c:'#9ad1ff'},
 {k:'fury',n:'狂暴层',d:'敌人攻击更凶',c:'#ff5c7a'},
 {k:'calm',n:'静滞层',d:'敌人变慢',c:'#2ee6a8'}
];

const RELIC=[
 {k:'frag',n:'配方碎片',c:'#2ee6a8',d:'可在圣山换取一次强化'},
 {k:'iron',n:'魔铁锭',c:'#9ad1ff',d:'锻造用金属'},
 {k:'book',n:'附魔书',c:'#ffd60a',d:'锻造用附魔'}
];

Object.assign(ABY,{G:G,JV:JV,JV2:JV2,HAX:HAX,SPB:SPB,SPG:SPG,SPMX:SPMX,MAXS:MAXS,FORM:FORM,CS:CS,PD:PD,PC:PC,PS:PS,PR:PR,IT:IT,GB:GB,HK:HK,PN:PN,LO:LO,STN:STN,ENMX:ENMX,EN_HIT:EN_HIT,EN_KIL:EN_KIL,EN_TAKE:EN_TAKE,EN_PICK:EN_PICK,CHG_T:CHG_T,FTL:FTL,FTK:FTK,CB_T:CB_T,CRT:CRT,CRD:CRD,KC:KC,MTL:MTL,PM:PM,EL_HP:EL_HP,EL_D:EL_D,BOSS:BOSS,BOSSEV:BOSSEV,GOLD_KILL:GOLD_KILL,GOLD_ELITE:GOLD_ELITE,GOLD_BOSS:GOLD_BOSS,SHOP:SHOP,SK:SK,OFF:OFF,DEF:DEF,UP:UP,ABY_KEY:ABY_KEY,PEND_KEY:PEND_KEY,POT_KEY:POT_KEY,FORGE_KEY:FORGE_KEY,POTS:POTS,FIRE_T:FIRE_T,FLOW_T:FLOW_T,WARD_T:WARD_T,MPMX:MPMX,MPREG:MPREG,SPL:SPL,MOD:MOD,UNLOCK:UNLOCK,SLOT_BASE:SLOT_BASE,SLOT_MAX:SLOT_MAX,SLOT_PER:SLOT_PER,PT_R:PT_R,PT_D:PT_D,GATE_W:GATE_W,EVT:EVT,RELIC:RELIC,INK:INK,INK3:INK3,GOLD:GOLD,CYN:CYN,GRA:GRA,RED:RED});
})();
