// Script: TopCashBack referral monitor (AU/US/DE/IT/FR/UK)
// [task_local]
// 0 */6 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/TopCashBack/tcb_aff.js, tag=TopCashBack 邀请奖励监控, enabled=true

const $ = new Env("TopCashBack Referral");

const COOKIE = "";

const REGIONS = {
  AU: {
    flag: "🇦🇺",
    name: "AU",
    storePrefix: "tcb_aff_au",
    acceptLanguage: "en-AU,en;q=0.9",
    currencyHints: ["$"],
    urls: ["https://www.topcashback.com.au/tellafriend"],
  },
  US: {
    flag: "🇺🇸",
    name: "US",
    storePrefix: "tcb_aff_us",
    acceptLanguage: "en-US,en;q=0.9",
    currencyHints: ["$"],
    urls: ["https://www.topcashback.com/tellafriend"],
  },
  DE: {
    flag: "🇩🇪",
    name: "DE",
    storePrefix: "tcb_aff_de",
    acceptLanguage: "de-DE,de;q=0.9,en;q=0.8",
    currencyHints: ["€"],
    urls: ["https://www.topcashback.de/tellafriend"],
  },
  IT: {
    flag: "🇮🇹",
    name: "IT",
    storePrefix: "tcb_aff_it",
    acceptLanguage: "it-IT,it;q=0.9,en;q=0.8",
    currencyHints: ["€"],
    urls: ["https://www.topcashback.it/tellafriend"],
  },
  FR: {
    flag: "🇫🇷",
    name: "FR",
    storePrefix: "tcb_aff_fr",
    acceptLanguage: "fr-FR,fr;q=0.9,en;q=0.8",
    currencyHints: ["€"],
    urls: ["https://www.topcashback.fr/tellafriend"],
  },
  UK: {
    flag: "🇬🇧",
    name: "UK",
    storePrefix: "tcb_aff_uk",
    acceptLanguage: "en-GB,en;q=0.9",
    currencyHints: ["£"],
    urls: [],
  },
};

const REGION_ORDER = ["AU", "US", "DE", "IT", "FR", "UK"];

!(async () => {
  const entries = [];
  for (let i = 0; i < REGION_ORDER.length; i++) {
    const code = REGION_ORDER[i];
    const region = REGIONS[code];
    try {
      entries.push(await checkRegion(region));
    } catch (error) {
      const text = `${region.flag}${region.name}: 获取失败`;
      $.log(`${text} (${error.message || String(error)})`);
      logFailureHints(region, error);
      entries.push({ text, sortValue: -1 });
    }
  }

  $.msg($.name, "", buildNotificationMessage(entries), {
    "open-url": REGIONS.AU.urls[0],
  });
})()
  .catch((error) => {
    $.logErr(error);
    $.msg($.name, "执行失败", error.message || String(error));
  })
  .finally(() => $.done());

async function checkRegion(region) {
  const result = await fetchRegionReward(region);
  const rewardKey = `${region.storePrefix}_reward`;
  const dateKey = `${region.storePrefix}_date`;
  const displayReward = formatDisplayReward(region, result.reward);
  const prevReward = $.getdata(rewardKey);
  const date = $.time("MM-dd");
  const text =
    prevReward && prevReward !== displayReward
      ? `${region.flag}${region.name}: ${prevReward} -> ${displayReward}`
      : `${region.flag}${region.name}: ${displayReward}`;

  $.setdata(displayReward, rewardKey);
  $.setdata(date, dateKey);
  $.log(`${text} [${result.source}]`);
  if (Array.isArray(result.matches) && result.matches.length) {
    for (const item of result.matches) {
      const tag = item.tag ? `(${item.tag})` : "";
      if (region.name === "UK") {
        $.log(`${region.flag}${region.name}${tag} reward: ${formatDisplayReward(region, item.reward)}`);
      }
      if (item.matchedText) {
        $.log(`${region.flag}${region.name}${tag} matched: ${item.matchedText}`);
      }
      if (region.name === "UK" && item.reward === "0") {
        $.log(`${region.flag}${region.name}${tag} failed: ${item.reason || "未知原因"}`);
      }
    }
  } else if (result.matchedText) {
    $.log(`${region.flag}${region.name} matched: ${result.matchedText}`);
  }
  return {
    text,
    sortValue: getRewardSortValue(displayReward),
  };
}

async function fetchRegionReward(region) {
  if (region.name === "UK") {
    return fetchUkRegionReward(region);
  }

  const urls = getRegionUrls(region);
  let lastError = null;
  const matches = [];
  const debugHints = [];
  for (const url of urls) {
    try {
      const html = await fetchHtml(url, region.acceptLanguage);
      const parsed = extractRewardFromHtml(html, region.currencyHints, getNumberFormat(region));
      const snippets = collectSymbolSnippets(html, region.currencyHints, 3);
      debugHints.push({ url, snippets });
      if (parsed.reward) {
        matches.push({
          reward: parsed.reward,
          source: url,
          tag: getSourceTag(url),
          matchedText: parsed.matchedText,
        });
        return {
          reward: parsed.reward,
          source: url,
          matchedText: parsed.matchedText,
          matches,
        };
      }
      lastError = new Error("未匹配到邀请奖励金额");
    } catch (error) {
      lastError = error;
      debugHints.push({ url, snippets: [] });
    }
  }
  const finalError = lastError || new Error("未知错误");
  finalError.debugHints = debugHints;
  throw finalError;
}

