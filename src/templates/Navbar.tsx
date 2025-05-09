import { useEffect, useState } from "react";
import { PublicRoutes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { getUser } from "@/storage/session";
import NavUser from './NavUser'
import  LogoImage  from "@/assets/logo3.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState(getUser() || null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLogin(!!user);
  }, [user]);

  const navItems = [
    { name: "Inicio", href: PublicRoutes.HOME },
    { name: "Historia", href: PublicRoutes.HISTORIA },
    { name: "Eventos", href: PublicRoutes.EVENTOS },
    { name: "Biblioteca", href: PublicRoutes.BIBLIOTECA },
    { name: "Etnias", href: PublicRoutes.CULTURA },
    { name: "Presidentes", href: PublicRoutes.PRESIDENTES },
    { name: "Noticias", href: PublicRoutes.NOTICIAS },
  ];
  const Logo = ({ className }: { className?: string }) => {
    return <img src={LogoImage} alt="Logo" className={className} />;
  };
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isSticky ? "bg-slate/90 shadow-sm backdrop-blur-md " : "bg-slate-600"}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href={PublicRoutes.HOME} className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors text-xl",
                        isSticky ? "text-slate-100 hover:bg-slate-100" : "text-slate-100 hover:bg-slate-100"
                      )}>Bicentenario</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isSticky ? "text-slate-900 hover:bg-slate-100" : "text-slate-100 hover:bg-slate-100"
                      )}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* User/Auth Section */}
          <div className="flex items-center gap-2">
            {isLogin ? (
              <NavUser />
            ) : (
              <Button
                asChild
                variant={isSticky ? "default" : "outline"}
                className={isSticky ? "bg-blue-600 hover:bg-blue-700" : "border-white text-white hover:bg-white/10"}
              >
                <a href="/auth">Iniciar Sesión</a>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="border-t border-slate-200 px-4 py-3">
            {isLogin ? (
              <NavUser mobile />
            ) : (
              <Button asChild className="w-full">
                <a href="/auth">Iniciar Sesión</a>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;