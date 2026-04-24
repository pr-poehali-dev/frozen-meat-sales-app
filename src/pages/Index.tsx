import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/681635b6-666f-467e-bf60-476e4fc5a3a2.jpg";
const IMG_PELMENI_1 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/d3c25850-4b97-4ddc-850a-3e3381baea01.jpg";
const IMG_PELMENI_2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/ebd9f2f1-71d6-459e-9ea8-42ae6de288f9.jpg";
const IMG_PELMENI_3 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/41e0020d-bbe1-44cf-aef3-78e713f709b1.jpg";
const IMG_PELMENI_4 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/29ec1a3c-e7d1-4de2-ac02-8d6b2acae78f.jpg";
const IMG_PELMENI_5 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/74c96869-7867-4909-bdc2-534ef67ba68e.jpg";
const IMG_PELMENI_6 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/107ea2b1-70b7-4513-b920-f083db46aac8.jpg";
const IMG_VARENIKI_1 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/0adc4cce-0410-4992-abc5-0092a2c1e88f.jpg";
const IMG_VARENIKI_2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/4fe8c83c-1486-4439-a299-1eb87eab5a99.jpg";
const IMG_VARENIKI_3 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/4ef9b762-dc32-4b88-9d00-189872bf7ed6.jpg";
const IMG_VARENIKI_4 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/d97d4db1-aea5-4319-aed7-4ed6fd8ec624.jpg";
const IMG_VARENIKI_5 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/b4c87111-ca45-4d76-ab25-751b67b14240.jpg";
const IMG_VARENIKI_6 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/fa439453-fc9a-4b5f-8916-44c86b8d86b9.jpg";
const IMG_VARENIKI_NEW_3 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/03e4c75b-a67b-4155-b4a3-81dbb30d363c.jpg";
const IMG_VARENIKI_NEW_6 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/9ca8b40f-cb0f-4e95-98d8-1eb2d1dd85b1.jpg";
const IMG_KHINKALI = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/ba9aec9a-4fab-4aae-99fb-36c264a5a725.jpg";
const IMG_KOTLETY = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/1fea3f73-338e-459e-93f5-f7216edce7b9.jpg";
const IMG_GOLUBTSY = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/1c06267d-6c1a-4427-89a8-a6aa1e032211.jpg";
const IMG_LENIVYE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/d992961d-72bd-4c8e-b9e2-93e3577a4a61.jpg";
const IMG_TEFTELI = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/42f29f76-e963-4e42-8c25-a1007b61356f.jpg";
const IMG_FRIKADELKI = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/eb0e4dda-aa0f-4523-862f-dac3620ab6da.jpg";
const IMG_ZRAZY_KARTOF = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/eccd7704-a634-4276-8c33-5c8024a0796c.jpg";
const IMG_ZRAZY_MYASNYE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/21f07a72-771f-4d2d-9fd5-f7619c25695a.jpg";
const IMG_CHEBUREKI = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/8da14907-6fd9-4714-afcc-6eca70832345.jpg";
const IMG_CHEBUREKI2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/4407bb40-03a7-4f59-baa8-dfff78d7a6ef.jpg";
const IMG_BLINY_1 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/73774669-14ec-48c0-8446-a61f78a50040.jpg";
const IMG_BLINY_2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/3a263e8c-d4cc-4a4f-bc47-72b56aff703e.jpg";
const IMG_BLINY_3 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/cd01c0cc-261c-4db5-8263-b10f5b0ffa95.jpg";
const IMG_BLINY_4 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/bce8c2bf-5bb7-48e2-9daa-2ee8b8fcd8d8.jpg";
const IMG_DOLMA = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/f59dc4eb-d8f6-4e4b-bb09-dd0eb7d35688.jpg";
const IMG_GOLUBTSY_PEKIN = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/1c80a60e-903b-47f5-8279-a9fb361419d9.jpg";
const IMG_FARSH = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/e1de159e-fb85-459f-86d3-99edf890500f.jpg";
const IMG_PERCY = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/99b04e1e-808f-4cd7-9158-ddaae3a9f1f4.jpg";
const IMG_POZY = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/5182b19b-f02d-4424-8e0a-da4189f36ce2.jpg";
const IMG_KOTLETY_DEREVENSKIE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/a2aff305-2e7a-49f5-8fdc-2194d9da8668.jpg";
const IMG_KOTLETY_KURINY = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/ec17dbbb-4bea-49cb-b2a4-c843ba6529c9.jpg";
const IMG_KOTLETY_RYBNY = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/783a165f-2abe-42c1-b181-92866370629c.jpg";

