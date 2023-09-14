'use client';

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";
import E2EE from '@chatereum/react-e2ee';
import { FiTrash2 } from 'react-icons/fi';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';


interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  onDeleteMessage: (messageId: string) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
                                                 data,
                                                 isLast,
                                                 onDeleteMessage, // Receive the prop
                                               }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [rawMessage, setRawMessage] = useState("")
  let aes_key = "DsAR2grrUQP0axdEbcqZXWMQGZ3Z5s4Gmza7nzaPudHK+C5pu9XqHUFDE+a6/Kw26Druo9oiJQMgocS7PRCGLLEho6eVhR5Hrte2hnx1HbycTXNVbZsD1+NG5y4EN7dirT7fNcJGs2AwqyxcgiMS1Uqw6U9pJ+BbpjsRVVpcTRQ6gKue1IZj5PEda5YsrcU/JpX/W3kM3/9nNSpvWIorQc5CVKwquPL7+7gEj1K83+bAfc1pNjkf4kyw1ah2XG5cOUB77KAqLL/MUue3bzq+ajPiE4Ab8tl8T1nf5mXrk026Uw5SaA0KWK8RV9QpRQaJGCGDttuw2ZdbnhEO3Z9HAI0wyimebpLdcYd+LZn4HGE8Yp1l1+guxRcZcBDpVPodzYJoL/7oCmGea9mK9jQPQhIVTPX5Tsx51ipsc07LykRz7FjQMytEGYjcy+MfMMKbXKU7OF7c8yMUgTCHT3DP0DUaw4uxMRhXaBdEOCnUVObO/NR4k+fyYZwd197PRoLC9KnZpmBKXwteFns+yq600dj13ZiXwuzcNYlBnRVSLwyD5lqHtBHS1wLQ9Sfci3tPDJCB1QLXJ5uIiZkrtNuyrp/fCwk1lujiEiWW6ZW/8UzJwboExNNenvH6B7j5gVgXLN3SQY1Hu7di638AUecvz7t0racULa3xB9F8EKt09bk="


  const isOwn = session.data?.user?.email === data?.sender?.email
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  const theme = localStorage.getItem('theme');

  let divClassName = ``;

  if (theme == "dark") {
    divClassName = ` bg-gray-600 text-white`;
  } else {
    divClassName += ` bg-gray-100`;
  }

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden', 
    isOwn ? 'bg-sky-500 text-white' : `${divClassName}`,
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );

  let desiredString = ""
  if (data.body != null) {
    let startIndex = data.body.indexOf(aes_key) + aes_key.length;
    let endIndex = data.body.lastIndexOf(aes_key);
    desiredString = data.body.substring(startIndex, endIndex);
    data.body = desiredString;
  }

  useEffect(()=>{


    if(isOwn){
      setRawMessage(data.body || "")
    }
    else{
    // E2EE.decrypt(data.encryptedMsg?.aes_key!, data.encryptedMsg?.iv!, localStorage.getItem("private_key")! ,data.encryptedMsg?.cipher_text!).then(msg =>{
    //   setRawMessage(msg)
    //
    // })
  }
  },[])

  const handleDeleteMessage = async () => {
    let deleteMsgId = data.id;
    if (deleteMsgId) {
      try {
        await fetch(`/api/messages/${deleteMsgId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        onDeleteMessage(deleteMsgId);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async (langpair: string) => {
    try {
      if (!translatedText && data.body !== null) {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(data.body)}&langpair=${langpair}`);
        const responseData = await response.json();
        setTranslatedText(responseData.responseData.translatedText);
      }
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const handleToggleTranslation = (langpair: string) => {
    handleTranslate(langpair);
    setShowTranslation(!showTranslation);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [messageData, setMessageData] = useState(data);
  const handleLikeClick = async () => {
    try {
      // Toggle the isLiked property locally to provide immediate UI feedback
      const updatedData = { ...messageData, isLiked: !messageData.isLiked };
      // Update the UI with the new data
      setMessageData(updatedData);

      // Send a PUT request to update the isLiked property on the server
      await fetch(`/api/messages/likedMessages/${messageData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId: messageData.id, isLiked: !messageData.isLiked }), // Toggle the isLiked property
      });
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  return (
      <div className={container}>
        <div className={avatar}>
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">
              {data.sender.name}
            </div>
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), 'p')}
            </div>
          </div>
          <div className={message}>
            <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
            {data.image ? (
                <div>
                  <Image
                      alt="Image"
                      height="288"
                      width="288"
                      onClick={() => setImageModalOpen(true)}
                      src={data.image}
                      className="object-cover cursor-pointer hover:scale-110 translate"
                  />
                </div>
            ) : (
                <div className="flex items-center">
                  {isOwn && (
                      <>
                    <span className="text-red-500 cursor-pointer hover:text-red-600 " onClick={handleDeleteMessage}>
                        <FiTrash2 size={15} className="mr-1" />
                      </span>
                        <span className=" text-yellow-300 cursor-pointer">
                            {!data.isLiked && (
                                <AiOutlineLike size={18} className="mr-1"/>
                            )}
                            {data.isLiked && (
                                <AiFillLike size={18} className="mr-1"/>
                            )}
                        </span>
                      </>
                  )}
                  <span>{data.body}</span>
                  {!isOwn && (
                      <span className="text-blue-600 cursor-pointer hover:text-blue-900 " onClick={() => handleToggleTranslation('hr|en')}>
                        <span className="ml-2">EN</span>
                      </span>
                  )}
                  {!isOwn && (
                      <span className="text-red-400 cursor-pointer hover:text-red-800 " onClick={() => handleToggleTranslation('en|hr')}>
                        <span className="ml-2">HR</span>
                      </span>
                  )}
                  {!isOwn && (
                      <span className=" ml-3 text-blue-400 cursor-pointer hover:text-red-800 " onClick={handleLikeClick}>
                      {!data.isLiked && (
                          <AiOutlineLike size={18}/>
                      )}
                      {data.isLiked && (
                         <AiFillLike size={18}/>
                      )}
                      </span>
                )}
                </div>
            )}
          </div>
          {showTranslation && (
              <div className={`${message} bg-gray-500`} >
                {translatedText}
              </div>
          )}
          {isLast && isOwn && seenList.length > 0 && (
              <div className="text-xs font-light text-gray-500">
                {`Seen by ${seenList}`}
              </div>
          )}
        </div>
      </div>
  );


}
 
export default MessageBox;