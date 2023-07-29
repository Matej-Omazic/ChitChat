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

interface FormProps {
  recipientId: string
}

const Form: React.FC<FormProps> = ({recipientId}) => {
  const { conversationId } = useConversation();

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

  return ( 
    <div 
      className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      "
    >
      {/* <CldUploadButton 
        options={{ maxFiles: 1 }} 
        onUpload={handleUpload} 
        uploadPreset="oal1jcee"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton> */}
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
        <button 
          type="submit" 
          className="
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
        >
          {/* <HiPaperAirplane
            size={18}
            className="text-white"
          /> */}
          <div className="text-white"> Send</div>
        </button>
      </form>
    </div>
  );
}
 
export default Form;