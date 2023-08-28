import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";

const useRoutes = () => {
    const pathname = usePathname()
    const {conversationId} = useConversation()

    const routes = useMemo(() => [
        { 
          label: 'Chat', 
          href: '/conversations', 
          icon: HiChat,
          text: "Chat",
          active: pathname === '/conversations' || !!conversationId
        },
        { 
          label: 'Users', 
          href: '/users', 
          icon: HiUsers,
          text: "Users",
          active: pathname === '/users'
        },
        {
          label: 'Logout', 
          onClick: () => signOut(),
          href: '#',
          text: "Logout",
          icon: HiArrowLeftOnRectangle,
        }
      ], [pathname, conversationId]);
    
      return routes;
}

export default useRoutes;

