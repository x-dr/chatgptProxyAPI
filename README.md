
## 利用Cloudflare Worker中转api.openai.com

1. 新建一个 Cloudflare Worker
2. 复制 [cf_worker.js](https://cdn.jsdelivr.net/gh/x-dr/chatgptProxyAPI@main/cf_worker.js)  里的代码粘贴到 Worker 中并部署
3. 给 Worker 绑定一个没有被墙的域名
4. 使用自己的域名代替 api.openai.com


**[详细教程](./docs/cloudflare_workers.md)**



## 利用vercel中转api.openai.com

待续...