import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  activeGradient?: {
    from: string;
    to: string;
  };
}

interface GenericTabsProps {
  defaultTab: string;
  tabs: TabItem[];
  stickyHeader?: boolean;
  className?: string;
}

export const GenericTabs = ({
  defaultTab,
  tabs,
  stickyHeader = true,
  className = "",
}: GenericTabsProps) => {
  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className={stickyHeader ? "sticky top-0 z-10 bg-gray-800" : ""}>
          <TabsList className="grid w-full bg-gray-700/50 backdrop-blur-sm rounded-lg p-1 border border-white/10" style={{
            gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`
          }}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/20 transition-all ${
                  tab.activeGradient 
                    ? `data-[state=active]:bg-gradient-to-r data-[state=active]:from-${tab.activeGradient.from} data-[state=active]:to-${tab.activeGradient.to}`
                    : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20"
                }`}
              >
                <div className="flex items-center justify-center">
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-auto py-4">
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.value} 
              value={tab.value} 
              className="h-full outline-none p-1"
            >
              <div className="min-h-full">
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};