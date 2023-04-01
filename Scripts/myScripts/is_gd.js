/*
脚本功能: is.gd 缩短 url
*/

function shortUrl(url) {
  const method = `POST`;
  const headers = {
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    Origin: `https://is.gd`,
    "Accept-Encoding": `gzip, deflate, br`,
    Cookie: `recent=EaSgFh`,
    "Content-Type": `application/x-www-form-urlencoded`,
    Host: `is.gd`,
    Connection: `keep-alive`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1`,
    Referer: `https://is.gd/create.php`,
    "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
  };
  const body = `url=${encodeURIComponent(url)}&shorturl=&opt=0`;

  const myRequest = {
    url: "https://is.gd/create.php",
    method: method,
    headers: headers,
    body: body,
  };

  return $task.fetch(myRequest).then(
    (response) => {
      var reg = /\<div\sid\=\"main\".*href\=\"(.*)\"\sclass\=\"ioslink/;
      var shortUrl = reg.exec(response.body)[1];
      console.log("🔗 " + shortUrl);
      return shortUrl;
      // $done();
    },
    (reason) => {
      console.log(reason.error);
      $done();
    }
  );
}
