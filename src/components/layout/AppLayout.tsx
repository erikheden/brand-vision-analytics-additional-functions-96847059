
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SidebarNav from "@/components/navigation/SidebarNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <SidebarNav />
        
        <SidebarInset className="flex flex-col">
          <Header />
          
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
