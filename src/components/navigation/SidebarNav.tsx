
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarHeader 
} from "@/components/ui/sidebar";
import { BarChart3, LineChart, PieChart, LayoutGrid, MessageSquare } from "lucide-react";

const SidebarNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Sidebar className="border-r bg-[#34502b] text-white">
      <SidebarHeader className="h-16 flex items-center px-5">
        <Link 
          to="/" 
          className={cn(
            "flex items-center font-semibold text-xl",
            "hover:text-white/90"
          )}
        >
          <img 
            src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" 
            alt="SB Index" 
            className="h-10 w-auto mr-2" 
          />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          <div className="pb-2 text-xs font-medium text-white/70 uppercase">Dashboards</div>
          
          <SidebarMenuItem>
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                isActive("/") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors"
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              <span>Overview</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link 
              to="/country-comparison" 
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                isActive("/country-comparison") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors"
              )}
            >
              <LineChart className="h-5 w-5" />
              <span>Country Comparison</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link 
              to="/sustainability-priorities" 
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                isActive("/sustainability-priorities") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors"
              )}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Sustainability Priorities</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link 
              to="/materiality-areas" 
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                isActive("/materiality-areas") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors"
              )}
            >
              <PieChart className="h-5 w-5" />
              <span>Materiality Areas</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link 
              to="/sustainability-discussions" 
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                isActive("/sustainability-discussions") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors"
              )}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Sustainability Discussions</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
