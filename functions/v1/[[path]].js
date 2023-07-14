export async function onRequest(context) {
    const {
        request, // 与现有 Worker API 中的 request 相同
        env, // 与现有 Worker API 中的 env 相同
        params, // 如果文件名包含 [id] 或 [[path]]，则与现有 Worker API 中的 params 相同
        waitUntil, // 与现有 Worker API 中的 ctx.waitUntil 相同
        next, // 用于中间件或获取资源
        data, // 在中间件之间传递数据的任意空间
    } = context;
    // const newResponse = request.clone();
    const url = new URL(request.url);
    const headers_Origin = request.headers.get("Access-Control-Allow-Origin") || "*"

    // console.log('https://api.openai.com' + url.pathname + url.search);

    const modifiedRequest = new Request('https://api.openai.com' + url.pathname + url.search, {
        method: request.method,
        headers: request.headers,
        body: request.body,
    });

    const response = await fetch(modifiedRequest);

    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);

    return modifiedResponse;
}
