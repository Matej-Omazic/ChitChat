import Link from "next/link";

import clsx from "clsx";
import React from "react";

interface MobileItemProps {
  href: string;
  //icon: any;
  active?: boolean;
  text: string;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({ 
  href, 
  //icon: Icon,
  text,
  active,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return ( 
    <Link 
      onClick={handleClick} 
      href={href} 
      className={clsx(`
        group 
        flex 
        gap-x-3 
        text-sm 
        leading-6 
        font-semibold 
        w-full 
        justify-center 
        p-4 
        text-gray-500 
        hover:text-black 
        hover:bg-gray-100
      `,
        active && 'bg-gray-100 text-black',
      )}>
      <div>{text}</div>
    </Link>
   );
}
 
export default MobileItem;