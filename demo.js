import axios from 'axios';
const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
}
const requestPromise = async (params) => {
    return axios({
        url: params.url,
        method: params.method || 'POST',
        headers: params.headers || headers,
        data: params.body,
        validateStatus: status => {
            return status >= 200 && status < 400;
        },
        maxRedirects: 0
    })
        .then(res => {
            return res;
        })
        .catch(err => {
            // console.log(err);
            return err;
        })
}



let res = await requestPromise({
    url: 'https://api.api.api/chatgpt',
    body: {
        "q": 'What is OpenAI?'
    }

});

console.log(res.data.text);

res = await requestPromise({
    url: 'https://api.api.api/chatgpt',
    body: {
        "q": 'Can you expand on that?',
        "opts": {
            "parentMessageId": res.data.id
        }
    }

});

console.log(res.data.text);