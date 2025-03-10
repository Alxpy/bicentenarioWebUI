import { useEffect, useState, useRef } from "react";
import * as React from "react";
import { PublicRoutes, PrivateRoutes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { getUser } from "@/storage/session";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const componentsUser: { title: string; href: string }[] = [
  {
    title: "Perfil",
    href: "/perfil",
  },
  {
    title: "Cerrar Sesión",
    href: "/logout",
  },
];

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user] = useState(getUser() || null);
  const triggerRef = useRef<HTMLButtonElement>(null); // Referencia al botón que activa el menú

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user]);

  // Función para calcular si el menú debe abrirse a la izquierda o a la derecha
  const calculateMenuAlignment = () => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - triggerRect.right;
      const spaceOnLeft = triggerRect.left;

      // Si hay más espacio a la izquierda, abre el menú hacia la izquierda
      if (spaceOnRight < 300 && spaceOnLeft > 300) {
        return "start"; // Alinea a la izquierda
      }
    }
    return "end"; // Por defecto, alinea a la derecha
  };

  return (
    <div
      className={`flex items-center justify-between p-3 shadow-md sticky top-0 z-50 transition-all duration-500 ease-in-out backdrop-blur-md`}
      style={{
        background: `rgba(15, 23, 42, ${isSticky ? 0.1 : 1})`,
        color: `${isSticky ? "#020617" : "white"}`,
      }}
    >
      {/* Sección izquierda */}
      <NavigationMenu>
        <NavigationMenuList className="flex">
          <NavigationMenuItem>
            <NavigationMenuTrigger className={isSticky ? "bg-slate-100 hover:bg-slate-800" : "bg-slate-500 hover:bg-slate-800"}>
              Components
            </NavigationMenuTrigger>
            <NavigationMenuContent align="start" className="max-w-[90vw] overflow-auto">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Sección derecha */}
      <NavigationMenu>
        <NavigationMenuList className="flex mr-2">
          {isLogin ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger
                ref={triggerRef} // Referencia al botón
                className={isSticky ? "bg-slate-100 hover:bg-slate-800" : "bg-slate-500 hover:bg-slate-800"}
              >
                {user.nombre}
              </NavigationMenuTrigger>
              <NavigationMenuContent align={calculateMenuAlignment()} className="max-w-[90vw] overflow-auto">
                <ul className="grid w-[200px] gap-3 p-4">
                  {componentsUser.map((component) => (
                    <ListItemUser key={component.title} title={component.title} href={component.href} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink href="/auth" className="">
                Iniciar Sesión
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href}
          {...props}
        >
          <span className="text-sm font-medium leading-none block">{title}</span>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

const ListItemUser = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href}
          {...props}
        >
          <span className="text-sm font-medium leading-none block">{title}</span>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItemUser.displayName = "ListItemUser";
document.body.style.overflowX = "hidden";