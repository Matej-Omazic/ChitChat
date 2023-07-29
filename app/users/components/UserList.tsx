'use client';

import { useState } from "react";
import { User } from "@prisma/client";
import UserBox from "./UserBox";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the items based on the search term
  const filteredItems = items.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the input change event
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <aside
      className="
        fixed 
        inset-y-0 
        pb-20
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200
        block w-full left-0
        bg-blue-200
      "
      style={{ top: "80px" }}
    >
      <div className="px-5">
        <div className="flex-col">
          <div
            className="
              text-2xl
              font-bold
              text-neutral-800
              py-4
            " 
          >
            All users
          </div>
        </div>
        <div className="relative mb-1">
          <input value={searchTerm} onChange={handleInputChange} type="search" placeholder="Search" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <svg className="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M22 22l-6-6"></path>
          <circle cx="10" cy="10" r="7"></circle>
          </svg>
        </div>
        {filteredItems.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
