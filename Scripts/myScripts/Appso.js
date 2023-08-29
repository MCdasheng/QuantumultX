/*
脚本功能: Appso今日限免
29 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/Appso.js, tag=Appso今日限免, img-url=applelogo.system, enabled=true
*/
const url = "https://app.so/api/v5/appso/discount/?platform=web";
const method = "GET";
const headers = {
  "user-agent":
    " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "x-requested-with": "XMLHttpRequest",
};
const data = { platform: "web" };

const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: JSON.stringify(data),
};

$task.fetch(myRequest).then(
  (response) => {
    var json = response.body;
    var obj = eval("(" + json + ")");
    var notice = " ";
    for (i = 0; i < 10; i++) {
      var name = '🟢' + obj.objects[i].app.name.split(" ").join("").replace("\n", "");
      var content = obj.objects[i].content.replace("\n", "");
      var link = '🔗' + obj.objects[i].app.download_link[0].link.split(" ").join("").replace("\n", "");
      var discounted_price = obj.objects[i].discount_info[0].discounted_price.split(" ").join("").replace("\n", "");
      var original_price = obj.objects[i].discount_info[0].original_price.split(" ").join("").replace("\n", "");
      str = name +":￥" + original_price + " --> ￥" + discounted_price + "\n" + content + "\n" + link + "\n"+ "\n";
      notice += str;    
    }
    notice = notice.trim();
    $notify("Appso", "今日限免已送达,点击查看日志👇", notice);
    console.log(notice);
    $done();
  },
  (reason) => {
    $notify("Error", "请检查脚本", reason.error); // Error!
    $done();
  }
);
