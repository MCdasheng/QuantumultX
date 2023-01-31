/*
自用备份 Emby Premiere
From Tartarus2014

[Rewrite Local]
^https?:\/\/mb3admin.com\/admin\/service\/registration\/validateDevice url script-response-body https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/Emby.js

[Hostname]
hostname = mb3admin.com
*/

const CHECK_URL = 'mb3admin.com/admin/service/registration/validateDevice'

const url = $request.url
const isCheckUrl = (url) => url.includes(CHECK_URL)

if (isCheckUrl(url) && $response.status != 200) {
  const unlock = {
    cacheExpirationDays: 999,
    resultCode: 'GOOD',
    message: 'Device Valid'
  }

  const status = 200
  const headers = $response.headers
  const body = JSON.stringify(unlock)

  $done({ status, headers, body })
} else {
  $done({})
}
