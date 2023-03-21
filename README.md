
### Demo

[https://chatai.1rmb.tk](https://chatai.1rmb.tk)

> api
```url
https://openai.1rmb.tk
```

## 1、利用Cloudflare Worker中转api.openai.com

1. 新建一个 Cloudflare Worker
2. 复制 [cf_worker.js](https://cdn.jsdelivr.net/gh/x-dr/chatgptProxyAPI@main/cf_worker.js)  里的代码粘贴到 Worker 中并部署
3. 给 Worker 绑定一个没有被墙的域名
4. 使用自己的域名代替 api.openai.com


**[详细教程](./docs/cloudflare_workers.md)**




## 2、利用nextjs edge中转api.openai.com

### 利用Cloudflare pages部署

> [官方文档](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)

1. ~~Fork本项目~~ 点击[Use this template](https://github.com/x-dr/chatgptProxyAPI/generate)按钮创建一个新的代码库。
2. 登录到[Cloudflare](https://dash.cloudflare.com/)控制台.
3. 在帐户主页中，选择`pages`> ` Create a project` > `Connect to Git`
4. 选择你 Fork 的项目存储库，在`Set up builds and deployments`部分中，选择`Next.js`作为您的框架预设。您的选择将提供以下信息。

> 一般默认即可

|  Configuration option	   | Value  |
|  ----  | ----  |
| Production branch  | main |
| Framework preset  | next.js |
| Build command	  | npx @cloudflare/next-on-pages --experimental-minify|
| Build directory  | .vercel/output/static|


> 在 `Environment variables (advanced)`添加一个参数

|  Variable name	   | Value  |
|  ----  | ----  |
| NODE_VERSION   | 16 |

5. 点击`Save and Deploy`部署，然后点`Continue to project`即可看到访问域名


> 把官方接口的`https://api.openai.com`替换为`https://xxx.pages.dev/api` 即可 (https://xxx.pages.dev/api 为你的域名)

*注意路径多了一个`api`*

**[详细教程](./docs/cloudflare_pages.md)**


### docker 部署（要境外vps）

```bash
docker run -itd --name openaiproxy \
            -p 3000:3000 \
            --restart=always \
           gindex/openaiproxy:latest
```

#### 使用

*api : http://vpsip:3000/proxy/v1/chat/completions*

```bash
curl --location 'http://vpsip:3000/proxy/v1/chat/completions' \
--header 'Authorization: Bearer sk-xxxxxxxxxxxxxxx' \
--header 'Content-Type: application/json' \
--data '{
   "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
 }'

```


## Stargazers over time

[![Stargazers over time](https://starchart.cc/x-dr/chatgptProxyAPI.svg)](https://starchart.cc/x-dr/chatgptProxyAPI)
