
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "@/components/navigation/SidebarNav";
import Footer from "@/components/layout/Footer";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <SidebarNav />
        
        <SidebarInset className="flex flex-col">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger className="mr-4" />
            <img 
              src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" 
              alt="Data Dashboard" 
              className="h-10 w-auto" 
            />
            <div className="ml-auto">
              <img 
                src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" 
                alt="SB Index Logo" 
                className="h-14 w-auto" 
              />
            </div>
          </div>
          
          <div className="flex-grow">
            <Outlet />
          </div>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
