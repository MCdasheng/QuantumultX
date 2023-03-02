/*
脚本功能: Appso今日限免
29 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/Appso.js, tag=Appso今日限免, img-url=applelogo.system, enabled=true
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
    for (i = 0; i < 10; i++) {
      var name = obj.objects[i].app.name.split(" ").join("");
      var content = obj.objects[i].content.split(" ").join("");
      var link = obj.objects[i].app.download_link[0].link.split(" ").join("");
      var discounted_price = obj.objects[i].discount_info[0].discounted_price.split(" ").join("");
      var original_price = obj.objects[i].discount_info[0].original_price.split(" ").join("");
      console.log(name +":￥" + original_price + " --> ￥" + discounted_price + "\n" + content + "\n" + link);
    }
    $notify("Appso", "今日限免已送达,点击查看日志👇");
    $done();
  },
  (reason) => {
    $notify("Error", "请检查脚本", reason.error); // Error!
    $done();
  }
);
