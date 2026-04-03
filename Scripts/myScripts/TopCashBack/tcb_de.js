// 脚本功能: 监控 TopCashBack 德国站返现比例
// [task_local]
// 0 */6 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/TopCashBack/tcb_de.js, tag=TopCashBack DE 返现监控, enabled=true

const $ = new Env("tcb-de");

const COOKIE =
  "TCB_SessionID8=110df70b-0a3a-4ebf-a94e-908c0e8edc67; ReferralID=8034864; CookiesEnabled=true; _conv_v=vi%3A1*sc%3A2*cs%3A1775201576*fs%3A1775120961*pv%3A2*exp%3A%7B%7D*ps%3A1775120961; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Apr+03+2026+15%3A32%3A57+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=202505.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fwww.topcashback.de%2Favira%2F&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0";

const MONITORS = [
  {
    id: "avira",
    name: "Avira",
    url: "https://www.topcashback.de/avira/",
    label: "Onlinebestellung",
  },
  {
    id: "purevpn",
    name: "PureVPN",
    url: "https://www.topcashback.de/purevpn/",
    label: "Onlinebestellung",
  },
];

!(async () => {
  const messages = [];
  for (const item of MONITORS) {
    try {
      messages.push(await checkMerchant(item, "tcb_de"));
    } catch (error) {
      const text = `${item.name}: 获取失败 (${error.message || String(error)})`;
      $.log(text);
      messages.push(text);
    }
  }
  $.msg($.name, `本次检查 ${MONITORS.length} 个商户`, messages.join("\n"), {
    "open-url": MONITORS[0] ? MONITORS[0].url : "",
  });
})()
  .catch((error) => {
    $.logErr(error);
    $.msg($.name, "执行失败", error.message || String(error));
  })
  .finally(() => $.done());

async function checkMerchant(item, prefix) {
  const rate = await fetchMerchantRate(item, "de-DE,de;q=0.9,en;q=0.8,zh-CN;q=0.7");
  const date = $.time("M月d日");
  const rateKey = `${prefix}_${item.id}_rate`;
  const dateKey = `${prefix}_${item.id}_date`;
  const prevRate = $.getdata(rateKey);
  const prevDate = $.getdata(dateKey);

  let message = `${item.name}: 当前 ${item.label} ${rate}`;
  if (prevRate) {
    message =
      prevRate === rate
        ? `${item.name}: ${rate}，较 ${prevDate || "上次"} 无变化`
        : `${item.name}: ${prevRate} -> ${rate} (${date})`;
  } else {
    message = `${item.name}: 首次记录 ${rate} (${date})`;
  }

  $.setdata(rate, rateKey);
  $.setdata(date, dateKey);
  $.log(message);
  return message;
}

function fetchMerchantRate(item, acceptLanguage) {
  return $.http
    .get({
      url: item.url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": acceptLanguage,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Cookie: COOKIE,
      },
    })
    .then((resp) => {
      if (!resp || resp.statusCode !== 200) {
        throw new Error(`请求失败，状态码: ${resp ? resp.statusCode : "unknown"}`);
      }
      const rate = extractRateFromHtml(resp.body || "", item.label);
      if (!rate) throw new Error(`未找到 ${item.label} 对应返现信息`);
      return rate;
    });
}

function extractRateFromHtml(html, targetLabel) {
  const cardReg =
    /<div class="merch-rate-card"[\s\S]*?<span class="merch-cat__sub-cat">\s*([^<]+?)\s*<\/span>[\s\S]*?<span class="merch-cat__rate">\s*([^<]+?)\s*<\/span>/gi;
  let match;
  while ((match = cardReg.exec(html)) !== null) {
    const label = normalizeText(match[1]);
    const rate = normalizeText(match[2]);
    if (label === targetLabel) return rate;
  }
  return "";
}

