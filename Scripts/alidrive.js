/*************************************

项目名称：阿里云盘 净化/解锁SVIP
下载地址：https://t.cn/A6GqTACm
脚本作者：chxm1023
使用声明：⚠️仅供参考，🈲转载与售卖！
使用说明：非一次性解锁，每次解锁需打开脚本

**************************************

[rewrite_local]
^https?:\/\/(api|member)\.aliyundrive\.com url script-response-body https://raw.githubusercontent.com/chxm1023/Rewrite/main/alidrive.js

[mitm]
hostname = *.aliyundrive.com

*************************************/


var body = $response.body;
var chxm1023 = JSON.parse(body);

const huanying = '/users/apps/welcome';
const chatiao = '/users/tools';
const shouye = '/users/home';
const vipa = '/users/vip/info';
const vipb = '/users/me/vip/info';
const bofang = '/users/feature/list';
const tubiao = '/users/me';

if ($request.url.indexOf(huanying) != -1){
  chxm1023.title = "Hey, chxm1023欢迎您使用🎉";
  chxm1023.description = "特别说明：解锁部分功能，不完全解锁🔔";
}

if ($request.url.indexOf(chatiao) != -1){
  delete chxm1023.result.guideInfo;
}

if ($request.url.indexOf(shouye) != -1){
  delete chxm1023.recentUsed;
  delete chxm1023.recentSaved;
  delete chxm1023.activities;
  delete chxm1023.result;
  delete chxm1023.myBackup;
  delete chxm1023.success;
  delete chxm1023.deviceBackupChannel;
}

if ($request.url.indexOf(vipa) != -1){
  chxm1023 = {
  "status" : "normal",
  "identity" : "svip",
  "icon" : "https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png",
  "level" : "8t",
  "vipList" : [
    {
      "code" : "svip.8t",
      "promotedAt" : 1675469645,
      "expire" : 4092599349,
      "name" : "超级会员"
    }
  ],
  "mediumIcon" : "https://gw.alicdn.com/imgextra/i4/O1CN01Mk916Y1c99aVBrgxM_!!6000000003557-2-tps-222-60.png"
 };
}

if ($request.url.indexOf(vipb) != -1){
  chxm1023 = {
  "rightButtonText" : "立即续费",
  "identity" : "svip",
  "level" : "8t",
  "titleNotice" : "SVIP",
  "titleImage" : "https://gw.alicdn.com/imgextra/i1/O1CN01Z2Yv4u1jrJ5S5TYpo_!!6000000004601-2-tps-216-60.png",
  "description" : "有效期至2099-09-09"
 };
}

if ($request.url.indexOf(bofang) != -1){
  body = body.replace(/\"name":".*?"/g, '\"name":"svip"').replace(/\"intercept":\w+/g, '\"intercept":false');
  $done({body});
}

if ($request.url.indexOf(tubiao) != -1){
  chxm1023.membershipIdentity = "svip";
  chxm1023.membershipIcon = "https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png";
}


$done({body : JSON.stringify(chxm1023)});
