/* 
脚本功能: 获取乐健体育签到请求体 用于自动二次签到
[rewrite local]
^https\:\/\/cpes\.legym\.cn\/education\/activity\/app\/attainability\/sign url script-request-body https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/legym_sign.cookie.js
[MITM]
hostname = cpes.legym.cn
*/

const $ = new init();

if ($request.body) {
  $.msg("🟢会话获取成功");
  const legym_signBody = $request.body;
  $.msg("乐健体育", "🎉signBody获取成功");
  $.log("🎉signBody获取成功");
  $.log(legym_signBody);
  $.setdata("legym_signBody", legym_signBody);
  $.done();
} else {
  $.msg("🔴signBody获取失败");
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
