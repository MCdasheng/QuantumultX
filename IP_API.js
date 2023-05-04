/*
[general]
geo_location_checker=http://ip-api.com/json/?lang=zh-CN, https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/IP_API.js
*/

if ($response.statusCode != 200) {
  $done(null);
}

var city0 = "高谭市";
var isp0 = "Cross-GFW.org";

function City_ValidCheck(para) {
  if (para) {
    return para;
  } else {
    return city0;
  }
}

function ISP_ValidCheck(para) {
  if (para) {
    return para;
  } else {
    return isp0;
  }
}

var body = $response.body;
var obj = JSON.parse(body);
var title = flags.get(obj["countryCode"]) + " " + City_ValidCheck(obj["city"]); //+Area_check(obj['country']);
var subtitle = ISP_ValidCheck(obj["org"]);
var ip = obj["query"];
var description =
  "服务商:" +
  obj["isp"] +
  "\n" +
  "地区:" +
  City_ValidCheck(obj["regionName"]) +
  "\n" +
  "IP:" +
  obj["query"] +
  "\n" +
  "时区:" +
  obj["timezone"];
$done({ title, subtitle, ip, description });

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
