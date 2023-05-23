import Head from 'next/head'
// import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'


function formatDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  const date = new Date(timestamp * 1000);

  const replacements = {
    'YYYY': date.getFullYear(),
    'MM': addLeadingZero(date.getMonth() + 1),
    'DD': addLeadingZero(date.getDate()),
    'HH': addLeadingZero(date.getHours()),
    'mm': addLeadingZero(date.getMinutes()),
    'ss': addLeadingZero(date.getSeconds())
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => {
    return replacements[match];
  });
}

function addLeadingZero(num) {
  return num.toString().padStart(2, '0');
}


async function submit(key) {
  try {

    const headers = {
      'content-type': 'application/json',
      'Authorization': `Bearer ${key}`
    }
    // 查是否订阅
    const subscription = await fetch("/api/v1/dashboard/billing/subscription", {
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
      // console.log(subscriptionData);
      // console.log(subscriptionData.plan.id);
      const billingendDate = Math.floor(Date.now() / 1000 + 24 * 60 * 60);
      const billingstartDate = new Date(billingendDate - 90 * 24 * 60 * 60);

      // 赠送额度有效期
      const endDate = subscriptionData.access_until
      const startDate = new Date(endDate - 90 * 24 * 60 * 60);
      console.log(formatDate(endDate, "YYYY-MM-DD"));
      console.log(formatDate(startDate, "YYYY-MM-DD"));
      // const response = await fetch(`/api/v1/dashboard/billing/usage?start_date=${formatDate(startDate, "YYYY-MM-DD")}&end_date=${formatDate(endDate, "YYYY-MM-DD")}`, {

      // 查询90天内的使用情况
      const response = await fetch(`/api/v1/dashboard/billing/usage?start_date=${formatDate(billingstartDate, "YYYY-MM-DD")}&end_date=${formatDate(billingendDate, "YYYY-MM-DD")}`, {
        method: 'get',
        headers: headers
      })

      const usageData = await response.json();
      console.log(usageData);

      // 获取apiKey支持的最高GPT模型
      const modelResponse = await fetch(`/api/v1/models`, {
        method: 'get',
        headers: headers
      });
      const modelData = await modelResponse.json();
      const gptModels = modelData.data.filter(model => model.id.includes("gpt"));
      const highestGPTModel = gptModels.reduce((prev, current) => {
        const prevVersion = parseFloat(prev.id.split("-")[1]);
        const currentVersion = parseFloat(current.id.split("-")[1]);
        return (currentVersion > prevVersion) ? current : prev;
      });
      // console.log(highestGPTModel);
      const GPTModel = highestGPTModel.id
      // 账号类型
      // const plan = subscriptionData.plan.title
      const plan = (subscriptionData.plan.title === "Pay-as-you-go") ? "Pay-as-you-go" : subscriptionData.plan.id;

      // 总
      const total_granted = subscriptionData.hard_limit_usd;
      // 已用
      const total_used = usageData.total_usage / 100
      // 剩余额度
      const total_available = total_granted - total_used;

      return { plan, total_granted, total_used, total_available, endDate, startDate, GPTModel }

    }

  } catch (error) {
    console.error(error)
  }
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(null)
  const [alert, setAlert] = useState(null)
  const keyRef = useRef(null)
  const [ipinfo, setIpinfo] = useState('正在获取 IP 信息...')
  const [latency, setLatency] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [proxylink, setproxyLink] = useState("");

  useEffect(() => {
    const { origin } = location;
    setproxyLink(`${origin}/api`);
    // 底部ip获取
    fetch('https://forge.speedtest.cn/api/location/info')
      .then(res1 => res1.json())
      .then((res1) => {
        const info1 = `${res1.ip} (${res1.province} ${res1.city} ${res1.distinct} ${res1.isp})`
        setIpinfo(info1)
      })
      .catch(err => {
        console.log(err);
        setIpinfo('获取国内的IP信息失败')
      })

    const numTests = 3; // 进行 3 次测试
    let totalLatency = 0;
    for (let i = 0; i < numTests; i++) {
      const t1 = performance.now();
      fetch('/api/v1/chat/completions')
        .then(response => {
          const t2 = performance.now();
          const testLatency = t2 - t1;
          // console.log(testLatency);
          totalLatency += testLatency;

          if (i === numTests - 1) {
            setLatency(totalLatency / numTests);
            setIsLoading(false);
          }
        })
      // .catch(err=>{
      //   console.log(err);
      //   setLatency('获取平均响应时间失败');
      //   setIsLoading(false);
      // })
    }
  }, [])


  let latencyColor = 'black';


  if (latency !== null) {
    if (latency >= 500) {
      latencyColor = 'red';
    } else if (100 < latency <= 500) {
      latencyColor = 'orange';
    } else if (latency <= 100) {
      // console.log(latency);
      latencyColor = 'green';
    }
  }



  const handleClick = async () => {
    setAlert(null)
    setLoading(true)
    const key = keyRef.current.value
    if (/^sk-.{21,}$/.test(key)) {
      await submit(key)
        .then((data) => {
          if (data.hasOwnProperty('total_granted')) {
            setBalance(data)
            setLoading(false)
            setAlert({ type: 'success', message: '查询成功' })
          } else if (data.hasOwnProperty('error')) {
            // console.log(data);
            setLoading(false)
            setAlert({ type: 'error', message: data.error.message })
          }
        })
        .catch(e => {
          // console.log(e);
          setAlert({ type: 'error', message: '查询失败，请检查 API Key 是否正确' })
          setLoading(false)
        })
    } else {
      setAlert({ type: 'error', message: 'API Key 格式不正确' })
      setLoading(false)
    }
  }



  return (
    <>
      <Head>
        <title>OPENAI API PROXY</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/png;base64,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
"/>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>查询 ChatGPTAPI 余额</h1>
        </header>
        <main className={styles.main}>

          {alert && (
            <p className={`${styles.alert} ${styles[alert?.type]}`}>{alert?.message}</p>

          )}
          <input className={styles.input} placeholder="请输入以sk-开头的key..." ref={keyRef} /><br />
          <button className={`${styles.button} ${loading ? styles.loading : ''}`} disabled={loading} onClick={handleClick}>
            {loading ? 'Loading...' : '查询'}
          </button>
          <p className={styles.balance}>API接口：<a className={styles.proxy}>{proxylink}</a></p>
          {balance && (
            <div className={styles.balance}>
              <p>账号类型：{balance.plan}</p>
              <p>额度总量：{balance.total_granted}</p>
              <p>已用额度：{balance.total_used}</p>
              <p>剩余额度：{balance.total_available}</p>
              <p>最高模型：{balance.GPTModel}</p>
              <p>有效期为赠送额度的有效期</p>
              <p>有效期起：{formatDate(balance.startDate)}</p>
              <p>有效期止：{formatDate(balance.endDate)}</p>

            </div>
          )}


        </main>

        <footer className={styles.footer}>
          <i><a className={styles.a} href="https://github.com/x-dr/chatgptProxyAPI">By @x-dr</a></i>
          {isLoading ? (
            <p>正在测试响应时间...</p>
          ) : (
            <p style={{ color: latencyColor }}>API平均响应时间：{latency.toFixed(2)}ms</p>
          )}
          <p >{ipinfo}</p>
          {/* <p >{ipinfov}</p> */}

        </footer>

      </div>
      <style global jsx>{`
            :root {
              --color-primary: #5c7cfa;
              --color-primary-dark: #4263eb;
              --color-primary-alpha: #5c7cfa50;
            
              --body-color: #495057;
              --body-bg: #f8f9fa;
            
              --border-color: #dee2e6;
            }

            body {
              margin: 0;
              padding: 0;

              max-width: 30rem;
              margin-left: auto;
              margin-right: auto;
              padding-left: 2rem;
              padding-right: 2rem;
              color: var(--body-color);
              background: var(--body-bg);
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
              text-rendering: optimizelegibility;
              -webkit-font-smoothing: antialiased;
            }
            @keyframes rotate {
              100% {
                  transform: rotate(360deg);
              }
            }

       `}</style>
    </>
  )
}


