/*
考途 vip

[rewrite_local]
^https:\/\/api-service\.tutusouti\.com\/appServiceApi\/vip\/newUserPayVipData url script-response-body https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/kaotu.js

[mitm]
hostname = api-service.tutusouti.com

*/


var mcdasheng = JSON.parse($response.body);

mcdasheng = {
  "msg" : "ok",
  "statusCode" : 0,
  "data" : {
    "vipList" : [
      {
        "diffTime" : 0,
        "goodsName" : "拍搜VIP",
        "goodsLabel" : 208,
        "expireTime" : 0,
        "vipStatus" : 0,
        "svipExplain" : "",
        "svipIsLifelong" : 0
      },
      {
        "diffTime" : 0,
        "goodsName" : "备考VIP",
        "goodsLabel" : 209,
        "expireTime" : 4092599349000,
        "vipStatus" : 1,
        "svipExplain" : "",
        "svipIsLifelong" : 1
      }
    ],
    "svipInfo" : {
      "diffTime" : 0,
      "goodsName" : "超级VIP",
      "goodsLabel" : 207,
      "expireTime" : 0,
      "vipStatus" : 0,
      "svipExplain" : "",
      "svipIsLifelong" : 0
    }
  }
}



$done({body : JSON.stringify(mcdasheng)});