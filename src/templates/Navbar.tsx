import { useEffect, useState } from "react";
import * as React from "react";
import { PublicRoutes} from "@/routes/routes";
import { cn } from "@/lib/utils";
import { getUser } from "@/storage/session";
import NavUser from './NavUser'

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
    title: "Batallas",
    href: `${PublicRoutes.HISTORIA}`,
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Independencia",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Revoluciones",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Personajes",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
];

const componentsBlb: { title: string; href: string; description: string }[] = [
  {
    title: "Articulos",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Tesis",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Memorias",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Cronicas",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Censos",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Ensayos",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
];

const componentsEvnt: { title: string; href: string; description: string }[] = [
  {
    title: "Gastronomia",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Deportivo",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Cultural",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
];

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user] = useState(getUser() || null);
  
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
            <NavigationMenuLink href={PublicRoutes.HOME} className="text-xl ">
              Inicio
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={isSticky ? "bg-slate-100 hover:bg-slate-800" : "bg-slate-500 hover:bg-slate-800"}>
              Historia
            </NavigationMenuTrigger>
            <NavigationMenuContent className="max-w-[90vw] overflow-auto">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={isSticky ? "bg-slate-100 hover:bg-slate-800" : "bg-slate-500 hover:bg-slate-800"}>
              Eventos
            </NavigationMenuTrigger>
            <NavigationMenuContent className="max-w-[90vw] overflow-auto">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {componentsEvnt.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={isSticky ? "bg-slate-100 hover:bg-slate-800" : "bg-slate-500 hover:bg-slate-800"}>
              Biblioteca
            </NavigationMenuTrigger>
            <NavigationMenuContent className="max-w-[90vw] overflow-auto">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {componentsBlb.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuLink href={PublicRoutes.HOME} className="text-xl ">
            Cultura
          </NavigationMenuLink>
          <NavigationMenuLink href={PublicRoutes.HOME} className="text-xl ">
            Presidentes
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Sección derecha */}
      <NavigationMenu>
        <NavigationMenuList className="flex mr-2">
          {isLogin ? (
            <NavigationMenuItem
            >
              <NavUser />
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