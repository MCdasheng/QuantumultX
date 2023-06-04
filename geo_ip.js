/*
[task_local]
event-interaction https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/geo_ip.js, tag=GeoIP查询, img-url=location.fill.viewfinder.system
*/

var url = "https://api.ip.sb/geoip";
var opts = {
  policy: $environment.params,
};
var myRequest = {
  url: url,
  opts: opts,
  timeout: 4000,
};

var message = "";

$task.fetch(myRequest).then(
  (response) => {
    message = response ? json2info(response.body) : "";
    $done({
      title: "    🔎 IP.SB 查询结果",
      htmlMessage: message,
    });
  },
  (reason) => {
    message = "</br></br>🛑 查询超时";
    message =
      `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` +
      message +
      `</p>`;
    $done({
      title: "🔎 IP.SB 查询结果",
      htmlMessage: message,
    });
  }
);

function json2info(a) {
  // 先画一条虚线
  var res = "------------------------------";

  // 开始检查参数
  cnt = JSON.parse(a);

  var res_netWork = $environment.ssid
    ? "🌐" + $environment.ssid
    : "📶" + $environment.cellular.carrierName;
  var res_ip = cnt["ip"];
  var res_isp = cnt["isp"];
  var flag = flags.get(cnt["country_code"].toUpperCase())
    ? flags.get(cnt["country_code"].toUpperCase())
    : "🏴‍☠️";
  var res_city = cnt["city"] ? flag + cnt["city"] : null; // 添加flag
  var res_country_code = flag + cnt["country_code"]; // 添加flag

  // 添加css样式
  res =
    res +
    "</br><b>" +
    "<font  color=>" +
    "NetWork" +
    "</font> : " +
    "</b>" +
    "<font  color=>" +
    res_netWork +
    "</font></br>";

  res =
    res +
    "</br><b>" +
    "<font  color=>" +
    "IP" +
    "</font> : " +
    "</b>" +
    "<font  color=>" +
    res_ip +
    "</font></br>";

  res =
    res +
    "</br><b>" +
    "<font  color=>" +
    "ISP" +
    "</font> : " +
    "</b>" +
    "<font  color=>" +
    res_isp +
    "</font></br>";

  res =
    res +
    "</br><b>" +
    "<font  color=>" +
    "Country" +
    "</font> : " +
    "</b>" +
    "<font  color=>" +
    res_country_code +
    "</font></br>";

  res = res_city
    ? res +
      "</br><b>" +
      "<font  color=>" +
      "City" +
      "</font> : " +
      "</b>" +
      "<font  color=>" +
      res_city +
      "</font></br>"
    : res;

  res =
    res +
    "------------------------------" +
    `</br><font color=#6959CD><b>节点</b> ➟ ${$environment.params} </font>`;

  res =
    `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
    res +
    `</p>`;
  return res;
}

var flags = new Map([
  ["AC", "🇦🇨"],
  ["AE", "🇦🇪"],
  ["AF", "🇦🇫"],
  ["AI", "🇦🇮"],
  ["AL", "🇦🇱"],
  ["AM", "🇦🇲"],
  ["AQ", "🇦🇶"],
  ["AR", "🇦🇷"],
  ["AS", "🇦🇸"],
  ["AT", "🇦🇹"],
  ["AU", "🇦🇺"],
  ["AW", "🇦🇼"],
  ["AX", "🇦🇽"],
  ["AZ", "🇦🇿"],
  ["BA", "🇧🇦"],
  ["BB", "🇧🇧"],
  ["BD", "🇧🇩"],
  ["BE", "🇧🇪"],
  ["BF", "🇧🇫"],
  ["BG", "🇧🇬"],
  ["BH", "🇧🇭"],
  ["BI", "🇧🇮"],
  ["BJ", "🇧🇯"],
  ["BM", "🇧🇲"],
  ["BN", "🇧🇳"],
  ["BO", "🇧🇴"],
  ["BR", "🇧🇷"],
  ["BS", "🇧🇸"],
  ["BT", "🇧🇹"],
  ["BV", "🇧🇻"],
  ["BW", "🇧🇼"],
  ["BY", "🇧🇾"],
  ["BZ", "🇧🇿"],
  ["CA", "🇨🇦"],
  ["CF", "🇨🇫"],
  ["CH", "🇨🇭"],
  ["CK", "🇨🇰"],
  ["CL", "🇨🇱"],
  ["CM", "🇨🇲"],
  ["CN", "🇨🇳"],
  ["CO", "🇨🇴"],
  ["CP", "🇨🇵"],
  ["CR", "🇨🇷"],
  ["CU", "🇨🇺"],
  ["CV", "🇨🇻"],
  ["CW", "🇨🇼"],
  ["CX", "🇨🇽"],
  ["CY", "🇨🇾"],
  ["CZ", "🇨🇿"],
  ["DE", "🇩🇪"],
  ["DG", "🇩🇬"],
  ["DJ", "🇩🇯"],
  ["DK", "🇩🇰"],
  ["DM", "🇩🇲"],
  ["DO", "🇩🇴"],
  ["DZ", "🇩🇿"],
  ["EA", "🇪🇦"],
  ["EC", "🇪🇨"],
  ["EE", "🇪🇪"],
  ["EG", "🇪🇬"],
  ["EH", "🇪🇭"],
  ["ER", "🇪🇷"],
  ["ES", "🇪🇸"],
  ["ET", "🇪🇹"],
  ["EU", "🇪🇺"],
  ["FI", "🇫🇮"],
  ["FJ", "🇫🇯"],
  ["FK", "🇫🇰"],
  ["FM", "🇫🇲"],
  ["FO", "🇫🇴"],
  ["FR", "🇫🇷"],
  ["GA", "🇬🇦"],
  ["GB", "🇬🇧"],
  ["GR", "🇬🇷"],
  ["GU", "🇬🇺"],
  ["HK", "🇭🇰"],
  ["HR", "🇭🇷"],
  ["HU", "🇭🇺"],
  ["ID", "🇮🇩"],
  ["IE", "🇮🇪"],
  ["IL", "🇮🇱"],
  ["IM", "🇮🇲"],
  ["IN", "🇮🇳"],
  ["IR", "🇮🇷"],
  ["IS", "🇮🇸"],
  ["IT", "🇮🇹"],
  ["JP", "🇯🇵"],
  ["KH", "🇰🇭"],
  ["KR", "🇰🇷"],
  ["LA", "🇱🇦"],
  ["LT", "🇱🇹"],
  ["LU", "🇱🇺"],
  ["MK", "🇲🇰"],
  ["MN", "🇲🇳"],
  ["MO", "🇲🇴"],
  ["MX", "🇲🇽"],
  ["MY", "🇲🇾"],
  ["NL", "🇳🇱"],
  ["NO", "🇳🇴"],
  ["NZ", "🇳🇿"],
  ["OM", "🇴🇲"],
  ["PH", "🇵🇭"],
  ["PK", "🇵🇰"],
  ["PL", "🇵🇱"],
  ["PR", "🇵🇷"],
  ["PT", "🇵🇹"],
  ["QA", "🇶🇦"],
  ["RO", "🇷🇴"],
  ["RS", "🇷🇸"],
  ["RU", "🇷🇺"],
  ["RW", "🇷🇼"],
  ["SA", "🇸🇦"],
  ["SB", "🇸🇧"],
  ["SC", "🇸🇨"],
  ["SD", "🇸🇩"],
  ["SE", "🇸🇪"],
  ["SG", "🇸🇬"],
  ["TH", "🇹🇭"],
  ["TM", "🇹🇲"],
  ["TN", "🇹🇳"],
  ["TO", "🇹🇴"],
  ["TR", "🇹🇷"],
  ["TT", "🇹🇹"],
  ["TV", "🇹🇻"],
  ["TW", "🇼🇸"],
  ["UK", "🇬🇧"],
  ["UM", "🇺🇲"],
  ["US", "🇺🇸"],
  ["UY", "🇺🇾"],
  ["UZ", "🇺🇿"],
  ["VA", "🇻🇦"],
  ["VE", "🇻🇪"],
  ["VG", "🇻🇬"],
  ["VI", "🇻🇮"],
  ["VN", "🇻🇳"],
  ["ZA", "🇿🇦"],
]);
