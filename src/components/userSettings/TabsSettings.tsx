import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditUser } from "./EditUser";
import { ChangePassword } from "./ChangePassword";

export const TabsSettings = () => {
  return (
    <div className="w-full h-full flex flex-col"> {/* Contenedor principal */}
      <Tabs defaultValue="account" className="flex-1 flex flex-col overflow-hidden">
        
        {/* Encabezado fijo con sticky */}
        <div className="sticky top-0 z-10 bg-gray-800"> {/* Sticky para mantenerlo arriba */}
          <TabsList className="grid grid-cols-2 w-full bg-gray-700/50 backdrop-blur-sm rounded-lg p-1 border border-white/10">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/20 transition-all"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Perfil
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="password"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/20 transition-all"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Contraseña
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-auto py-4"> {/* Permitir scroll en el contenido */}
          <TabsContent value="account" className="h-full outline-none p-1">
            <div className="min-h-full">
              <EditUser />
            </div>
          </TabsContent>

          <TabsContent value="password" className="h-full outline-none p-1">
            <div className="min-h-full">
              <ChangePassword />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
