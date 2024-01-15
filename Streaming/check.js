const $ = new Env("ChatGPT");
const BASE_URL = "https://www.netflix.com/title/";
const FILM_ID = 81280792;
const AREA_TEST_FILM_ID = 80018499;
const arrow = " ➟ ";
var result = "";

$.token = $.getdata("ipinfo_token") ? $.getdata("ipinfo_token") : "";

ChatGPT_Test()
  .catch((e) => $.logErr(e))
  .finally(async () => {
    $.log("ok");
    $.done();
  });

async function ChatGPT_Test() {
  var ip = await getIp();
  let chatGPT_regions = [
    "T1",
    "XX",
    "AL",
    "DZ",
    "AD",
    "AO",
    "AG",
    "AR",
    "AM",
    "AU",
    "AT",
    "AZ",
    "BS",
    "BD",
    "BB",
    "BE",
    "BZ",
    "BJ",
    "BT",
    "BA",
    "BW",
    "BR",
    "BG",
    "BF",
    "CV",
    "CA",
    "CL",
    "CO",
    "KM",
    "CR",
    "HR",
    "CY",
    "DK",
    "DJ",
    "DM",
    "DO",
    "EC",
    "SV",
    "EE",
    "FJ",
    "FI",
    "FR",
    "GA",
    "GM",
    "GE",
    "DE",
    "GH",
    "GR",
    "GD",
    "GT",
    "GN",
    "GW",
    "GY",
    "HT",
    "HN",
    "HU",
    "IS",
    "IN",
    "ID",
    "IQ",
    "IE",
    "IL",
    "IT",
    "JM",
    "JP",
    "JO",
    "KZ",
    "KE",
    "KI",
    "KW",
    "KG",
    "LV",
    "LB",
    "LS",
    "LR",
    "LI",
    "LT",
    "LU",
    "MG",
    "MW",
    "MY",
    "MV",
    "ML",
    "MT",
    "MH",
    "MR",
    "MU",
    "MX",
    "MC",
    "MN",
    "ME",
    "MA",
    "MZ",
    "MM",
    "NA",
    "NR",
    "NP",
    "NL",
    "NZ",
    "NI",
    "NE",
    "NG",
    "MK",
    "NO",
    "OM",
    "PK",
    "PW",
    "PA",
    "PG",
    "PE",
    "PH",
    "PL",
    "PT",
    "QA",
    "RO",
    "RW",
    "KN",
    "LC",
    "VC",
    "WS",
    "SM",
    "ST",
    "SN",
    "RS",
    "SC",
    "SL",
    "SG",
    "SK",
    "SI",
    "SB",
    "ZA",
    "ES",
    "LK",
    "SR",
    "SE",
    "CH",
    "TH",
    "TG",
    "TO",
    "TT",
    "TN",
    "TR",
    "TV",
    "UG",
    "AE",
    "US",
    "UY",
    "VU",
    "ZM",
    "BO",
    "BN",
    "CG",
    "CZ",
    "VA",
    "FM",
    "MD",
    "PS",
    "KR",
    "TW",
    "TZ",
    "TL",
    "GB",
  ];

  var options = {
    url: `https://chat.openai.com/cdn-cgi/trace`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      "Content-Type": "text/json",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    timeout: 5000,
  };

  return $.http.get(options).then(
    (resp) => {
      var body = resp.body;
      $.log(body);

      let lines = body.split("\n");
      let cf = lines.reduce((a, line) => {
        let [key, value] = line.split("=");
        a[key] = value;
        return a;
      }, {});

      var gpt_warp = cf.warp === "plus" || cf.warp === "on" ? "true" : "false";
      var gpt_ip;

      if (gpt_warp == true) {
        gpt_ip = "🟢WARP解锁";
      } else if (cf.ip == ip) {
        gpt_ip = "🎉原生解锁";
      } else {
        gpt_ip = "🟡代理解锁";
      }

      let gpt_country = getCountryFlagEmoji(cf.loc) + cf.loc;

      if (chatGPT_regions.indexOf(cf.loc) !== -1) {
        gpt = `${gpt_ip} ➟ ${gpt_country}`;
      } else {
        gpt = "🚫未解锁";
      }

      // $.log(ip);
      // $.log(gpt_ip);
      // $.log(gpt_warp);
      // $.log(gpt_country);
      $.log(gpt);

      var res = "------------------------------";

      res =
        res +
        "</br><b>" +
        "<font  color=>" +
        "🤖ChatGPT" +
        "</font> : " +
        "</b>" +
        "<font  color=>" +
        gpt +
        "</font></br>";

      res =
        res +
        "------------------------------" +
        `</br><font color=#6959CD><b>节点</b> ➟ ${$environment.params} </font>`;

      res =
        `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
        res +
        `</p>`;

      message = res;

      $done({
        title: "      ChatGPT 查询结果",
        htmlMessage: message,
      });
    },
    (reason) => {
      $.log("🔴ChatGPT test error");
      $.log(reason.error);
      $.done();
    }
  );
}

async function testNetflix() {
  try {
    netflix = await testNf(FILM_ID);
    if (result !== "Success") {
      netflix = await testNf(AREA_TEST_FILM_ID);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    var res = "------------------------------";

    res =
      res +
      "</br><b>" +
      "<font  color=>" +
      "📺Netflix" +
      "</font> : " +
      "</b>" +
      "<font  color=>" +
      netflix +
      "</font></br>";

    res =
      res +
      "------------------------------" +
      `</br><font color=#6959CD><b>节点</b> ➟ ${$environment.params} </font>`;

    res =
      `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
      res +
      `</p>`;

    message = res;

    $done({
      title: "      Netflix 查询结果",
      htmlMessage: message,
    });
  }
}

async function testNf(filmId) {
  let options = {
    url: BASE_URL + filmId,
    timeout: 5000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
    },
  };

  return $.http.get(options).then((response) => {
    if (filmId == FILM_ID) {
      $.log("Netflix Main Test...");
    } else {
      $.log("Netflix Region Test...");
    }

    if (response.statusCode === 404) {
      netflix = "🟡仅支持自制剧";
      result = "Original Only";
      $.log(netflix);
      return netflix;
    } else if (response.statusCode === 403) {
      netflix = "🚫未支持";
      result = "Not Available";
      $.log(netflix);
      return netflix;
    } else if (response.statusCode === 200) {
      let url = response.headers["X-Originating-URL"];
      let region = url.split("/")[3];
      region = region.split("-")[0];
      if (region == "title") {
        region = "us";
      }

      if (filmId == FILM_ID) {
        netflix =
          "🎉完整支持" +
          arrow +
          getCountryFlagEmoji(region.toUpperCase()) +
          region.toUpperCase();
      } else {
        netflix =
          "🟡仅支持自制剧" +
          arrow +
          getCountryFlagEmoji(region.toUpperCase()) +
          region.toUpperCase();
      }
      result = "Success";
      $.log(netflix);
      return netflix;
    }
  });
}

async function YouTube_Test() {
  var options = {
    url: `https://www.youtube.com/premium`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      "Content-Type": "text/html; charset=utf-8",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    timeout: 8000,
  };

  return $.http.get(options).then(
    (response) => {
      let body = response.body;
      // $.log(body);
      // $.log(response.statusCode);

      if (response.statusCode !== 200) {
        ytb = "检测失败❗️";
      } else if (
        body.indexOf("Premium is not available in your country") !== -1
      ) {
        ytb = "🚫未支持";
      } else {
        let region = "";
        let re = new RegExp('"GL":"(.*?)"', "gm");
        let ret = re.exec(body);
        if (ret != null && ret.length === 2) {
          region = ret[1];
        } else if (body.indexOf("www.google.cn") !== -1) {
          region = "CN";
        } else {
          region = "US";
        }
        ytb =
          "🎉支持 " +
          arrow +
          getCountryFlagEmoji(region) +
          region.toUpperCase();
      }

      console.log(ytb);

      var res = "------------------------------";

      res =
        res +
        "</br><b>" +
        "<font  color=>" +
        "📺YouTube Premium" +
        "</font> : " +
        "</b>" +
        "<font  color=>" +
        ytb +
        "</font></br>";

      res =
        res +
        "------------------------------" +
        `</br><font color=#6959CD><b>节点</b> ➟ ${$environment.params} </font>`;

      res =
        `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
        res +
        `</p>`;

      message = res;

      $done({
        title: "      YouTube 查询结果",
        htmlMessage: message,
      });
    },
    (reason) => {
      ytb = "<b>📺YouTube Premium: </b>🚦检测超时";
      //resolve("timeout")
    }
  );
}
async function Spotify_Test() {
  var options = {
    url: `https://spclient.wg.spotify.com/signup/public/v1/account`,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: "birth_day=11&birth_month=11&birth_year=2000&collect_personal_info=undefined&creation_flow=&creation_point=https%3A%2F%2Fwww.spotify.com%2Fhk-en%2F&displayname=Gay%20Lord&gender=male&iagree=1&key=a1e486e2729f46d6bb368d6b2bcda326&platform=www&referrer=&send-email=0&thirdpartyemail=0&identifier_token=AgE6YTvEzkReHNfJpO114514",
    timeout: 20000,
  };

  return $.http.post(options).then((resp) => {
    $.log(resp.body);
    var obj = JSON.parse(resp.body);
    if (obj.status == "320" || obj.status == "120") {
      spotify = "🔴No";
    } else if (obj.status == "311") {
      spotify_country = getCountryFlagEmoji(obj.country) + obj.country;
      spotify = "🎉Yes" + arrow + spotify_country;
    }
    $.log("🎵Spotify: " + spotify);
  });
}

function getCountryFlagEmoji(countryCode) {
  if (countryCode.toUpperCase() == "TW") {
    countryCode = "WS";
  }
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

async function getIp() {
  var options = {
    url: `https://ipinfo.io/json?token=${$.token}`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      "Content-Type": "application/json",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
  };

  return $.http.get(options).then((resp) => {
    $.log(resp.body);
    var obj = JSON.parse(resp.body);
    if (!obj.ip) {
      $.log("🔴ip查询失败!");
      $.log(resp.body);
      $.msg($.name, "🔴ip查询失败!");
      $.done();
    }
    return obj.ip;
  });
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.tocountryaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
