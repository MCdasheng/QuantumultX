/*
脚本功能: 获取八方云试用订阅
注: 3h有效; 关闭代理运行
33 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/bfy.js, tag=八方云订阅, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png, enabled=true
*/

a();

function a() {
  const rd = Math.random().toString(36).slice(-8);
  const url = `https://bafangyun.vip/api/v1/passport/auth/register`;
  const method = `POST`;
  const headers = {
    Accept: `*/*`,
    Origin: `https://bafangyun.vip`,
    "Accept-Encoding": `gzip, deflate, br`,
    "Content-Language": `zh-CN`,
    "Content-Type": `application/x-www-form-urlencoded`,
    Host: `bafangyun.vip`,
    Connection: `keep-alive`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1`,
    Referer: `https://bafangyun.vip/`,
    "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
  };
  const body = `email=${rd}%40qq.com&password=12345678&invite_code=&email_code=`;

  const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body,
  };

  $task.fetch(myRequest).then(
    (response) => {
      //   console.log(response.body);
      var obj = JSON.parse(response.body);
      var bfy_auth = obj.data.auth_data;
      $prefs.setValueForKey(bfy_auth, "bfy_auth");
      if ($prefs.valueForKey("bfy_auth") == bfy_auth) {
        console.log("🎉注册成功!");
        console.log(bfy_auth);
      } else {
        console.log("🔴注册失败!");
        console.log(response.body);
        $done();
      }

      b();
    },
    (reason) => {
      console.log(reason.error);
      $done();
    }
  );
}

function b() {
  const url = `https://bafangyun.vip/api/v1/user/getSubscribe`;
  const method = `GET`;
  const headers = {
    "Accept-Encoding": `gzip, deflate, br`,
    Accept: `*/*`,
    Connection: `keep-alive`,
    "Content-Language": `zh-CN`,
    Referer: `https://bafangyun.vip/`,
    Host: `bafangyun.vip`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1`,
    "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
    Authorization: $prefs.valueForKey("bfy_auth"),
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
      //   console.log(response.body);
      var obj = JSON.parse(response.body);
      if (obj.data.subscribe_url) {
        var url = obj.data.subscribe_url;
        $notify("八方云订阅", "🎉获取订阅链接成功!", url);
        console.log("🎉订阅获取成功!");
        console.log(`${url}, tag=八方云, opt-parser=true, enabled=true`);
        $done();
      } else {
        console.log("🔴订阅获取失败!");
        console.log(response.body);
        $done();
      }
    },
    (reason) => {
      console.log(reason.error);
      $done();
    }
  );
}
