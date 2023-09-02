'use client';

import DesktopItem from "./DesktopItem";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import Avatar from "../Avatar";
import { User } from "@prisma/client";

interface DesktopSidebarProps {
  currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser
}) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);


  return (
      <>
        <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className="hidden lg:fixed lg:inset-x-0 lg:top-0 lg:z-40 lg:h-20 lg:overflow-x-auto lg:border-b-[1px] lg:pr-4 lg:flex lg:flex-row justify-between pl-20 bg-blue-200 ">
          <nav className="mt-4 flex flex-row justify-between">
            <ul role="list" className="flex flex-row items-center space-x-1 ">
              
            <div
                onClick={() => setIsOpen(true)}
                className="cursor-pointer hover:opacity-75 transition"
            >
              {/* <Avatar user={currentUser} /> */}
              {currentUser.name}
            </div>
              {routes.map((item) => (
                  <DesktopItem
                      key={item.label}
                      href={item.href}
                      label={item.label}
                      //icon={item.icon}
                      text={item.text}
                      active={item.active}
                      onClick={item.onClick}
                  />
              ))}
            </ul>
            
          </nav>
        </div>
      </>
  );
}

export default DesktopSidebar;
