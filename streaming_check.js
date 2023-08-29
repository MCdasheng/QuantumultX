/*
流媒体检测精简版: 检测 📺Youtube & 🤖ChatGPT
url = https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/streaming_check.js
From https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js

[task_local]

event-interaction https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/streaming_check.js, tag=解锁查询, img-url=checkmark.seal.system, enabled=true

*/

const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_GPT = "https://chat.openai.com/";
const Region_URL_GPT = "https://chat.openai.com/cdn-cgi/trace";
const arrow = " ➟ ";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36";

var opts = {
  policy: $environment.params,
};

var opts1 = {
  policy: $environment.params,
  redirection: false,
};

var flags = new Map([
  ["AC", "🇦🇨"],
  ["AD", "🇦🇩"],
  ["AE", "🇦🇪"],
  ["AF", "🇦🇫"],
  ["AG", "🇦🇬"],
  ["AI", "🇦🇮"],
  ["AL", "🇦🇱"],
  ["AM", "🇦🇲"],
  ["AO", "🇦🇴"],
  ["AQ", "🇦🇶"],
  ["AR", "🇦🇷"],
  ["AS", "🇦🇸"],
  ["AT", "🇦🇹"],
  ["AU", "🇦🇺"],
  ["AW", "🇦🇼"],
  ["AX", "🇦🇽"],
  ["AZ", "🇦🇿"],
  ["BA", "🇧🇦"],
  ["BB", "🇧🇧"],
  ["BD", "🇧🇩"],
  ["BE", "🇧🇪"],
  ["BF", "🇧🇫"],
  ["BG", "🇧🇬"],
  ["BH", "🇧🇭"],
  ["BI", "🇧🇮"],
  ["BJ", "🇧🇯"],
  ["BM", "🇧🇲"],
  ["BN", "🇧🇳"],
  ["BO", "🇧🇴"],
  ["BR", "🇧🇷"],
  ["BS", "🇧🇸"],
  ["BT", "🇧🇹"],
  ["BV", "🇧🇻"],
  ["BW", "🇧🇼"],
  ["BY", "🇧🇾"],
  ["BZ", "🇧🇿"],
  ["CA", "🇨🇦"],
  ["CD", "🇨🇩"],
  ["CF", "🇨🇫"],
  ["CG", "🇨🇬"],
  ["CH", "🇨🇭"],
  ["CI", "🇨🇮"],
  ["CK", "🇨🇰"],
  ["CL", "🇨🇱"],
  ["CM", "🇨🇲"],
  ["CN", "🇨🇳"],
  ["CO", "🇨🇴"],
  ["CP", "🇨🇵"],
  ["CR", "🇨🇷"],
  ["CU", "🇨🇺"],
  ["CV", "🇨🇻"],
  ["CW", "🇨🇼"],
  ["CX", "🇨🇽"],
  ["CY", "🇨🇾"],
  ["CZ", "🇨🇿"],
  ["DE", "🇩🇪"],
  ["DG", "🇩🇬"],
  ["DJ", "🇩🇯"],
  ["DK", "🇩🇰"],
  ["DM", "🇩🇲"],
  ["DO", "🇩🇴"],
  ["DZ", "🇩🇿"],
  ["EA", "🇪🇦"],
  ["EC", "🇪🇨"],
  ["EE", "🇪🇪"],
  ["EG", "🇪🇬"],
  ["EH", "🇪🇭"],
  ["ER", "🇪🇷"],
  ["ES", "🇪🇸"],
  ["ET", "🇪🇹"],
  ["EU", "🇪🇺"],
  ["FI", "🇫🇮"],
  ["FJ", "🇫🇯"],
  ["FK", "🇫🇰"],
  ["FM", "🇫🇲"],
  ["FO", "🇫🇴"],
  ["FR", "🇫🇷"],
  ["GA", "🇬🇦"],
  ["GB", "🇬🇧"],
  ["GD", "🇬🇩"],
  ["GE", "🇬🇪"],
  ["GF", "🇬🇫"],
  ["GH", "🇬🇭"],
  ["GI", "🇬🇮"],
  ["GL", "🇬🇱"],
  ["GM", "🇬🇲"],
  ["GN", "🇬🇳"],
  ["GP", "🇬🇵"],
  ["GR", "🇬🇷"],
  ["GT", "🇬🇹"],
  ["GU", "🇬🇺"],
  ["GW", "🇬🇼"],
  ["GY", "🇬🇾"],
  ["HK", "🇭🇰"],
  ["HN", "🇭🇳"],
  ["HR", "🇭🇷"],
  ["HT", "🇭🇹"],
  ["HU", "🇭🇺"],
  ["ID", "🇮🇩"],
  ["IE", "🇮🇪"],
  ["IL", "🇮🇱"],
  ["IM", "🇮🇲"],
  ["IN", "🇮🇳"],
  ["IR", "🇮🇷"],
  ["IS", "🇮🇸"],
  ["IT", "🇮🇹"],
  ["JM", "🇯🇲"],
  ["JO", "🇯🇴"],
  ["JP", "🇯🇵"],
  ["KE", "🇰🇪"],
  ["KG", "🇰🇬"],
  ["KH", "🇰🇭"],
  ["KI", "🇰🇮"],
  ["KM", "🇰🇲"],
  ["KN", "🇰🇳"],
  ["KP", "🇰🇵"],
  ["KR", "🇰🇷"],
  ["KW", "🇰🇼"],
  ["KY", "🇰🇾"],
  ["KZ", "🇰🇿"],
  ["LA", "🇱🇦"],
  ["LB", "🇱🇧"],
  ["LC", "🇱🇨"],
  ["LI", "🇱🇮"],
  ["LK", "🇱🇰"],
  ["LR", "🇱🇷"],
  ["LS", "🇱🇸"],
  ["LT", "🇱🇹"],
  ["LU", "🇱🇺"],
  ["LV", "🇱🇻"],
  ["LY", "🇱🇾"],
  ["MA", "🇲🇦"],
  ["MC", "🇲🇨"],
  ["MD", "🇲🇩"],
  ["MG", "🇲🇬"],
  ["MH", "🇲🇭"],
  ["MK", "🇲🇰"],
  ["ML", "🇲🇱"],
  ["MM", "🇲🇲"],
  ["MN", "🇲🇳"],
  ["MO", "🇲🇴"],
  ["MP", "🇲🇵"],
  ["MQ", "🇲🇶"],
  ["MR", "🇲🇷"],
  ["MS", "🇲🇸"],
  ["MT", "🇲🇹"],
  ["MU", "🇲🇺"],
  ["MV", "🇲🇻"],
  ["MW", "🇲🇼"],
  ["MX", "🇲🇽"],
  ["MY", "🇲🇾"],
  ["MZ", "🇲🇿"],
  ["NA", "🇳🇦"],
  ["NC", "🇳🇨"],
  ["NE", "🇳🇪"],
  ["NF", "🇳🇫"],
  ["NG", "🇳🇬"],
  ["NI", "🇳🇮"],
  ["NL", "🇳🇱"],
  ["NO", "🇳🇴"],
  ["NP", "🇳🇵"],
  ["NR", "🇳🇷"],
  ["NZ", "🇳🇿"],
  ["OM", "🇴🇲"],
  ["PA", "🇵🇦"],
  ["PE", "🇵🇪"],
  ["PF", "🇵🇫"],
  ["PG", "🇵🇬"],
  ["PH", "🇵🇭"],
  ["PK", "🇵🇰"],
  ["PL", "🇵🇱"],
  ["PM", "🇵🇲"],
  ["PR", "🇵🇷"],
  ["PS", "🇵🇸"],
  ["PT", "🇵🇹"],
  ["PW", "🇵🇼"],
  ["PY", "🇵🇾"],
  ["QA", "🇶🇦"],
  ["RE", "🇷🇪"],
  ["RO", "🇷🇴"],
  ["RS", "🇷🇸"],
  ["RU", "🇷🇺"],
  ["RW", "🇷🇼"],
  ["SA", "🇸🇦"],
  ["SB", "🇸🇧"],
  ["SC", "🇸🇨"],
  ["SD", "🇸🇩"],
  ["SE", "🇸🇪"],
  ["SG", "🇸🇬"],
  ["SI", "🇸🇮"],
  ["SK", "🇸🇰"],
  ["SL", "🇸🇱"],
  ["SM", "🇸🇲"],
  ["SN", "🇸🇳"],
  ["SR", "🇸🇷"],
  ["ST", "🇸🇹"],
  ["SV", "🇸🇻"],
  ["SY", "🇸🇾"],
  ["SZ", "🇸🇿"],
  ["TC", "🇹🇨"],
  ["TD", "🇹🇩"],
  ["TG", "🇹🇬"],
  ["TH", "🇹🇭"],
  ["TJ", "🇹🇯"],
  ["TL", "🇹🇱"],
  ["TM", "🇹🇲"],
  ["TN", "🇹🇳"],
  ["TO", "🇹🇴"],
  ["TR", "🇹🇷"],
  ["TT", "🇹🇹"],
  ["TV", "🇹🇻"],
  ["TW", "🇼🇸"],
  ["TZ", "🇹🇿"],
  ["UA", "🇺🇦"],
  ["UG", "🇺🇬"],
  ["UK", "🇬🇧"],
  ["UM", "🇺🇲"],
  ["US", "🇺🇸"],
  ["UY", "🇺🇾"],
  ["UZ", "🇺🇿"],
  ["VA", "🇻🇦"],
  ["VC", "🇻🇨"],
  ["VE", "🇻🇪"],
  ["VG", "🇻🇬"],
  ["VI", "🇻🇮"],
  ["VN", "🇻🇳"],
  ["VU", "🇻🇺"],
  ["WS", "🇼🇸"],
  ["YE", "🇾🇪"],
  ["YT", "🇾🇹"],
  ["ZA", "🇿🇦"],
  ["ZM", "🇿🇲"],
  ["ZW", "🇿🇼"],
]);

