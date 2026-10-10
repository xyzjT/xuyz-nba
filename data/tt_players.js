/* 乒乓球 · 明星运动员数据库(手工整理,截至 2025 年) */
window.NBA_DATA = window.NBA_DATA || {};
NBA_DATA.tt = [
  /* ===== 中国男队 ===== */
  { name: 'Ma Long', zh: '马龙', sex: '男', team: '中国', style: '右手横拍双面反胶', honors: ['奥运会金牌 ×6(单打 2 + 团体 4,历史最多)', '世锦赛单打冠军 ×3(2015/2017/2019)', '世界杯单打冠军 ×2', '双圈大满贯(史上唯一男子)', '世界排名第一累计 64+ 个月(纪录)', 'ITTF 年度最佳男运动员'], career: { olympicGold: 6, worldTitles: 29, peakRank: '世界第 1' }, note: '公认的乒乓球 GOAT,「六边形战士」' },
  { name: 'Fan Zhendong', zh: '樊振东', sex: '男', team: '中国', style: '右手横拍双面反胶', honors: ['2024 巴黎奥运会男单金牌', '奥运会金牌 ×3(单打 1 + 团体 2)', '世锦赛单打冠军 ×2(2021/2023)', '世界杯单打冠军 ×4', '大满贯得主', '世界排名第一累计 60+ 个月'], career: { olympicGold: 3, worldTitles: 20, peakRank: '世界第 1' }, note: '现役世界第一,暴力美学打法' },
  { name: 'Wang Chuqin', zh: '王楚钦', sex: '男', team: '中国', style: '左手横拍', honors: ['2024 巴黎奥运会混双金牌 + 男团金牌', '世锦赛混双冠军 ×2', '世界排名第一', 'WTT 大满贯冠军'], career: { olympicGold: 2, worldTitles: 8, peakRank: '世界第 1' }, note: '国乒新生代领军人物' },
  { name: 'Zhang Jike', zh: '张继科', sex: '男', team: '中国', style: '右手横拍', honors: ['2012 伦敦奥运会男单金牌', '世锦赛单打冠军 ×2(2011/2013)', '世界杯单打冠军 ×2', '大满贯(445 天完成,史上最快)'], career: { olympicGold: 3, worldTitles: 16, peakRank: '世界第 1' }, note: '藏獒,史上最快大满贯' },
  { name: 'Xu Xin', zh: '许昕', sex: '男', team: '中国', style: '左手直拍', honors: ['奥运会男团金牌 ×2', '世锦赛混双冠军 ×2', '世界杯男单冠军', '直板打法最后的艺术大师'], career: { olympicGold: 2, worldTitles: 13, peakRank: '世界第 2' }, note: '「大蟒」,神仙球集锦常客' },
  { name: 'Wang Liqin', zh: '王励勤', sex: '男', team: '中国', style: '右手横拍', honors: ['世锦赛单打冠军 ×3(2001/2005/2007)', '奥运会男团金牌', '「王大力」正手第一人'], career: { olympicGold: 1, worldTitles: 13, peakRank: '世界第 1' }, note: '二王一马时代代表人物' },
  { name: 'Ma Lin', zh: '马琳', sex: '男', team: '中国', style: '右手直拍', honors: ['2008 北京奥运会男单金牌', '世界杯单打冠军 ×4(历史并列最多)', '奥运会金牌 ×3', '直板前三板宗师'], career: { olympicGold: 3, worldTitles: 18, peakRank: '世界第 1' }, note: '「拼命三郎」,现中国女队主教练' },
  { name: 'Wang Hao', zh: '王皓', sex: '男', team: '中国', style: '右手直拍横打', honors: ['奥运会男单银牌 ×3(史上唯一三连亚)', '世锦赛单打冠军(2009)', '世界杯单打冠军 ×3', '直拍横打开创者'], career: { olympicGold: 2, worldTitles: 12, peakRank: '世界第 1' }, note: '悲情英雄,直拍横打鼻祖' },
  { name: 'Liu Guoliang', zh: '刘国梁', sex: '男', team: '中国', style: '右手直拍', honors: ['中国第一位男子大满贯(1996)', '1996 亚特兰大奥运会男单金牌', '世锦赛单打冠军 ×2', '世界杯单打冠军', '现任中国乒协主席'], career: { olympicGold: 2, worldTitles: 11, peakRank: '世界第 1' }, note: '「不懂球的胖子」,国乒掌门人' },
  { name: 'Kong Linghui', zh: '孔令辉', sex: '男', team: '中国', style: '右手横拍', honors: ['2000 悉尼奥运会男单金牌', '1995 天津世锦赛男单冠军', '世界杯单打冠军', '大满贯得主'], career: { olympicGold: 2, worldTitles: 10, peakRank: '世界第 1' }, note: '「乒乓王子」' },

  /* ===== 中国女队 ===== */
  { name: 'Sun Yingsha', zh: '孙颖莎', sex: '女', team: '中国', style: '右手横拍', honors: ['2024 巴黎奥运会混双金牌 + 女团金牌', '2023 德班世锦赛女单冠军', '2024 世界杯女单冠军', '世界排名第一(长期)', '女单大满贯仅差奥运金牌'], career: { olympicGold: 3, worldTitles: 10, peakRank: '世界第 1' }, note: '「小魔王」,现役女单世界第一' },
  { name: 'Chen Meng', zh: '陈梦', sex: '女', team: '中国', style: '右手横拍', honors: ['奥运会女单金牌 ×2(2020/2024,卫冕)', '奥运会女团金牌 ×2', '世界杯女单冠军', '世界排名第一累计 30+ 个月'], career: { olympicGold: 4, worldTitles: 8, peakRank: '世界第 1' }, note: '卫冕奥运女单的第六人' },
  { name: 'Wang Manyu', zh: '王曼昱', sex: '女', team: '中国', style: '右手横拍', honors: ['2021 休斯敦世锦赛女单冠军', '奥运会女团金牌 ×2', '世锦赛女双冠军', '新生代「鳗鱼」'], career: { olympicGold: 2, worldTitles: 7, peakRank: '世界第 2' }, note: '攻防一体的新世代代表' },
  { name: 'Liu Shiwen', zh: '刘诗雯', sex: '女', team: '中国', style: '右手横拍', honors: ['世界杯单打冠军 ×5(历史纪录)', '2019 布达佩斯世锦赛女单冠军', '奥运会女团金牌', '速度型打法极致'], career: { olympicGold: 1, worldTitles: 13, peakRank: '世界第 1' }, note: '「小枣」,世界杯五冠女王' },
  { name: 'Ding Ning', zh: '丁宁', sex: '女', team: '中国', style: '左手横拍', honors: ['2016 里约奥运会女单金牌(大满贯)', '世锦赛单打冠军 ×3', '世界杯单打冠军 ×3', '奥运会金牌 ×3'], career: { olympicGold: 3, worldTitles: 18, peakRank: '世界第 1' }, note: '左撇子大满贯' },
  { name: 'Li Xiaoxia', zh: '李晓霞', sex: '女', team: '中国', style: '右手横拍', honors: ['2012 伦敦奥运会女单金牌(大满贯)', '世锦赛单打冠军(2013)', '世界杯单打冠军', '力量型打法代表'], career: { olympicGold: 2, worldTitles: 9, peakRank: '世界第 1' }, note: '大锤' },
  { name: 'Zhang Yining', zh: '张怡宁', sex: '女', team: '中国', style: '右手横拍', honors: ['双圈大满贯(女子历史唯一)', '奥运会金牌 ×4(单打 2)', '世锦赛单打冠军 ×2', '世界杯单打冠军 ×4', '无敌到「找不到对手」退役'], career: { olympicGold: 4, worldTitles: 19, peakRank: '世界第 1' }, note: '「大魔王」,女子乒坛 GOAT 候选' },
  { name: 'Deng Yaping', zh: '邓亚萍', sex: '女', team: '中国', style: '右手横拍怪胶', honors: ['奥运会金牌 ×4(单打 2 + 双打 2)', '世锦赛单打冠军 ×3', '世界杯单打冠军 ×2', '女子大满贯第一人', '18 个世界冠军(保持多年纪录)'], career: { olympicGold: 4, worldTitles: 18, peakRank: '世界第 1' }, note: '1.50 米的巨人,初代大魔王' },

  /* ===== 国际名将 ===== */
  { name: 'Timo Boll', zh: '蒂莫·波尔', sex: '男', team: '德国', style: '左手横拍', honors: ['世界杯单打冠军 ×2', '欧洲锦标赛单打冠军 ×8(纪录)', '世界排名第一', '乒坛常青树,征战 20+ 年'], career: { olympicGold: 0, worldTitles: 12, peakRank: '世界第 1' }, note: '欧洲乒坛传奇,绅士球员' },
  { name: 'Dimitrij Ovtcharov', zh: '迪米特里·奥恰洛夫', sex: '男', team: '德国', style: '右手横拍', honors: ['奥运会单打铜牌 ×2(2012/2020)', '欧洲锦标赛单打冠军', '世界杯亚军'], career: { olympicGold: 0, worldTitles: 3, peakRank: '世界第 4' }, note: '潜水发球名将' },
  { name: 'Truls Moregard', zh: '特鲁尔斯·莫雷高德', sex: '男', team: '瑞典', style: '右手横拍', honors: ['2024 巴黎奥运会男单银牌', '2021 休斯敦世锦赛男单亚军', '欧洲冠军'], career: { olympicGold: 0, worldTitles: 1, peakRank: '世界第 3' }, note: '六边形球拍的瑞典天才' },
  { name: 'Tomokazu Harimoto', zh: '张本智和', sex: '男', team: '日本', style: '右手横拍', honors: ['2020 东京奥运会男团铜牌', '2018 世界杯亚军', 'ITTF 巡回赛最年轻冠军(14 岁)'], career: { olympicGold: 0, worldTitles: 0, peakRank: '世界第 3' }, note: '华裔日本选手,吼叫式打法' },
  { name: 'Felix Lebrun', zh: '费利克斯·勒布伦', sex: '男', team: '法国', style: '右手直拍', honors: ['2024 巴黎奥运会男单铜牌', '2023 欧锦赛冠军', '直拍复兴旗手'], career: { olympicGold: 0, worldTitles: 1, peakRank: '世界第 4' }, note: '勒布伦兄弟之弟,欧洲直拍希望' },
  { name: 'Lin Yun-Ju', zh: '林昀儒', sex: '男', team: '中国台北', style: '左手横拍', honors: ['2020 东京奥运会混双铜牌', '世界杯季军', '「沉默刺客」'], career: { olympicGold: 0, worldTitles: 1, peakRank: '世界第 5' }, note: '台湾乒乓球一哥' },
  { name: 'Mima Ito', zh: '伊藤美诚', sex: '女', team: '日本', style: '右手横拍生胶', honors: ['2020 东京奥运会混双金牌(日本乒乓首金)', '2020 东京奥运会女单铜牌', '多次击败中国主力'], career: { olympicGold: 1, worldTitles: 2, peakRank: '世界第 2' }, note: '生胶怪拍,国乒多年最大外协威胁' },
  { name: 'Hina Hayata', zh: '早田希娜', sex: '女', team: '日本', style: '左手横拍', honors: ['2024 巴黎奥运会女单铜牌 + 女团银牌', '日本女队一姐', '亚运会亚军'], career: { olympicGold: 0, worldTitles: 1, peakRank: '世界第 4' }, note: '日本女乒现役最强' },
  { name: 'Shin Yubin', zh: '申裕斌', sex: '女', team: '韩国', style: '右手横拍', honors: ['2024 巴黎奥运会混双铜牌 + 女团铜牌', '韩国女乒新星'], career: { olympicGold: 0, worldTitles: 0, peakRank: '世界第 6' }, note: '韩国乒乓人气王' },
];
