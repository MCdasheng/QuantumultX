/*
脚本功能:乐健体育报名
30-35 10 * * * https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/legym.js, tag=乐健体育报名, img-url=figure.disc.sports.system, enabled=true
@params: 
  "legym_loginBody"
运行一次可能不成功(待解决？)
*/

const $ = init();

login();
getId();
signUp();

function login() {
  const BODY = $.getdata("legym_loginBody");

  let options = {
    url: "https://cpes.legym.cn/authorization/user/manage/login",
    headers: {
      "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/50) uni-app`,
      "Content-Type": `application/json`,
    },
  };
  options.body = BODY;

  $.post(options, (error, response, data) => {
    var obj = JSON.parse(data);
    if (obj.code == 0) {
      var accessToken = obj.data.accessToken;
      accessToken = "Bearer " + accessToken;
      $.setdata("legym_auth", accessToken);
      if ($.getdata("legym_auth") == accessToken) {
        $.log("🎉用户鉴权已更新");
        $.log(accessToken);
      } else $.msg("🔴用户鉴权获取失败");
    } else {
      $.msg("Error", error);
    }
    // $.done();
  });
}

function getId() {
  const AUTH = $.getdata("legym_auth");

  let options = {
    url: "https://cpes.legym.cn/education/app/activity/getActivityList",
    headers: {
      "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/50) uni-app`,
      "Content-Type": `application/json`,
      Organization: `402881ea7c39c5d5017c39d134ca03ab`, // uestc
    },
    body: `{"name":"","campus":"","page":1,"size":99,"state":"","topicId":"","week":""}`,
  };
  options.headers["Authorization"] = AUTH;

  $.post(options, (error, response, data) => {
    var obj = JSON.parse(data);
    if (obj.code == 0) {
      const items = obj.data.items;
      for (i = items.length - 1; i > 0; i--) {
        if (items[i].name.search(/沙河/) != -1) {
          var name = items[i].name;
          var activityId = items[i].id;
          break;
        } else continue;
      }

      $.setdata("legym_activityId", activityId);
      if ($.getdata("legym_activityId") == activityId) {
        $.log("🎉活动id已更新");
        $.log(name);
        $.log(activityId);
      } else $.msg("🔴活动信息获取失败");
    } else {
      $.msg("Error", error);
    }
    // $.done();
  });
}

function signUp() {
  const activityId = $.getdata("legym_activityId");
  const AUTH = $.getdata("legym_auth");

  let options = {
    url: "https://cpes.legym.cn/education/app/activity/signUp",
    headers: {
      "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/50) uni-app`,
      "Content-Type": `application/json`,
      Organization: `402881ea7c39c5d5017c39d134ca03ab`, // uestc
    },
    body: `{}`,
  };
  options.body = `{"activityId":"` + activityId + `"}`;
  options.headers["Authorization"] = AUTH;

  $.post(options, (error, response, data) => {
    var obj = JSON.parse(data);
    if (obj.code == 0) {
      var success = obj.data.success;
      var reason = obj.data.reason;
      if (success) {
        reason = "🎉" + reason;
        $.log("乐健体育", reason);
        $.msg("乐健体育", reason);
      } else {
        reason = "🔴" + reason;
        $.log("乐健体育", reason);
        $.msg("乐健体育", reason);
      }
    } else {
      $.msg("Error", error);
    }
    $.done();
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
