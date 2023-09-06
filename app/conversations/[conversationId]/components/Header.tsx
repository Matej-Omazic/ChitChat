'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";

import useOtherUser from "@/app/hooks/useOtherUser";
import useActiveList from "@/app/hooks/useActiveList";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import ProfileDrawer from "./ProfileDrawer";
import ConfirmModal from "@/app/conversations/[conversationId]/components/ConfirmModal";
import Image from "next/image";
import {FiTrash2} from "react-icons/fi";

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}



const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline'
  }, [conversation, isActive]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };


  const [confirmOpen, setConfirmOpen] = useState(false);


  const theme = localStorage.getItem('theme');

  let divClassName = `w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm`;
  let divClassNameV2 = `text-smtext-neutral-500`;
  let divClassNameV3 = `flex flex-col`;
  let divClassNameV4 = `absolute right-0 mt-2 py-2 w-48 border rounded-lg shadow-lg`;

  if (theme == "dark") {
    divClassName += ` bg-gray-800 border-gray-900`;
    divClassNameV2 += ` font-light text-white`
    divClassNameV3 += ` text-white`
    divClassNameV4 += ` bg-gray-800`
  } else {
    divClassName += ` bg-white`;
    divClassNameV2 += `  font-light`;
    divClassNameV4 += ` bg-white`
  }


  return (
  <>

    <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
    />
    <ProfileDrawer 
      data={conversation} 
      isOpen={drawerOpen} 
      onClose={() => setDrawerOpen(false)}
    />
    <div
        className={divClassName}>
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations" 
          className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className={divClassNameV3}>
          <div>{conversation.name || otherUser.name}</div>

          {otherUser.status == "default" && (
              <div className={divClassNameV2}>{statusText}</div>
          )}
          {otherUser.status == "away" && (
              <div className="flex items-center">
                <span className="block rounded-full bg-red-500 ring-2 ring-white h-2 w-2 md:h-3 md:w-3" />
                <div className={divClassNameV2}>Away</div>
              </div>
          )}
          {otherUser.status == "invisible" && (
            <div className={divClassNameV2}>Offline</div>
        )}

        </div>
      </div>
      <div>

        <div className="relative inline-block text-sky-500">
          <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:text-sky-600 transition ease-in-out duration-150 focus:outline-none focus:ring"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isOpen && (
              <div className={divClassNameV4}>
                <button
                    className="block px-4 py-2 text-sm text-left text-red-500 hover:bg-red-100 w-full focus:outline-none"
                    onClick={() => setConfirmOpen(true)}
                >
                  Delete conversation
                </button>
                <button
                    className="block px-4 py-2 text-sm text-left text-blue-500 hover:bg-blue-100 w-full focus:outline-none"
                    onClick={() => setDrawerOpen(true)}
                >
                  User info
                </button>
              </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}
 
export default Header;