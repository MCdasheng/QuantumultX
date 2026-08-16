// 脚本功能: 监控 TopCashBack 英国站返现比例
// [task_local]
// 0 */6 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/TopCashBack/tcb_uk.js, tag=TopCashBack UK 返现监控, enabled=true

const $ = new Env("TopCashBack UK");

const COOKIE =
  "TCB_SessionID8=110df70b-0a3a-4ebf-a94e-908c0e8edc67; ReferralID=8034864; CookiesEnabled=true; _conv_v=vi%3A1*sc%3A2*cs%3A1775201576*fs%3A1775120961*pv%3A2*exp%3A%7B%7D*ps%3A1775120961; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Apr+03+2026+15%3A32%3A57+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=202505.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fwww.topcashback.de%2Favira%2F&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0";

const MONITORS = [
  {
    id: "cyberghost-vpn",
    name: "CyberGhost VPN",
    url: "https://www.topcashback.co.uk/cyberghost-vpn/",
    title: "Cyberghost VPN Cashback",
  },
  {
    id: "avira",
    name: "Avira",
    url: "https://www.topcashback.co.uk/avira/",
    title: "Avira Cashback",
  },
  {
    id: "nordvpn",
    name: "NordVPN",
    url: "https://www.topcashback.co.uk/nordvpn/",
    title: "NordVPN Cashback",
  },
];

!(async () => {
  const entries = [];
  for (let index = 0; index < MONITORS.length; index++) {
    const item = MONITORS[index];
    try {
      entries.push(await checkMerchant(item, "tcb_uk", index));
    } catch (error) {
      const text = `${item.name}: 获取失败 (${error.message || String(error)})`;
      $.log(text);
      entries.push(createMessageEntry(text, null, index));
    }
  }
  $.msg($.name, "关注列表", buildNotificationMessage(entries), {
    "open-url": MONITORS[0] ? MONITORS[0].url : "",
  });
})()
  .catch((error) => {
    $.logErr(error);
    $.msg($.name, "执行失败", error.message || String(error));
  })
  .finally(() => $.done());

async function checkMerchant(item, prefix, index) {
  const rate = await fetchMerchantRate(item, "en-GB,en;q=0.9,zh-CN;q=0.7");
  const rateKey = `${prefix}_${item.id}_rate`;
  const dateKey = `${prefix}_${item.id}_date`;
  const prevRate = $.getdata(rateKey);
  const marker = getRateMarker(rate);
  const message = prevRate && prevRate !== rate ? `${marker}${item.name}: ${prevRate} -> ${rate}` : `${marker}${item.name}: ${rate}`;

  $.setdata(rate, rateKey);
  $.setdata($.time("M月d日"), dateKey);
  $.log(message);
  return createMessageEntry(message, rate, index);
}

function fetchMerchantRate(item, acceptLanguage) {
  return $.http
    .get({
      url: item.url,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": acceptLanguage,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Cookie: COOKIE,
      },
    })
    .then((resp) => {
      if (!resp || resp.statusCode !== 200) throw new Error(`请求失败，状态码: ${resp ? resp.statusCode : "unknown"}`);
      const result = extractRateFromHtml(resp.body || "", item.title);
      if (!result.rate) throw new Error(`未找到 ${item.title} 对应返现信息\n${result.debugText || "无可用调试文本"}`);
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

    const nextMatch = titleMatches[i + 1];
    const cardHtml = html.slice(match.index, nextMatch ? nextMatch.index : html.length);
    return { rate: extractMaxCardRate(cardHtml), debugText: buildCardDebugText(title, cardHtml) };
  }
  return { rate: "", debugText: `已识别标题: ${titles.length ? titles.join(" | ") : "无"}` };
}

