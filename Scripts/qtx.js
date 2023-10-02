/*
  url = https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/qtx.js
  From https://github.com/LinYuanovo/scripts/blob/main/qtx.js
  @mcdasheng 
    本版本兼容 qx 
    增加行走任务
  软件:青碳行
  功能:签到、分享、回答问题、收取精力值
  抓包:carbon.lcago.cn 这个域名 请求体 的body部分的 token 和 deviceCoding
  变量:export qtxtk='token1&deviceCoding1@token2&deviceCoding2'  多个账号用@或者换行分割 
  抓包之前请先把这些任务都点一下,手动开启一下,不然跑不了
  收益不高,一天一毛 兑换的是 数字人民币 没有的,不知道这是啥或者嫌少的可以不跑
  tk有效时间应该挺长的,写了到现在没过期过,闲的没事可以多创几个号和几个钱包,到时候转到一个钱包就行了
  定时一天一次
  cron:10 10 * * *
 */

const $ = Env("青碳行");
const Notify = 1; // 0为关闭通知,1为打开通知,默认为1
const debug = 0; // 0为关闭调试,1为打开调试,默认为0

let qtxtk = $.getdata("qtxtk");

let qtxtkArr = [];
let data = "";
let msg = "";
let queIdArr = [];
let queAnswerArr = [];
let calIdArr = [];
let amt = 0.0;
let beforeAmt = 0.0;
let afterAmt = 0.0;
let name = "";
let url = {
  url: "https://carbon.lcago.cn/",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Host: "carbon.lcago.cn",
    Connection: "Keep-Alive",
    "Accept-Encoding": "gzip",
    "User-Agent": "okhttp/3.12.",
  },
  body: "",
};

!(async () => {
  if (!(await Envs())) return;
  else {
    console.log(`\n========= 共找到 ${qtxtkArr.length} 个账号 ===========`);

    if (debug) {
      console.log(`【debug】 这是你的全部账号数组:\n ${qtxtkArr}`);
    }

    for (let index = 0; index < qtxtkArr.length; index++) {
      let num = index + 1;
      console.log(`\n========= 开始【第 ${num} 个账号】=========\n`);

      data = qtxtkArr[index].split("&");

      if (debug) {
        console.log(`\n 【debug】 这是你第 ${num} 账号信息:\n ${data}\n`);
      }

      console.log("开始查询余额");
      await getNickName();
      await $.wait(2 * 1000);
      beforeAmt = amt;

      console.log("开始签到");
      await signIn();
      await $.wait(2 * 1000);

      console.log("开始分享");
      for (var k = 0; k < 3; k++) {
        await share();
        await $.wait(2 * 1000);
      }

      console.log("开始获取问题");
      await getQue();
      await $.wait(2 * 1000);

      console.log("开始回答问题");
      for (var k = 0; k < queIdArr.length; k++) {
        await doQue(k);
        await $.wait(2 * 1000);
      }

      console.log("开始走路");
      await walk();
      await $.wait(2 * 1000);

      console.log("开始获取未收取精力");
      await getCal();
      await $.wait(2 * 1000);

      console.log("开始收取精力");
      for (var l = 0; l < calIdArr.length; l++) {
        await doCal(l);
        await $.wait(2 * 1000);
      }

      console.log("开始查询余额");
      await getExchange();
      await $.wait(2 * 1000);
      afterAmt = amt;
      msg += `\n账号[${name}]: 💴${beforeAmt} --> 💴${afterAmt}`;
    }
    await SendMsg(msg);
  }
})()
  .catch((e) => console.logErr(e))
  .finally(() => $.done());

/**
 * 签到
 */
