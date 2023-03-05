/* Quantumult X example js */

const url = "https://example.com/";
const method = "GET";
const headers = { Field: "test-header-param" };
const data = { info: "abc" };

const myRequest = {
  url: url,
  method: method,  
  headers: headers, 
  body: JSON.stringify(data), 
};

$task.fetch(myRequest).then(
  (response) => {
    console.log(response.body); //只能在日志中查看
    $notify("Title", "Subtitle", notice); // 点击跳转内容为 notice、
    $done();
  },
  (reason) => {
    $notify("Error", "请检查脚本", reason.error); 
    $done();
  }
);