function extractMaxCardRate(cardHtml) {
  const rateReg = /<span class="merch-cat__rate">\s*([^<]+?)\s*<\/span>/gi;
  let match;
  let maxRate = null;
  while ((match = rateReg.exec(cardHtml)) !== null) {
    const value = parseRateValue(normalizeText(match[1]));
    if (value !== null && (maxRate === null || value > maxRate)) maxRate = value;
  }
  return maxRate === null ? "" : `${maxRate}%`;
}

function parseRateValue(rateText) {
  const value = Number(String(rateText || "").replace(/%/g, "").replace(/\s+/g, "").replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function getRateMarker(rate) {
  const value = parseRateValue(rate);
  return value !== null && value >= 100 ? "💯 " : "";
}

function createMessageEntry(text, rate, index) {
  const value = parseRateValue(rate);
  return { text, index, isTopRate: value !== null && value >= 100 };
}

function buildNotificationMessage(entries) {
  const topRates = [];
  const normalRates = [];
  for (const entry of entries) (entry.isTopRate ? topRates : normalRates).push(entry.text);
  return topRates.concat(normalRates).join("\n");
}

function stripHtml(text) {
  return String(text || "").replace(/<[^>]*>/g, " ");
}

function buildCardDebugText(title, cardHtml) {
  return `命中标题: ${title}\n卡片文本: ${normalizeText(stripHtml(cardHtml))}`;
}

function normalizeText(text) {
  return String(text || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function Env(name) {
  class Http {
    constructor(env) { this.env = env; }
    get(opts) { return new Promise((resolve, reject) => this.env.get(opts, (err, resp) => (err ? reject(err) : resolve(resp)))); }
  }

  return new (class {
    constructor(name) {
      this.name = name;
      this.http = new Http(this);
      this.startTime = Date.now();
      this.log(`🔔${this.name}, 开始!`);
    }
    isQuanX() { return typeof $task !== "undefined"; }
    isSurge() { return typeof $environment !== "undefined" && !!$environment["surge-version"]; }
    isLoon() { return typeof $loon !== "undefined"; }
    isShadowrocket() { return typeof $rocket !== "undefined"; }
    isStash() { return typeof $environment !== "undefined" && !!$environment["stash-version"]; }
    getdata(key) {
      if (this.isQuanX()) return $prefs.valueForKey(key);
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) return $persistentStore.read(key);
      return null;
    }
    setdata(value, key) {
      if (this.isQuanX()) return $prefs.setValueForKey(value, key);
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) return $persistentStore.write(value, key);
      return false;
    }
    get(opts, cb) {
      if (this.isQuanX()) {
        $task.fetch(opts).then(
          (resp) => cb(null, { statusCode: resp.statusCode, headers: resp.headers, body: resp.body }),
          (err) => cb(err && err.error ? err.error : err)
        );
      } else if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) {
        $httpClient.get(opts, (err, resp, body) => {
          if (resp) { resp.statusCode = resp.status || resp.statusCode; resp.body = body; }
          cb(err, resp);
        });
      } else cb(new Error("不支持的运行环境"));
    }
    time(fmt, ts) {
      const date = ts ? new Date(ts) : new Date();
      const map = { "M+": date.getMonth() + 1, "d+": date.getDate(), "H+": date.getHours(), "m+": date.getMinutes(), "s+": date.getSeconds() };
      for (const key in map) if (new RegExp(`(${key})`).test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? map[key] : `00${map[key]}`.slice(-2));
      return fmt;
    }
    msg(title, subtitle, body, opts) {
      if (this.isQuanX()) $notify(title, subtitle, body, opts && { "open-url": opts["open-url"] || opts.url });
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) $notification.post(title, subtitle, body, opts && { url: opts.url || opts["open-url"] });
    }
    log(...args) { console.log(args.join("\n")); }
    logErr(err) { this.log(`❌${this.name}, 错误!`, err); }
    done(value) {
      this.log(`🔔${this.name}, 结束! 🕛 ${(Date.now() - this.startTime) / 1000} 秒`);
      if (this.isQuanX() || this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isStash()) $done(value || {});
    }
  })(name);
}
