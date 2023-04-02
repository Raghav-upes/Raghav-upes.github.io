import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react';
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
const API_KEY="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";
function App() {
 
library.add(faCamera)

const camera = icon({ prefix: 'fas', iconName: 'camera' })
  const [typing,setTyping]=useState(false);
  const [color,setColor]=useState("primary");
  const [input,setInput]=useState("");
  const [messages, setMessages] = useState([
    {
      message: "नमस्कार हरि राम मैं ChatGPT हूँ",
      sender: "ChatGPT",
    }
  ])
   const handleSend=async(message)=>{
const newMessage={
  message:message,
  sender:"user",
  direction:"outgoing"
}
const newMessages=[...messages,newMessage];
setMessages(newMessages);
setTyping(true);
await messageTochatGpt(newMessages);
   }
   async function messageTochatGpt(chatMessages){
   let apiMessage=chatMessages.map((messageObject)=>{
    let role="";
    if(messageObject.sender=="ChatGPT"){
      role="assistant";
    }else{
      role="user";
    }
    return {role:role,content:messageObject.message}
   })
   const systemMeassage={
   role:"system",
   content:"always speak in hindi what is command always respond in hindi"
   }
   const apiRequestBody={
    "model":"gpt-3.5-turbo",
    "messages":[
      systemMeassage,
      ...apiMessage
    ]
   }
   await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Authorization":"Bearer "+API_KEY,
      "Content-Type":"application/json"
    },
    body:JSON.stringify(apiRequestBody)
   }).then((data)=>{
    return data.json();
   }).then((data)=>{
    console.log(data);
    console.log(data.choices[0].message.content);
    setMessages([
      ...chatMessages,{
        message:data.choices[0].message.content,
        sender:"ChatGPT"
      }
    ])
    setTyping(false);
   })
   }
   function voice(){
    setColor("danger");
    const reco = new webkitSpeechRecognition();
    reco.lang="hi";
    reco.onresult=function(event){
      handleSend(event.results[0][0].transcript);
      console.log(event);
      setInput(event.results[0][0].transcript)
      
      console.log(event.results[0][0].transcript)
      setColor("primary");
    }
    reco.start();
   }
  return (
    <div className="App">
      <div className="container-fluid">
        <div className="title">
        <p className='heading'>ChatGPT</p>
        <p className='heading hari'>for हरि राम</p>
        </div>
     <div className='container chatBox'>
      <div className='container d-flex justify-content-end'>
     <button onClick={voice} type="button" className={`btn btn-${color}`}><img className="img-fluid" src='https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/256/external-microphone-digital-marketing-tanah-basah-glyph-tanah-basah.png'/></button>
     </div>
     <MainContainer className='mainContainer'>
    <ChatContainer>
      
      <MessageList
      scrollBehavior='smooth'
      typingIndicator={typing?<TypingIndicator content="ChatGPT सोच रहा है"/>:null} className='messageList'>
       {messages.map((message,i)=>{
           return <Message key={i} model={message}/>
       })}
       
      </MessageList>
      
      <MessageInput placeholder="Type message here" onSend={handleSend} id='speechTotext' attachButton={false} />
    </ChatContainer>
  </MainContainer>
  </div>
     </div>
    </div>
  )
}

export default App
