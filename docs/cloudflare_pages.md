## 利用Cloudflare pages部署

> 参考自 https://github.com/open-tdp/openai-chat

1. ~~Fork本项目 [x-dr/chatgptProxyAPI](https://github.com/x-dr/chatgptProxyAPI/fork)~~ 点击[Use this template](https://github.com/x-dr/chatgptProxyAPI/generate)按钮创建一个新的代码库。
2. 登录到[Cloudflare](https://dash.cloudflare.com/)控制台.
3. 在帐户主页中，选择`pages`> ` Create a project` > `Connect to Git`
![Cloudflare_pages1.png](./img/Cloudflare_pages1.png)

4. 选择你 Fork 的项目存储库，在`Set up builds and deployments`部分中，全部默认即可。

![Cloudflare_pages2.png](./img/Cloudflare_pages2.png)



![Cloudflare_pages4.png](./img/Cloudflare_pages7.png)



5. 点击`Save and Deploy`部署


> 然后点`Continue to project`即可看到访问域名

![Cloudflare_pages6.png](./img/Cloudflare_pages6.png)

**至此便大功告成。等待片刻，应该就可以通过你自己的域名来代替 OpenAI 的 API 地址了，比如在本文搭建的api:`https://openapi-dev.pages.dev`为例子，想要请求 ChatGPT 的 API ，即是把官方 API 地址 https://api.openai.com/v1/chat/completions 换为我自己的域名 https://openapi-dev.pages.dev/v1/chat/completions ，其他参数均参照官方示例即可。由于 Cloudflare 有每天免费 10 万次的请求额度，所以轻度使用基本是零成本的。**

### 使用 

> 以我的搭建的服务`https://openapi-dev.pages.dev/` 为例

1. 对话

```bash
curl --location 'https://openapi-dev.pages.dev/v1/chat/completions' \
--header 'Authorization: Bearer sk-xxxxxxxxxxxxxxx' \
--header 'Content-Type: application/json' \
--data '{
   "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
 }'

```

<details>

<summary>响应</summary>

```json
{
    "id": "chatcmpl-6rMlZybwjMQIhFAEaiCmWvMP1BXld",
    "object": "chat.completion",
    "created": 1678176917,
    "model": "gpt-3.5-turbo-0301",
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 11,
        "total_tokens": 20
    },
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "\n\nHello! How can I assist you today?"
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
}

```

</details>

2. 查询key余额

```js
    const headers = {
      'content-type': 'application/json',
      'Authorization': `Bearer sk-xxxxxxxxxxxxxxxxx`
    }
    // 查是否订阅
    const subscription = await fetch("https://openai.1rmb.tk/v1/dashboard/billing/subscription", {
      method: 'get',
      headers: headers
    })
    if (!subscription.ok) {
      const data = await subscription.json()
      // console.log(data);
      return data
      // throw new Error('API request failed')
    } else {
      const subscriptionData = await subscription.json()
      const endDate = subscriptionData.access_until
      const startDate = new Date(endDate - 90 * 24 * 60 * 60);
      console.log(formatDate(endDate, "YYYY-MM-DD"));
      console.log(formatDate(startDate, "YYYY-MM-DD"));
      const response = await fetch(`https://openai.1rmb.tk/v1/dashboard/billing/usage?start_date=${formatDate(startDate, "YYYY-MM-DD")}&end_date=${formatDate(endDate, "YYYY-MM-DD")}`, {
        method: 'get',
        headers: headers
      })
      
      const usageData = await response.json();
      console.log(usageData);
      }

```



