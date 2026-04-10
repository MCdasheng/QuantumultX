// 脚本功能: 监控 TopCashBack 多地区返现比例
// [task_local]
// 0 */6 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/TopCashBack/tcb.js, tag=TopCashBack 返现监控, enabled=true

const $ = new Env("TopCashBack");

const COOKIE =
  "TCB_SessionID8=110df70b-0a3a-4ebf-a94e-908c0e8edc67; ReferralID=8034864; CookiesEnabled=true; _conv_v=vi%3A1*sc%3A2*cs%3A1775201576*fs%3A1775120961*pv%3A2*exp%3A%7B%7D*ps%3A1775120961; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Apr+03+2026+15%3A32%3A57+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=202505.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fwww.topcashback.de%2Favira%2F&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0";

const REGIONS = {
  DE: {
    flag: "🇩🇪",
    acceptLanguage: "de-DE,de;q=0.9,en;q=0.8,zh-CN;q=0.7",
    storePrefix: "tcb_de",
  },
  FR: {
    flag: "🇫🇷",
    acceptLanguage: "fr-FR,fr;q=0.9,en;q=0.8,zh-CN;q=0.7",
    storePrefix: "tcb_fr",
  },
  US: {
    flag: "🇺🇸",
    acceptLanguage: "en-US,en;q=0.9,zh-CN;q=0.7",
    storePrefix: "tcb_us",
  },
};

const MERCHANTS = [
  {
    region: "DE",
    name: "Avira",
    url: "https://www.topcashback.de/avira/",
    title: "Avira Cashback",
  },
  {
    region: "DE",
    name: "Norton Antivirus",
    url: "https://www.topcashback.de/norton-antivirus/",
    title: "Norton Antivirus Cashback",
  },
  {
    region: "DE",
    name: "NordVPN",
    url: "https://www.topcashback.de/nordvpn/",
    title: "NordVPN Cashback",
  },
  {
    region: "DE",
    name: "Private Internet Access",
    url: "https://www.topcashback.de/private-internet-access/",
    title: "Private Internet Access Cashback",
  },
  {
    region: "DE",
    name: "PureVPN",
    url: "https://www.topcashback.de/purevpn/",
    title: "PureVPN Cashback",
  },
  {
    region: "DE",
    name: "Surfshark",
    url: "https://www.topcashback.de/surfshark/",
    title: "Surfshark Cashback",
  },
  {
    region: "FR",
    name: "Surfshark",
    url: "https://www.topcashback.fr/surfshark/",
    title: "Cashback Surfshark",
  },
  {
    region: "FR",
    name: "Private Internet Access",
    url: "https://www.topcashback.fr/private-internet-access/",
    title: "Cashback Private Internet Access",
  },
  {
    region: "FR",
    name: "Norton",
    url: "https://www.topcashback.fr/norton/",
    title: "Cashback Norton",
  },
  {
    region: "US",
    name: "PureVPN",
    url: "https://www.topcashback.com/purevpn/",
    title: "PureVPN Cash Back",
  },
  {
    region: "US",
    name: "Private Internet Access",
    url: "https://www.topcashback.com/private-internet-access/",
    title: "Private Internet Access Cash Back",
  },
  {
    region: "US",
    name: "Norton",
    url: "https://www.topcashback.com/norton-cps/",
    title: "Norton Cash Back",
  },
  {
    region: "US",
    name: "NordVPN",
    url: "https://www.topcashback.com/nordvpn/",
    title: "NordVPN Cash Back",
  },
].map((merchant) => ({
  ...merchant,
  id: getMerchantIdFromUrl(merchant.url),
}));

!(async () => {
  const entries = [];

  for (let index = 0; index < MERCHANTS.length; index++) {
    const merchant = MERCHANTS[index];
    try {
      entries.push(await checkMerchant(merchant, index));
    } catch (error) {
      const text = `${getDisplayName(merchant)}: 获取失败`;
      $.log(`${text} (${error.message || String(error)})`);
      entries.push(createMessageEntry(text, null, index));
    }
  }

  $.msg($.name, "关注列表", buildNotificationMessage(entries), {
    "open-url": MERCHANTS[0] ? MERCHANTS[0].url : "",
  });
})()
  .catch((error) => {
    $.logErr(error);
    $.msg($.name, "执行失败", error.message || String(error));
  })
  .finally(() => $.done());

