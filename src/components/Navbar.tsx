import Icon from "@/components/ui/icon";

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Каталог", href: "#catalog" },
  { label: "Доставка", href: "#delivery" },
  { label: "Контакты", href: "#contacts" },
];

interface NavbarProps {
  cartCount: number;
  mobileMenu: boolean;
  setMobileMenu: (v: boolean) => void;
  scrollTo: (href: string) => void;
}

export default function Navbar({ cartCount, mobileMenu, setMobileMenu, scrollTo }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center animate-pulse-red">
            <span className="text-white text-sm font-bold">🥩</span>
          </div>
          <span className="font-display text-xl font-bold tracking-wide text-foreground">ФАБРИКАНТ<span className="text-primary"> ЮРКО</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ShoppingCart" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Icon name={mobileMenu ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3 animate-fade-in">
          {navLinks.map(l => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="text-left font-body text-foreground py-2 border-b border-border last:border-0"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}