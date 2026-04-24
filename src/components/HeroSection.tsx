import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/2ae814dc-027e-4ce5-868f-8b2909498366.jpg";
const BURGER_IMAGE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/405af508-4c90-4e69-b4dc-5be136775306.jpg";
const DUMPLINGS_IMAGE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/305d9f94-183d-41c2-a075-80289d166615.jpg";

const products = [
  { id: 1, name: "Котлеты «Домашние»", category: "Котлеты", weight: "500г", price: 320, badge: "Хит продаж", img: BURGER_IMAGE },
  { id: 2, name: "Пельмени сибирские", category: "Пельмени", weight: "800г", price: 450, badge: "Новинка", img: DUMPLINGS_IMAGE },
  { id: 3, name: "Стейк из говядины", category: "Стейки", weight: "300г", price: 890, badge: null, img: HERO_IMAGE },
  { id: 4, name: "Фарш говяжий", category: "Фарш", weight: "500г", price: 380, badge: null, img: BURGER_IMAGE },
  { id: 5, name: "Котлеты «Пожарские»", category: "Котлеты", weight: "400г", price: 360, badge: "Новинка", img: BURGER_IMAGE },
  { id: 6, name: "Вареники с картофелем", category: "Пельмени", weight: "600г", price: 280, badge: null, img: DUMPLINGS_IMAGE },
  { id: 7, name: "Антрекот из свинины", category: "Стейки", weight: "350г", price: 420, badge: null, img: HERO_IMAGE },
  { id: 8, name: "Фарш куриный", category: "Фарш", weight: "500г", price: 260, badge: "Хит продаж", img: BURGER_IMAGE },
];

const categories = ["Все", "Котлеты", "Пельмени", "Стейки", "Фарш"];

interface HeroSectionProps {
  onAddToCart: (id: number) => void;
  scrollTo: (href: string) => void;
}

export default function HeroSection({ onAddToCart, scrollTo }: HeroSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filtered = activeCategory === "Все"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <>
      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 md:opacity-50">
            <img
              src={HERO_IMAGE}
              alt="Мясные продукты"
              className="w-full h-full object-cover"
              style={{ maskImage: "linear-gradient(to left, black 40%, transparent 100%)" }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 font-body text-xs animate-fade-in-up">
              🔥 Доставка от 2 часов · Свежее мясо каждый день
            </Badge>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mb-6 animate-fade-in-up delay-100">
              МЯСО,<br />
              <span className="text-gradient">КАК У МАМЫ</span>
            </h1>

            <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in-up delay-200">
              Свежие полуфабрикаты из отборного мяса с доставкой на дом. Котлеты, пельмени, стейки и многое другое — без консервантов и добавок.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-display text-base tracking-wide px-8 h-12"
                onClick={() => scrollTo("#catalog")}
              >
                <Icon name="ShoppingBag" size={18} className="mr-2" />
                СМОТРЕТЬ КАТАЛОГ
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary font-display text-base tracking-wide px-8 h-12"
                onClick={() => scrollTo("#subscription")}
              >
                <Icon name="RefreshCw" size={18} className="mr-2" />
                ПОДПИСКА
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-12 animate-fade-in-up delay-400">
              {[
                { value: "500+", label: "Постоянных клиентов" },
                { value: "24ч", label: "Срок свежести" },
                { value: "2ч", label: "Скорость доставки" },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                  <div className="font-body text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={24} className="text-muted-foreground" />
        </div>
      </section>

      {/* БЕГУЩАЯ СТРОКА */}
      <section className="py-4 bg-primary overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: "marquee 20s linear infinite", width: "max-content" }}>
          {[...Array(4)].flatMap(() =>
            ["Приглашаем к сотрудничеству", "Кафе", "Рестораны", "Магазины"].map(t => (
              <span key={Math.random()} className="font-display text-sm font-bold text-white tracking-[0.2em] uppercase px-6">
                ✦ {t}
              </span>
            ))
          )}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* КАТАЛОГ */}
      <section id="catalog" className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="font-body text-primary text-sm font-medium mb-2 uppercase tracking-widest">Каталог</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">ВСЕ ПРОДУКТЫ</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground hover:bg-primary/20 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-hover group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-primary text-white border-0 font-body text-xs">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <p className="font-body text-xs text-muted-foreground mb-1">{product.category} · {product.weight}</p>
                <h3 className="font-display text-base font-semibold mb-3 leading-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-primary">{product.price} ₽</span>
                  <button
                    onClick={() => onAddToCart(product.id)}
                    className="w-9 h-9 bg-primary hover:bg-primary/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}