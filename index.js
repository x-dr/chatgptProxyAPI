import Express from 'express';
import chatgptMsg from './chatgpt.js'
const app = Express()

app.set('x-powered-by', false)
app.use(Express.json())
// 配置中间件
app.use(Express.urlencoded({ extended: false }))



app.get('/', async (req, res) => {
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <mete content="text/html; charset=utf-8" http-equiv="Content-Type"></mete>
        <title>api</title>
    </head>
    <body>
        <p id="ipinfo"></p>
        <script>
            (function () {
                fetch('https://forge.speedtest.cn/api/location/info')
                    .then(res => res.json())
                    .then(res => {
                        var ipinfo = "你的ip: " + res.ip + ' ' + res.province + res.city +res.distinct + ' ' + res.net_str
                        console.log(ipinfo)
                        var ipinfoNode = document.getElementById("ipinfo")
                        ipinfoNode.innerHTML = ipinfo
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })();
        </script>
    </body>
    </html>`
    res.send(html)
})

/**
 *   {
 *      "q": "question",
 *     "opts":{
 *        "parentMessageId": res.id (可为空)
 *   }
 *}
 * 
 * 
 */

 app.post('/chatgpt', async (req, res) => {
    const { q, opts = {} } = req.body
    // console.log(q);
    const chatgtp = await chatgptMsg(q, opts)
    res.send(chatgtp)
})


const port = process.env.PORT || 3035;
app.listen(port, () => {
    console.log('Start service success! listening port: http://127.0.0.1:' + port);
})
