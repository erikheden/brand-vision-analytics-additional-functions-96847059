
import React from "react";
import UserMenu from "@/components/UserMenu";

const Header = () => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="w-full bg-[#34502b] py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <img 
          src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" 
          alt="Data Dashboard" 
          className="h-10 md:h-12 w-auto animate-fade-in cursor-pointer" 
          onClick={handleLogoClick} 
        />
        <div className="flex items-center gap-4">
          <UserMenu />
          <img 
            src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" 
            alt="SB Index Logo" 
            className="h-14 md:h-16 w-auto cursor-pointer" 
            onClick={handleLogoClick} 
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
