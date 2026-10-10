/* 羽毛球 · 明星运动员数据库(手工整理,截至 2025 年) */
window.NBA_DATA = window.NBA_DATA || {};
NBA_DATA.bd = [
  /* ===== 男单 ===== */
  { name: 'Lin Dan', zh: '林丹', sex: '男', team: '中国', event: '男单', honors: ['奥运会男单金牌 ×2(2008 北京 / 2012 伦敦,卫冕)', '世锦赛男单冠军 ×5(历史第一)', '全英公开赛冠军 ×6', '亚运会男单冠军 ×2', '双圈全满贯(历史唯一)', '世界冠军 20 个'], career: { olympicGold: 2, worldTitles: 20, peakRank: '世界第 1' }, note: '「超级丹」,羽毛球历史 GOAT' },
  { name: 'Chen Long', zh: '谌龙', sex: '男', team: '中国', event: '男单', honors: ['2016 里约奥运会男单金牌', '2020 东京奥运会男单银牌', '世锦赛男单冠军 ×2(2014/2015)', '全英冠军 ×2'], career: { olympicGold: 1, worldTitles: 9, peakRank: '世界第 1' }, note: '防守反击大师,「中国龙」' },
  { name: 'Shi Yuqi', zh: '石宇奇', sex: '男', team: '中国', event: '男单', honors: ['世界排名第一(2024)', '2018 全英公开赛冠军', '2018 世锦赛男单亚军', '汤姆斯杯冠军主力'], career: { olympicGold: 0, worldTitles: 2, peakRank: '世界第 1' }, note: '中国男单现役领军人' },
  { name: 'Lee Chong Wei', zh: '李宗伟', sex: '男', team: '马来西亚', event: '男单', honors: ['奥运会男单银牌 ×3(2008/2012/2016)', '世锦赛男单亚军 ×4', '全英公开赛冠军 ×4', '世界排名第一累计 349 周(历史纪录)', '马来西亚史上最伟大运动员'], career: { olympicGold: 0, worldTitles: 5, peakRank: '世界第 1' }, note: '无冕之王,与林丹的「林李大战」名垂青史' },
  { name: 'Viktor Axelsen', zh: '安赛龙', sex: '男', team: '丹麦', event: '男单', honors: ['奥运会男单金牌 ×2(2020 东京 / 2024 巴黎,卫冕)', '世锦赛男单冠军 ×2(2017/2022)', '全英冠军 ×2', '会流利中文的「中文哥」'], career: { olympicGold: 2, worldTitles: 8, peakRank: '世界第 1' }, note: '丹麦巨人,现役最强男单' },
  { name: 'Kento Momota', zh: '桃田贤斗', sex: '男', team: '日本', event: '男单', honors: ['世锦赛男单冠军 ×2(2018/2019,卫冕)', '2019 赛季单年 11 冠(吉尼斯纪录)', '世界排名第一'], career: { olympicGold: 0, worldTitles: 3, peakRank: '世界第 1' }, note: '车祸后陨落的天才,2019 年统治级表现' },

  /* ===== 女单 ===== */
  { name: 'Chen Yufei', zh: '陈雨菲', sex: '女', team: '中国', event: '女单', honors: ['2020 东京奥运会女单金牌', '2024 巴黎奥运会女单 8 强(拼到最后一分)', '世锦赛女单亚军 ×2', '全英公开赛冠军'], career: { olympicGold: 1, worldTitles: 4, peakRank: '世界第 1' }, note: '中国女单领军人' },
  { name: 'He Bingjiao', zh: '何冰娇', sex: '女', team: '中国', event: '女单', honors: ['2024 巴黎奥运会女单银牌', '世锦赛女单季军', '苏迪曼杯冠军主力'], career: { olympicGold: 0, worldTitles: 2, peakRank: '世界第 5' }, note: '左手将,巴黎夺银后退役' },
  { name: 'Tai Tzu-ying', zh: '戴资颖', sex: '女', team: '中国台北', event: '女单', honors: ['世界排名第一累计 214 周(女单历史纪录)', '全英公开赛冠军 ×3', '2020 东京奥运会银牌', '亚运会冠军'], career: { olympicGold: 0, worldTitles: 5, peakRank: '世界第 1' }, note: '假动作天后,「小戴」' },
  { name: 'An Se-young', zh: '安洗莹', sex: '女', team: '韩国', event: '女单', honors: ['2024 巴黎奥运会女单金牌', '2023 哥本哈根世锦赛女单冠军', '世界排名第一', '韩国 28 年来首枚羽毛球奥运金牌'], career: { olympicGold: 1, worldTitles: 3, peakRank: '世界第 1' }, note: '韩国天才少女,新生代女王' },
  { name: 'Akane Yamaguchi', zh: '山口茜', sex: '女', team: '日本', event: '女单', honors: ['世锦赛女单冠军 ×2(2021/2022,卫冕)', '世界排名第一', '全英冠军'], career: { olympicGold: 0, worldTitles: 3, peakRank: '世界第 1' }, note: '小个子跑不死的日本一姐' },
  { name: 'Carolina Marin', zh: '卡罗琳娜·马林', sex: '女', team: '西班牙', event: '女单', honors: ['2016 里约奥运会女单金牌', '世锦赛女单冠军 ×3', '欧洲历史上最伟大女单', '两次大伤后仍返巅峰'], career: { olympicGold: 1, worldTitles: 4, peakRank: '世界第 1' }, note: '西班牙斗士,嘶吼式打法' },
  { name: 'P.V. Sindhu', zh: '普萨拉·辛杜', sex: '女', team: '印度', event: '女单', honors: ['2016 里约奥运会银牌', '2020 东京奥运会铜牌(奥运奖牌 ×2)', '2019 世锦赛女单冠军', '印度羽毛球第一人'], career: { olympicGold: 0, worldTitles: 2, peakRank: '世界第 2' }, note: '印度体坛传奇' },
  { name: 'Zhang Ning', zh: '张宁', sex: '女', team: '中国', event: '女单', honors: ['奥运会女单金牌 ×2(2004 雅典 / 2008 北京,卫冕)', '29 岁与 33 岁两夺奥运(大龄传奇)', '世锦赛女单冠军'], career: { olympicGold: 2, worldTitles: 5, peakRank: '世界第 1' }, note: '大器晚成的奥运双冠王' },

  /* ===== 双打与混双 ===== */
  { name: 'Zheng Siwei', zh: '郑思维', sex: '男', team: '中国', event: '混双', honors: ['2024 巴黎奥运会混双金牌', '世锦赛混双冠军 ×3(与黄雅琼)', '世界排名第一(混双)', '「雅思组合」统治一个时代'], career: { olympicGold: 1, worldTitles: 8, peakRank: '世界第 1' }, note: '混双 GOAT 组合的男伴' },
  { name: 'Huang Yaqiong', zh: '黄雅琼', sex: '女', team: '中国', event: '混双', honors: ['2024 巴黎奥运会混双金牌', '世锦赛混双冠军 ×3(与郑思维)', '世界排名第一(混双)'], career: { olympicGold: 1, worldTitles: 7, peakRank: '世界第 1' }, note: '雅思组合女伴,奥运夺冠现场被求婚' },
  { name: 'Chen Qingchen', zh: '陈清晨', sex: '女', team: '中国', event: '女双', honors: ['2024 巴黎奥运会女双金牌', '世锦赛女双冠军 ×4(与贾一凡,历史最多)', '世界排名第一(女双)'], career: { olympicGold: 1, worldTitles: 7, peakRank: '世界第 1' }, note: '凡尘组合,「C语言」场边名场面' },
  { name: 'Jia Yifan', zh: '贾一凡', sex: '女', team: '中国', event: '女双', honors: ['2024 巴黎奥运会女双金牌', '世锦赛女双冠军 ×4(与陈清晨)', '世界排名第一(女双)'], career: { olympicGold: 1, worldTitles: 7, peakRank: '世界第 1' }, note: '凡尘组合搭档' },
  { name: 'Fu Haifeng', zh: '傅海峰', sex: '男', team: '中国', event: '男双', honors: ['2012 伦敦奥运会男双金牌(风云组合)', '2008 北京奥运会银牌', '2016 里约再夺金牌(与张楠)', '世锦赛男双冠军 ×4', '奥运金牌 ×2 的男双传奇'], career: { olympicGold: 2, worldTitles: 6, peakRank: '世界第 1' }, note: '重炮手,男双两代搭档两金' },
  { name: 'Cai Yun', zh: '蔡赟', sex: '男', team: '中国', event: '男双', honors: ['2012 伦敦奥运会男双金牌(风云组合)', '世锦赛男双冠军 ×4', '中国男双标杆'], career: { olympicGold: 1, worldTitles: 5, peakRank: '世界第 1' }, note: '网前大师,风云组合之云' },
];
