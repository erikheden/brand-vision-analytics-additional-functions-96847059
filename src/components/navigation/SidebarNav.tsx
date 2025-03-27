import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, ListChecks, Sparkles, Settings, HelpCircle, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  // Get the first letter of the user's email for the avatar fallback
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";
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
  return <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Avatar className="h-10 w-10 bg-[#f77171] text-white">
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <span className="ml-2 text-lg font-medium text-sidebar-foreground">SB Index</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={location.pathname === item.path} onClick={() => navigate(item.path)} tooltip={item.title} className="text-base">
                    <item.icon className="mr-2" size={20} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings size={20} className="mr-2" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help">
                  <HelpCircle size={20} className="mr-2" />
                  <span>Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Logout">
                  <LogOut size={20} className="mr-2" />
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