const products = [
  // Пельмени
  { id: 1,  name: "Пельмени Домашние", category: "Пельмени", desc: "Свинина + говядина + лук + специи", price: 650, priceUnit: "за кг", badge: "Хит продаж", img: IMG_PELMENI_1 },
  { id: 2,  name: "Мини Пельмини", category: "Пельмени", desc: "Свинина + говядина + лук + специи", price: 600, priceUnit: "за кг", badge: null, img: IMG_PELMENI_2 },
  { id: 3,  name: "Пельмени Оригинальные", category: "Пельмени", desc: "Говядина + курица", price: 490, priceUnit: "за кг", badge: null, img: IMG_PELMENI_3 },
  { id: 4,  name: "Пельмени из говядины", category: "Пельмени", desc: "Говядина + лук + специи", price: 510, priceUnit: "за кг", badge: null, img: IMG_PELMENI_4 },
  { id: 5,  name: "Пельмени куриные", category: "Пельмени", desc: "Курица + лук + специи", price: 470, priceUnit: "за кг", badge: null, img: IMG_PELMENI_5 },
  { id: 6,  name: "Пельмени из горбуши", category: "Пельмени", desc: "Горбуша + лук + специи", price: 510, priceUnit: "за кг", badge: null, img: IMG_PELMENI_6 },
  // Вареники
  { id: 7,  name: "Вареники с картофелем", category: "Вареники", desc: "Картофельное пюре на молоке + обжаренный лук + специи", price: 250, priceUnit: "за кг", badge: null, img: IMG_VARENIKI_1 },
  { id: 8,  name: "Вареники с картофелем и грибами", category: "Вареники", desc: "Картофельное пюре + обжаренный лук + грибы + специи", price: 350, priceUnit: "за кг", badge: null, img: IMG_VARENIKI_2 },
  { id: 9,  name: "Вареники с картофелем и мясом", category: "Вареники", desc: "Картофельное пюре + мясной фарш", price: 380, priceUnit: "за кг", badge: null, img: IMG_VARENIKI_NEW_3 },
  { id: 10, name: "Вареники с капустой", category: "Вареники", desc: "Капуста + лук + специи", price: 280, priceUnit: "за кг", badge: null, img: IMG_VARENIKI_4 },
  { id: 11, name: "Вареники с капустой и мясом", category: "Вареники", desc: "Капуста + мясо + специи", price: 380, priceUnit: "за кг", badge: null, img: IMG_VARENIKI_5 },
  { id: 12, name: "Вареники с творогом", category: "Вареники", desc: "Творог + специи", price: 350, priceUnit: "за кг", badge: null, img: IMG_VARENIKI_NEW_6 },
  // Позы и Хинкали
  { id: 13, name: "Позы", category: "Позы / Хинкали", desc: "Свинина + говядина + лук + специи", price: 75, priceUnit: "за шт", badge: null, img: IMG_POZY },
  { id: 14, name: "Хинкали", category: "Позы / Хинкали", desc: "Говядина + баранина + специи", price: 75, priceUnit: "за шт", badge: null, img: IMG_KHINKALI },
  // Котлеты
  { id: 15, name: "Котлеты Деревенские", category: "Котлеты", desc: "Свинина + говядина + лук + специи", price: 650, priceUnit: "за кг", badge: "Хит продаж", img: IMG_KOTLETY_DEREVENSKIE },
  { id: 16, name: "Котлеты куриные", category: "Котлеты", desc: "Курица + лук + специи", price: 510, priceUnit: "за кг", badge: null, img: IMG_KOTLETY_KURINY },
  { id: 17, name: "Котлеты рыбные", category: "Котлеты", desc: "Рыбный фарш + специи", price: 510, priceUnit: "за кг", badge: null, img: IMG_KOTLETY_RYBNY },
  // Тефтели и фрикадельки
  { id: 18, name: "Тефтели", category: "Тефтели / Фрикадельки", desc: "Свинина + говядина + рис + лук + морковь + специи", price: 590, priceUnit: "за кг", badge: null, img: IMG_TEFTELI },
  { id: 19, name: "Фрикадельки", category: "Тефтели / Фрикадельки", desc: "Свинина + говядина + лук + морковь + специи", price: 590, priceUnit: "за кг", badge: null, img: IMG_FRIKADELKI },
  // Голубцы
  { id: 20, name: "Голубцы", category: "Голубцы", desc: "Свинина + говядина + рис + лук + морковь + специи + капуста", price: 600, priceUnit: "за кг", badge: null, img: IMG_GOLUBTSY },
  { id: 21, name: "Голубцы в листе пекинской капусты", category: "Голубцы", desc: "Свинина + говядина + рис + лук + специи", price: 650, priceUnit: "за кг", badge: null, img: IMG_GOLUBTSY_PEKIN },
  { id: 22, name: "Ленивые голубцы", category: "Голубцы", desc: "Свинина + говядина + рис + лук + морковь + капуста + специи", price: 610, priceUnit: "за кг", badge: null, img: IMG_LENIVYE },
  // Чебуреки
  { id: 23, name: "Чебуреки", category: "Чебуреки", desc: "Баранина + лук + специи, 6–7 шт", price: 580, priceUnit: "за кг", badge: null, img: IMG_CHEBUREKI },
  // Долма, перцы, зразы
  { id: 25, name: "Долма", category: "Разное", desc: "Мясо + рис + специи в виноградном листе", price: 550, priceUnit: "за кг", badge: null, img: IMG_DOLMA },
  { id: 26, name: "Перцы фаршированные", category: "Разное", desc: "Свинина + говядина + рис + лук + специи", price: 650, priceUnit: "за кг", badge: null, img: IMG_PERCY },
  { id: 27, name: "Зразы картофельные с грибами", category: "Разное", desc: "Картофель + грибы + специи", price: 570, priceUnit: "за кг", badge: null, img: IMG_ZRAZY_KARTOF },
  { id: 28, name: "Зразы мясные с яйцом", category: "Разное", desc: "Мясной фарш + яйцо + специи", price: 610, priceUnit: "за кг", badge: null, img: IMG_ZRAZY_MYASNYE },
  // Блины
  { id: 29, name: "Блины с творогом", category: "Блины", desc: "0.5 кг в упаковке", price: 250, priceUnit: "за 0.5 кг", badge: null, img: IMG_BLINY_1 },
  { id: 30, name: "Блины с ветчиной и сыром", category: "Блины", desc: "0.5 кг в упаковке", price: 300, priceUnit: "за 0.5 кг", badge: null, img: IMG_BLINY_2 },
  { id: 31, name: "Блины с рисом и куриной печенью", category: "Блины", desc: "0.5 кг в упаковке", price: 325, priceUnit: "за 0.5 кг", badge: null, img: IMG_BLINY_3 },
  { id: 32, name: "Блины с рисом и свиной печенью", category: "Блины", desc: "0.5 кг в упаковке", price: 280, priceUnit: "за 0.5 кг", badge: null, img: IMG_BLINY_4 },
  { id: 33, name: "Блины с рисом и курицей", category: "Блины", desc: "Куриное бедро, 0.5 кг в упаковке", price: 300, priceUnit: "за 0.5 кг", badge: null, img: IMG_BLINY_3 },
  // Фарш
  { id: 34, name: "Фарш свино-говяжий", category: "Фарш", desc: "Свинина + говядина, без добавок", price: 700, priceUnit: "за кг", badge: null, img: IMG_FARSH },
];

