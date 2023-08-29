/*
脚本功能: GoFans今日限免
30 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/GoFans.js, tag=GoFans今日限免img-url=applelogo.system, enabled=true
*/
const url = "https://api.gofans.cn/v1/web/app_records?kind=2&page=1";
const method = "GET";
const headers = {
  authorization:
    "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEwMDExNDYyLCJleHAiOjE2Nzg2MzAwMDgsImp0aSI6IjEwMDExNDYyMTY3ODAyNTIwOCIsImlhdCI6MTY3ODAyNTIwOCwiaXNzIjoiR29GYW5zIiwic3ViIjoiMDhjMDM5MTM5ODQ3NGE4MWYyZmFhYzYwMWNjYzliYWIifQ.VGEtMFiuLG5dPZuLwo9fooPaRJQJ42Phqzeqr0ulZLgJpwiAmDUQAdNbhn1nAkW0TYTvay0X0OM5Gv6zNpcrRw",
  origin: "https://gofans.cn", // 排查参数后得到的,以后可以直接加上
  // "referer": "https://gofans.cn/",
  // "sec-ch-ua-platform": "Windows",
  // "sec-fetch-dest": "empty",
  // "sec-fetch-mode": "cors",
  // "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36", // 甚至UA都可以不加?
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
    var json = response.body;
    var obj = eval("(" + json + ")");
    var notice = " ";
    for (i = 0; i < 10; i++) {
        var name = '🟢' + obj.data[i].name.split(" ").join("").replace("\n", "");
        var description = obj.data[i].description.replace("\n", "");
        // 通过uuid拼接得到的url,与网页不同，而在iPhone上可以轻松访问
        var uuid = "🔗https://m.gofans.cn/app/"+ obj.data[i].uuid.split(" ").join("").replace("\n", ""); 
        var price = obj.data[i].price.split(" ").join("").replace("\n", "");
        var original_price = obj.data[i].original_price.split(" ").join("").replace("\n", "");
        str = name +":￥" + original_price + " --> ￥" + price + "\n" + description + "\n" + uuid + "\n"+ "\n";
        notice += str;    
      }
      notice = notice.trim();
      $notify("GoFans", "今日限免已送达,点击查看日志👇", notice);
      console.log(notice);
      $done();
    },
    (reason) => {
        $notify("Error", "请检查脚本", reason.error); // Error!
        $done();
  }
);
