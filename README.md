
## cf worker版本部署

1. 首页：https://workers.cloudflare.com

2. 注册，登陆，`Start building`，取一个子域名，`Create a Worker`。

3. 复制 [cf_worker.js](https://cdn.jsdelivr.net/gh/x-dr/chatgptProxyAPI@main/cf_worker.js)  到左侧代码框，`Save and deploy`。

4. 使用 
```bash
curl --location 'https://openai.1rmb.tk/v1/chat/completions' \
--header 'Authorization: Bearer sk-xxxxxxxxxxxxxxx' \
--header 'Content-Type: application/json' \
--data '{
   "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
 }'

```

![post](./post.png)






