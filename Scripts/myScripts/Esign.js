/*
自己写的第一个QX脚本！ 
脚本功能:监控轻松签版本更新
30 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/Esign.js, tag=轻松签版本监控, img-url=https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Icon/ESign.png, enabled=true
*/

const currentVersion = $prefs.valueForKey("currentVersion");
const url = "https://esign.yyyue.xyz/yyy/api/esignapp/lastVersion";
const method = "GET";
const headers = {
  "User-Agent":
    " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "X-Requested-With": " XMLHttpRequest",
};
const data = { info: "abc" };
const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: JSON.stringify(data),
};

$task.fetch(myRequest).then(
  (response) => {
    const obj = JSON.parse(response.body);
    if (obj.result.version !== currentVersion) {
      const notice = "👇New version has released!\n" + obj.result.lzurl;
      $notify("轻松签版本监控", "", notice);
      console.log(notice);
    } else {
      const notice = "🥳No updates, now version:" + obj.result.version;
      $notify("轻松签版本监控", "", notice);
      console.log(notice);
    }
    $done();
  },
  (reason) => {
    $notify("Error", "请检查脚本", reason.error);
    $done();
  }
);