function normalizeText(text) {
  return String(text || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function Env(name) {
  class Http {
    constructor(env) {
      this.env = env;
    }
    send(opts, method = "GET") {
      opts = typeof opts === "string" ? { url: opts } : opts;
      const fn = method === "POST" ? this.post : this.get;
      return new Promise((resolve, reject) => {
        fn.call(this, opts, (err, resp) => {
          if (err) reject(err);
          else resolve(resp);
        });
      });
    }
    get(opts) {
      return this.send.call(this.env, opts);
    }
    post(opts) {
      return this.send.call(this.env, opts, "POST");
    }
  }

  return new (class {
    constructor(name) {
      this.name = name;
      this.http = new Http(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.logSeparator = "\n";
      this.startTime = Date.now();
      this.log("", `🔔${this.name}, 开始!`);
    }
    isNode() {
      return typeof module !== "undefined" && !!module.exports;
    }
    isQuanX() {
      return typeof $task !== "undefined";
    }
    isSurge() {
      return typeof $environment !== "undefined" && !!$environment["surge-version"];
    }
    isLoon() {
      return typeof $loon !== "undefined";
    }
    isShadowrocket() {
      return typeof $rocket !== "undefined";
    }
    isStash() {
      return typeof $environment !== "undefined" && !!$environment["stash-version"];
    }
    loaddata() {
      if (!this.isNode()) return {};
      this.fs = this.fs || require("fs");
      this.path = this.path || require("path");
      const f1 = this.path.resolve(this.dataFile);
      const f2 = this.path.resolve(process.cwd(), this.dataFile);
      const file = this.fs.existsSync(f1) ? f1 : this.fs.existsSync(f2) ? f2 : null;
      if (!file) return {};
      try {
        return JSON.parse(this.fs.readFileSync(file));
      } catch {
        return {};
      }
    }
    writedata() {
      if (!this.isNode()) return;
      this.fs = this.fs || require("fs");
      this.path = this.path || require("path");
      const file = this.path.resolve(this.dataFile);
      this.fs.writeFileSync(file, JSON.stringify(this.data));
    }
    getdata(key) {
      return this.getval(key);
    }
    setdata(val, key) {
      return this.setval(val, key);
    }
    getval(key) {
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) return $persistentStore.read(key);
      if (this.isQuanX()) return $prefs.valueForKey(key);
      if (this.isNode()) {
        this.data = this.loaddata();
        return this.data[key];
      }
      return null;
    }
    setval(val, key) {
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) return $persistentStore.write(val, key);
      if (this.isQuanX()) return $prefs.setValueForKey(val, key);
      if (this.isNode()) {
        this.data = this.loaddata();
        this.data[key] = val;
        this.writedata();
        return true;
      }
      return false;
    }
    get(opts, cb = () => {}) {
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) {
        $httpClient.get(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body;
            resp.statusCode = resp.status || resp.statusCode;
          }
          cb(err, resp, body);
        });
      } else if (this.isQuanX()) {
        $task.fetch(opts).then(
          (resp) => cb(null, { status: resp.statusCode, statusCode: resp.statusCode, headers: resp.headers, body: resp.body }, resp.body),
          (err) => cb(err && err.error ? err.error : err)
        );
      } else if (this.isNode()) {
        const got = require("got");
        const iconv = require("iconv-lite");
        got(opts).then(
          (resp) =>
            cb(null, { status: resp.statusCode, statusCode: resp.statusCode, headers: resp.headers, body: iconv.decode(resp.rawBody, "utf-8") }),
          (err) => cb(err.message, err.response, err.response && iconv.decode(err.response.rawBody, "utf-8"))
        );
      }
    }
    post(opts, cb = () => {}) {
      opts.method = opts.method || "POST";
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) {
        $httpClient.post(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body;
            resp.statusCode = resp.status || resp.statusCode;
          }
          cb(err, resp, body);
        });
      } else if (this.isQuanX()) {
        $task.fetch(opts).then(
          (resp) => cb(null, { status: resp.statusCode, statusCode: resp.statusCode, headers: resp.headers, body: resp.body }, resp.body),
          (err) => cb(err && err.error ? err.error : err)
        );
      } else if (this.isNode()) {
        const got = require("got");
        const iconv = require("iconv-lite");
        const { url, ...rest } = opts;
        got.post(url, rest).then(
          (resp) =>
            cb(null, { status: resp.statusCode, statusCode: resp.statusCode, headers: resp.headers, body: iconv.decode(resp.rawBody, "utf-8") }),
          (err) => cb(err.message, err.response, err.response && iconv.decode(err.response.rawBody, "utf-8"))
        );
      }
    }
    time(fmt, ts = null) {
      const d = ts ? new Date(ts) : new Date();
      const map = { "M+": d.getMonth() + 1, "d+": d.getDate(), "H+": d.getHours(), "m+": d.getMinutes(), "s+": d.getSeconds() };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, `${d.getFullYear()}`.slice(4 - RegExp.$1.length));
      for (const k in map) {
        if (new RegExp(`(${k})`).test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? map[k] : `00${map[k]}`.slice(`${map[k]}`.length));
        }
      }
      return fmt;
    }
    msg(title = this.name, subt = "", desc = "", opts) {
      const toEnvOpts = (x) => {
        if (!x) return x;
        if (typeof x === "string") return this.isQuanX() ? { "open-url": x } : { url: x };
        if (this.isQuanX()) return { "open-url": x["open-url"] || x.url || x.openUrl };
        return { url: x.url || x["open-url"] || x.openUrl };
      };
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) $notification.post(title, subt, desc, toEnvOpts(opts));
      if (this.isQuanX()) $notify(title, subt, desc, toEnvOpts(opts));
      this.log("", "==============📣系统通知📣==============", title, subt, desc);
    }
    log(...args) {
      if (args.length) this.logs = this.logs.concat(args);
      console.log(args.join(this.logSeparator));
    }
    logErr(err) {
      this.log("", `❗️${this.name}, 错误!`, this.isNode() && err.stack ? err.stack : err);
    }
    done(val = {}) {
      const cost = (Date.now() - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${cost} 秒`, "");
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isQuanX() || this.isStash()) $done(val);
    }
  })(name);
}
