import {useEffect, useState} from "react"
import * as React from "react"
import { PublicRoutes, PrivateRoutes } from "@/routes/routes"
import { cn } from "@/lib/utils"


import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
 
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
    description:
      "For sighted users to preview content available behind a link.",
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
]





const Navbar = () => {

  const [isSticky, setIsSticky] = useState(false);

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

  return (
<div className={`flex items-center justify-between p-3 shadow-md sticky top-0 z-50 transition-all duration-500 ease-in-out backdrop-blur-md`}
      style={{
        background: `rgba(15, 23, 42, ${isSticky ? 0.1 : 1})`,
        color: `${isSticky ? "#020617" : "white"}`,
      }}
>
  <NavigationMenu>
    <div className="flex items-center">
      <NavigationMenuList className="flex">
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isSticky ? "bg-slate-100 hover:bg-slate-800" : "bg-slate-500 hover:bg-slate-800"}>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
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
          <NavigationMenuLink href="/docs" className="">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

    </div>
  </NavigationMenu>

  {/* Sección derecha*/}
  <NavigationMenu>
    <NavigationMenuList className="flex mr-2">
        <NavigationMenuItem>
          <NavigationMenuLink href={PublicRoutes.LOGIN} className="">
            Login
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href={PublicRoutes.REGISTER} className="">
            Registrase
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
  </NavigationMenu>
</div>


  )
}
export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }, ref) => {
    return (
    <li className="">
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
          <span className="text-sm font-medium leading-none block">
            {title}
          </span>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});


ListItem.displayName = "ListItem"

document.body.style.overflowX = "hidden";