import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const subscriptionPlans = [
  {
    name: "Старт",
    price: 1990,
    period: "мес",
    desc: "Для одного",
    items: ["2 вида котлет", "1 кг пельменей", "500г фарша", "Доставка раз в 2 недели"],
    accent: false,
  },
  {
    name: "Семейный",
    price: 3490,
    period: "мес",
    desc: "Для семьи",
    items: ["4 вида котлет", "2 кг пельменей", "1 кг фарша", "2 стейка", "Доставка раз в неделю"],
    accent: true,
  },
  {
    name: "Гурман",
    price: 5990,
    period: "мес",
    desc: "Для ценителей",
    items: ["6 видов котлет", "3 кг пельменей", "Премиальные стейки", "Эксклюзивные новинки", "Доставка 2 раза в неделю"],
    accent: false,
  },
];

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Каталог", href: "#catalog" },
  { label: "Доставка", href: "#delivery" },
  { label: "Контакты", href: "#contacts" },
];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [cart, setCart] = useState<number[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = activeCategory === "Все"
    ? products
    : products.filter(p => p.category === activeCategory);

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id]);
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center animate-pulse-red">
              <span className="text-white text-sm font-bold">🥩</span>
            </div>
            <span className="font-display text-xl font-bold tracking-wide text-foreground">ЛЕНИВЫЙ<span className="text-primary"> МЯСНИК</span></span>
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
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                  {cart.length}
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
              🔥 Если есть в наличии — доставка от 2 часов · Принимаем заказы за 2–3 дня
            </Badge>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mb-6 animate-fade-in-up delay-100">
              ЛЕНИВЫЙ<br />
              <span className="text-gradient">МЯСНИК</span>
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
            ["Свежие котлеты", "Сибирские пельмени", "Мраморная говядина", "Куриный фарш", "Свиные стейки", "Домашние вареники"].map(t => (
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
          {filtered.map((product, i) => (
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
                    onClick={() => addToCart(product.id)}
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

      {/* ПОДПИСКА */}
      <section id="subscription" className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="font-body text-primary text-sm font-medium mb-2 uppercase tracking-widest">Регулярные поставки</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">СИСТЕМА ПОДПИСКИ</h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Получайте свежие полуфабрикаты автоматически по расписанию. Экономьте до 20% и никогда не думайте о заказе.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 ${
                  plan.accent
                    ? "bg-primary border-transparent shadow-2xl shadow-primary/30 md:scale-105"
                    : "bg-secondary border-border"
                }`}
              >
                {plan.accent && (
                  <Badge className="mb-4 bg-accent text-accent-foreground border-0 font-body text-xs">
                    🌟 Популярный выбор
                  </Badge>
                )}
                <p className={`font-body text-sm mb-1 ${plan.accent ? "text-white/70" : "text-muted-foreground"}`}>{plan.desc}</p>
                <h3 className={`font-display text-2xl font-bold mb-4 ${plan.accent ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`font-display text-4xl font-bold ${plan.accent ? "text-white" : "text-primary"}`}>{plan.price.toLocaleString()}</span>
                  <span className={`font-body text-sm ml-1 ${plan.accent ? "text-white/70" : "text-muted-foreground"}`}>₽/{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.items.map(item => (
                    <li key={item} className={`flex items-center gap-2 font-body text-sm ${plan.accent ? "text-white/90" : "text-muted-foreground"}`}>
                      <Icon name="Check" size={14} className={plan.accent ? "text-white" : "text-primary"} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full font-display tracking-wide ${
                    plan.accent
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  ВЫБРАТЬ ПЛАН
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ДОСТАВКА И ОПЛАТА */}
      <section id="delivery" className="py-20 container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-body text-primary text-sm font-medium mb-2 uppercase tracking-widest">Условия</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">ДОСТАВКА И ОПЛАТА</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <Icon name="Truck" size={24} className="text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">Доставка</h3>
            <ul className="space-y-3">
              {[
                { icon: "Clock", text: "Доставка от 2 до 4 часов после оформления заказа" },
                { icon: "MapPin", text: "По всему городу и пригороду в радиусе 30 км" },
                { icon: "Package", text: "Бесплатная доставка при заказе от 2000 ₽" },
                { icon: "Snowflake", text: "Изотермические сумки — продукты сохраняют свежесть" },
              ].map(item => (
                <li key={item.text} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-primary mt-0.5 shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Стандартная доставка</span>
                <span className="font-semibold text-foreground">250 ₽</span>
              </div>
              <div className="flex justify-between font-body text-sm mt-2">
                <span className="text-muted-foreground">При заказе от 2000 ₽</span>
                <span className="font-semibold text-primary">Бесплатно</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
              <Icon name="CreditCard" size={24} className="text-accent" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">Оплата</h3>
            <ul className="space-y-3">
              {[
                { icon: "Smartphone", text: "Онлайн картой Visa, Mastercard, МИР" },
                { icon: "Wallet", text: "СБП — перевод по номеру телефона" },
                { icon: "Banknote", text: "Наличными курьеру при получении" },
                { icon: "Shield", text: "Безопасная оплата — шифрование данных" },
              ].map(item => (
                <li key={item.text} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-accent mt-0.5 shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex gap-3">
                {["💳 Карта", "📱 СБП", "💵 Наличные"].map(m => (
                  <span key={m} className="px-3 py-1.5 bg-secondary rounded-lg font-body text-xs text-foreground">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "ThumbsUp", title: "Гарантия качества", desc: "Возврат при любых нареканиях" },
            { icon: "Leaf", title: "Без консервантов", desc: "Только натуральные ингредиенты" },
            { icon: "Award", title: "Сертифицировано", desc: "Все продукты сертифицированы" },
            { icon: "Heart", title: "Сделано с душой", desc: "Рецепты проверены годами" },
          ].map(f => (
            <div key={f.title} className="bg-secondary border border-border rounded-xl p-4 text-center">
              <Icon name={f.icon as Parameters<typeof Icon>[0]["name"]} size={24} className="text-primary mx-auto mb-2" />
              <h4 className="font-display text-sm font-bold mb-1">{f.title}</h4>
              <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-20 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="font-body text-primary text-sm font-medium mb-2 uppercase tracking-widest">Связаться</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">КОНТАКТЫ</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div>
              <div className="space-y-6 mb-8">
                {[
                  { icon: "Phone", label: "Телефон", value: "8 800 444-14-19", sub: "Ежедневно с 8:00 до 22:00" },
                  { icon: "Mail", label: "Email", value: "hello@myasomarket.ru", sub: "Ответим в течение часа" },
                  { icon: "MapPin", label: "Адрес", value: "ул. Мясницкая, д. 15", sub: "Пункт выдачи заказов" },
                  { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "8 800 444-14-19", sub: "Удобный мессенджер" },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                      <Icon name={c.icon as Parameters<typeof Icon>[0]["name"]} size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-0.5">{c.label}</p>
                      <p className="font-body text-sm font-semibold text-foreground">{c.value}</p>
                      <p className="font-body text-xs text-muted-foreground">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: "Send", label: "Telegram" },
                  { icon: "MessageCircle", label: "WhatsApp" },
                  { icon: "Share2", label: "Instagram" },
                ].map(s => (
                  <button
                    key={s.label}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary/20 border border-border rounded-lg font-body text-sm text-foreground transition-colors duration-200"
                  >
                    <Icon name={s.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-primary" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold mb-6">Обратная связь</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1.5 block">Ваше имя</label>
                    <Input placeholder="Иван Иванов" className="bg-secondary border-border font-body text-sm" />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1.5 block">Телефон</label>
                    <Input placeholder="+7 (___) ___-__-__" className="bg-secondary border-border font-body text-sm" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1.5 block">Email</label>
                  <Input placeholder="your@email.ru" className="bg-secondary border-border font-body text-sm" />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1.5 block">Сообщение</label>
                  <Textarea
                    placeholder="Ваш вопрос или пожелание..."
                    rows={4}
                    className="bg-secondary border-border font-body text-sm resize-none"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-display tracking-wide h-11">
                  <Icon name="Send" size={16} className="mr-2" />
                  ОТПРАВИТЬ СООБЩЕНИЕ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background border-t border-border py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white text-xs">🥩</span>
              </div>
              <span className="font-display text-lg font-bold">ЛЕНИВЫЙ<span className="text-primary"> МЯСНИК</span></span>
            </div>

            <div className="flex gap-6">
              {navLinks.map(l => (
                <button
                  key={l.label}
                  onClick={() => scrollTo(l.href)}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <p className="font-body text-xs text-muted-foreground">
              © 2025 Ленивый мясник. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}