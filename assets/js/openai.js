//参考自 https://github.com/open-tdp/openai-chat
const app = {
    u: '',
    alert: null,
    total: null,
    loading: false,
    isValidated() {
        const inputText = this.u.trim();
        // 使用正则表达式匹配以 "sk-" 开头的密钥，并排除非匹配项
        const regex = /^sk-.{21,}$/;
        const keys = inputText.split('\n').filter(key => regex.test(key.trim()));
        return keys
    },

    clear() {
        this.total = this.total.filter(item => {
            return item.total_available && (item.total_available > 0 || item.total_available === "查询失败");
        });
        this.u = this.total.map(item => item.key).join('\n');
        this.alert = { type: 'success', message: '清理完成' };
    },

    async submit($refs) {
        if (!this.u) {
            this.alert = { type: 'error', message: '请输入以sk-开头的key...' }
            return
        }
        const keys = this.isValidated();
        if (keys.length === 0) {
            this.alert = { type: 'error', message: '非法key格式' }
            return
        }

        keys.forEach(async (key) => {
            await this.checkBilling(key);
        });


    },

    async fetch(path, body, key) {
        key = key || 'this.defaultKey';

        const opts = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer ' + key,
            },
            credentials: 'omit', // 添加此行以取消发送凭据
        }

        if (body != null) {
            opts.method = 'POST';
            opts.body = JSON.stringify(body);
        }

        return fetch(path, opts).then(async r => {

            const data = await r.json();
            if (!r.ok) {
                if (data && data.error) {
                    // console.log(data.error);
                    // throw new Error(data.error.message);
                    return data
                }
                throw new Error(r.statusText || '请求失败');
            }
            return data;
        })
    },


    async checkBilling(key) {
        this.alert = null
        this.loading = true
        this.total = null
        const today = new Date();
        const formatDate = function (timestamp) {
            const date = new Date(timestamp * 1000);
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
        };

        const headers = {
            'content-type': 'application/json',
            'Authorization': `Bearer ${key}`
        }
        const subscription = await this.fetch('/v1/dashboard/billing/subscription', null, key);
        if (!subscription || !subscription.plan) {
            if (!this.total) {
                this.total = [];
            }
            this.total.push({
                key: key,
                msgkey: key.replace(/(sk-.{5}).+(.{5})/, '$1****$2'),
                total_granted: 0,
                total_used: 0,
                total_available: 0,
                plan: 'API Key 无效',
                endDate: '',
                latest_gpt: subscription.error.code
            });
            this.loading = false
            this.alert = { type: 'success', message: "查询成功" }
        } else {
            const start_date = subscription.hard_limit_usd > 20
                ? [today.getFullYear(), today.getMonth() + 1, '1'].join('-') : formatDate(today / 1000 - 90 * 86400);
            const end_date = formatDate(today / 1000 + 86400);
            const usageData = await this.fetch(`/v1/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`, null, key);

            const modelData = await this.fetch('/v1/models', null, key);


            const gptModels = modelData.data.filter(model => model.id.includes("gpt"));
            const highestGPTModel = gptModels.reduce((prev, current) => {
                const prevVersion = parseFloat(prev.id.split("-")[1]);
                const currentVersion = parseFloat(current.id.split("-")[1]);
                return (currentVersion > prevVersion) ? current : prev;
            });
            const GPTModel = highestGPTModel.id
            const plan = (subscription.plan.title === "Pay-as-you-go") ? "Pay-as-you-go" : subscription.plan.id;
            //总
            const total_granted = subscription.hard_limit_usd;
            //已用
            // const total_used = usageData.total_usage / 100 || -1
            const total_used = typeof usageData.total_usage === "number" ? usageData.total_usage / 100 : "查询失败";

            // 剩余额度
            const total_available = typeof total_used === "number" ? total_granted - total_used : "查询失败";

            //剩余额度
            // const total_available = total_granted - total_used;

            if (!this.total) {
                this.total = [];
            }
            this.total.push({
                key: key,
                msgkey: key.replace(/(sk-.{5}).+(.{5})/, '$1****$2'),
                total_granted: total_granted,
                total_used: total_used,
                total_available: total_available,
                plan: plan,
                endDate: formatDate(subscription.access_until),
                latest_gpt: GPTModel,
            });


        }

        this.loading = false
        this.alert = { type: 'success', message: "查询成功" }
        return

    }
}


const ip = {
    ipinfo: '',
    getipinfo() {
        fetch('https://forge.speedtest.cn/api/location/info')
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                this.ipinfo = `当前IP: ${res.ip} (${res.province} ${res.city}  ${res.distinct} ${res.isp})  `

            })
            .catch(err => {
                console.log(err);
            })
    }
}


function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('API已复制到剪贴板');
        })
        .catch((error) => {
            console.error('API复制到剪贴板时出错:', error);
        });
}