let result = {
  title: "   📺 流媒体服务查询",
  YouTube: "<b>📺YouTube: </b>检测失败, 请重试 ❗️",
  ChatGPT: "<b>🤖ChatGPT: </b>检测失败, 请重试 ❗️",
};
const message = {
  action: "get_policy_state",
  content: $environment.params,
};

(async () => {
  await testYTB();
  await testChatGPT();

  let content =
    "------------------------------" +
    "</br>" +
    [result["YouTube"], result["ChatGPT"]].join("</br></br>");
  content =
    content +
    "</br>---------------------------</br>" +
    "<font color=#CD5C5C >" +
    "<b>节点</b> ➟ " +
    $environment.params +
    "</font>";
  content =
    `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
    content +
    `</p>`;
  //  cnt = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +'----------------------</br></br>'+result["Disney"]+'</br></br>----------------------</br>'+$environment.params + `</p>`
  $configuration.sendMessage(message).then(
    (resolve) => {
      if (resolve.error) {
        console.log(resolve.error);
        $done();
      }
      if (resolve.ret) {
        let output = JSON.stringify(resolve.ret[message.content])
          ? JSON.stringify(resolve.ret[message.content])
              .replace(/\"|\[|\]/g, "")
              .replace(/\,/g, " ➟ ")
          : $environment.params;
        let content =
          "----------------------------------</br>" +
          [result["ChatGPT"], result["YouTube"]].join("</br></br>");
        content =
          content +
          "</br>------------------------------------</br>" +
          "<font color=#CD5C5C>" +
          "<b>节点</b> ➟ " +
          output +
          "</font>";
        content =
          `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
          content +
          `</p>`;
        //$notify(typeof(output),output)
        console.log(output);
        $done({ title: result["title"], htmlMessage: content });
      }
      //$done();|
    },
    (reject) => {
      // Normally will never happen.
      $done();
    }
  );
  //$done({"title":result["title"],"htmlMessage":content})
})().finally(() => {
  $configuration.sendMessage(message).then(
    (resolve) => {
      if (resolve.error) {
        console.log(resolve.error);
        $done();
      }
      if (resolve.ret) {
        let output = JSON.stringify(resolve.ret[message.content])
          ? JSON.stringify(resolve.ret[message.content])
              .replace(/\"|\[|\]/g, "")
              .replace(/\,/g, " ➟ ")
          : $environment.params;
        let content =
          "--------------------------------------</br>" +
          [result["ChatGPT"], result["YouTube"]].join("</br></br>");
        content =
          content +
          "</br>------------------------------------</br>" +
          "<font color=#CD5C5C>" +
          "<b>节点</b> ➟ " +
          output +
          "</font>";
        content =
          `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
          content +
          `</p>`;
        //$notify(typeof(output),output)
        console.log(output);
        $done({ title: result["title"], htmlMessage: content });
      }
      //$done();|
    },
    (reject) => {
      // Normally will never happen.
      $done();
    }
  );

  $done({
    title: result["title"],
    htmlMessage:
      `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +
      "----------------------</br></br>" +
      "🚥 检测异常" +
      "</br></br>----------------------</br>" +
      output +
      `</p>`,
  });
});

function timeout(delay = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Timeout");
    }, delay);
  });
}