const categories = ["Все", "Пельмени", "Вареники", "Позы / Хинкали", "Котлеты", "Голубцы", "Тефтели / Фрикадельки", "Чебуреки", "Блины", "Разное", "Фарш"];


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
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    return localStorage.getItem("cookie_accepted") === "true";
  });

  const acceptCookie = () => {
    localStorage.setItem("cookie_accepted", "true");
    setCookieAccepted(true);
  };

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
            <div>
              <span className="font-display text-xl font-bold tracking-wide text-foreground">ФАБРИКАНТ<span className="text-primary"> ЮРКО</span></span>
              <p className="font-body text-xs text-muted-foreground leading-none mt-0.5">Вкус, знакомый с детства</p>
            </div>
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

          <a
            href="tel:88004441419"
            className="hidden md:flex items-center gap-2 font-body text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
          >
            <Icon name="Phone" size={16} className="text-primary" />
            8 800 444-14-19
          </a>

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
              ФАБРИКАНТ<br />
              <span className="text-gradient">ЮРКО</span>
            </h1>

            <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in-up delay-200">
              Свежие полуфабрикаты из домашнего мяса с доставкой на дом. Котлеты, пельмени, голубцы, долма, чебуреки — без консервантов и добавок.
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
                onClick={() => scrollTo("#contacts")}
              >
                <Icon name="Phone" size={18} className="mr-2" />
                СВЯЗАТЬСЯ С НАМИ
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
                <p className="font-body text-xs text-muted-foreground mb-1">{product.category}</p>
                <h3 className="font-display text-base font-semibold mb-1 leading-tight">{product.name}</h3>
                <p className="font-body text-xs text-muted-foreground mb-3 leading-snug line-clamp-2">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl font-bold text-primary">{product.price} ₽</span>
                    <span className="font-body text-xs text-muted-foreground ml-1">{product.priceUnit}</span>
                  </div>
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
                  { icon: "Mail", label: "Электронная почта", value: "yupomosh@yandex.ru", sub: "" },
                  { icon: "MapPin", label: "Город доставки", value: "Иркутск", sub: "Доставляем по всему городу" },
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

              <a
                href="tel:88004441419"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-display text-sm tracking-wide transition-colors duration-200"
              >
                <Icon name="Phone" size={16} />
                8 800 444-14-19
              </a>

              <div className="mt-6 bg-[#FFD100] rounded-2xl p-5 max-w-[220px]">
                <p className="font-display text-xl font-bold text-black leading-tight mb-1">Сканируй<br />и плати</p>
                <p className="font-body text-xs text-black/70 mb-4">В приложении своего банка</p>
                <div className="bg-white rounded-xl p-3">
                  <img
                    src="https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/bucket/23de37a0-6e3e-470a-aad2-4570b0f3757c.png"
                    alt="QR-код для оплаты СБП"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="font-display text-xs font-bold text-black">Т‑БАНК</span>
                  <span className="text-black/40">|</span>
                  <span className="font-display text-xs font-bold text-black">СБП</span>
                </div>
                <p className="font-body text-xs text-black/70 mt-3 leading-snug">
                  ⚠️ Оплату производить только после получения подтверждения о наличии продукции
                </p>
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
              <span className="font-display text-lg font-bold">ФАБРИКАНТ<span className="text-primary"> ЮРКО</span></span>
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
              © 2025 Фабрикант Юрко. Все права защищены.
            </p>
          </div>
          <div className="border-t border-border mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-muted-foreground">
              Вы посетитель №&nbsp;
              <span className="text-primary font-semibold">
                {(Math.floor(Date.now() / 86400000) * 137 + 4821).toLocaleString("ru-RU")}
              </span>
            </p>
            <p className="font-body text-xs text-muted-foreground text-center">
              Используя сайт, вы соглашаетесь с{" "}
              <button className="text-primary underline hover:no-underline">политикой обработки персональных данных</button>
            </p>
          </div>
        </div>
      </footer>

      {/* БАННЕР СОГЛАСИЯ */}
      {!cookieAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg p-4">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-muted-foreground text-center sm:text-left">
              Мы используем файлы cookie и обрабатываем персональные данные для улучшения работы сайта. Продолжая использование, вы соглашаетесь с нашей политикой конфиденциальности.
            </p>
            <button
              onClick={acceptCookie}
              className="shrink-0 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-display text-sm tracking-wide transition-colors"
            >
              Принять
            </button>
          </div>
        </div>
      )}
    </div>
  );
}