import { Footer, FooterColumn, FooterBottom, FooterContent } from "@/components/ui/footer";
import  LogoImage  from "@/assets/logo3.png";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const FooterTemplate = () => {
  const footerLinks = [
    {
      title: "Explorar",
      links: [
        { name: "Inicio", href: "/" },
        { name: "Historia", href: "/historia" },
        { name: "Eventos", href: "/eventos" },
        { name: "Biblioteca", href: "/biblioteca" },
      ],
    },
    {
      title: "Cultura",
      links: [
        { name: "Etnias", href: "/cultura" },
        { name: "Presidentes", href: "/presidentes" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { name: "Documentos", href: "/biblioteca" },
        { name: "Presidentes", href: "/presidentes" }
      ],
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#" },
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Instagram className="h-5 w-5" />, href: "#" },
    { icon: <Youtube className="h-5 w-5" />, href: "#" },
  ];
  const Logo = ({ className }: { className?: string }) => {
    return <img src={LogoImage} alt="Logo" className={className} />;
  };
  return (
    <footer className="bg-slate-900 text-slate-100 text-white">
      <div className="container bg-slate-900 mx-auto px-4 py-12">
        <Footer className="bg-slate-900">
          <FooterContent className="bg-slate-900 grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Logo and description */}
            <FooterColumn className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-1">
                <Logo className="h-50 w-50 text-white" />
                
              </div>
              <span className="text-xl font-bold text-white">Bicentenario Bolivia</span>
              <p className="text-sm text-slate-400 mb-4">
                Preservando nuestra historia, celebrando nuestra cultura.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label={`Red social ${index}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </FooterColumn>

            {/* Footer links */}
            {footerLinks.map((section, index) => (
              <FooterColumn key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

          </FooterContent>

          <FooterBottom className="border-t border-slate-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
              <div>
                © {new Date().getFullYear()} Bicentenario Bolivia. Todos los derechos reservados.
              </div>
              <div className="flex gap-4">
                <Link to="/terminos" className="hover:text-white transition-colors">
                  Términos
                </Link>
                <Link to="/privacidad" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
                <Link to="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
};

export default FooterTemplate;