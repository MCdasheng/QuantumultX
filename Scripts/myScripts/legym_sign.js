/* 
脚本功能: 乐健体育自动签退
30 16 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/legym_sign.js, tag=乐健体育签退, img-url=figure.disc.sports.system, enabled=true
*/
const legym_signBody = $prefs.valueForKey("legym_signBody");
const AUTH = $prefs.valueForKey("legym_auth");

const url = `https://cpes.legym.cn/education/activity/app/attainability/sign`;
const method = `PUT`;
const headers = {
  Organization: `402881ea7c39c5d5017c39d134ca03ab`, // uestc
  "Content-Type": `application/json`,
  "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/50) uni-app`,
  Authorization: AUTH,
};
const body = legym_signBody;

const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: body,
};

$task.fetch(myRequest).then(
  (response) => {
    const obj = JSON.parse(response.body);
    if (obj.code == 0) {
      var notice = obj.message;
      notice = "🎉" + notice;
      console.log("乐健体育二次签到");
      console.log(notice);
      $notify("乐健体育二次签到", notice);
      $done();
    } else {
      var notice = obj.message;
      notice = "🔴" + notice;
      console.log("乐健体育二次签到");
      console.log(notice);
      $notify("乐健体育二次签到", notice);
      $done();
    }
  },
  (reason) => {
    console.log(reason.error);
    $done();
  }
);
