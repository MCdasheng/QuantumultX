/* 
🏆Bing Task v2.3
[task_local]
36 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/bingSearch_v2.js, tag=🏆BingSearch Task, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google_Opinion_Rewards.png, enabled=false
⚠️注意事项:
    v1版本用于单账号搜索任务快速执行,也可以使用BoxJS多会话实现多账号
    v2版本支持多账号搜索任务&lowking积分任务,Cookies以严格JSON格式填入
    JSON格式检查: https://www.bejson.com/json/format/
🥳脚本功能: 
    ✅兼容执行@mcdasheng搜索任务
    ✅兼容执行@lowking积分任务
    ✅国区每日阅读📖    (新增，半自动,详见bingRead.js)
    ❎国区每日签到      (不好写)
    ❎外区每日任务      (手做任务都失败,写锤子)
    ❎外区浏览任务      (目前不在外区做任务了,先不写了~)
📍地区选择:
    详见v1版本中注释: https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/bingSearch.js
📦BoxJs地址:
    https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/mcdasheng.boxjs.json
@thanks
    @Chavy's Env.js
    @lowking's bingPoint.js 
@params
    bing_cn:        强制国区开关,开启后强制以国区域名cn.bing.com进行搜索
    bing_times:     执行次数,不要设置太多,默认20次
    bing_cookies:   多账号Cookie,严格JSON格式
    bing_timeout:   执行任务时间,超时自动结束任务,默认50s
    bing_interval:  搜索间隔,默认2s
Cookies格式:
    [{
        "account": "example1@qqq.com",
        "bingPointCookieKey": "",
        "bingSearchCookiePCKey": "",
        "bingSearchCookieMobileKey": ""
    },{
        "account": "example2@qqq.com",
        "bingPointCookieKey": "",
        "bingSearchCookiePCKey": "",
        "bingSearchCookieMobileKey": ""
    }]
*/

const $ = new Env("Bing任务");

const lk = new ToolKit(`🏆Bing积分`, `BingPoint`);

// lowking
let bingPointHeader;
let scriptTimeout = 30;
let cachePoint = lk.getVal("bingCachePointKey", 0);

// mcdasheng
var cookies = $.getdata("bing_cookies");
$.host = $.getdata("bing_cn") === "true" ? "cn.bing.com" : "www.bing.com";
$.times = $.getdata("bing_times") || 20;
$.timeout = $.getdata("bing_timeout") || 50;
$.interval = $.getdata("bing_interval") || 2;

cookies = JSON.parse(cookies);
$.log(`共找到${cookies.length}个账号`);
$.log(`当前搜索域名: ${$.host}`);
$.log(`当前搜索次数: ${$.times}次`);
$.log(`搜索间隔时间: ${$.interval}s`);
$.log(`预计在${$.timeout}s后结束任务`);
$.log(`-------------------------------------------`);

// 开始任务
async function processAll() {
  var promises = [];

  for (var i = 0; i < cookies.length; i++) {
    var account = cookies[i].account; // account
    var pc_cookie = cookies[i].bingSearchCookiePCKey; // bingSearch pc_Cookie
    var mb_cookie = cookies[i].bingSearchCookieMobileKey; // bingSearch mb_Cookie

    for (var j = 1; j <= $.times; j++) {
      promises.push(bingSearch(account, mb_cookie, pc_cookie));
      await $.wait(`${$.interval}` * 1000); // interval
    }
  }

  for (var k = 0; k < cookies.length; k++) {
    var mc_bingPointCookieKey = cookies[k].bingPointCookieKey; // bingPoint Cookie
    if (mc_bingPointCookieKey != "") {
      promises.push(lowking(mc_bingPointCookieKey));
    } else {
      $.log(`🔴账号${k + 1}: 面板Cookie为空,跳过积分任务!`);
    }
  }

  await Promise.all(promises);
}

// 定时结束任务
setTimeout(() => {
  $.log("🟡脚本执行超时,强制结束。");
  $.msg($.name, "🟡脚本执行超时,强制结束。");
  $.done();
}, `${$.timeout}` * 1000);

processAll().then(() => {
  $.log(`🎉BingSearch已自动结束,请检查是否完成全部任务!`);
  $.msg($.name, `🎉BingSearch已自动结束`, `请检查是否完成全部任务!`);
  $.done();
});

// mcdasheng
async function bingSearch(account, mb_cookie, pc_cookie) {
  $.log(`🟢当前账号: ${account}`);
  await mbSearch(mb_cookie);
  await pcSearch(pc_cookie);
  await pcSearch(pc_cookie);
}

async function mbSearch(mb_cookie) {
  // $.log("mbSearching...");
  if (!mb_cookie) {
    $.log("🟡mobile Cookie为空,跳过移动端搜索任务!");
    return 0;
  }
  let rd = Math.random().toString(36).slice(-8);
  let options = {
    url: `https://${$.host}/search?q=${rd}`,
    headers: {
      Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
      Connection: `keep-alive`,
      "Accept-Encoding": `gzip, deflate, br`,
      "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410308003`,
      "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
      Cookie: mb_cookie,
    },
  };
  return $.http.get(options).then(
    (resp) => {
      $.log("🎉mb:" + resp.statusCode + " " + rd);
      // $done();
    },
    (reason) => {
      $.log("mbSearch error");
      $.log(reason.error);
      $.msg($.name, "🔴mbSearch error", reason.error);
      $.done();
    }
  );
}

async function pcSearch(pc_cookie) {
  // $.log("pcSearching...");
  if (!pc_cookie) {
    $.log("🟡pc Cookie为空,跳过pc端搜索任务!");
    return 0;
  }
  let rd = Math.random().toString(36).slice(-8);
  let options = {
    url: `https://${$.host}/search?q=${rd}`,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.44",
      Cookie: pc_cookie,
    },
  };
  return $.http.get(options).then(
    (resp) => {
      $.log("🎉pc:" + resp.statusCode + " " + rd);
      // $done();
    },
    (reason) => {
      $.log("pcSearch error");
      $.log(reason.error);
      $.msg($.name, "🔴pcSearch error", reason.error);
      $.done();
    }
  );
}

