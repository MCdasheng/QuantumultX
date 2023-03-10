/*
脚本功能: 哇哈体育签到
29 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/waha.js, img-url=figure.disc.sports.system, enabled=true
*/

const cookie = $prefs.valueForKey("cookie");
if (!cookie) {
  $notify("cookie为空,请检查cookie!");
}
const url =
  "https://bbs.wahatiyu.com/plugin.php?id=gsignin:index&action=signin&formhash=dca5dc70";
const method = "GET";
const data = { info: "abc" };
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
  Cookie: cookie,
};
const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: JSON.stringify(data),
};

$task.fetch(myRequest).then(
  (response) => {
    var res = response.body;
    var regex = /(<([^>]+)>)/gi;
    var notice = res.replace(regex, "").trim();
    $notify("哇哈体育", notice);
    $done();
  },
  (reason) => {
    $notify("Error", "请检查脚本", reason.error);
    $done();
  }
);
