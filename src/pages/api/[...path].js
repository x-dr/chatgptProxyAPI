export const config = {
  runtime: 'edge',
};

// 异步函数，处理 HTTP 请求
async function handler(req) {

  // 提取请求的 URL，并将它转化为 URL 类型
  const url = new URL(req.url);
  const headers_Origin = req.headers.get("Access-Control-Allow-Origin") || "*"

  let req_url = `https://api.openai.com${url.pathname.replace("\/api", "")}`
  if (req.method === "GET") {
    const reqParams = url.search.replace(/&path=[^&]+/g, "");
    req_url = req_url + reqParams
    console.log(reqParams);
  }


  // 创建一个新的请求，指向 OpenAI 的 API
  const modifiedRequest = new Request(req_url, {
    headers: req.headers,
    method: req.method,
    body: req.body,
    redirect: 'follow'
  });

  try {
    // 向 OpenAI 发送修改后的请求，并等待响应
    const response = await fetch(modifiedRequest);

    // 根据 OpenAI 响应创建一个新的响应对象
    const modifiedResponse = new Response(response.body, response);

    // 添加允许跨域访问的响应头
    modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);

    // 返回修改后的响应
    return modifiedResponse;
  } catch (e) {
    // 处理错误，打印错误信息到控制台
    console.log(e);
  }
}

// 将异步函数导出，作为模块的默认输出
export default handler;