// from lowking
async function dealMsg(dashBoard, newPoint) {
  return new Promise((resolve, _reject) => {
    let availablePoints =
      dashBoard?.dashboard?.userStatus?.availablePoints || "-";
    if (availablePoints != "-" && cachePoint) {
      lk.setVal(bingCachePointKey, JSON.stringify(availablePoints));
      let increaseAmount = availablePoints - cachePoint;
      lk.prependNotifyInfo(
        `本次执行:${
          increaseAmount >= 0 ? "+" + increaseAmount : increaseAmount
        }`
      );
      lk.setVal(
        "bingIsContinueWhenZeroKey",
        JSON.stringify(increaseAmount + newPoint)
      );
    }
    resolve(
      `当前积分:${availablePoints}${
        newPoint > 0 ? "+" + newPoint : ""
      }   日常获得:${
        dashBoard?.dashboard?.userStatus?.counters?.dailyPoint[0]
          ?.pointProgress || "-"
      }/${
        dashBoard?.dashboard?.userStatus?.counters?.dailyPoint[0]
          ?.pointProgressMax || "-"
      }`
    );
  });
}

async function lowking(bingPointCookie) {
  let msg = ``;
  if (bingPointCookie == "") {
    lk.execFail();
    lk.appendNotifyInfo(`⚠️请先打开rewards.bing.com获取cookie`);
  } else {
    bingPointHeader = {};
    bingPointHeader["authority"] = "rewards.bing.com";
    bingPointHeader["accept"] =
      "application/json, text/javascript, */*; q=0.01";
    bingPointHeader["accept-language"] = "zh-CN,zh;q=0.9";
    bingPointHeader["cookie"] = bingPointCookie;
    bingPointHeader["correlation-context"] = "v=1,ms.b.tel.market=zh-CN";
    bingPointHeader["dnt"] = "1";
    bingPointHeader["referer"] = "https://rewards.bing.com/redeem/000899036002";
    bingPointHeader["sec-ch-ua"] = '"Chromium";v="111", "Not(A:Brand";v="8"';
    bingPointHeader["sec-ch-ua-arch"] = '"x86"';
    bingPointHeader["sec-ch-ua-bitness"] = '"64"';
    bingPointHeader["sec-ch-ua-full-version"] = '"111.0.5563.64"';
    bingPointHeader["sec-ch-ua-mobile"] = "?0";
    bingPointHeader["sec-ch-ua-platform"] = '"macOS"';
    bingPointHeader["sec-ch-ua-platform-version"] = "13.2.0";
    bingPointHeader["sec-fetch-dest"] = "document";
    bingPointHeader["sec-fetch-mode"] = "navigate";
    bingPointHeader["sec-fetch-site"] = "none";
    bingPointHeader["user-agent"] =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

    let dashBoard = await getDashBoard();
    if (dashBoard?.dashboard) {
      let newPoint = await reportAct(dashBoard);
      msg = await dealMsg(dashBoard, newPoint);
    } else {
      lk.appendNotifyInfo("❌未获取到活动信息");
    }
  }
  if (!lk.isNode()) {
    lk.log(lk.notifyInfo.join("\n"));
  }
  lk.msg(msg);
  //   lk.done();
}

function doReportActForUrlreward(title, item, rvt) {
  return new Promise((resolve, _reject) => {
    const t = "做url奖励任务:" + title;
    lk.log(t);
    let ret = 0;
    let url = {
      url: `https://rewards.bing.com/api/reportactivity?X-Requested-With=XMLHttpRequest&_=${lk.startTime}`,
      headers: bingPointHeader,
      body: `id=${item.name}&hash=${item.hash}&timeZone=480&activityAmount=1&__RequestVerificationToken=${rvt}`,
    };
    // lk.log(JSON.stringify(url));
    // lk.log(JSON.stringify(item));
    lk.post(url, (error, _response, data) => {
      try {
        if (error) {
          lk.execFail();
          lk.log(error);
          lk.appendNotifyInfo(`🔴${t}失败,请稍后再试`);
        } else {
          // {"activity":{"id":"3484a93d-db98-490f-998e-10e64e481de7","points":10,"quantity":1,"timestamp":"2023-03-01T22:22:39.5968778+08:00","activityType":11,"channel":"","activitySubtype":"","currencyCode":"","purchasePrice":0.0,"orderId":""},"balance":157}
          lk.log(data);
          data = JSON.parse(data);
          if (data?.activity?.points) {
            ret = 1;
          }
        }
      } catch (e) {
        lk.logErr(e);
        // lk.log(`bing返回数据:${data}`);
        lk.execFail();
        lk.appendNotifyInfo(`🔴${t}错误,请稍后再试`);
      } finally {
        resolve(ret);
      }
    });
  });
}

