'use client';

import axios from "axios";
import { use, useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find } from "lodash";
import { useSearchParams } from "next/navigation";
import Form from "./Form";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const searchParams = useSearchParams()
  const [recipientId, setRecipientId] = useState("")
  
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    axios.get(`/api/conversations/${conversationId}/getConversation`).then(data =>{
     const _recipientId = data.data.userIds[0]
     setRecipientId(_recipientId)

    })
  }, [conversationId]);

  useEffect(()=> {
    if(recipientId){
      axios.get(`/api/users/${recipientId}`).then(data =>{
      const publicKey = data.data.public_key
      localStorage.setItem(data.data.id, publicKey)
     })
    }
  }, [recipientId]) 

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });
      
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
  
        return currentMessage;
      }))
    };

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId]);



  const theme = localStorage.getItem('theme');

  let divClassName = `flex-1 overflow-y-auto`;

  if (theme == "dark") {
    divClassName += ` bg-gray-800`;
  } else {
    divClassName += ` bg-white`;
  }

  const handleDeleteMessage = (messageId: string) => {
    // Filter out the deleted message from the messages array
    setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== messageId)
    );
  };




  return ( 
    <>
    <div className={divClassName}>
      {messages.map((message, i) => (
          <MessageBox
              isLast={i === messages.length - 1}
              key={message.id}
              data={message}
              onDeleteMessage={handleDeleteMessage}
          />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
    <Form recipientId={recipientId} />
    </>
  );
}
 
export default Body;