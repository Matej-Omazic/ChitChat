'use client';

import { 
  HiPaperAirplane, 
  HiPhoto
} from "react-icons/hi2";
// import MessageInput from "./MessageInput";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from "react-hook-form";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import E2EE from '@chatereum/react-e2ee';
import {useEffect} from "react";

interface FormProps {
  recipientId: string
}

const Form: React.FC<FormProps> = ({recipientId}) => {
  const { conversationId } = useConversation();
  let aes_key = "DsAR2grrUQP0axdEbcqZXWMQGZ3Z5s4Gmza7nzaPudHK+C5pu9XqHUFDE+a6/Kw26Druo9oiJQMgocS7PRCGLLEho6eVhR5Hrte2hnx1HbycTXNVbZsD1+NG5y4EN7dirT7fNcJGs2AwqyxcgiMS1Uqw6U9pJ+BbpjsRVVpcTRQ6gKue1IZj5PEda5YsrcU/JpX/W3kM3/9nNSpvWIorQc5CVKwquPL7+7gEj1K83+bAfc1pNjkf4kyw1ah2XG5cOUB77KAqLL/MUue3bzq+ajPiE4Ab8tl8T1nf5mXrk026Uw5SaA0KWK8RV9QpRQaJGCGDttuw2ZdbnhEO3Z9HAI0wyimebpLdcYd+LZn4HGE8Yp1l1+guxRcZcBDpVPodzYJoL/7oCmGea9mK9jQPQhIVTPX5Tsx51ipsc07LykRz7FjQMytEGYjcy+MfMMKbXKU7OF7c8yMUgTCHT3DP0DUaw4uxMRhXaBdEOCnUVObO/NR4k+fyYZwd197PRoLC9KnZpmBKXwteFns+yq600dj13ZiXwuzcNYlBnRVSLwyD5lqHtBHS1wLQ9Sfci3tPDJCB1QLXJ5uIiZkrtNuyrp/fCwk1lujiEiWW6ZW/8UzJwboExNNenvH6B7j5gVgXLN3SQY1Hu7di638AUecvz7t0racULa3xB9F8EKt09bk="

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue('message', '', { shouldValidate: true });
    const encryptedMsg = await E2EE.encrypt(localStorage.getItem(recipientId) || "", data.message)

    data.message = aes_key + data.message + aes_key;

    axios.post('/api/messages', {
      ...data,
      encryptedMsg,
      conversationId: conversationId
    })
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId
    })
  }

  const theme = localStorage.getItem('theme');

  let divClassName = `py-4 px-4 border-t flex items-center gap-2 lg:gap-4 w-full`;

  if (theme == "dark") {
    divClassName += ` bg-gray-800 border-gray-900`;
  } else {
    divClassName += ` bg-white`;
  }

  return ( 
    <div className={divClassName}>
       <CldUploadButton
      options={{ maxFiles: 1 }}
      onUpload={handleUpload}
      uploadPreset="oal1jcee"
      >
      <HiPhoto size={30} className="text-sky-500" />
    </CldUploadButton>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput 
          id="message" 
          register={register} 
          errors={errors} 
          required 
          placeholder="Type a message"
        />
        <button type="submit" className=" rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition ">
          <div className="text-white"> Send</div>
        </button>
      </form>
    </div>
  );
}
 
export default Form;