async function testYTB() {
  let option = {
    url: BASE_URL_YTB,
    opts: opts,
    timeout: 2800,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
    },
  };
  $task.fetch(option).then(
    (response) => {
      let data = response.body;
      console.log("ytb:" + response.statusCode);
      if (response.statusCode !== 200) {
        //reject('Error')
        result["YouTube"] = "<b>YouTube Premium: </b>检测失败 ❗️";
      } else if (
        data.indexOf("Premium is not available in your country") !== -1
      ) {
        //resolve('Not Available')
        result["YouTube"] = "<b>YouTube Premium: </b>未支持 🚫";
      } else if (
        data.indexOf("Premium is not available in your country") == -1
      ) {
        //console.log(data.split("countryCode")[1])
        let region = "";
        let re = new RegExp('"GL":"(.*?)"', "gm");
        let ret = re.exec(data);
        if (ret != null && ret.length === 2) {
          region = ret[1];
        } else if (data.indexOf("www.google.cn") !== -1) {
          region = "CN";
        } else {
          region = "US";
        }
        //resolve(region)
        result["YouTube"] =
          "<b>📺YouTube: </b>🎉支持 " +
          arrow +
          flags.get(region.toUpperCase()) +
          region.toUpperCase();

        console.log("ytb:" + region + result["YouTube"]);
      }
    },
    (reason) => {
      result["YouTube"] = "<b>YouTube Premium: </b>检测超时 🚦";
      //resolve("timeout")
    }
  );
}

