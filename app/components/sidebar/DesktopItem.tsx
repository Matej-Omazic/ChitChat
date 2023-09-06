'use-client'

import clsx from 'clsx';
import React from 'react'
import Link from "next/link"

interface DesktopItemProps {
  label: string;
  //icon: any;
  href: string;
  text: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({ 
  label, 
  href, 
  //icon: Icon,
  text, 
  active,
  onClick
}) => {
  const handleClick = () =>{
    if(onClick){
      return onClick()
    }
  }
  return(
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(`
            group 
            flex 
            gap-x-3 
            rounded-md 
            p-3 
            text-sm 
            leading-6 
            font-semibold 
            text-gray-500 
            hover:text-black 
            hover:bg-blue-300
          `,
            active && 'bg-gray-100 text-black'
          )}
      >
        <div>{text}</div>
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  )
}

export default DesktopItem
