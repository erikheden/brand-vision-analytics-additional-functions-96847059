
import { Card } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { BarChart3, LineChart, PieChart, LayoutGrid, MessageSquare, BarChart, TrendingUp, BookOpen, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#34502b] mb-4">Sustainability Intelligence Platform</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore comprehensive sustainability data across countries, industries, and brands. 
            Analyze consumer perceptions, priorities, knowledge, and industry performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#34502b] mb-4">Consumer Insights</h2>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 gap-3">
              <Link to="/sustainability-priorities" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <BarChart3 className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Priorities</span>
                  <p className="text-xs text-gray-500">Analyze what consumers prioritize in sustainability</p>
                </div>
              </Link>
              <Link to="/sustainability-influences" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <TrendingUp className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Influences</span>
                  <p className="text-xs text-gray-500">Discover what influences consumer behavior</p>
                </div>
              </Link>
              <Link to="/sustainability-knowledge" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <BookOpen className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Knowledge</span>
                  <p className="text-xs text-gray-500">Measure consumer understanding of terms</p>
                </div>
              </Link>
              <Link to="/sustainability-discussions" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <MessageSquare className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Discussions</span>
                  <p className="text-xs text-gray-500">Track conversation topics across markets</p>
                </div>
              </Link>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#34502b] mb-4">Industry & Brand Analysis</h2>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 gap-3">
              <Link to="/materiality-areas" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <PieChart className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Areas</span>
                  <p className="text-xs text-gray-500">Review key materiality areas by industry</p>
                </div>
              </Link>
              <Link to="/sustainability-impact" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <BarChart className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Impact</span>
                  <p className="text-xs text-gray-500">Measure impact across industries</p>
                </div>
              </Link>
              <Link to="/sustainability-perception" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <Award className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Sustainability Perception</span>
                  <p className="text-xs text-gray-500">Brand sustainability index and comparisons</p>
                </div>
              </Link>
              <Link to="/country-comparison" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700">
                <LineChart className="h-5 w-5 text-[#34502b]" />
                <div>
                  <span className="font-medium">Country Comparison</span>
                  <p className="text-xs text-gray-500">Compare metrics across different markets</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
        
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-[#34502b] mb-4">Getting Started</h2>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <p className="text-gray-600">
              This platform provides comprehensive insights into sustainability perceptions, behaviors, and industry performance. 
              Here's how to get the most out of it:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><span className="font-medium">Explore by topic:</span> Use the sidebar to navigate between different aspects of sustainability data</li>
              <li><span className="font-medium">Compare countries:</span> Most views allow filtering or comparing data across different markets</li>
              <li><span className="font-medium">Analyze brands:</span> View brand performance in the Sustainability Perception dashboard</li>
              <li><span className="font-medium">Track changes:</span> Many charts show data over time to identify trends</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
