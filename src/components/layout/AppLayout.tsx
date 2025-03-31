import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "@/components/navigation/SidebarNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
const AppLayout = () => {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <SidebarNav />
        
        <SidebarInset className="flex flex-col">
          <Header>
            <SidebarTrigger className="text-white hover:bg-white/10" />
          </Header>
          
          <div className="flex-grow py-0">
            <Outlet />
          </div>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default AppLayout;