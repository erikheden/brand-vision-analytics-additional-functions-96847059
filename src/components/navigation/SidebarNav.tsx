
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuSection, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { BarChart3, LineChart, PieChart, LayoutGrid, MessageSquare } from "lucide-react";

const SidebarNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Sidebar className="border-r bg-[#34502b] text-white" defaultCollapsed={false}>
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
          <SidebarMenuSection label="Dashboards">
            <SidebarMenuItem 
              as={Link} 
              to="/" 
              active={isActive("/")}
              icon={<LayoutGrid className="h-5 w-5" />}
              activeClassName="bg-white/10 text-white"
              className="hover:bg-white/5 transition-colors"
            >
              Overview
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              as={Link} 
              to="/country-comparison" 
              active={isActive("/country-comparison")}
              icon={<LineChart className="h-5 w-5" />}
              activeClassName="bg-white/10 text-white"
              className="hover:bg-white/5 transition-colors"
            >
              Country Comparison
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              as={Link} 
              to="/sustainability-priorities" 
              active={isActive("/sustainability-priorities")}
              icon={<BarChart3 className="h-5 w-5" />}
              activeClassName="bg-white/10 text-white"
              className="hover:bg-white/5 transition-colors"
            >
              Sustainability Priorities
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              as={Link} 
              to="/materiality-areas" 
              active={isActive("/materiality-areas")}
              icon={<PieChart className="h-5 w-5" />}
              activeClassName="bg-white/10 text-white"
              className="hover:bg-white/5 transition-colors"
            >
              Materiality Areas
            </SidebarMenuItem>
            
            <SidebarMenuItem 
              as={Link} 
              to="/sustainability-discussions" 
              active={isActive("/sustainability-discussions")}
              icon={<MessageSquare className="h-5 w-5" />}
              activeClassName="bg-white/10 text-white"
              className="hover:bg-white/5 transition-colors"
            >
              Sustainability Discussions
            </SidebarMenuItem>
          </SidebarMenuSection>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
