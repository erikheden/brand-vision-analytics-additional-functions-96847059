import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { BarChart3, LineChart, PieChart, LayoutGrid, MessageSquare, BarChart, TrendingUp, BookOpen } from "lucide-react";
const SidebarNav = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <Sidebar className="border-r bg-[#34502b] text-white">
      
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          <div className="pb-2 text-xs font-medium text-white/70 uppercase px-0 mx-0 my-px py-[15px]">Dashboards</div>
          
          <SidebarMenuItem>
            <Link to="/" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <LayoutGrid className="h-5 w-5" />
              <span>Overview</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link to="/country-comparison" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/country-comparison") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <LineChart className="h-5 w-5" />
              <span>Country Comparison</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link to="/sustainability-priorities" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/sustainability-priorities") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <BarChart3 className="h-5 w-5" />
              <span>Sustainability Priorities</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link to="/sustainability-influences" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/sustainability-influences") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <TrendingUp className="h-5 w-5" />
              <span>Sustainability Influences</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link to="/sustainability-knowledge" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/sustainability-knowledge") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <BookOpen className="h-5 w-5" />
              <span>Sustainability Knowledge</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link to="/sustainability-discussions" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/sustainability-discussions") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <MessageSquare className="h-5 w-5" />
              <span>Sustainability Discussions</span>
            </Link>
          </SidebarMenuItem>
          
          {/* Add divider for Industry section */}
          <div className="pb-2 text-xs font-medium text-white/70 uppercase px-0 mx-0 mt-6 mb-px py-[15px]">Industry</div>
          
          <SidebarMenuItem>
            <Link to="/materiality-areas" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/materiality-areas") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <PieChart className="h-5 w-5" />
              <span>Sustainability Areas</span>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link to="/sustainability-impact" className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm", isActive("/sustainability-impact") ? "bg-white/10 text-white" : "hover:bg-white/5 transition-colors")}>
              <BarChart className="h-5 w-5" />
              <span>Sustainability Impact</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>;
};
export default SidebarNav;