/*
[rewrite_local]
^http[s]s:\/\/cdn\.alzhuanxian1\.com:7390\/platform-ns\/v1\.0\/member\/money url script-response-body https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/test.js
[mitm] 
hostname = cdn.alzhuanxian1.com
*/

if ($response.body) {
    $done({
        body: JSON.stringify({
  "msg" : "成功",
  "data" : {
    "total_account" : 100
  },
  "code" : 0
}
)
    });
} else {
    $done({});
}
