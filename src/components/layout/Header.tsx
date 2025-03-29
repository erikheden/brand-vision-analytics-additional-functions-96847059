import React from "react";
import UserMenu from "@/components/UserMenu";
const Header = () => {
  const handleLogoClick = () => {
    window.location.reload();
  };
  return <div className="w-full bg-white py-2 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        <UserMenu />
      </div>
    </div>;
};
export default Header;