function reportAct(dashBoard) {
  return new Promise(async (resolve, _reject) => {
    let newPoint = 0;
    let promotionalItem, morePromotions;
    morePromotions = dashBoard?.dashboard?.morePromotions || [];
    if ((promotionalItem = dashBoard?.dashboard?.promotionalItem)) {
      morePromotions.push(promotionalItem);
    }
    // lk.log(JSON.stringify(morePromotions))
    if (morePromotions.length > 0) {
      let todoCount = 0,
        sucCount = 0,
        failCount = 0,
        completeCount = 0,
        completePoint = 0;
      morePromotions.forEach(
        (_ = async (item) => {
          let title = item?.attributes?.title;
          let point = item?.pointProgressMax;
          let type = item?.attributes?.type;
          if (item?.complete == false) {
            if (point > 0) {
              let ret = 0;
              let b = true || title == "Rewa rds 挑戰";
              lk.log(`开始任务:${title}【${point}】\n${type}\n${b}`);
              if (b) {
                if (type === "urlreward") {
                  ret = await doReportActForUrlreward(
                    title,
                    item,
                    dashBoard?.rvt
                  );
                } else if (type === "quiz") {
                  ret = -1; // await doReportActForQuiz(title, item, dashBoard?.rvt)
                } else {
                  ret = -2;
                }
              }
              todoCount++;
              if (ret === 1) {
                lk.appendNotifyInfo(`🎉${title}【${point}】`);
                sucCount++;
                completePoint += point;
                newPoint += point;
              } else {
                failCount++;
                lk.execFail();
                if (ret === 0) {
                  lk.appendNotifyInfo(`🔴${title}【${point}】`);
                } else {
                  failCount--;
                  lk.log(`⎌${title}【${point}】`);
                }
              }
            } else {
              todoCount++;
            }
          } else {
            completeCount++;
            completePoint += point;
            lk.appendNotifyInfo(`🟢${title}【${point}】`);
          }
        })
      );
      let err = "";
      let totalCount = sucCount + failCount;
      while (true) {
        lk.log(
          `total: ${morePromotions.length}, suc: ${sucCount}, fail: ${failCount}, complete: ${completeCount}, todo:${todoCount}`
        );
        if (todoCount + completeCount >= morePromotions.length) {
          lk.log(`任务都做完了,退出`);
          err = `🎉任务都做完啦,共获得${completePoint}积分`;
          break;
        }
        if (new Date().getTime() - lk.startTime > scriptTimeout * 1000) {
          lk.log(`执行超时,强制退出`);
          err = "❌执行超时,强制退出（请添加分流切换节点）";
          break;
        }
        await lk.sleep(100);
        totalCount = sucCount + failCount;
      }
      if (!err) {
        if (totalCount > 0) {
          lk.execFail();
          lk.prependNotifyInfo(`🎉成功:${sucCount}个,❌失败:${failCount}个`);
        } else {
          lk.appendNotifyInfo(`🎉今天的任务都做完啦`);
        }
      } else {
        lk.prependNotifyInfo(err);
        lk.prependNotifyInfo(
          `🎉:${sucCount}个,❌:${failCount}个,今日已完成:${completeCount}个`
        );
      }
      resolve(newPoint);
    } else {
      lk.execFail();
      lk.prependNotifyInfo(`❌未获取到活动信息`);
      resolve(newPoint);
    }
  });
}

function getDashBoard() {
  return new Promise((resolve, _reject) => {
    const t = "获取面板信息";
    lk.log(`开始${t}`);
    let url = {
      url: `https://rewards.bing.com/?_=${lk.startTime}`,
      headers: bingPointHeader,
    };
    lk.get(url, (error, _response, data) => {
      try {
        if (error) {
          lk.execFail();
          lk.appendNotifyInfo(`❌${t}失败,请稍后再试`);
          resolve({});
        } else {
          let rvt = data
            .split("__RequestVerificationToken")[1]
            .split('value="')[1]
            .split('"')[0];
          url.url = `https://rewards.bing.com/api/getuserinfo?type=1&X-Requested-With=XMLHttpRequest&_=${lk.startTime}`;
          let dashboard = JSON.parse(
            data.split("var dashboard = ")[1].split("\n")[0].slice(0, -2)
          );
          // 和上面网页返回截取的结构一样
          // lk.get(url, (error, _response, data) => {
          //     if (error) {
          //         lk.execFail()
          //         lk.appendNotifyInfo(`❌${t}失败,请稍后再试`)
          //         resolve({})
          //     } else {
          //         lk.log(JSON.stringify(dashboard))
          //         dashboard = JSON.parse(data)?.dashboard
          //         lk.log(JSON.stringify(dashboard))
          //         let dataObj = {
          //             dashboard,
          //             rvt
          //         }
          //         resolve(dataObj)
          //     }
          // })
          let dataObj = {
            dashboard,
            rvt,
          };
          resolve(dataObj);
        }
      } catch (e) {
        lk.logErr(e);
        lk.log(`bing返回数据:${data}\n${error}\n${JSON.stringify(_response)}`);
        lk.execFail();
        lk.appendNotifyInfo(`❌${t}错误,请稍后再试,或者cookie过期,请重新抓取`);
        resolve({});
      }
    });
  });
}

