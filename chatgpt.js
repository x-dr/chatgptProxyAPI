import { ChatGPTAPI} from 'chatgpt';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
let apiKey = '';

const api = new ChatGPTAPI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
const chatgptMsg = async (request,opts={})=>{   
    let response 
    try{
        response = await api.sendMessage(request, opts);

    }catch(e){
        if (e.message === 'ChatGPTAPI error 429') {
            response = {
                'role': 'bot',
                'id': '0',
                'text': "🤒🤒🤒出了一点小问题，请稍后重试下..."
              }
          }
          console.error(e);
    }
    // console.log(response.text);
    return response

}



// const id = await chatgptMsg("写一个JavaScript holle word")

        
// chatgptMsg("详细点",{parentMessageId: id.id})

export default chatgptMsg