async function fetchUkRegionReward(region) {
  const urls = getRegionUrls(region);
  const matches = [];

  for (const url of urls) {
    const tag = getSourceTag(url);
    try {
      const html = await fetchHtml(url, region.acceptLanguage);
      const parsed = extractRewardFromHtml(html, region.currencyHints, getNumberFormat(region));
      if (parsed.reward) {
        matches.push({
          tag,
          source: url,
          reward: parsed.reward,
          matchedText: parsed.matchedText,
          reason: "",
        });
      } else {
        matches.push({
          tag,
          source: url,
          reward: "0",
          matchedText: "",
          reason: "未匹配到金额",
        });
      }
    } catch (error) {
      matches.push({
        tag,
        source: url,
        reward: "0",
        matchedText: "",
        reason: error && error.message ? error.message : String(error),
      });
    }
  }

  let bestReward = "0";
  let bestValue = -1;
  for (const item of matches) {
    if (item.reward === "0") continue;
    const value = parseAmountValue(item.reward);
    if (value > bestValue) {
      bestValue = value;
      bestReward = item.reward;
    }
  }

  return {
    reward: bestReward,
    source: matches[0] ? matches[0].source : (urls[0] || ""),
    matches,
    matchedText: "",
  };
}

function getRegionUrls(region) {
  if (region && region.name === "UK") return buildUkUrls();
  return region.urls || [];
}

function buildUkUrls() {
  const monthSlugs = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const now = new Date();
  const monthSlug = monthSlugs[now.getMonth()];
  const year = now.getFullYear();
  return [
    `https://www.topcashback.co.uk/blog/${monthSlug}-taf-offer-${year}/`,
    "https://www.topcashback.co.uk/TellAFriend?nid=0",
    "https://www.topcashback.co.uk/category/travel/",
  ];
}

function getSourceTag(url) {
  const text = String(url || "").toLowerCase();
  if (text.includes("/blog/")) return "blog";
  if (text.includes("/tellafriend")) return "tellafriend";
  if (text.includes("/category/travel/")) return "travel";
  return "source";
}

function getNumberFormat(region) {
  return region && region.name === "IT" ? "eu" : "default";
}

function fetchHtml(url, acceptLanguage) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": acceptLanguage,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
  if (COOKIE) headers.Cookie = COOKIE;

  return $.http
    .get({
      url,
      headers,
    })
    .then((resp) => {
      if (!resp || resp.statusCode !== 200) {
        throw new Error(`请求失败，状态码: ${resp ? resp.statusCode : "unknown"}`);
      }
      return resp.body || "";
    });
}

function extractRewardFromHtml(html, currencyHints, numberFormat) {
  const text = normalizeText(stripHtml(htmlEntityDecode(removeScriptAndStyle(html))));
  const amountReg =
    /(?:(?:A\$|AU\$|US\$|£|€|\$)\s?\d{1,4}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?|\d{1,4}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?\s?(?:€|£|\$))/g;
  const candidates = [];
  let match;

  while ((match = amountReg.exec(text)) !== null) {
    const amount = normalizeAmountToken(match[0], numberFormat);
    if (!isCurrencyMatch(amount, currencyHints)) continue;

    const index = match.index;
    const left = Math.max(0, index - 80);
    const right = Math.min(text.length, index + 100);
    const rawContext = normalizeText(text.slice(left, right));
    const context = rawContext.toLowerCase();
    const numericValue = parseAmountValue(amount);
    const score = getContextScore(context);

    if (score > 0) {
      candidates.push({ amount, score, index, matchedText: rawContext, numericValue });
    }
  }

  if (!candidates.length) return { reward: "", matchedText: "" };
  candidates.sort((a, b) => b.numericValue - a.numericValue || b.score - a.score || a.index - b.index);
  return {
    reward: candidates[0].amount,
    matchedText: candidates[0].matchedText,
  };
}

function getContextScore(context) {
  let score = 0;
  if (
    /refer|referral|tell[-\s]?a[-\s]?friend|invite|invita|invitar|einladen|werben|parrain|parrainage|invitez/.test(
      context
    )
  )
    score += 4;
  if (/friend|friends|amico|amici|freund|freunde|amis|famille/.test(context)) score += 3;
  if (
    /earn|earned|get|receive|reward|bonus|premio|belohnung|pr(a|ä)mie|erhalten|verdient|ricev|ottieni|gagnez|recevez|gratuit/.test(
      context
    )
  )
    score += 2;
  if (/per friend|each friend|for each|pro freund|pour chaque ami|per ogni amico/.test(context)) score += 2;
  return score;
}

function isCurrencyMatch(amount, hints) {
  if (!Array.isArray(hints) || !hints.length) return true;
  for (const hint of hints) {
    if (amount.includes(hint)) return true;
  }
  return false;
}