async function checkMerchant(merchant, index) {
  const region = getRegionConfig(merchant.region);
  const rate = await fetchMerchantRate(merchant, region.acceptLanguage);
  const rateKey = `${region.storePrefix}_${merchant.id}_rate`;
  const dateKey = `${region.storePrefix}_${merchant.id}_date`;
  const prevRate = $.getdata(rateKey);
  const date = $.time("M月d日");

  const marker = getRateMarker(rate);
  const message =
    prevRate && prevRate !== rate
      ? `${marker}${getDisplayName(merchant)}: ${prevRate} -> ${rate}`
      : `${marker}${getDisplayName(merchant)}: ${rate}`;

  $.setdata(rate, rateKey);
  $.setdata(date, dateKey);
  $.log(message);
  return createMessageEntry(message, rate, index);
}

function fetchMerchantRate(merchant, acceptLanguage) {
  return $.http
    .get({
      url: merchant.url,
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

      const result = extractRateFromHtml(resp.body || "", merchant.title);
      if (!result.rate) {
        throw new Error(
          `未找到 ${merchant.title} 对应返现信息\n${result.debugText || "无可用调试文本"}`
        );
      }
      return result.rate;
    });
}

function extractRateFromHtml(html, targetTitle) {
  const titleReg = /<h2 class="merch-cat__title">[\s\S]*?<\/h2>/gi;
  const titleMatches = Array.from(html.matchAll(titleReg));
  const titles = [];

  for (let i = 0; i < titleMatches.length; i++) {
    const match = titleMatches[i];
    const title = normalizeText(stripHtml(match[0]));
    if (title) titles.push(title);
    if (title !== targetTitle) continue;

    const start = match.index;
    const nextMatch = titleMatches[i + 1];
    const end = nextMatch ? nextMatch.index : html.length;
    const cardHtml = html.slice(start, end);

    const rate = extractMaxCardRate(cardHtml);
    if (rate) return { rate, debugText: buildCardDebugText(title, cardHtml) };
    return { rate: "", debugText: buildCardDebugText(title, cardHtml) };
  }

  return {
    rate: "",
    debugText: `已识别标题: ${titles.length ? titles.join(" | ") : "无"}`,
  };
}

function extractMaxCardRate(cardHtml) {
  const rateReg = /<span class="merch-cat__rate">\s*([^<]+?)\s*<\/span>/gi;
  let match;
  let maxRate = null;

  while ((match = rateReg.exec(cardHtml)) !== null) {
    const numericRate = parseRateValue(normalizeText(match[1]));
    if (numericRate === null) continue;
    if (maxRate === null || numericRate > maxRate) {
      maxRate = numericRate;
    }
  }

  return maxRate === null ? "" : `${formatRateValue(maxRate)}%`;
}

function parseRateValue(rateText) {
  const cleaned = String(rateText || "")
    .replace(/%/g, "")
    .replace(/\s+/g, "")
    .replace(",", ".");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function formatRateValue(value) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function getRateMarker(rate) {
  const value = parseRateValue(rate);
  return value !== null && value >= 100 ? "💯 " : "";
}

function createMessageEntry(text, rate, index) {
  const value = parseRateValue(rate);
  return {
    text,
    index,
    isTopRate: value !== null && value >= 100,
  };
}

function buildNotificationMessage(entries) {
  const topRates = [];
  const normalRates = [];

  for (const entry of entries) {
    if (entry.isTopRate) topRates.push(entry.text);
    else normalRates.push(entry.text);
  }

  return topRates.concat(normalRates).join("\n");
}

function getRegionConfig(region) {
  const config = REGIONS[region];
  if (!config) throw new Error(`未配置地区: ${region}`);
  return config;
}

function getDisplayName(merchant) {
  return `${getRegionConfig(merchant.region).flag}${merchant.name}`;
}

function getMerchantIdFromUrl(url) {
  return String(url || "")
    .replace(/\/+$/, "")
    .split("/")
    .pop();
}

function stripHtml(text) {
  return String(text || "").replace(/<[^>]*>/g, " ");
}

function buildCardDebugText(title, cardHtml) {
  return `命中标题: ${title}\n卡片文本: ${normalizeText(stripHtml(cardHtml))}`;
}

function normalizeText(text) {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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
