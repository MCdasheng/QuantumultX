/*
沪碳行app 支持 QX

url = https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/htx.js
From https://raw.githubusercontent.com/liuqi6968/-/main/htx.js

有显示系统异常的自行更新ck

一天一毛数字人民币 小毛 
抓取 htx.lcago.cn  body中的 token 和deviceCoding  
多账号换行   
htx  'token#deviceCoding'
cron 10 7,17 * * *  htx.js

*/

const $ = new Env("沪碳行");

let httpResult;
const ckName = "htx";
let userCookie = [];

userCookie = userCookie.concat($.getdata(ckName)?.split("\n") || []);

let userList = [];
let userIdx = 0;

class UserInfo {
  constructor(str) {
    (this.n = ++userIdx), (this.index = `账号 [${this.n}]`);
    this.ck = str.split("#");
  }

  async sign() {
    try {
      let url = `https://htx.lcago.cn/signIn/sign`;
      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}","language": "ZH","appChannel": "htx","systemversion": "9"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);
      let result = httpResult;
      //console.log(result)
      if (result.respcod == "01") {
        console.log(`${this.index}  ${result.respmsg}`);
      } else if (result.respcod == "02") {
        console.log(`${this.index}  ${result.respmsg}`);
      } else if (result.respcod == "04") {
        console.log(`${this.index}  ${result.respmsg}`);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }

  async participate() {
    try {
      let url = `https://carbon.lcago.cn/community/participate`;
      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}","taskId":"EHD8472JSDS_htx"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);
      let result = httpResult;
      //	console.log(result)
      if (result.respcod == "01") {
        console.log(`${this.index}  答题 ${result.respmsg}   `);
        await this.dt();
      } else if (result.respcod == "02") {
        console.log(result.respmsg);
      } else if (result.respcod == "04") {
        console.log(result.respmsg);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }

  async dt() {
    try {
      let url = `https://htx.lcago.cn/community/requestQuestion`;
      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}","taskId":"EHD8472JSDS_htx"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);
      let result = httpResult;
      //console.log(result)
      if (result.respcod == "01") {
        console.log(`${this.index}  答题 ${result.respmsg}`);
        for (let i = 0; i < result.data.dataList.length; i++) {
          let dd = result.data.dataList[i];
          this.id = dd.id;
          this.wer = dd.answer;
          //console.log(`${this.id}  ${this.wer}`)
          await this.tjda();
          await $.wait(5000);
          if (this.b == 1) break;
        }
      } else if (result.respcod == "02") {
        console.log(result.respmsg);
      } else if (result.respcod == "04") {
        console.log(result.respmsg);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }

  async tjda() {
    try {
      let url = `https://htx.lcago.cn/community/answerQuestion`;
      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}","questionId":${this.id},"answer":"${this.wer}"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);
      let result = httpResult;
      //console.log(result)
      if (result.respcod == "01") {
        console.log(`${this.index}  ${result.respmsg}`);
      } else if (result.respcod == "02") {
        console.log(`${this.index}  已完成答题`);
        this.b = 1;
      } else if (result.respcod == "04") {
        console.log(`${this.index}  ${result.respmsg}`);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }

  async interact() {
    try {
      let url = `https://htx.lcago.cn/interact/data`;
      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);

      let result = httpResult;
      //console.log(result)
      if (result.respcod == "01") {
        this.grxx = result.data.nickName;
        for (let i = 0; i < result.data.dataList.length; i++) {
          let d = result.data.dataList[i];
          (this.ida = d.id), (this.scene = d.source), (this.value = d.value);
          await this.collect();
          await $.wait(3000);
        }
      } else if (result.respcod == "02") {
        $.logAndNotify(`${result.respmsg}  建议更新一下ck  `);
      } else if (result.respcod == "04") {
        console.log(result.respmsg);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }

  async collect() {
    try {
      let url = `https://htx.lcago.cn/interact/collect`;
      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}","id":"${this.ida}"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);
      let result = httpResult;
      //	console.log(result)
      if (result.respcod == "01") {
        console.log(
          `${this.index} ${this.scene}  ${this.value}  ${result.respmsg}   `
        );
      } else if (result.respcod == "02") {
        console.log(result.respmsg);
      } else if (result.respcod == "04") {
        console.log(result.respmsg);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }

  async myData() {
    try {
      let url = `https://htx.lcago.cn/myCarbonAssets/myData`;

      let body = `{"token":"${this.ck[0]}","deviceCoding":"${this.ck[1]}"}`;
      let h = {
        "Content-Type": "application/json; charset\u003dutf-8",
        Host: "htx.lcago.cn",
      };
      let urlObject = popu(url, h, body);
      // console.log(urlObject)
      await httpRequest("post", urlObject);
      let result = httpResult;
      //	console.log(result)
      if (result.respcod == "01") {
        $.logAndNotify(
          `${this.index} ${this.grxx} 💴${result.data.exchangeAmt}  `
        );
      } else if (result.respcod == "02") {
        console.log(result.respmsg);
      } else if (result.respcod == "04") {
        console.log(result.respmsg);
      }
    } catch (e) {
    } finally {
      return Promise.resolve(1);
    }
  }
}

(async () => {
  await checkEnv();
  if (userList.length > 0) {
    for (let user of userList) {
      console.log(`\n============= 签到 =============`);
      await user.sign();

      console.log(`\n============= 答题 =============`);
      await user.dt();

      console.log(`\n============= 收取能量 =============`);
      await user.interact();

      console.log(`\n============= 个人信息 =============`);
      await user.myData();
    }
  }
  await $.showmsg();
})()
  .catch((e) => console.log(e))
  .finally(() => $.done());

async function checkEnv() {
  if (userCookie) {
    for (let userCookies of userCookie) {
      if (userCookies) userList.push(new UserInfo(userCookies));
    }
    userCount = userList.length;
  } else {
    console.log(`未找到CK`);
    return false;
  }
  console.log(`\n共找到${userCount}个账号`);
  return true;
}

function popu(url, h, body = "") {
  let host = url.replace("//", "/").split("/")[1];
  let urlObject = {
    url: url,
    headers: h,
  };
  if (body) {
    urlObject.body = body;
    urlObject.headers["Content-Length"] = body?.length || 0;
  }
  return urlObject;
}

async function httpRequest(method, url) {
  (httpResult = null), (httpReq = null), (httpResp = null);
  return new Promise((resolve) => {
    $.send(method, url, async (err, req, resp) => {
      try {
        httpReq = req;
        httpResp = resp;
        if (err) {
          console.log(`${method}请求失败`);
          console.log(JSON.stringify(err));
        } else {
          if (resp.body) {
            if (typeof resp.body == "object") {
              httpResult = resp.body;
            } else {
              try {
                httpResult = JSON.parse(resp.body);
              } catch (e) {
                httpResult = resp.body;
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve();
      }
    });
  });
}

function Env(name, env) {
  "undefined" != typeof process &&
    JSON.stringify(process.env).indexOf("GITHUB") > -1 &&
    process.exit(0);
  return new (class {
    constructor(name, env) {
      this.name = name;
      this.notifyStr = "";
      this.startTime = new Date().getTime();
      Object.assign(this, env);
      console.log(`${this.name} 开始运行：\n`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
          o = this.getval(i),
          h = i ? ("null" === o ? null : o || "{}") : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), i));
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), (s = this.setval(JSON.stringify(o), i));
        }
      } else {
        s = this.setval(t, e);
      }
      return s;
    }
    getval(t) {
      return this.isSurge() || this.isLoon()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : this.isNode()
        ? ((this.data = this.loaddata()), this.data[t])
        : (this.data && this.data[t]) || null;
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon()
        ? $persistentStore.write(t, e)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, e)
        : this.isNode()
        ? ((this.data = this.loaddata()),
          (this.data[e] = t),
          this.writedata(),
          !0)
        : (this.data && this.data[e]) || null;
    }
    send(m, t, e = () => {}) {
      if (m != "get" && m != "post" && m != "put" && m != "delete") {
        console.log(`无效的http方法：${m}`);
        return;
      }
      if (m == "get" && t.headers) {
        delete t.headers["Content-Type"];
        delete t.headers["Content-Length"];
      } else if (t.body && t.headers) {
        if (!t.headers["Content-Type"])
          t.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          t.headers = t.headers || {};
          Object.assign(t.headers, {
            "X-Surge-Skip-Scripting": !1,
          });
        }
        let conf = {
          method: m,
          url: t.url,
          headers: t.headers,
          timeout: t.timeout,
          data: t.body,
        };
        if (m == "get") delete conf.data;
        $axios(conf)
          .then((t) => {
            const { status: i, request: q, headers: r, data: o } = t;
            e(null, q, {
              statusCode: i,
              headers: r,
              body: o,
            });
          })
          .catch((err) => console.log(err));
      } else if (this.isQuanX()) {
        (t.method = m.toUpperCase()),
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}),
            Object.assign(t.opts, {
              hints: !1,
            })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: i, request: q, headers: r, body: o } = t;
              e(null, q, {
                statusCode: i,
                headers: r,
                body: o,
              });
            },
            (t) => e(t)
          );
      } else if (this.isNode()) {
        this.got = this.got ? this.got : require("got");
        const { url: s, ...i } = t;
        this.instance = this.got.extend({
          followRedirect: false,
        });
        this.instance[m](s, i).then(
          (t) => {
            const { statusCode: i, request: q, headers: r, body: o } = t;
            e(null, q, {
              statusCode: i,
              headers: r,
              body: o,
            });
          },
          (t) => {
            const { message: s, response: i } = t;
            e(s, i, i && i.body);
          }
        );
      }
    }
    time(t) {
      let e = {
        "M+": new Date().getMonth() + 1,
        "d+": new Date().getDate(),
        "h+": new Date().getHours(),
        "m+": new Date().getMinutes(),
        "s+": new Date().getSeconds(),
        "q+": Math.floor((new Date().getMonth() + 3) / 3),
        S: new Date().getMilliseconds(),
      };
      /(y+)/.test(t) &&
        (t = t.replace(
          RegExp.$1,
          (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
      for (let s in e)
        new RegExp("(" + s + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? e[s]
              : ("00" + e[s]).substr(("" + e[s]).length)
          ));
      return t;
    }
    async showmsg() {
      if (!this.notifyStr) return;
      let title = this.name;
      let notifyBody = this.notifyStr;

      this.msg(title, "", notifyBody.trim());
    }
    logAndNotify(str) {
      console.log(str);
      this.notifyStr += str;
      this.notifyStr += "\n";
    }
    msg(e = t, s = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t)
          return this.isLoon()
            ? t
            : this.isQuanX()
            ? {
                "open-url": t,
              }
            : this.isSurge()
            ? {
                url: t,
              }
            : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s,
            };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s,
            };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e,
            };
          }
        }
      };
      this.isMute ||
        (this.isSurge() || this.isLoon()
          ? $notification.post(e, s, i, o(r))
          : this.isQuanX() && $notify(e, s, i, o(r)));
      let h = ["", "============== 系统通知 =============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n"));
    }
    getMin(a, b) {
      return a < b ? a : b;
    }
    getMax(a, b) {
      return a < b ? b : a;
    }
    padStr(num, length, padding = "0") {
      let numStr = String(num);
      let numPad = length > numStr.length ? length - numStr.length : 0;
      let retStr = "";
      for (let i = 0; i < numPad; i++) {
        retStr += padding;
      }
      retStr += numStr;
      return retStr;
    }
    json2str(obj, c, encodeUrl = false) {
      let ret = [];
      for (let keys of Object.keys(obj).sort()) {
        let v = obj[keys];
        if (v && encodeUrl) v = encodeURIComponent(v);
        ret.push(keys + "=" + v);
      }
      return ret.join(c);
    }
    str2json(str, decodeUrl = false) {
      let ret = {};
      for (let item of str.split("&")) {
        if (!item) continue;
        let idx = item.indexOf("=");
        if (idx == -1) continue;
        let k = item.substr(0, idx);
        let v = item.substr(idx + 1);
        if (decodeUrl) v = decodeURIComponent(v);
        ret[k] = v;
      }
      return ret;
    }
    randomString(len, charset = "abcdef0123456789") {
      let str = "";
      for (let i = 0; i < len; i++) {
        str += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return str;
    }
    randomList(a) {
      let idx = Math.floor(Math.random() * a.length);
      return a[idx];
    }
    wait(t) {
      return new Promise((e) => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1e3;
      console.log(`\n${this.name} 运行结束，共运行了 ${s} 秒！`);
      if (this.isSurge() || this.isQuanX() || this.isLoon()) $done(t);
    }
  })(name, env);
}
