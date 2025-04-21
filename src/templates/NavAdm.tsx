import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrivateRoutesAdmin } from '@/routes/routes';

export const NavAdm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const routeConfig = {
    [PrivateRoutesAdmin.DASHBOARD]: {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: 'Dashboard'
    },
    [PrivateRoutesAdmin.INVENTORY]: {
      icon: <Users className="w-4 h-4" />,
      label: 'Usuarios'
    },
    [PrivateRoutesAdmin.PRODUCTS]: {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Eventos'
    },
    [PrivateRoutesAdmin.USERS]: {
      icon: <Users className="w-4 h-4" />,
      label: 'Historia'
    },
    [PrivateRoutesAdmin.VENTAS]: {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Biblioteca'
    },
  };

  const adminLinks = Object.entries(routeConfig).map(([key, value]) => ({
    ...value,
    path: `/${PrivateRoutesAdmin.BASE}/${key}`
  }));

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Admin</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
          <div className="p-1 space-y-1">
            {adminLinks.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-200 hover:bg-gray-700 px-3 py-2 text-sm"
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
              >
                {link.icon}
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};