'use client';

import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister
} from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors
}

const theme = localStorage.getItem('theme');

let divClassName = `font-light py-2 px-4 w-full rounded-full focus:outline-none`;

if (theme == "dark") {
  divClassName += ` text-white bg-gray-900`;
} else {
  divClassName += ` text-black bg-neutral-100`;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  placeholder, 
  id, 
  type, 
  required, 
  register, 
}) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className={divClassName}/>
    </div>
   );
}
 
export default MessageInput;