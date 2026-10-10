/* NBA 30 队数据 · 截至 2023-24 赛季 */
window.NBA_DATA = window.NBA_DATA || {};
NBA_DATA.teams = [
  /* ================= 东部 · 大西洋 ================= */
  { id:'celtics', name:'凯尔特人', en:'Boston Celtics', city:'波士顿', arena:'TD花园球馆', founded:1946, conf:'东部', div:'大西洋赛区', champs:18, colors:['#007A33','#BA9653'], desc:'NBA 史上夺冠最多的豪门,「绿色军团」。2024 年拿下队史第 18 冠,压过宿敌湖人。', stars:['tatum','brown'] },
  { id:'knicks', name:'尼克斯', en:'New York Knicks', city:'纽约', arena:'麦迪逊广场花园', founded:1946, conf:'东部', div:'大西洋赛区', champs:2, colors:['#F58426','#006BB6'], desc:'「篮球麦加」,全球最著名的球馆之一。市值常年联盟第一,铁杆球迷文化独树一帜。', stars:['brunson','randall'] },
  { id:'nets', name:'篮网', en:'Brooklyn Nets', city:'布鲁克林', arena:'巴克莱中心', founded:1967, conf:'东部', div:'大西洋赛区', champs:0, colors:['#000000','#FFFFFF'], desc:'布鲁克林的黑白极简美学代表,2024 年进入重建期,巴克莱中心是纽约潮流文化地标。', stars:['bridges'] },
  { id:'sixers', name:'76人', en:'Philadelphia 76ers', city:'费城', arena:'富国银行中心', founded:1946, conf:'东部', div:'大西洋赛区', champs:3, colors:['#006BB6','#ED174C'], desc:'「相信过程」的费城军团,恩比德时代两夺得分王,2024 年马克西飞速成长接过火炬。', stars:['embiid','maxey'] },
  { id:'raptors', name:'猛龙', en:'Toronto Raptors', city:'多伦多', arena:'丰业银行球馆', founded:1995, conf:'东部', div:'大西洋赛区', champs:1, colors:['#CE1141','#000000'], desc:'唯一非美国本土球队,「北境之王」2019 年夺得队史首冠,加拿大篮球旗帜。', stars:['barnes'] },

  /* ================= 东部 · 中部 ================= */
  { id:'bulls', name:'公牛', en:'Chicago Bulls', city:'芝加哥', arena:'联合中心', founded:1966, conf:'东部', div:'中部赛区', champs:6, colors:['#CE1141','#000000'], desc:'乔丹时代 6 冠王朝的传奇之地,「风城」红色公牛是 90 年代篮球的代名词。', stars:['lavine'] },
  { id:'cavaliers', name:'骑士', en:'Cleveland Cavaliers', city:'克利夫兰', arena:'速贷球馆', founded:1970, conf:'东部', div:'中部赛区', champs:1, colors:['#860038','#FDBB30'], desc:'2016 年 1-3 逆转 73 胜勇士夺冠,为克利夫兰终结 52 年冠军荒。米切尔时代重新崛起。', stars:['mitchell','garland','mobley'] },
  { id:'pistons', name:'活塞', en:'Detroit Pistons', city:'底特律', arena:'小凯撒球馆', founded:1941, conf:'东部', div:'中部赛区', champs:3, colors:['#C8102E','#1D42BA'], desc:'「坏孩子军团」与「平民五虎」两支冠军之师,铁血防守是底特律的篮球 DNA。', stars:['cunningham'] },
  { id:'pacers', name:'步行者', en:'Indiana Pacers', city:'印第安纳波利斯', arena:'甘布里吉球馆', founded:1967, conf:'东部', div:'中部赛区', champs:0, colors:['#002D62','#FDBB30'], desc:'印第安纳的篮球圣地,雷吉·米勒的 9 秒 8 分名垂青史。2024 年哈利伯顿率队杀回东决。', stars:['haliburton'] },
  { id:'bucks', name:'雄鹿', en:'Milwaukee Bucks', city:'密尔沃基', arena:'费哲论坛球馆', founded:1968, conf:'东部', div:'中部赛区', champs:2, colors:['#00471B','#EEE1C6'], desc:'字母哥的希腊怪兽王朝,2021 年时隔 50 年重夺总冠军。', stars:['giannis','lillard'] },

  /* ================= 东部 · 东南 ================= */
  { id:'heat', name:'热火', en:'Miami Heat', city:'迈阿密', arena:'卡塞亚中心', founded:1988, conf:'东部', div:'东南赛区', champs:3, colors:['#98002E','#F9A01B'], desc:'帕特·莱利打造的铁血文化,两度以低种子杀入总决赛。「热火文化」是全联盟的试金石。', stars:['butler','adebayo','herro'] },
  { id:'magic', name:'魔术', en:'Orlando Magic', city:'奥兰多', arena:'安利中心', founded:1989, conf:'东部', div:'东南赛区', champs:0, colors:['#0077C0','#C4CED4'], desc:'奥尼尔、麦迪、霍华德都曾在此闪耀。2024 年班凯罗率年轻军团重返季后赛。', stars:['banchero','wagner'] },
  { id:'hawks', name:'老鹰', en:'Atlanta Hawks', city:'亚特兰大', arena:'州立农业球馆', founded:1946, conf:'东部', div:'东南赛区', champs:1, colors:['#E03A3E','#C1D32F'], desc:'特雷·杨的超远三分与空接之城,2021 年意外杀入东决的青春之师。', stars:['young'] },
  { id:'hornets', name:'黄蜂', en:'Charlotte Hornets', city:'夏洛特', arena:'光谱中心', founded:1988, conf:'东部', div:'东南赛区', champs:0, colors:['#1D1160','#00788C'], desc:'夏洛特的城市名片,拉梅洛·鲍尔的天马行空传球让光谱中心重新沸腾。', stars:['ball'] },
  { id:'wizards', name:'奇才', en:'Washington Wizards', city:'华盛顿', arena:'首都一号球馆', founded:1961, conf:'东部', div:'东南赛区', champs:1, colors:['#002B5C','#E31837'], desc:'首都球队,1978 年夺冠。乔丹生涯最后一站,如今处于重建期。', stars:[] },

  /* ================= 西部 · 西北 ================= */
  { id:'nuggets', name:'掘金', en:'Denver Nuggets', city:'丹佛', arena:'波尔球馆', founded:1967, conf:'西部', div:'西北赛区', champs:1, colors:['#0E2240','#FEC524'], desc:'高原之城,约基奇用不可思议的传球美学定义中锋新时代,2023 年夺得队史首冠。', stars:['jokic','murray'] },
  { id:'timberwolves', name:'森林狼', en:'Minnesota Timberwolves', city:'明尼阿波利斯', arena:'标靶中心', founded:1989, conf:'西部', div:'西北赛区', champs:0, colors:['#0C2340','#78BE20'], desc:'加内特时代的狼王传说,2024 年爱德华兹率队 20 年后重返西决,青春风暴席卷联盟。', stars:['edwards','towns','gobert'] },
  { id:'thunder', name:'雷霆', en:'Oklahoma City Thunder', city:'俄克拉荷马城', arena:'佩科姆中心', founded:1967, conf:'西部', div:'西北赛区', champs:1, colors:['#007AC1','#EF3B24'], desc:'杜兰特、威少、哈登的选秀神话,2024 年 SGA 带领最年轻军团登顶西部第一。', stars:['sga','holmgren'] },
  { id:'blazers', name:'开拓者', en:'Portland Trail Blazers', city:'波特兰', arena:'摩达中心', founded:1970, conf:'西部', div:'西北赛区', champs:1, colors:['#E03A3E','#000000'], desc:'撕裂之城,1977 年比尔·沃顿率队夺冠。利拉德时代结束后进入重建。', stars:['simons'] },
  { id:'jazz', name:'爵士', en:'Utah Jazz', city:'盐湖城', arena:'三角洲中心', founded:1974, conf:'西部', div:'西北赛区', champs:0, colors:['#002B5C','#F9A01B'], desc:'马龙与斯托克顿的挡拆教科书,「爵士乐之城」的钢铁纪律传统。', stars:['markkanen'] },

  /* ================= 西部 · 太平洋 ================= */
  { id:'warriors', name:'勇士', en:'Golden State Warriors', city:'旧金山', arena:'大通中心', founded:1946, conf:'西部', div:'太平洋赛区', champs:7, colors:['#1D428A','#FFC72C'], desc:'库里的三分革命改变了篮球本身,8 年 4 冠的王朝球队,大通中心是湾区新地标。', stars:['curry','paul'] },
  { id:'lakers', name:'湖人', en:'Los Angeles Lakers', city:'洛杉矶', arena:'Crypto.com 球馆', founded:1947, conf:'西部', div:'太平洋赛区', champs:17, colors:['#552583','#FDB927'], desc:'紫金军团,好莱坞的球队。从魔术师到科比再到詹姆斯,17 冠与凯尔特人并称绝代双骄。', stars:['james','davis'] },
  { id:'clippers', name:'快船', en:'Los Angeles Clippers', city:'洛杉矶', arena:'直觉巨蛋', founded:1970, conf:'西部', div:'太平洋赛区', champs:0, colors:['#C8102E','#1D428A'], desc:'洛杉矶的另一极,2024 年搬入全美最先进的直觉巨蛋球馆,追逐队史首冠。', stars:['leonard','george','harden','westbrook'] },
  { id:'suns', name:'太阳', en:'Phoenix Suns', city:'菲尼克斯', arena:'足迹中心', founded:1968, conf:'西部', div:'太平洋赛区', champs:0, colors:['#1D1160','#E56020'], desc:'「七秒进攻」的跑轰鼻祖,巴克利与纳什都曾在此饮恨。杜兰特+布克的火力组合同样冲击首冠。', stars:['durant','booker'] },
  { id:'kings', name:'国王', en:'Sacramento Kings', city:'萨克拉门托', arena:'金色1号中心', founded:1945, conf:'西部', div:'太平洋赛区', champs:1, colors:['#5A2D81','#63727A'], desc:'2002 年西决之憾成永恒话题,2023 年「点亮光束」终结 16 年季后赛荒,福克斯与小萨让国王复兴。', stars:['fox','sabonis'] },

  /* ================= 西部 · 西南 ================= */
  { id:'mavericks', name:'独行侠', en:'Dallas Mavericks', city:'达拉斯', arena:'美航中心', founded:1980, conf:'西部', div:'西南赛区', champs:1, colors:['#00538C','#B8C4CA'], desc:'诺维茨基单核 2011 年击败三巨头夺冠的经典,如今东契奇的魔术师表演延续传奇。', stars:['doncic','irving'] },
  { id:'rockets', name:'火箭', en:'Houston Rockets', city:'休斯顿', arena:'丰田中心', founded:1967, conf:'西部', div:'西南赛区', champs:2, colors:['#CE1141','#000000'], desc:'奥拉朱旺背靠背冠军,姚明让火箭成为中国球迷的「主队」,中国红是休斯顿的印记。', stars:['green','sengun'] },
  { id:'spurs', name:'马刺', en:'San Antonio Spurs', city:'圣安东尼奥', arena:'弗罗斯特银行中心', founded:1967, conf:'西部', div:'西南赛区', champs:5, colors:['#C4CED4','#000000'], desc:'波波维奇的银黑军团,邓肯时代 5 冠 22 年常胜。2023 年文班亚马开启新纪元。', stars:['wembanyama'] },
  { id:'grizzlies', name:'灰熊', en:'Memphis Grizzlies', city:'孟菲斯', arena:'联邦快递球馆', founded:1995, conf:'西部', div:'西南赛区', champs:0, colors:['#5D76A9','#12173F'], desc:'「磨砺之城」,黑白双雄的防守传统,莫兰特的飞天遁地让孟菲斯重燃激情。', stars:['morant','jackson'] },
  { id:'pelicans', name:'鹈鹕', en:'New Orleans Pelicans', city:'新奥尔良', arena:'冰沙王中心', founded:1988, conf:'西部', div:'西南赛区', champs:0, colors:['#0C2340','#C8102E'], desc:'爵士乐之城的球队,浓眉与锡安两代状元的传承之地。', stars:['zion','ingram'] },
];