support_countryCodes = [
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

async function testChatGPT() {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL_GPT,
      opts: opts1,
      timeout: 2800,
    };
    $task.fetch(option).then(
      (response) => {
        let resp = JSON.stringify(response);
        console.log("ChatGPT Main Test");
        let jdg = resp.indexOf("text/plain");
        if (jdg == -1) {
          let option1 = {
            url: Region_URL_GPT,
            opts: opts1,
            timeout: 2800,
          };
          $task.fetch(option1).then(
            (response) => {
              console.log("ChatGPT Region Test");
              let region = response.body.split("loc=")[1].split("\n")[0];
              console.log("ChatGPT Region: " + region);
              let res = support_countryCodes.indexOf(region);
              if (res != -1) {
                result["ChatGPT"] =
                  "<b>🤖ChatGPT: </b>🎉支持 " +
                  arrow +
                  flags.get(region.toUpperCase()) +
                  region.toUpperCase();
                console.log("支持 ChatGPT");
                resolve("支持 ChatGPT");
                return;
              } else {
                result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫";
                console.log("不支持 ChatGPT");
                resolve("不支持 ChatGPT");
                return;
              }
            },
            (reason) => {
              console.log("Check-Error" + reason);
              resolve("ChatGPT failed");
            }
          );
        } else {
          result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫";
          console.log("不支持 ChatGPT");
          resolve("不支持 ChatGPT");
        }
      },
      (reason) => {
        console.log("ChatGPT-Error" + reason);
        resolve("ChatGPT failed");
      }
    );
  });
}
