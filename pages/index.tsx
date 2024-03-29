import { Chat } from "@/components/Chat/Chat";
import { Navbar } from "@/components/Mobile/Navbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ChatBody, Conversation, KeyValuePair, Message, OpenAIModel, OpenAIModelID, OpenAIModels } from "@/types";
import { cleanConversationHistory, cleanSelectedConversation } from "@/utils/app/clean";
import { DEFAULT_SYSTEM_PROMPT, RES_CODE_MAP, RES_CODE_ARRAY } from "@/utils/app/const";
import { saveConversation, saveConversations, updateConversation } from "@/utils/app/conversation";
import { exportConversations, importConversations } from "@/utils/app/data";
import { IconArrowBarLeft, IconArrowBarRight } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import clientMd5 from "@/utils/common/client-md5";

// 获得签名
function getSign(messages: Array<any>, time: string) {
  const msg:any = messages.length ? messages[messages.length - 1] : '';
  const PubSignKey = 'chatgpt-bigerfe-start-$%^&*()_';
  return clientMd5(`${time}${msg.content}${time}${PubSignKey}`);
}
const CountKey = 'test12345';
const GuestKey = 'gk-guest3BlbkFJh';
const CanSendCount = 5; //可以体验15条

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [lightMode, setLightMode] = useState<"dark" | "light">("dark");
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [messageError, setMessageError] = useState<boolean>(false);
  const [modelError, setModelError] = useState<boolean>(false);
  const stopConversationRef = useRef<boolean>(false);

  function initSetCount(){
      let str='';
      let cache = localStorage.getItem(CountKey);
      if(cache){
        return false;
      }
      for(let i=0;i<300;i++){
        str+='a';
      }
      localStorage.setItem(CountKey,str);
  }
  function sendSetCount(){
    if(apiKey !== GuestKey){return false;}
    let str = localStorage.getItem(CountKey);
    if(str){
      localStorage.setItem(CountKey, str.replace('a',''));
    }else{
      initSetCount();
    }
  }
  function canSend(){
    initSetCount();
    const str = localStorage.getItem(CountKey);
    if(!str) return false;
    return str.length >=300 - CanSendCount;
  }

  const handleSend = async (message: Message, isResend: boolean) => {
    if(!apiKey) {
      alert('请先绑定key!!')
      return;
    }
    if(apiKey === GuestKey){
      if(!canSend()){
        alert(`您的${CanSendCount}次体验已用完！去公众号回复"卡密"，领取正式卡密！卡密每7天重置一次，到时可重新领取！`);
        return false;
      }
    }

    if (selectedConversation) {
      let updatedConversation: Conversation;

      if (isResend) {
        const updatedMessages = [...selectedConversation.messages];
        updatedMessages.pop();

        updatedConversation = {
          ...selectedConversation,
          messages: [...updatedMessages, message]
        };
      } else {
        updatedConversation = {
          ...selectedConversation,
          messages: [...selectedConversation.messages, message]
        };
      }

      setSelectedConversation(updatedConversation);
      setLoading(true);
      setMessageIsStreaming(true);
      setMessageError(false);

      const reqTime = `${+new Date()}`;
      const chatBody: ChatBody = {
        model: updatedConversation.model,
        messages: updatedConversation.messages,
        key: apiKey,
        prompt: updatedConversation.prompt,
        t: reqTime,
        sign: getSign(updatedConversation.messages, reqTime),
      };

      const controller = new AbortController();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify(chatBody)
      });

      // 做次数累计
      sendSetCount();
      if (!response.ok) {
        setLoading(false);
        setMessageIsStreaming(false);
        setMessageError(true);
        return;
      }

      const data = response.body;
      
      if (!data) {
        setLoading(false);
        setMessageIsStreaming(false);
        setMessageError(true);

        return;
      }

      if (updatedConversation.messages.length === 1) {
        const { content } = message;
        const customName = content.length > 30 ? content.substring(0, 30) + "..." : content;

        updatedConversation = {
          ...updatedConversation,
          name: customName
        };
      }

      setLoading(false);

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirst = true;
      let text = "";

      while (!done) {
        if (stopConversationRef.current === true) {
          controller.abort();
          done = true;
          break;
        }
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        text += chunkValue;

        if (isFirst) {
          isFirst = false;
          const updatedMessages: Message[] = [...updatedConversation.messages, { role: "assistant", content: chunkValue }];

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
          };

          setSelectedConversation(updatedConversation);
        } else {
          const updatedMessages: Message[] = updatedConversation.messages.map((message, index) => {
            if (index === updatedConversation.messages.length - 1) {
              return {
                ...message,
                content: text
              };
            }

            return message;
          });

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
          };

          setSelectedConversation(updatedConversation);
        }
      }

      saveConversation(updatedConversation);

      const updatedConversations: Conversation[] = conversations.map((conversation) => {
        if (conversation.id === selectedConversation.id) {
          return updatedConversation;
        }

        return conversation;
      });

      if (updatedConversations.length === 0) {
        updatedConversations.push(updatedConversation);
      }

      setConversations(updatedConversations);

      saveConversations(updatedConversations);

      setMessageIsStreaming(false);
    }
  };

  const fetchModels = async (key: string) => {
    const response = await fetch("/api/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key
      })
    });

    if (!response.ok) {
      setModelError(true);
      return;
    }

    const data = await response.json();

    if (!data) {
      setModelError(true);
      return;
    }

    setModels(data);
    setModelError(false);
  };

  const handleLightMode = (mode: "dark" | "light") => {
    setLightMode(mode);
    localStorage.setItem("theme", mode);
  };

  const handleApiKeyChange = (apiKey: string) => {
    setApiKey(apiKey);
    localStorage.setItem("apiKey", apiKey);
  };

  const handleExportConversations = () => {
    exportConversations();
  };

  const handleImportConversations = (conversations: Conversation[]) => {
    importConversations(conversations);
    setConversations(conversations);
    setSelectedConversation(conversations[conversations.length - 1]);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    saveConversation(conversation);
  };

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: lastConversation ? lastConversation.id + 1 : 1,
      name: `对话 ${lastConversation ? lastConversation.id + 1 : 1}`,
      messages: [],
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      prompt: DEFAULT_SYSTEM_PROMPT
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    setLoading(false);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(updatedConversations[updatedConversations.length - 1]);
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT
      });
      localStorage.removeItem("selectedConversation");
    }
  };

  const handleUpdateConversation = (conversation: Conversation, data: KeyValuePair) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value
    };

    const { single, all } = updateConversation(updatedConversation, conversations);

    setSelectedConversation(single);
    setConversations(all);
  };

  const handleClearConversations = () => {
    setConversations([]);
    localStorage.removeItem("conversationHistory");

    setSelectedConversation({
      id: 1,
      name: "New conversation",
      messages: [],
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      prompt: DEFAULT_SYSTEM_PROMPT
    });
    localStorage.removeItem("selectedConversation");
  };

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (apiKey) {
      fetchModels(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setLightMode(theme as "dark" | "light");
    }

    const apiKey = localStorage.getItem("apiKey");
    if (apiKey) {
      setApiKey(apiKey);
      fetchModels(apiKey);
    }

    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const conversationHistory = localStorage.getItem("conversationHistory");
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] = JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(parsedConversationHistory);
      setConversations(cleanedConversationHistory);
    }

    const selectedConversation = localStorage.getItem("selectedConversation");
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation = JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(parsedSelectedConversation);
      setSelectedConversation(cleanedSelectedConversation);
    } else {
      setSelectedConversation({
        id: 1,
        name: "New conversation",
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT
      });
    }
  }, []);

  const WebSiteStatus = 1; //0关闭 1启动

  if(!WebSiteStatus)
  return <>
  <div style={{color:'white'}}>当前访问人数过多，请稍后重试.</div>
  </>

  return (
    <>
      <Head>
        <title>chatGPT中文版 - 国内直接使用</title>
        <meta
          name="description"
          content="ChatGPT but better."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      {selectedConversation && (
        <main className={`flex flex-col h-screen w-screen text-white dark:text-white text-sm ${lightMode}`}>
          <div className="sm:hidden w-full fixed top-0">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          <article className="flex h-full w-full pt-[48px] sm:pt-0">
            {showSidebar ? (
              <>
                <Sidebar
                  loading={messageIsStreaming}
                  conversations={conversations}
                  lightMode={lightMode}
                  selectedConversation={selectedConversation}
                  apiKey={apiKey}
                  onToggleLightMode={handleLightMode}
                  onNewConversation={handleNewConversation}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onToggleSidebar={() => setShowSidebar(!showSidebar)}
                  onUpdateConversation={handleUpdateConversation}
                  onApiKeyChange={handleApiKeyChange}
                  onClearConversations={handleClearConversations}
                  onExportConversations={handleExportConversations}
                  onImportConversations={handleImportConversations}
                />

                <IconArrowBarLeft
                  className="fixed top-2.5 left-4 sm:top-1 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8 sm:hidden"
                  onClick={() => setShowSidebar(!showSidebar)}
                />
              </>
            ) : (
              <IconArrowBarRight
                className="fixed text-white z-50 top-2.5 left-4 sm:top-1.5 sm:left-4 sm:text-neutral-700 dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 h-7 w-7 sm:h-8 sm:w-8"
                onClick={() => setShowSidebar(!showSidebar)}
              />
            )}

            <Chat
              conversation={selectedConversation}
              messageIsStreaming={messageIsStreaming}
              apiKey={apiKey}
              modelError={modelError}
              messageError={messageError}
              models={models}
              loading={loading}
              lightMode={lightMode}
              onSend={handleSend}
              onUpdateConversation={handleUpdateConversation}
              stopConversationRef={stopConversationRef}
            />
          </article>
        </main>
      )}
    </>
  );
}
