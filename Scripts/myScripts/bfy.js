/*
脚本功能: 获取八方云试用订阅(3h有效)
注: 关闭代理运行
33 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/bfy.js, tag=八方云订阅, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png, enabled=true
*/

const auth = "bfy_auth";
const tagName = "八方云";
const register_url = `https://bafangyun.vip/api/v1/passport/auth/register`;
const subscribe_url = `https://bafangyun.vip/api/v1/user/getSubscribe`;

a();

function a() {
  const rd = Math.random().toString(36).slice(-8);
  const url = register_url;
  const method = `POST`;
  const headers = {
    "Content-Type": `application/x-www-form-urlencoded`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1`,
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
      var AUTH = obj.data.auth_data;
      $prefs.setValueForKey(AUTH, `${auth}`);
      if ($prefs.valueForKey(`${auth}`) == AUTH) {
        console.log("🎉注册成功!");
        console.log(AUTH);
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
  const url = subscribe_url;
  const method = `GET`;
  const headers = {
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1`,
    Authorization: $prefs.valueForKey(`${auth}`),
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
        var sub = `${url}#emoji=2, tag=${tagName}, opt-parser=true, enabled=true`;
        console.log("🎉订阅获取成功!");
        console.log(sub);
        $notify(`${tagName}订阅`, "🎉获取订阅链接成功!", sub);
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
