import { Message, OpenAIModel, OpenAIModelID } from "@/types";
import { IconPlayerStop, IconSend } from "@tabler/icons-react";
import { FC, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from "react";

interface Props {
  messageIsStreaming: boolean;
  onSend: (message: Message) => void;
  model: OpenAIModel;
  stopConversationRef: MutableRefObject<boolean>;
}

const sendTimeKey = 'savesendtime_11113333abc';
function setSendTime(){
  localStorage.setItem(sendTimeKey,`${+new Date()}`);
}

function getSendTime(){
  let cache = localStorage.getItem(sendTimeKey);
  if(!cache){
    setSendTime();
    return +new Date();
  }
  return parseInt(cache,10);
}

function checkSendTime(){
  const len = 5000;
  const cacheTime = getSendTime();
  if(!cacheTime){
    setSendTime();
    return true;
  }
  const flag = +new Date() - getSendTime() >len;
  if(flag) {
    setSendTime();
    return true;
  }
  return false;
}


export const ChatInput: FC<Props> = ({ onSend, messageIsStreaming, model, stopConversationRef }) => {
  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = model.id === OpenAIModelID.GPT_3_5 ? 12000 : 24000;

    if (value.length > maxLength) {
      alert(`Message limit is ${maxLength} characters`);
      return;
    }

    setContent(value);
  };

  const PWDS: any = ['1024', '9527', '3306', '1688'];
  const PwdKey = 'pwdkeys121212';
  function getPwd() {
    const str = localStorage.getItem(PwdKey);
    return str;
  }
  function setPwd(val: string) {
    localStorage.setItem(PwdKey, val);
  }
  function checkPwd(val: string) {
    return PWDS.indexOf(val) > -1;
  }

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    //判断访问密码,否则提示关注公众号
    if (!getPwd()) {
      var val = prompt("请输入访问密码,关注程序员饭哥公众号，回复 '登录' 获得密码。", "") || '';
      if(!val) return;
      if(!checkPwd(val)){
        alert('密码错误！')
        return;
      }else{
        setPwd(val)
        alert('验证通过！')
      }
    }

    if (!content) {
      return;
    }

     //在这里设置时间间隔
     if(!checkSendTime()){
      alert('由于官方接口速率限制，请和上次发送间隔5秒后发送!');
      return;
    }

    onSend({ role: "user", content });
    setContent("");

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const isMobile = () => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      if (e.key === "Enter" && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? "auto" : "hidden"}`;
    }
  }, [content]);

  function handleStopConversation() {
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  }

  return (
    <div className="absolute bottom-0 left-0 w-full dark:border-white/20 border-transparent dark:bg-[#444654] dark:bg-gradient-to-t from-[#343541] via-[#343541] to-[#343541]/0 bg-white dark:!bg-transparent dark:bg-vert-dark-gradient pt-6 md:pt-2">
      <div className="stretch mx-2 md:mt-[52px] mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        {messageIsStreaming && (
          <button
            className="absolute -top-2 md:top-0 left-0 right-0 mx-auto dark:bg-[#343541] border w-fit border-gray-500 py-2 px-4 rounded text-black dark:text-white hover:opacity-50"
            onClick={handleStopConversation}
          >
            <IconPlayerStop
              size={16}
              className="inline-block mb-[2px]"
            />{" "}
            停止回答
          </button>
        )}
        <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-[#40414F] rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
          <textarea
            ref={textareaRef}
            className="text-black dark:text-white m-0 w-full resize-none outline-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
            style={{
              resize: "none",
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: "400px",
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? "auto" : "hidden"}`
            }}
            placeholder="请输入内容..."
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <button
            className="absolute right-5 focus:outline-none text-neutral-800 hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-neutral-200 dark:bg-opacity-50 hover:bg-neutral-200 p-1 rounded-sm"
            onClick={handleSend}
          >
            <IconSend
              size={16}
              className="opacity-60"
            />
          </button>
        </div>
      </div>
      <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
        bigerfe.com(大前端面试题库) - 拟gpt官方UI，对接官方API，只需绑定Key即可对话。<a href="https://qiniu.bigerfe.com/fangegongzonghao.jpg" style={{ color: '#fff', fontWeight: 'bold' }} target="_blank">站长公众号点这里</a>
      </div>
    </div>
  );
};