function signIn(timeout = 3 * 1000) {
  url.url = "https://carbon.lcago.cn/signIn/sign";
  url.body = `{"token":"${data[0]}","platform":"android","model":"MI8","version":"1.1.1_VersionCode_111","deviceCoding":"${data[1]}","language":"ZH","systemversion":"10"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 签到 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(
      url,
      async (error, response, data) => {
        try {
          if (debug) {
            console.log(
              `\n\n【debug】===============这是 签到 返回data==============`
            );
            console.log(data);
          }

          let result = JSON.parse(data);
          if (result.respcod == "01") {
            console.log(`\n签到成功`);
          } else if (result.respcod === "02") {
            console.log(`\n今日已签到 `);
          } else {
            console.log(`\n签到失败,原因是${result.respmsg} `);
          }
        } catch (e) {
          console.log(e);
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}

/**
 * 分享
 */
function share(timeout = 3 * 1000) {
  url.url = "https://carbon.lcago.cn/community/share/accomplish";
  url.body = `{"token":"${data[0]}","deviceCoding":"${data[1]}","taskId":"SHARE001"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 分享 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(
      url,
      async (error, response, data) => {
        try {
          if (debug) {
            console.log(
              `\n\n【debug】===============这是 分享 返回data==============`
            );
            console.log(data);
          }
        } catch (e) {
          console.log(e);
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}

/**
 * 获取问题
 */
function getQue(timeout = 3 * 1000) {
  url.url = "https://carbon.lcago.cn/community/requestQuestion";
  url.body = `{"token":"${data[0]}","deviceCoding":"${data[1]}","taskId":"EHD8472JSDS"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 获取问题 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(
      url,
      async (error, response, data) => {
        try {
          if (debug) {
            console.log(
              `\n\n【debug】===============这是 获取问题 返回data==============`
            );
            console.log(data);
          }

          let result = JSON.parse(data);
          var obj1 = eval(result.data);
          for (var i = 0; i < obj1.dataList.length; i++) {
            queIdArr[i] = obj1.dataList[i].id;
            queAnswerArr[i] = obj1.dataList[i].answer;
          }
          if (queAnswerArr[0] == "A" || queAnswerArr[0] == "B") {
            console.log("获取问题成功");
          } else console.log("获取问题失败");
          console.log(queIdArr);
          console.log(queAnswerArr);
        } catch (e) {
          console.log(e);
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}

/**
 * 回答问题
 */
function doQue(num1) {
  url.url = "https://carbon.lcago.cn/community/answerQuestion";
  url.body = `{"token":"${data[0]}","deviceCoding":"${data[1]}","questionId":${queIdArr[num1]},"answer":"${queAnswerArr[num1]}"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 回答问题 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(url, async (error, response, data) => {
      try {
        if (debug) {
          console.log(
            `\n\n【debug】===============这是 回答问题 返回data==============`
          );
          console.log(data);
        }

        let result = JSON.parse(data);
        if (result.respcod == "01") {
          console.log(`\n回答问题成功`);
        } else if (result.respcod === "02") {
          console.log(`\n该题目已回答 `);
        } else {
          console.log(`\n回答失败,原因是${result.respmsg} `);
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve();
      }
    });
  });
}

// @mcdasheng 走路
function walk() {
  var randStep = Math.floor(Math.random() * 1000) + 10000;
  url.url = "https://carbon.lcago.cn/community/step/latest";
  url.body = `{"token":"${data[0]}","deviceCoding":"${data[1]}","step":"${randStep}","taskId":"STEP001"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 走路 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(url, async (error, response, data) => {
      try {
        if (debug) {
          console.log(
            `\n\n【debug】===============这是 走路 返回data==============`
          );
          console.log(data);
        }

        let result = JSON.parse(data);
        if (result.respcod == "01") {
          console.log(`\n走路成功: ${randStep}步`);
        } else {
          console.log(`\n走路失败,原因是${result.respmsg}`);
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve();
      }
    });
  });
}

/**
 * 获取未收取精力
 */
function getCal(timeout = 3 * 1000) {
  url.url = "https://carbon.lcago.cn/interact/data";
  url.body = `{"token":"${data[0]}","platform":"android","model":"MI8","version":"1.1.1_VersionCode_111","deviceCoding":"${data[1]}","language":"ZH","systemversion":"10"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 获取未收取精力 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(
      url,
      async (error, response, data) => {
        try {
          if (debug) {
            console.log(
              `\n\n【debug】===============这是 获取未收取精力 返回data==============`
            );
            console.log(data);
          }

          let result = JSON.parse(data);
          // var obj2 = eval(result.data);
          if (result.data.dataList.length != 0) {
            for (var j = 0; j < result.data.dataList.length; j++) {
              calIdArr[j] = result.data.dataList[j].id;
              console.log(`未收取精力ID为${calIdArr[j]}`);
            }
          } else console.log("获取未收取精力失败");
        } catch (e) {
          console.log(e);
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}

/**
 * 收取精力
 */
function doCal(num2) {
  url.url = "https://carbon.lcago.cn/interact/collect";
  url.body = `{"token":"${data[0]}","platform":"android","model":"MI8SE","version":"1.1.1_VersionCode_111","deviceCoding":"${data[1]}","language":"ZH","systemversion":"10","id":"${calIdArr[num2]}"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 收取精力 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(url, async (error, response, data) => {
      try {
        if (debug) {
          console.log(
            `\n\n【debug】===============这是 收取精力 返回data==============`
          );
          console.log(data);
        }

        let result = JSON.parse(data);
        if (result.respcod == "01") {
          console.log(`收取精力成功`);
        } else if (result.respcod === "02") {
          console.log(`\n无可收精力 `);
        } else {
          console.log(`\n收取失败,原因是${result.respmsg}`);
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve();
      }
    });
  });
}

/**
 * 查询昵称
 */
function getNickName(timeout = 2 * 1000) {
  url.url = "https://carbon.lcago.cn/interact/data";
  url.body = `{"token":"${data[0]}","platform":"android","model":"MI8SE","version":"1.1.1_VersionCode_111","deviceCoding":"${data[1]}","language":"ZH","systemversion":"10"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 查询昵称 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(
      url,
      async (error, response, data) => {
        try {
          if (debug) {
            console.log(
              `\n\n【debug】===============这是 查询昵称 返回data==============`
            );
            console.log(data);
          }

          let result = JSON.parse(data);
          if (result.respcod == "01") {
            name = result.data.nickName;
            getExchange();
          } else {
            console.log(`\n查询昵称失败,原因是${result.respmsg} `);
          }
        } catch (e) {
          console.log(e);
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}

/**
 * 查询可兑换余额
 */
function getExchange(timeout = 2 * 1000) {
  url.url = "https://carbon.lcago.cn/myCarbonAssets/myData";
  url.body = `{"token":"${data[0]}","platform":"android","model":"MI8SE","version":"1.1.1_VersionCode_111","deviceCoding":"${data[1]}","language":"ZH","systemversion":"10"}`;
  return new Promise((resolve) => {
    if (debug) {
      console.log(
        `\n【debug】=============== 这是 查询可兑换余额 请求 url ===============`
      );
      console.log(JSON.stringify(url));
    }

    $.post(
      url,
      async (error, response, data) => {
        try {
          if (debug) {
            console.log(
              `\n\n【debug】===============这是 查询可兑换余额 返回data==============`
            );
            console.log(data);
          }

          let result = JSON.parse(data);
          if (result.respcod == "01") {
            console.log(
              `\n账号[${name}]可兑换余额为:${result.data.exchangeAmt}`
            );
            amt = +`${result.data.exchangeAmt}`;
          } else {
            console.log(`\n查询可兑换余额,原因是${result.respmsg} `);
          }
        } catch (e) {
          console.log(e);
        } finally {
          resolve();
        }
      },
      timeout
    );
  });
}
// ============================================变量检查============================================ \\
async function Envs() {
  if (qtxtk) {
    if (qtxtk.indexOf("@") != -1) {
      qtxtk.split("@").forEach((item) => {
        qtxtkArr.push(item);
      });
    } else if (qtxtk.indexOf("\n") != -1) {
      qtxtk.split("\n").forEach((item) => {
        qtxtkArr.push(item);
      });
    } else {
      qtxtkArr.push(qtxtk);
    }
  } else {
    console.log(`\n 【${$.name}】:未填写变量 qtxtk`);
    return;
  }

  return true;
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
  if (!message) return;

  if (Notify > 0) {
    $.msg($.name, "🎉任务完成!", message.trim());
  } else {
    console.log(message);
  }
}

function Env(t, e) {
  "undefined" != typeof process &&
    JSON.stringify(process.env).indexOf("GITHUB") > -1 &&
    process.exit(0);
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let s = this.get;
      return (
        "POST" === e && (s = this.post),
        new Promise((e, i) => {
          s.call(this, t, (t, s, r) => {
            t ? i(t) : e(s);
          });
        })
      );
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new (class {
    constructor(t, e) {
      (this.name = t),
        (this.http = new s(this)),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.isMute = !1),
        (this.isNeedRewrite = !1),
        (this.logSeparator = "\n"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, e),
        this.log("", `🔔${this.name}, 开始!`);
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
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i)
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise((e) => {
        this.get({ url: t }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise((s) => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
        const [o, h] = i.split("@"),
          n = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: r },
            headers: { "X-Key": o, Accept: "*/*" },
          };
        this.post(n, (t, e, i) => s(i));
      }).catch((t) => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {};
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s
          ? this.fs.writeFileSync(t, r)
          : i
          ? this.fs.writeFileSync(e, r)
          : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return s;
      return r;
    }
    lodash_set(t, e, s) {
      return Object(t) !== t
        ? t
        : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
          (e
            .slice(0, -1)
            .reduce(
              (t, s, i) =>
                Object(t[s]) === t[s]
                  ? t[s]
                  : (t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}),
              t
            )[e[e.length - 1]] = s),
          t);
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
      } else s = this.setval(t, e);
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
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")),
        (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
        (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
    }
    get(t, e = () => {}) {
      t.headers &&
        (delete t.headers["Content-Type"], delete t.headers["Content-Length"]),
        this.isSurge() || this.isLoon()
          ? (this.isSurge() &&
              this.isNeedRewrite &&
              ((t.headers = t.headers || {}),
              Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
            $httpClient.get(t, (t, s, i) => {
              !t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
            }))
          : this.isQuanX()
          ? (this.isNeedRewrite &&
              ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
            $task.fetch(t).then(
              (t) => {
                const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                e(null, { status: s, statusCode: i, headers: r, body: o }, o);
              },
              (t) => e(t)
            ))
          : this.isNode() &&
            (this.initGotEnv(t),
            this.got(t)
              .on("redirect", (t, e) => {
                try {
                  if (t.headers["set-cookie"]) {
                    const s = t.headers["set-cookie"]
                      .map(this.cktough.Cookie.parse)
                      .toString();
                    s && this.ckjar.setCookieSync(s, null),
                      (e.cookieJar = this.ckjar);
                  }
                } catch (t) {
                  this.logErr(t);
                }
              })
              .then(
                (t) => {
                  const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o,
                  } = t;
                  e(null, { status: s, statusCode: i, headers: r, body: o }, o);
                },
                (t) => {
                  const { message: s, response: i } = t;
                  e(s, i, i && i.body);
                }
              ));
    }
    post(t, e = () => {}) {
      if (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        t.headers && delete t.headers["Content-Length"],
        this.isSurge() || this.isLoon())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient.post(t, (t, s, i) => {
            !t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
          });
      else if (this.isQuanX())
        (t.method = "POST"),
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: s, statusCode: i, headers: r, body: o } = t;
              e(null, { status: s, statusCode: i, headers: r, body: o }, o);
            },
            (t) => e(t)
          );
      else if (this.isNode()) {
        this.initGotEnv(t);
        const { url: s, ...i } = t;
        this.got.post(s, i).then(
          (t) => {
            const { statusCode: s, statusCode: i, headers: r, body: o } = t;
            e(null, { status: s, statusCode: i, headers: r, body: o }, o);
          },
          (t) => {
            const { message: s, response: i } = t;
            e(s, i, i && i.body);
          }
        );
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds(),
      };
      /(y+)/.test(t) &&
        (t = t.replace(
          RegExp.$1,
          (s.getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
      for (let e in i)
        new RegExp("(" + e + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? i[e]
              : ("00" + i[e]).substr(("" + i[e]).length)
          ));
      return t;
    }
    msg(e = t, s = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t)
          return this.isLoon()
            ? t
            : this.isQuanX()
            ? { "open-url": t }
            : this.isSurge()
            ? { url: t }
            : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return { openUrl: e, mediaUrl: s };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return { "open-url": e, "media-url": s };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return { url: e };
          }
        }
      };
      if (
        (this.isMute ||
          (this.isSurge() || this.isLoon()
            ? $notification.post(e, s, i, o(r))
            : this.isQuanX() && $notify(e, s, i, o(r))),
        !this.isMuteLog)
      ) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e),
          s && t.push(s),
          i && t.push(i),
          console.log(t.join("\n")),
          (this.logs = this.logs.concat(t));
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]),
        console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s
        ? this.log("", `❗️${this.name}, 错误!`, t.stack)
        : this.log("", `❗️${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise((e) => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1e3;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`),
        this.log(),
        (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  })(t, e);
}
