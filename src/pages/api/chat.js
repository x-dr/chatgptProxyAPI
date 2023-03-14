export const config = {
  runtime: 'edge',
}


export default async function handler(req, res) {
  const modifiedRequest = new Request("https://api.openai.com/v1/chat/completions", {
    headers: req.headers,
    method: req.method,
    body: req.body,
    redirect: 'follow'
  });



  try {
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);
    // 添加允许跨域访问的响应头

    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');


    return modifiedResponse;
  } catch (e) {
    console.log(e);

  }
}

