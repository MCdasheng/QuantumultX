/* 
脚本功能: 获取 bingSearchCookieMobileKey
[rewrite local]
^https\:\/\/www\.bing\.com\/search\?q=testt&.* url script-request-header https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/bing.cookie.js
[MITM]
hostname = www.bing.com
*/

const $ =  init();

if ($request.headers) {
  const ck = $request.headers["Cookie"];
  $.msg("🏆Bing", "🎉MobileCookie获取成功");
  $.log("🎉bingMobileCookie获取成功");
  $.log(ck);
  $.setdata("bingSearchCookieMobileKey", ck);
  $.log("testCookie...");
  $.log($.getdata("bingSearchCookieMobileKey"));
  $.done();
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
