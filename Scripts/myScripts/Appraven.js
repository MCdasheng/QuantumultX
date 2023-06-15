/*
脚本功能: Appraven今日限免
29 10,16 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/Appraven.js, tag=Appraven今日限免, img-url=https://raw.githubusercontent.com/Semporia/Hand-Painted-icon/master/Universal/Final.png, enabled=true
*/

const url =
  "https://appraven.net/AppRaven/app?t=sn&qt=pd&pr=Free&mr=0&mrc=0&ml=0&pg=0&g=Any&d=Universal&rare=0";
const method = `GET`;
const headers = {
  "Accept-Encoding": `gzip, deflate, br`,
  Cookie: `JSESSIONID=F6887C7D97DE6FA5469E56B35CF15FD5`,
  Connection: `keep-alive`,
  Accept: `*/*`,
  Host: `appraven.net`,
  "User-Agent": `AppRaven/1 CFNetwork/1399 Darwin/22.1.0`,
  "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
};
const body = ``;

const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: body,
};

$task.fetch(myRequest).then(
  (response) => {
    var json = response.body;
    var obj = eval("(" + json + ")");
    var count = Object.keys(obj).length;
    var notice2 = "🥳ios限免新脚本AppSLiced.js已发布!\n如果对你有帮助,给个⭐️Star吧!\n\n";
    for (var i = 0; i < count; i++) {
      var count2 = obj[i].apps.length;
      var notice = "";
      for (var j = 0; j < count2; j++) {
        var app = obj[i].apps[j];
        var name = '🟢' + app.app_title;
        var original_price = app.last;
        var price = app.price;
        var link = "https://apps.apple.com/us/app/id" + app.application_id;
        var str = name +": $" + original_price + " --> $" + price + "\n" + link + "\n" + "\n";
        notice += str;
      }
      // notice = notice.trim();
      notice2 += notice;
    }
    console.log(notice2);
    $notify("Appraven", "今日限免已送达,点击查看日志👇", notice2);
    $done();
  },
  (reason) => {
    $notify("Error", "请检查脚本", reason.error); // Error!
    $done();
  }
);