// ToolKit
function ToolKit(t, s, i) {
  return new (class {
    constructor(t, s, i) {
      this.tgEscapeCharMapping = { "&": "＆", "#": "＃" };
      this.userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;
      this.prefix = `lk`;
      this.name = t;
      this.id = s;
      this.data = null;
      this.dataFile = this.getRealPath(`${this.prefix}${this.id}.dat`);
      this.boxJsJsonFile = this.getRealPath(
        `${this.prefix}${this.id}.boxjs.json`
      );
      this.options = i;
      this.isExecComm = false;
      this.isEnableLog = this.getVal(`${this.prefix}IsEnableLog${this.id}`);
      this.isEnableLog = this.isEmpty(this.isEnableLog)
        ? true
        : JSON.parse(this.isEnableLog);
      this.isNotifyOnlyFail = this.getVal(
        `${this.prefix}NotifyOnlyFail${this.id}`
      );
      this.isNotifyOnlyFail = this.isEmpty(this.isNotifyOnlyFail)
        ? false
        : JSON.parse(this.isNotifyOnlyFail);
      this.isEnableTgNotify = this.getVal(
        `${this.prefix}IsEnableTgNotify${this.id}`
      );
      this.isEnableTgNotify = this.isEmpty(this.isEnableTgNotify)
        ? false
        : JSON.parse(this.isEnableTgNotify);
      this.tgNotifyUrl = this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);
      this.isEnableTgNotify = this.isEnableTgNotify
        ? !this.isEmpty(this.tgNotifyUrl)
        : this.isEnableTgNotify;
      this.costTotalStringKey = `${this.prefix}CostTotalString${this.id}`;
      this.costTotalString = this.getVal(this.costTotalStringKey);
      this.costTotalString = this.isEmpty(this.costTotalString)
        ? `0,0`
        : this.costTotalString.replace('"', "");
      this.costTotalMs = this.costTotalString.split(",")[0];
      this.execCount = this.costTotalString.split(",")[1];
      this.costTotalMs = this.isEmpty(this.costTotalMs)
        ? 0
        : parseInt(this.costTotalMs);
      this.execCount = this.isEmpty(this.execCount)
        ? 0
        : parseInt(this.execCount);
      this.logSeparator = "\n";
      this.now = new Date();
      this.startTime = this.now.getTime();
      this.node = (() => {
        if (this.isNode()) {
          const t = require("request");
          return { request: t };
        } else {
          return null;
        }
      })();
      this.execStatus = true;
      this.notifyInfo = [];
      this.log(`${this.name}, 开始执行!`);
      this.execComm();
    }
    getRealPath(t) {
      if (this.isNode()) {
        let s = process.argv.slice(1, 2)[0].split("/");
        s[s.length - 1] = t;
        return s.join("/");
      }
      return t;
    }
    async execComm() {
      if (this.isNode()) {
        this.comm = process.argv.slice(1);
        let t = false;
        if (this.comm[1] == "p") {
          this.isExecComm = true;
          this.log(`开始执行指令【${this.comm[1]}】=> 发送到手机测试脚本!`);
          if (
            this.isEmpty(this.options) ||
            this.isEmpty(this.options.httpApi)
          ) {
            this.log(`未设置options,使用默认值`);
            if (this.isEmpty(this.options)) {
              this.options = {};
            }
            this.options.httpApi = `ffff@10.0.0.9:6166`;
          } else {
            if (!/.*?@.*?:[0-9]+/.test(this.options.httpApi)) {
              t = true;
              this.log(`❌httpApi格式错误!格式:ffff@3.3.3.18:6166`);
              this.done();
            }
          }
          if (!t) {
            this.callApi(this.comm[2]);
          }
        }
      }
    }
    callApi(t) {
      let s = this.comm[0];
      this.log(`获取【${s}】内容传给手机`);
      let i = "";
      this.fs = this.fs ? this.fs : require("fs");
      this.path = this.path ? this.path : require("path");
      const e = this.path.resolve(s);
      const o = this.path.resolve(process.cwd(), s);
      const h = this.fs.existsSync(e);
      const r = !h && this.fs.existsSync(o);
      if (h || r) {
        const t = h ? e : o;
        try {
          i = this.fs.readFileSync(t);
        } catch (t) {
          i = "";
        }
      } else {
        i = "";
      }
      let n = {
        url: `http://${
          this.options.httpApi.split("@")[1]
        }/v1/scripting/evaluate`,
        headers: { "X-Key": `${this.options.httpApi.split("@")[0]}` },
        body: {
          script_text: `${i}`,
          mock_type: "cron",
          timeout: !this.isEmpty(t) && t > 5 ? t : 5,
        },
        json: true,
      };
      this.post(n, (t, i, e) => {
        this.log(`已将脚本【${s}】发给手机!`);
        this.done();
      });
    }
    getCallerFileNameAndLine() {
      let t;
      try {
        throw Error("");
      } catch (s) {
        t = s;
      }
      const s = t.stack;
      const i = s.split("\n");
      let e = 1;
      if (e !== 0) {
        const t = i[e];
        this.path = this.path ? this.path : require("path");
        return `[${t.substring(
          t.lastIndexOf(this.path.sep) + 1,
          t.lastIndexOf(":")
        )}]`;
      } else {
        return "[-]";
      }
    }
    getFunName(t) {
      var s = t.toString();
      s = s.substr("function ".length);
      s = s.substr(0, s.indexOf("("));
      return s;
    }
    boxJsJsonBuilder(t, s) {
      if (this.isNode()) {
        let i = "/Users/lowking/Desktop/Scripts/lowking.boxjs.json";
        if (s && s.hasOwnProperty("target_boxjs_json_path")) {
          i = s["target_boxjs_json_path"];
        }
        if (!this.fs.existsSync(i)) {
          return;
        }
        if (!this.isJsonObject(t) || !this.isJsonObject(s)) {
          this.log("构建BoxJsJson传入参数格式错误,请传入json对象");
          return;
        }
        this.log("using node");
        let e = ["settings", "keys"];
        const o = "https://raw.githubusercontent.com/Orz-3";
        let h = {};
        let r = "#lk{script_url}";
        if (s && s.hasOwnProperty("script_url")) {
          r = this.isEmpty(s["script_url"])
            ? "#lk{script_url}"
            : s["script_url"];
        }
        h.id = `${this.prefix}${this.id}`;
        h.name = this.name;
        h.desc_html = `⚠️使用说明</br>详情【<a href='${r}?raw=true'><font class='red--text'>点我查看</font></a>】`;
        h.icons = [
          `${o}/mini/master/Alpha/${this.id.toLocaleLowerCase()}.png`,
          `${o}/mini/master/Color/${this.id.toLocaleLowerCase()}.png`,
        ];
        h.keys = [];
        h.settings = [
          {
            id: `${this.prefix}IsEnableLog${this.id}`,
            name: "开启/关闭日志",
            val: true,
            type: "boolean",
            desc: "默认开启",
          },
          {
            id: `${this.prefix}NotifyOnlyFail${this.id}`,
            name: "只当执行失败才通知",
            val: false,
            type: "boolean",
            desc: "默认关闭",
          },
          {
            id: `${this.prefix}IsEnableTgNotify${this.id}`,
            name: "开启/关闭Telegram通知",
            val: false,
            type: "boolean",
            desc: "默认关闭",
          },
          {
            id: `${this.prefix}TgNotifyUrl${this.id}`,
            name: "Telegram通知地址",
            val: "",
            type: "text",
            desc: "Tg的通知地址,如:https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text=",
          },
        ];
        h.author = "#lk{author}";
        h.repo = "#lk{repo}";
        h.script = `${r}?raw=true`;
        if (!this.isEmpty(t)) {
          for (let s in e) {
            let i = e[s];
            if (!this.isEmpty(t[i])) {
              if (i === "settings") {
                for (let s = 0; s < t[i].length; s++) {
                  let e = t[i][s];
                  for (let t = 0; t < h.settings.length; t++) {
                    let s = h.settings[t];
                    if (e.id === s.id) {
                      h.settings.splice(t, 1);
                    }
                  }
                }
              }
              h[i] = h[i].concat(t[i]);
            }
            delete t[i];
          }
        }
        Object.assign(h, t);
        if (this.isNode()) {
          this.fs = this.fs ? this.fs : require("fs");
          this.path = this.path ? this.path : require("path");
          const t = this.path.resolve(this.boxJsJsonFile);
          const e = this.path.resolve(process.cwd(), this.boxJsJsonFile);
          const o = this.fs.existsSync(t);
          const r = !o && this.fs.existsSync(e);
          const n = JSON.stringify(h, null, "\t");
          if (o) {
            this.fs.writeFileSync(t, n);
          } else if (r) {
            this.fs.writeFileSync(e, n);
          } else {
            this.fs.writeFileSync(t, n);
          }
          let a = JSON.parse(this.fs.readFileSync(i));
          if (
            a.hasOwnProperty("apps") &&
            Array.isArray(a["apps"]) &&
            a["apps"].length > 0
          ) {
            let t = a.apps;
            let e = t.indexOf(
              t.filter((t) => {
                return t.id == h.id;
              })[0]
            );
            if (e >= 0) {
              a.apps[e] = h;
            } else {
              a.apps.push(h);
            }
            let o = JSON.stringify(a, null, 2);
            if (!this.isEmpty(s)) {
              for (const t in s) {
                let i = "";
                if (s.hasOwnProperty(t)) {
                  i = s[t];
                } else if (t === "author") {
                  i = "@lowking";
                } else if (t === "repo") {
                  i = "https://github.com/lowking/Scripts";
                }
                o = o.replace(`#lk{${t}}`, i);
              }
            }
            const r = /(?:#lk\{)(.+?)(?=\})/;
            let n = r.exec(o);
            if (n !== null) {
              this.log(
                `生成BoxJs还有未配置的参数,请参考https://github.com/lowking/Scripts/blob/master/util/example/ToolKitDemo.js#L17-L18传入参数:\n`
              );
            }
            let l = new Set();
            while ((n = r.exec(o)) !== null) {
              l.add(n[1]);
              o = o.replace(`#lk{${n[1]}}`, ``);
            }
            l.forEach((t) => {
              console.log(`${t} `);
            });
            this.fs.writeFileSync(i, o);
          }
        }
      }
    }
    isJsonObject(t) {
      return (
        typeof t == "object" &&
        Object.prototype.toString.call(t).toLowerCase() == "[object object]" &&
        !t.length
      );
    }
    appendNotifyInfo(t, s) {
      if (s == 1) {
        this.notifyInfo = t;
      } else {
        this.notifyInfo.push(t);
      }
    }
    prependNotifyInfo(t) {
      this.notifyInfo.splice(0, 0, t);
    }
    execFail() {
      this.execStatus = false;
    }
    isRequest() {
      return typeof $request != "undefined";
    }
    isSurge() {
      return typeof $httpClient != "undefined";
    }
    isQuanX() {
      return typeof $task != "undefined";
    }
    isLoon() {
      return typeof $loon != "undefined";
    }
    isJSBox() {
      return typeof $app != "undefined" && typeof $http != "undefined";
    }
    isStash() {
      return (
        "undefined" !== typeof $environment && $environment["stash-version"]
      );
    }
    isNode() {
      return typeof require == "function" && !this.isJSBox();
    }
    sleep(t) {
      return new Promise((s) => setTimeout(s, t));
    }
    log(t) {
      if (this.isEnableLog) console.log(`${this.logSeparator}${t}`);
    }
    logErr(t) {
      this.execStatus = true;
      if (this.isEnableLog) {
        // console.log(`${this.logSeparator}${this.name}执行异常:`);
        console.log(t);
        console.log(`\n${t.message}`);
      }
    }
    msg(t, s, i, e) {
      if (!this.isRequest() && this.isNotifyOnlyFail && this.execStatus) {
      } else {
        if (this.isEmpty(s)) {
          if (Array.isArray(this.notifyInfo)) {
            s = this.notifyInfo.join("\n");
          } else {
            s = this.notifyInfo;
          }
        }
        if (!this.isEmpty(s)) {
          if (this.isEnableTgNotify) {
            this.log(`${this.name}Tg通知开始`);
            for (let t in this.tgEscapeCharMapping) {
              if (!this.tgEscapeCharMapping.hasOwnProperty(t)) {
                continue;
              }
              s = s.replace(t, this.tgEscapeCharMapping[t]);
            }
            this.get(
              { url: encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`) },
              (t, s, i) => {
                this.log(`Tg通知完毕`);
              }
            );
          } else {
            let o = {};
            const h = !this.isEmpty(i);
            const r = !this.isEmpty(e);
            if (this.isQuanX()) {
              if (h) o["open-url"] = i;
              if (r) o["media-url"] = e;
              $notify(this.name, t, s, o);
            }
            if (this.isSurge() || this.isStash()) {
              if (h) o["url"] = i;
              $notification.post(this.name, t, s, o);
            }
            if (this.isNode())
              this.log("⭐️" + this.name + "\n" + t + "\n" + s);
            if (this.isJSBox())
              $push.schedule({ title: this.name, body: t ? t + "\n" + s : s });
          }
        }
      }
    }
    getVal(t, s = "") {
      let i;
      if (this.isSurge() || this.isLoon() || this.isStash()) {
        i = $persistentStore.read(t);
      } else if (this.isQuanX()) {
        i = $prefs.valueForKey(t);
      } else if (this.isNode()) {
        this.data = this.loadData();
        i = process.env[t] || this.data[t];
      } else {
        i = (this.data && this.data[t]) || null;
      }
      return !i ? s : i;
    }
    setVal(t, s) {
      if (this.isSurge() || this.isLoon() || this.isStash()) {
        return $persistentStore.write(s, t);
      } else if (this.isQuanX()) {
        return $prefs.setValueForKey(s, t);
      } else if (this.isNode()) {
        this.data = this.loadData();
        this.data[t] = s;
        this.writeData();
        return true;
      } else {
        return (this.data && this.data[t]) || null;
      }
    }
    loadData() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile);
        const s = this.path.resolve(process.cwd(), this.dataFile);
        const i = this.fs.existsSync(t);
        const e = !i && this.fs.existsSync(s);
        if (i || e) {
          const e = i ? t : s;
          try {
            return JSON.parse(this.fs.readFileSync(e));
          } catch (t) {
            return {};
          }
        } else return {};
      } else return {};
    }
    writeData() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile);
        const s = this.path.resolve(process.cwd(), this.dataFile);
        const i = this.fs.existsSync(t);
        const e = !i && this.fs.existsSync(s);
        const o = JSON.stringify(this.data);
        if (i) {
          this.fs.writeFileSync(t, o);
        } else if (e) {
          this.fs.writeFileSync(s, o);
        } else {
          this.fs.writeFileSync(t, o);
        }
      }
    }
    adapterStatus(t) {
      if (t) {
        if (t.status) {
          t["statusCode"] = t.status;
        } else if (t.statusCode) {
          t["status"] = t.statusCode;
        }
      }
      return t;
    }
    get(t, s = () => {}) {
      if (this.isQuanX()) {
        if (typeof t == "string") t = { url: t };
        t["method"] = "GET";
        $task.fetch(t).then(
          (t) => {
            s(null, this.adapterStatus(t), t.body);
          },
          (t) => s(t.error, null, null)
        );
      }
      if (this.isSurge() || this.isLoon() || this.isStash())
        $httpClient.get(t, (t, i, e) => {
          s(t, this.adapterStatus(i), e);
        });
      if (this.isNode()) {
        this.node.request(t, (t, i, e) => {
          s(t, this.adapterStatus(i), e);
        });
      }
      if (this.isJSBox()) {
        if (typeof t == "string") t = { url: t };
        t["header"] = t["headers"];
        t["handler"] = function (t) {
          let i = t.error;
          if (i) i = JSON.stringify(t.error);
          let e = t.data;
          if (typeof e == "object") e = JSON.stringify(t.data);
          s(i, this.adapterStatus(t.response), e);
        };
        $http.get(t);
      }
    }
    post(t, s = () => {}) {
      if (this.isQuanX()) {
        if (typeof t == "string") t = { url: t };
        t["method"] = "POST";
        $task.fetch(t).then(
          (t) => {
            s(null, this.adapterStatus(t), t.body);
          },
          (t) => s(t.error, null, null)
        );
      }
      if (this.isSurge() || this.isLoon() || this.isStash()) {
        $httpClient.post(t, (t, i, e) => {
          s(t, this.adapterStatus(i), e);
        });
      }
      if (this.isNode()) {
        this.node.request.post(t, (t, i, e) => {
          s(t, this.adapterStatus(i), e);
        });
      }
      if (this.isJSBox()) {
        if (typeof t == "string") t = { url: t };
        t["header"] = t["headers"];
        t["handler"] = function (t) {
          let i = t.error;
          if (i) i = JSON.stringify(t.error);
          let e = t.data;
          if (typeof e == "object") e = JSON.stringify(t.data);
          s(i, this.adapterStatus(t.response), e);
        };
        $http.post(t);
      }
    }
    put(t, s = () => {}) {
      if (this.isQuanX()) {
        if (typeof t == "string") t = { url: t };
        t["method"] = "PUT";
        $task.fetch(t).then(
          (t) => {
            s(null, this.adapterStatus(t), t.body);
          },
          (t) => s(t.error, null, null)
        );
      }
      if (this.isSurge() || this.isLoon() || this.isStash()) {
        t.method = "PUT";
        $httpClient.put(t, (t, i, e) => {
          s(t, this.adapterStatus(i), e);
        });
      }
      if (this.isNode()) {
        t.method = "PUT";
        this.node.request.put(t, (t, i, e) => {
          s(t, this.adapterStatus(i), e);
        });
      }
      if (this.isJSBox()) {
        if (typeof t == "string") t = { url: t };
        t["header"] = t["headers"];
        t["handler"] = function (t) {
          let i = t.error;
          if (i) i = JSON.stringify(t.error);
          let e = t.data;
          if (typeof e == "object") e = JSON.stringify(t.data);
          s(i, this.adapterStatus(t.response), e);
        };
        $http.post(t);
      }
    }
    costTime() {
      let t = `${this.name}执行完毕!`;
      if (this.isNode() && this.isExecComm) {
        t = `指令【${this.comm[1]}】执行完毕!`;
      }
      const s = new Date().getTime();
      const i = s - this.startTime;
      const e = i / 1e3;
      this.execCount++;
      this.costTotalMs += i;
      this.log(
        `${t}耗时【${e}】秒\n总共执行【${this.execCount}】次,平均耗时【${(
          this.costTotalMs /
          this.execCount /
          1e3
        ).toFixed(4)}】秒`
      );
      this.setVal(
        this.costTotalStringKey,
        JSON.stringify(`${this.costTotalMs},${this.execCount}`)
      );
    }
    done(t = {}) {
      this.costTime();
      if (this.isSurge() || this.isQuanX() || this.isLoon() || this.isStash()) {
        $done(t);
      }
    }
    getRequestUrl() {
      return $request.url;
    }
    getResponseBody() {
      return $response.body;
    }
    isGetCookie(t) {
      return !!($request.method != "OPTIONS" && this.getRequestUrl().match(t));
    }
    isEmpty(t) {
      return (
        typeof t == "undefined" ||
        t == null ||
        t == "" ||
        t == "null" ||
        t == "undefined" ||
        t.length === 0
      );
    }
    randomString(t) {
      t = t || 32;
      var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      var i = s.length;
      var e = "";
      for (let o = 0; o < t; o++) {
        e += s.charAt(Math.floor(Math.random() * i));
      }
      return e;
    }
    autoComplete(t, s, i, e, o, h, r, n, a, l) {
      t += ``;
      if (t.length < o) {
        while (t.length < o) {
          if (h == 0) {
            t += e;
          } else {
            t = e + t;
          }
        }
      }
      if (r) {
        let s = ``;
        for (var f = 0; f < n; f++) {
          s += l;
        }
        t = t.substring(0, a) + s + t.substring(n + a);
      }
      t = s + t + i;
      return this.toDBC(t);
    }
    customReplace(t, s, i, e) {
      try {
        if (this.isEmpty(i)) {
          i = "#{";
        }
        if (this.isEmpty(e)) {
          e = "}";
        }
        for (let o in s) {
          t = t.replace(`${i}${o}${e}`, s[o]);
        }
      } catch (t) {
        this.logErr(t);
      }
      return t;
    }
    toDBC(t) {
      var s = "";
      for (var i = 0; i < t.length; i++) {
        if (t.charCodeAt(i) == 32) {
          s = s + String.fromCharCode(12288);
        } else if (t.charCodeAt(i) < 127) {
          s = s + String.fromCharCode(t.charCodeAt(i) + 65248);
        }
      }
      return s;
    }
    hash(t) {
      let s = 0,
        i,
        e;
      for (i = 0; i < t.length; i++) {
        e = t.charCodeAt(i);
        s = (s << 5) - s + e;
        s |= 0;
      }
      return String(s);
    }
    formatDate(t, s) {
      let i = {
        "M+": t.getMonth() + 1,
        "d+": t.getDate(),
        "H+": t.getHours(),
        "m+": t.getMinutes(),
        "s+": t.getSeconds(),
        "q+": Math.floor((t.getMonth() + 3) / 3),
        S: t.getMilliseconds(),
      };
      if (/(y+)/.test(s))
        s = s.replace(
          RegExp.$1,
          (t.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let t in i)
        if (new RegExp("(" + t + ")").test(s))
          s = s.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? i[t]
              : ("00" + i[t]).substr(("" + i[t]).length)
          );
      return s;
    }
  })(t, s, i);
}

// from Chavy's Env.js
function Env(t, s) {
  class e {
    constructor(t) {
      this.env = t;
    }
    send(t, s = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let e = this.get;
      return (
        "POST" === s && (e = this.post),
        new Promise((s, i) => {
          e.call(this, t, (t, e, r) => {
            t ? i(t) : s(e);
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
    constructor(t, s) {
      (this.name = t),
        (this.http = new e(this)),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.isMute = !1),
        (this.isNeedRewrite = !1),
        (this.logSeparator = "\n"),
        (this.encoding = "utf-8"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, s),
        this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return (
        "undefined" != typeof $environment && $environment["surge-version"]
      );
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    isShadowrocket() {
      return "undefined" != typeof $rocket;
    }
    isStash() {
      return (
        "undefined" != typeof $environment && $environment["stash-version"]
      );
    }
    toObj(t, s = null) {
      try {
        return JSON.parse(t);
      } catch {
        return s;
      }
    }
    toStr(t, s = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return s;
      }
    }
    getjson(t, s) {
      let e = s;
      const i = this.getdata(t);
      if (i)
        try {
          e = JSON.parse(this.getdata(t));
        } catch {}
      return e;
    }
    setjson(t, s) {
      try {
        return this.setdata(JSON.stringify(t), s);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise((s) => {
        this.get({ url: t }, (t, e, i) => s(i));
      });
    }
    runScript(t, s) {
      return new Promise((e) => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (r = r ? 1 * r : 20), (r = s && s.timeout ? s.timeout : r);
        const [o, h] = i.split("@"),
          a = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: r },
            headers: { "X-Key": o, Accept: "*/*" },
            timeout: r,
          };
        this.post(a, (t, s, i) => e(i));
      }).catch((t) => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s);
        if (!e && !i) return {};
        {
          const i = e ? t : s;
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
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s),
          r = JSON.stringify(this.data);
        e
          ? this.fs.writeFileSync(t, r)
          : i
          ? this.fs.writeFileSync(s, r)
          : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, s, e) {
      const i = s.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return e;
      return r;
    }
    lodash_set(t, s, e) {
      return Object(t) !== t
        ? t
        : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []),
          (s
            .slice(0, -1)
            .reduce(
              (t, e, i) =>
                Object(t[e]) === t[e]
                  ? t[e]
                  : (t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}),
              t
            )[s[s.length - 1]] = e),
          t);
    }
    getdata(t) {
      let s = this.getval(t);
      if (/^@/.test(t)) {
        const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = e ? this.getval(e) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            s = t ? this.lodash_get(t, i, "") : s;
          } catch (t) {
            s = "";
          }
      }
      return s;
    }
    setdata(t, s) {
      let e = !1;
      if (/^@/.test(s)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(s),
          o = this.getval(i),
          h = i ? ("null" === o ? null : o || "{}") : "{}";
        try {
          const s = JSON.parse(h);
          this.lodash_set(s, r, t), (e = this.setval(JSON.stringify(s), i));
        } catch (s) {
          const o = {};
          this.lodash_set(o, r, t), (e = this.setval(JSON.stringify(o), i));
        }
      } else e = this.setval(t, s);
      return e;
    }
    getval(t) {
      return this.isSurge() ||
        this.isShadowrocket() ||
        this.isLoon() ||
        this.isStash()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : this.isNode()
        ? ((this.data = this.loaddata()), this.data[t])
        : (this.data && this.data[t]) || null;
    }
    setval(t, s) {
      return this.isSurge() ||
        this.isShadowrocket() ||
        this.isLoon() ||
        this.isStash()
        ? $persistentStore.write(t, s)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, s)
        : this.isNode()
        ? ((this.data = this.loaddata()),
          (this.data[s] = t),
          this.writedata(),
          !0)
        : (this.data && this.data[s]) || null;
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
    get(t, s = () => {}) {
      if (
        (t.headers &&
          (delete t.headers["Content-Type"],
          delete t.headers["Content-Length"]),
        this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient.get(t, (t, e, i) => {
            !t &&
              e &&
              ((e.body = i),
              (e.statusCode = e.status ? e.status : e.statusCode),
              (e.status = e.statusCode)),
              s(t, e, i);
          });
      else if (this.isQuanX())
        this.isNeedRewrite &&
          ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: e, statusCode: i, headers: r, body: o } = t;
              s(null, { status: e, statusCode: i, headers: r, body: o }, o);
            },
            (t) => s((t && t.error) || "UndefinedError")
          );
      else if (this.isNode()) {
        let e = require("iconv-lite");
        this.initGotEnv(t),
          this.got(t)
            .on("redirect", (t, s) => {
              try {
                if (t.headers["set-cookie"]) {
                  const e = t.headers["set-cookie"]
                    .map(this.cktough.Cookie.parse)
                    .toString();
                  e && this.ckjar.setCookieSync(e, null),
                    (s.cookieJar = this.ckjar);
                }
              } catch (t) {
                this.logErr(t);
              }
            })
            .then(
              (t) => {
                const {
                    statusCode: i,
                    statusCode: r,
                    headers: o,
                    rawBody: h,
                  } = t,
                  a = e.decode(h, this.encoding);
                s(
                  null,
                  { status: i, statusCode: r, headers: o, rawBody: h, body: a },
                  a
                );
              },
              (t) => {
                const { message: i, response: r } = t;
                s(i, r, r && e.decode(r.rawBody, this.encoding));
              }
            );
      }
    }
    post(t, s = () => {}) {
      const e = t.method ? t.method.toLocaleLowerCase() : "post";
      if (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        t.headers && delete t.headers["Content-Length"],
        this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient[e](t, (t, e, i) => {
            !t &&
              e &&
              ((e.body = i),
              (e.statusCode = e.status ? e.status : e.statusCode),
              (e.status = e.statusCode)),
              s(t, e, i);
          });
      else if (this.isQuanX())
        (t.method = e),
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: e, statusCode: i, headers: r, body: o } = t;
              s(null, { status: e, statusCode: i, headers: r, body: o }, o);
            },
            (t) => s((t && t.error) || "UndefinedError")
          );
      else if (this.isNode()) {
        let i = require("iconv-lite");
        this.initGotEnv(t);
        const { url: r, ...o } = t;
        this.got[e](r, o).then(
          (t) => {
            const { statusCode: e, statusCode: r, headers: o, rawBody: h } = t,
              a = i.decode(h, this.encoding);
            s(
              null,
              { status: e, statusCode: r, headers: o, rawBody: h, body: a },
              a
            );
          },
          (t) => {
            const { message: e, response: r } = t;
            s(e, r, r && i.decode(r.rawBody, this.encoding));
          }
        );
      }
    }
    time(t, s = null) {
      const e = s ? new Date(s) : new Date();
      let i = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "H+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        S: e.getMilliseconds(),
      };
      /(y+)/.test(t) &&
        (t = t.replace(
          RegExp.$1,
          (e.getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
      for (let s in i)
        new RegExp("(" + s + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? i[s]
              : ("00" + i[s]).substr(("" + i[s]).length)
          ));
      return t;
    }
    queryStr(t) {
      let s = "";
      for (const e in t) {
        let i = t[e];
        null != i &&
          "" !== i &&
          ("object" == typeof i && (i = JSON.stringify(i)),
          (s += `${e}=${i}&`));
      }
      return (s = s.substring(0, s.length - 1)), s;
    }
    msg(s = t, e = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t)
          return this.isLoon() || this.isShadowrocket()
            ? t
            : this.isQuanX()
            ? { "open-url": t }
            : this.isSurge() || this.isStash()
            ? { url: t }
            : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let s = t.openUrl || t.url || t["open-url"],
              e = t.mediaUrl || t["media-url"];
            return { openUrl: s, mediaUrl: e };
          }
          if (this.isQuanX()) {
            let s = t["open-url"] || t.url || t.openUrl,
              e = t["media-url"] || t.mediaUrl,
              i = t["update-pasteboard"] || t.updatePasteboard;
            return { "open-url": s, "media-url": e, "update-pasteboard": i };
          }
          if (this.isSurge() || this.isShadowrocket() || this.isStash()) {
            let s = t.url || t.openUrl || t["open-url"];
            return { url: s };
          }
        }
      };
      if (
        (this.isMute ||
          (this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash()
            ? $notification.post(s, e, i, o(r))
            : this.isQuanX() && $notify(s, e, i, o(r))),
        !this.isMuteLog)
      ) {
        let t = [
          "",
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============",
        ];
        t.push(s),
          e && t.push(e),
          i && t.push(i),
          console.log(t.join("\n")),
          (this.logs = this.logs.concat(t));
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]),
        console.log(t.join(this.logSeparator));
    }
    logErr(t, s) {
      const e = !(
        this.isSurge() ||
        this.isShadowrocket() ||
        this.isQuanX() ||
        this.isLoon() ||
        this.isStash()
      );
      e
        ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
        : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
    }
    wait(t) {
      return new Promise((s) => setTimeout(s, t));
    }
    done(t = {}) {
      const s = new Date().getTime(),
        e = (s - this.startTime) / 1e3;
      this.log(
        "",
        `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`
      ),
        this.log(),
        this.isSurge() ||
        this.isShadowrocket() ||
        this.isQuanX() ||
        this.isLoon() ||
        this.isStash()
          ? $done(t)
          : this.isNode() && process.exit(1);
    }
  })(t, s);
}