function normalizeAmountToken(token, numberFormat) {
  const raw = String(token || "")
    .replace(/AU\$/g, "$")
    .replace(/US\$/g, "$")
    .replace(/\s+/g, "")
    .trim();
  const prefix = raw.match(/^(€|£|\$)(.+)$/);
  if (prefix) return `${prefix[1]}${normalizeLocaleNumber(prefix[2], numberFormat)}`;
  const suffix = raw.match(/^(.+)(€|£|\$)$/);
  if (suffix) return `${suffix[2]}${normalizeLocaleNumber(suffix[1], numberFormat)}`;
  return normalizeLocaleNumber(raw, numberFormat);
}

function normalizeLocaleNumber(text, numberFormat) {
  let n = String(text || "").replace(/\s+/g, "");
  if (!n) return n;

  if (numberFormat === "eu") {
    if (n.includes(".") && n.includes(",")) {
      n = n.replace(/\./g, "").replace(",", ".");
    } else if (n.includes(".")) {
      if (/^\d{1,3}(?:\.\d{3})+$/.test(n)) n = n.replace(/\./g, "");
    } else if (n.includes(",")) {
      if (/^\d{1,3}(?:,\d{3})+$/.test(n)) n = n.replace(/,/g, "");
      else n = n.replace(",", ".");
    }
  } else {
    if (n.includes(",") && n.includes(".")) {
      n = n.replace(/,/g, "");
    } else if (n.includes(",")) {
      if (/^\d{1,3}(?:,\d{3})+$/.test(n)) n = n.replace(/,/g, "");
      else n = n.replace(",", ".");
    }
  }

  if (/^\d+\.0+$/.test(n)) n = n.replace(/\.0+$/, "");
  return n;
}

function formatDisplayReward(region, reward) {
  if (!reward) return reward;
  if (region && region.name === "AU" && reward.startsWith("$")) return `AU${reward}`;
  return reward;
}

function parseAmountValue(amount) {
  const text = String(amount || "").replace(/[^\d.,]/g, "").trim();
  if (!text) return 0;
  if (/^\d{1,3}(?:\.\d{3})+$/.test(text)) {
    const n = Number(text.replace(/\./g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  if (/^\d{1,3}(?:,\d{3})+$/.test(text)) {
    const n = Number(text.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  const normalized = text.replace(/\.(?=\d{3}\b)/g, "").replace(/,/g, ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

function getCurrencyRate(text) {
  const t = String(text || "");
  if (t.startsWith("AU$")) return 0.65;
  if (t.includes("£")) return 1.27;
  if (t.includes("€")) return 1.1;
  return 1;
}

function getRewardSortValue(rewardText) {
  const parts = String(rewardText || "").split("|");
  let best = -1;
  for (const partRaw of parts) {
    const part = partRaw.trim();
    if (!part || part === "0") continue;
    const value = parseAmountValue(part) * getCurrencyRate(part);
    if (value > best) best = value;
  }
  return best;
}

function buildNotificationMessage(entries) {
  return entries
    .slice()
    .sort((a, b) => b.sortValue - a.sortValue)
    .map((item) => item.text)
    .join("\n");
}

function collectSymbolSnippets(html, currencyHints, maxCount) {
  const text = normalizeText(stripHtml(htmlEntityDecode(removeScriptAndStyle(html))));
  const snippets = [];
  const hints = Array.isArray(currencyHints) && currencyHints.length ? currencyHints : ["$", "€", "£"];

  for (const hint of hints) {
    const escaped = escapeRegExp(hint);
    const reg = new RegExp(escaped, "g");
    let match;
    while ((match = reg.exec(text)) !== null) {
      const left = Math.max(0, match.index - 60);
      const right = Math.min(text.length, match.index + 120);
      snippets.push(normalizeText(text.slice(left, right)));
      if (snippets.length >= maxCount) return snippets;
    }
  }
  return snippets;
}

function logFailureHints(region, error) {
  const hints = error && Array.isArray(error.debugHints) ? error.debugHints : [];
  if (!hints.length) return;
  for (const item of hints) {
    $.log(`${region.flag}${region.name} source: ${item.url}`);
    if (item.snippets && item.snippets.length) {
      for (const snippet of item.snippets) {
        $.log(`${region.flag}${region.name} near-symbol: ${snippet}`);
      }
    }
  }
}

function escapeRegExp(text) {
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeScriptAndStyle(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
}

function stripHtml(text) {
  return String(text || "").replace(/<[^>]*>/g, " ");
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlEntityDecode(text) {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&euro;|&#8364;|&#x20ac;/gi, "€")
    .replace(/&pound;|&#163;|&#x00a3;/gi, "£")
    .replace(/&#36;|&#x24;/gi, "$")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
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
      this.log("", "==============系统通知==============", title, subt, desc);
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
      this.log("", `🔔${this.name}, 结束! 🕛 ${cost} 秒`);
      if (this.isSurge() || this.isLoon() || this.isShadowrocket() || this.isQuanX() || this.isStash()) $done(val);
    }
  })(name);
}
