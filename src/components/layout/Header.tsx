import React, { ReactNode } from "react";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  children?: ReactNode;
}
const Header = ({
  children
}: HeaderProps) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };
  return <div className="w-full py-4 bg-[#b7c895]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {children}
          <img src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" alt="Data Dashboard" className="h-10 w-auto cursor-pointer" onClick={handleLogoClick} />
        </div>
        
        <div className="flex items-center">
          <img src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" alt="SB Index Logo" className="h-14 w-auto mr-6 hidden md:block" />
          <UserMenu />
        </div>
      </div>
    </div>;
};
export default Header;