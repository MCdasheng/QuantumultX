/*
脚本功能: 哇哈体育签到
29 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/waha.js, img-url=figure.disc.sports.system, enabled=true
*/

const $ = init();
const cookie = $.getdata("waha_cookie");
if (!cookie) {
  $notify("cookie为空,请检查cookie!");
}

sign();

function sign() {
  let options = {
    url: "https://bbs.wahatiyu.com/plugin.php?id=gsignin:index&action=signin&formhash=ba019fd5",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
      cookie: cookie,
    },
  };

  $.get(options, (error, response, data) => {
    var exp1 = "!DOCTYPE";
    var exp2 = "System Error";
    var exp3 = "您当前的访问请求当中含有非法字符，已经被系统拒绝";
    var exp4 = "深感歉意";

    if (
      (data.search(exp1) ||
        data.search(exp2) ||
        data.search(exp3) ||
        data.search(exp4)) != -1
    ) {
      var reg = /parent\.showDialog\(\'(.*)function\(\)*\)/;
      var notice = reg.exec(data)[1];
      notice = "🟢" + notice;
      $.msg("哇哈体育", notice);
      $.log(notice);
      $.done();
    } else {
      var notice = "🔴签到失败!";
      $.msg("哇哈体育", notice);
      $.done();
    }
  });
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true;
  };
  isQuanX = () => {
    return undefined === this.$task ? false : true;
  };
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key);
    if (isQuanX()) return $prefs.valueForKey(key);
  };
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val);
    if (isQuanX()) return $prefs.setValueForKey(val, key); // 注意！
  };
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body);
    if (isQuanX()) $notify(title, subtitle, body);
  };
  log = (message) => console.log(message);
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb);
    }
    if (isQuanX()) {
      url.method = "GET";
      $task.fetch(url).then((resp) => cb(null, {}, resp.body));
    }
  };
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb);
    }
    if (isQuanX()) {
      url.method = "POST";
      $task.fetch(url).then((resp) => cb(null, {}, resp.body));
    }
  };
  done = (value = {}) => {
    $done(value);
  };
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done };
}
