
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, ListChecks, Sparkles, Settings, HelpCircle, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";

export function SidebarNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signOut,
    user
  } = useAuth();
  const {
    toast
  } = useToast();

  const menuItems = [{
    title: "Brand Rankings",
    path: "/",
    icon: BarChart3
  }, {
    title: "Sustainability Priorities",
    path: "/sustainability-priorities",
    icon: ListChecks
  }, {
    title: "Sustainability Discussions",
    path: "/sustainability-discussions",
    icon: Sparkles
  }];
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return <Sidebar className="bg-[#34502b] text-white border-r border-[#4a6a3f]">
      <SidebarHeader className="flex items-center justify-center py-4">
        <img 
          src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" 
          alt="SB Index Logo" 
          className="h-14 w-auto" 
        />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={location.pathname === item.path} 
                    onClick={() => navigate(item.path)} 
                    tooltip={item.title} 
                    className="text-base hover:bg-[#4a6a3f] data-[active=true]:bg-[#4a6a3f]"
                  >
                    <item.icon className="mr-2 text-white" size={20} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" className="hover:bg-[#4a6a3f]">
                  <Settings size={20} className="mr-2 text-white" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help" className="hover:bg-[#4a6a3f]">
                  <HelpCircle size={20} className="mr-2 text-white" />
                  <span>Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Logout" className="hover:bg-[#4a6a3f]">
                  <LogOut size={20} className="mr-2 text-white" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>;
}

export default SidebarNav;
