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

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data, 
  isLast
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
    // console.log("ME: ", session.data?.user?.email)
    // console.log("NOT ME: ", data?.sender?.email)



    console.log("MSG: ", data.body)
    console.log("MINE: ", isOwn)

    if(isOwn){
      console.log("DATA: ", data.body)
      setRawMessage(data.body || "")
    }
    else{
    // E2EE.decrypt(data.encryptedMsg?.aes_key!, data.encryptedMsg?.iv!, localStorage.getItem("private_key")! ,data.encryptedMsg?.cipher_text!).then(msg =>{
    //   setRawMessage(msg)
    //
    // })
  }
  },[])

  return ( 
    <div className={container}>
      <div className={avatar}>
        {/* <Avatar user={data.sender} /> */}
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
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)} 
              src={data.image} 
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div 
            className="
            text-xs 
            font-light 
            text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
   );
}
 
export default MessageBox;