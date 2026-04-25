import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/681635b6-666f-467e-bf60-476e4fc5a3a2.jpg";
const API_PRODUCTS = "https://functions.poehali.dev/5ba4d26d-b55f-4e5d-aaa0-f6b9f4d614fc";
const IMG_PELMENI_1 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/d3c25850-4b97-4ddc-850a-3e3381baea01.jpg";
const IMG_PELMENI_2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/ebd9f2f1-71d6-459e-9ea8-42ae6de288f9.jpg";
const IMG_PELMENI_3 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/a1fc6ec8-783d-4076-9589-2b1e0cac0beb.jpg";
const IMG_PELMENI_4 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/29ec1a3c-e7d1-4de2-ac02-8d6b2acae78f.jpg";
const IMG_PELMENI_5 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/74c96869-7867-4909-bdc2-534ef67ba68e.jpg";
const IMG_PELMENI_6 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/107ea2b1-70b7-4513-b920-f083db46aac8.jpg";
const IMG_VARENIKI_1 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/860f9a00-435b-4ed7-8a48-ba9572e02d64.jpg";
const IMG_VARENIKI_2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/fc31a41f-70d1-4ad7-9c7c-c4dee11e6216.jpg";
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
const IMG_CHEBUREKI = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/718a9264-7f91-4728-bfc1-e802c623cf1d.jpg";
const IMG_CHEBUREKI2 = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/718a9264-7f91-4728-bfc1-e802c623cf1d.jpg";
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

interface Product { id: number; name: string; category: string; desc: string; price: number; priceUnit: string; badge: string | null; img: string; inStock: boolean; availableDate: string | null; }


const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Каталог", href: "#catalog" },
  { label: "Доставка", href: "#delivery" },
  { label: "Контакты", href: "#contacts" },
];

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartQty, setCartQty] = useState<Record<number, number>>({}); // граммы или штуки
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    return localStorage.getItem("cookie_accepted") === "true";
  });
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [cartForm, setCartForm] = useState({ name: '', phone: '' });
  const [cartOrderSent, setCartOrderSent] = useState(false);
  const [cartOrderSending, setCartOrderSending] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'cash' | 'terminal' | ''>('');
  const [deliveryForm, setDeliveryForm] = useState({ name: '', phone: '', street: '', house: '', entrance: '', apartment: '', floor: '', intercom: '', comment: '', district: '', locality: '', distance_km: '', delivery_date: '' });
  const [deliverySent, setDeliverySent] = useState(false);
  const [deliverySending, setDeliverySending] = useState(false);
  const [cancelSeconds, setCancelSeconds] = useState(0);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<number>(0);
  const [siteClosed, setSiteClosed] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [showLoyaltyPopup, setShowLoyaltyPopup] = useState(false);
  const [loyaltyChecked, setLoyaltyChecked] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setGeoError('Геолокация не поддерживается браузером'); return; }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=ru`);
          const data = await res.json();
          const addr = data.address || {};
          const street = addr.road || addr.pedestrian || addr.footway || '';
          const house = addr.house_number || '';
          setDeliveryForm(f => ({ ...f, street, house }));
        } catch {
          setGeoError('Не удалось определить адрес');
        }
        setGeoLoading(false);
      },
      () => { setGeoError('Нет доступа к геолокации — разрешите в браузере'); setGeoLoading(false); },
      { timeout: 10000 }
    );
  };

  const handleDeliverySubmit = async () => {
    if (!deliveryForm.name || !deliveryForm.phone || !deliveryForm.street || !deliveryForm.house || !deliveryForm.district) return;
    setDeliverySending(true);
    const items = cartItems.map(p => ({ name: p.name, qty: cartQty[p.id] || 1, price: p.price, sum: getItemPrice(p), inStock: p.inStock, availableDate: p.availableDate }));
    const info = getDeliveryInfo();
    const userSession = localStorage.getItem('user_session') || '';
    const res = await fetch("https://functions.poehali.dev/36d594d4-0de1-47a0-8704-a93dc25f659a", {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...(userSession ? { 'X-User-Session': userSession } : {}) },
      body: JSON.stringify({
        ...deliveryForm,
        items,
        total: cartTotalWithDiscount + DELIVERY_COST,
        delivery_cost: DELIVERY_COST,
        payment_method: PAYMENT_LABELS[paymentMethod as string] || paymentMethod,
        delivery_minutes: info?.deliveryMinutes ?? 45,
        arrival_time: info?.arrivalStr ?? '',
        is_evening: info?.isEvening ?? false,
        discount_percent: discount,
        discount_amount: discountAmount,
        order_count: orderCount,
      })
    }).then(r => r.json()).catch(() => ({}));
    if (res.order_id) setLastOrderId(res.order_id);
    setDeliverySending(false);
    setDeliverySent(true);
    setCancelled(false);
    setCancelSeconds(600);
    const interval = setInterval(() => {
      setCancelSeconds(s => { if (s <= 1) { clearInterval(interval); return 0; } return s - 1; });
    }, 1000);
  };

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const handleFormSubmit = async () => {
    if (!form.name || !form.phone) return;
    setFormSending(true);
    await fetch("https://functions.poehali.dev/36d594d4-0de1-47a0-8704-a93dc25f659a", {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: 'contact' })
    });
    setFormSent(true);
    setFormSending(false);
    setForm({ name: '', phone: '', email: '', message: '' });
  };

  useEffect(() => {
    fetch(API_PRODUCTS)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setProducts(d.products);
          if (d.site_closed) setSiteClosed(true);
        }
      })
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      if (!localStorage.getItem('pwa_dismissed')) setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBanner(false);
  };

  const dismissInstall = () => {
    localStorage.setItem('pwa_dismissed', '1');
    setShowInstallBanner(false);
  };

  const acceptCookie = () => {
    localStorage.setItem("cookie_accepted", "true");
    setCookieAccepted(true);
  };

  const categories = ["Все", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = activeCategory === "Все"
    ? products
    : products.filter(p => p.category === activeCategory);

  const isByPiece = (p: { priceUnit: string }) => p.priceUnit.includes('шт');
  const getDefaultQty = (p: { priceUnit: string }) => isByPiece(p) ? 1 : 500;
  const getQtyStep = (p: { priceUnit: string }) => isByPiece(p) ? 1 : 100;

  const addToCart = (id: number) => {
    const p = products.find(x => x.id === id)!;
    setCart(prev => ({ ...prev, [id]: 1 }));
    setCartQty(prev => ({ ...prev, [id]: prev[id] || getDefaultQty(p) }));
  };
  const removeFromCart = (id: number) => {
    setCart(prev => { const next = { ...prev }; delete next[id]; return next; });
    setCartQty(prev => { const next = { ...prev }; delete next[id]; return next; });
  };
  const updateQty = (id: number, delta: number) => {
    const p = products.find(x => x.id === id)!;
    const step = getQtyStep(p);
    const min = step;
    setCartQty(prev => ({ ...prev, [id]: Math.max(min, (prev[id] || getDefaultQty(p)) + delta) }));
  };
  const getItemPrice = (p: typeof products[0]) => {
    const qty = cartQty[p.id] || getDefaultQty(p);
    if (isByPiece(p)) return p.price * qty;
    if (p.priceUnit.includes('0.5 кг')) return Math.round(p.price * qty / 500);
    return Math.round(p.price * qty / 1000);
  };
  const getQtyLabel = (p: typeof products[0]) => {
    const qty = cartQty[p.id] || getDefaultQty(p);
    if (isByPiece(p)) return `${qty} шт`;
    return qty >= 1000 ? `${qty / 1000} кг` : `${qty} г`;
  };

  const checkLoyalty = async (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || loyaltyChecked === digits) return;
    setLoyaltyChecked(digits);
    const res = await fetch(`https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b?type=loyalty&phone=${encodeURIComponent(phone)}`).then(r => r.json()).catch(() => null);
    if (res?.ok && res.discount > 0) {
      setDiscount(res.discount);
      setOrderCount(res.count);
      setShowLoyaltyPopup(true);
    } else {
      setDiscount(0);
      setOrderCount(0);
    }
  };

  const cartItems = products.filter(p => cart[p.id]);
  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, p) => sum + getItemPrice(p), 0);
  const PAYMENT_LABELS: Record<string, string> = { sbp: 'СБП', cash: 'Наличные курьеру', terminal: 'Терминал (карта курьеру)' };

  const DISTRICTS = ['Октябрьский', 'Правобережный', 'Свердловский', 'Ленинский', 'За пределы города'];
  const isOutOfCity = deliveryForm.district === 'За пределы города';
  const distanceKm = parseInt(deliveryForm.distance_km) || 0;
  const outOfCityCost = isOutOfCity && distanceKm > 0 ? Math.ceil(distanceKm / 10) * 150 : 0;

  const getDeliveryInfo = () => {
    const now = new Date();
    const hour = now.getHours();
    const isEvening = hour >= 18 || hour < 0;
    const isDay = hour >= 10 && hour < 18;
    if (!isDay && !isEvening) return null;
    const freeThreshold = isOutOfCity ? 3000 : 2000;
    const basePrice = cartTotal >= freeThreshold ? 0 : 250;
    const cityDeliveryCost = isEvening ? basePrice * 2 : basePrice;
    const deliveryCost = cityDeliveryCost + outOfCityCost;
    const deliveryMinutes = isEvening ? 60 : 45;
    const arrivalTime = new Date(now.getTime() + deliveryMinutes * 60 * 1000);
    const arrivalStr = arrivalTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return { deliveryCost, deliveryMinutes, arrivalStr, isEvening, outOfCityCost };
  };

  const deliveryInfo = getDeliveryInfo();
  const freeThreshold = isOutOfCity ? 3000 : 2000;
  const DELIVERY_COST = deliveryInfo?.deliveryCost ?? ((cartTotal >= freeThreshold ? 0 : 250) + outOfCityCost);
  const discountAmount = discount > 0 ? Math.round(cartTotal * discount / 100) : 0;
  const cartTotalWithDiscount = cartTotal - discountAmount;

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  const handleCartOrder = async () => {
    if (!cartForm.name || !cartForm.phone) return;
    setCartOrderSending(true);
    const items = cartItems.map(p => `${p.name} x${cart[p.id]} (${p.price * cart[p.id]} ₽)`).join(', ');
    const message = `Заказ из корзины: ${items}. Итого: ${cartTotal} ₽`;
    await fetch("https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b", {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cartForm.name, phone: cartForm.phone, message })
    });
    setCartOrderSent(true);
    setCartOrderSending(false);
  };

  const QR_URL = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/bucket/23de37a0-6e3e-470a-aad2-4570b0f3757c.png";

  if (siteClosed) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">🥩</div>
      <h1 className="font-display text-4xl font-bold mb-4">ФАБРИКАНТ <span className="text-primary">ЮРКО</span></h1>
      <p className="font-display text-2xl font-semibold mb-3">Сейчас не принимаем заказы</p>
      <p className="font-body text-muted-foreground text-lg mb-8 max-w-md">Мы скоро вернёмся! Позвоните нам или напишите — мы уточним время работы.</p>
      <a href="tel:88004441419" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-display text-lg font-bold hover:bg-primary/90 transition-colors">
        <Icon name="Phone" size={20} /> 8 800 444-14-19
      </a>
      <a href="/admin" className="mt-6 text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground transition-colors">
        Войти в панель управления
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* КОРЗИНА */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-xl bg-background flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-display text-xl font-bold">Корзина</h2>
              <button onClick={() => setCartOpen(false)} className="p-1 hover:text-primary"><Icon name="X" size={22} /></button>
            </div>
            <div className={`px-5 py-4 space-y-3 ${cartItems.length > 2 ? 'overflow-y-auto flex-1' : 'overflow-visible'} ${showPayment ? 'hidden' : ''}`}>
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Корзина пуста</p>
                  <p className="text-sm text-muted-foreground mt-1">Добавьте товары из каталога</p>
                </div>
              ) : cartItems.map(p => (
                <div key={p.id} className="bg-card border rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <img src={p.img} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base leading-tight">{p.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.price} ₽ {p.priceUnit}</p>
                      {!p.inStock && (
                        <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                          Под заказ{p.availableDate ? ` — с ${p.availableDate}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-red-50 text-red-500"><Icon name="Trash2" size={12} /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(p.id, -getQtyStep(p))} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-secondary"><Icon name="Minus" size={12} /></button>
                      <span className="font-semibold text-sm w-14 text-center">{getQtyLabel(p)}</span>
                      <button onClick={() => updateQty(p.id, getQtyStep(p))} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80"><Icon name="Plus" size={12} /></button>
                    </div>
                    <p className="font-bold text-sm text-primary">{getItemPrice(p)} ₽</p>
                  </div>
                </div>
              ))}
            </div>
            {cartItems.length > 0 && !showPayment && (
              <div className="border-t px-5 py-5 space-y-4">
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-white rounded-2xl px-5 py-4 transition-colors"
                >
                  <span className="font-display text-lg font-bold">Итого:</span>
                  <span className="font-display text-2xl font-bold">{cartTotal} ₽ →</span>
                </button>
                <Button variant="outline" className="w-full" onClick={() => setCart({})}>Очистить корзину</Button>
              </div>
            )}

            {cartItems.length > 0 && showPayment && !showDelivery && (
              <div className="border-t px-5 py-6 flex flex-col gap-4 overflow-y-auto flex-1">
                <button onClick={() => setShowPayment(false)} className="self-start flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="ChevronLeft" size={16} /> Назад
                </button>
                <p className="font-display text-xl font-bold text-center">Оформление заказа</p>

                {/* Итог с доставкой */}
                <div className="bg-secondary rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Товары</span>
                    <span className="font-semibold">{cartTotal} ₽</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    {cartTotal >= freeThreshold
                      ? <span className="font-semibold text-primary">Бесплатно</span>
                      : <span className="font-semibold">250 ₽</span>
                    }
                  </div>
                  {cartTotal < freeThreshold && (
                    <p className="text-xs text-muted-foreground">Добавьте ещё на {freeThreshold - cartTotal} ₽ для бесплатной доставки</p>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between font-body text-sm text-green-600">
                      <span>Скидка {discount}% (заказ #{orderCount})</span>
                      <span className="font-semibold">−{discountAmount} ₽</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-body text-sm">
                    <span className="font-bold">Итого</span>
                    <span className="font-bold text-primary">{cartTotalWithDiscount + (cartTotal >= freeThreshold ? 0 : 250)} ₽</span>
                  </div>
                </div>

                {/* Способ оплаты */}
                <div>
                  <p className="font-body text-sm font-semibold mb-3">Способ оплаты</p>
                  <div className="space-y-2">
                    {[
                      { id: 'sbp' as const, icon: 'Smartphone', label: 'СБП (QR-код)', sub: 'Оплата через приложение банка' },
                      { id: 'cash' as const, icon: 'Banknote', label: 'Наличными курьеру', sub: 'Оплата при получении' },
                      { id: 'terminal' as const, icon: 'CreditCard', label: 'Картой через терминал', sub: 'Терминал у курьера при доставке' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${paymentMethod === m.id ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/50'}`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === m.id ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                          <Icon name={m.icon as Parameters<typeof Icon>[0]["name"]} size={18} />
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold leading-tight">{m.label}</p>
                          <p className="font-body text-xs text-muted-foreground">{m.sub}</p>
                        </div>
                        {paymentMethod === m.id && <Icon name="CheckCircle" size={18} className="text-primary ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR для СБП */}
                {paymentMethod === 'sbp' && (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src="https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/bucket/c37202ab-de78-44b5-b1b4-0ba0490e56a3.png"
                      alt="QR СБП"
                      className="w-56 rounded-2xl"
                    />
                    <p className="text-xs text-muted-foreground text-center">⚠️ Оплачивайте только после подтверждения наличия товара</p>
                  </div>
                )}

                {(paymentMethod === 'cash' || paymentMethod === 'terminal') && (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-sm text-primary font-body">
                    {paymentMethod === 'cash' ? '💵 Оплата наличными курьеру при доставке' : '💳 Курьер привезёт терминал для оплаты картой'}
                  </div>
                )}

                <button
                  onClick={() => { if (paymentMethod) setShowDelivery(true); }}
                  disabled={!paymentMethod}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold rounded-2xl py-4 text-base tracking-wide transition-colors"
                >
                  {paymentMethod === 'sbp' ? 'Оплатил — указать адрес →' : paymentMethod ? 'Указать адрес доставки →' : 'Выберите способ оплаты'}
                </button>
              </div>
            )}

            {showDelivery && (
              <div className="border-t px-5 py-6 flex flex-col gap-4 overflow-y-auto flex-1">
                {!deliverySent ? (
                  <>
                    <button onClick={() => setShowDelivery(false)} className="self-start flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="ChevronLeft" size={16} /> Назад
                    </button>
                    <p className="font-display text-xl font-bold">Адрес доставки</p>

                    {deliveryInfo ? (
                      <div className={`rounded-xl p-3 flex items-center gap-3 ${deliveryInfo.isEvening ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                        <Icon name="Clock" size={20} className={deliveryInfo.isEvening ? 'text-orange-500' : 'text-green-600'} />
                        <div>
                          {!isOutOfCity && <p className="font-body text-sm font-semibold">Доставим через {deliveryInfo.deliveryMinutes} мин — к {deliveryInfo.arrivalStr}</p>}
                          {isOutOfCity && <p className="font-body text-sm font-semibold">Доставка за пределы города — по согласованию</p>}
                          <p className="font-body text-xs text-muted-foreground">
                            {deliveryInfo.isEvening ? 'Вечерний тариф' : 'Дневной тариф'}
                            {' · '}Доставка: {DELIVERY_COST === 0 ? 'Бесплатно' : `${DELIVERY_COST} ₽`}
                            {isOutOfCity && distanceKm > 0 && ` (${distanceKm} км × 15 ₽)`}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl p-3 flex items-center gap-3 bg-red-50 border border-red-200">
                        <Icon name="AlertCircle" size={20} className="text-red-500" />
                        <p className="font-body text-sm font-semibold text-red-700">Доставка работает с 10:00 до 00:00</p>
                      </div>
                    )}

                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Телефон *</label>
                      <Input placeholder="+7 (___) ___-__-__" value={deliveryForm.phone} onChange={e => { setDeliveryForm(f => ({ ...f, phone: e.target.value })); checkLoyalty(e.target.value); }} onBlur={e => checkLoyalty(e.target.value)} className="bg-secondary border-border font-body text-sm" />
                    </div>

                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Район *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {DISTRICTS.map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDeliveryForm(f => ({ ...f, district: d }))}
                            className={`py-2 rounded-lg font-body text-sm font-semibold border transition-colors ${deliveryForm.district === d ? 'bg-primary text-white border-primary' : 'bg-secondary border-border text-foreground hover:border-primary'}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Имя получателя *</label>
                      <Input placeholder="Иван" value={deliveryForm.name} onChange={e => setDeliveryForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleGeolocate}
                        disabled={geoLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-body text-sm font-semibold transition-colors disabled:opacity-60"
                      >
                        <Icon name={geoLoading ? "Loader" : "LocateFixed"} size={16} className={geoLoading ? "animate-spin" : ""} />
                        {geoLoading ? 'Определяем местоположение...' : 'Определить моё местоположение'}
                      </button>
                      {geoError && <p className="text-xs text-red-500 mt-1">{geoError}</p>}
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Улица *</label>
                      <Input placeholder="Ленина" value={deliveryForm.street} onChange={e => setDeliveryForm(f => ({ ...f, street: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1 block">Дом *</label>
                        <Input placeholder="42" value={deliveryForm.house} onChange={e => setDeliveryForm(f => ({ ...f, house: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1 block">Подъезд</label>
                        <Input placeholder="3" value={deliveryForm.entrance} onChange={e => setDeliveryForm(f => ({ ...f, entrance: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1 block">Квартира</label>
                        <Input placeholder="15" value={deliveryForm.apartment} onChange={e => setDeliveryForm(f => ({ ...f, apartment: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1 block">Этаж</label>
                        <Input placeholder="5" value={deliveryForm.floor} onChange={e => setDeliveryForm(f => ({ ...f, floor: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1 block">Домофон</label>
                        <Input placeholder="15К" value={deliveryForm.intercom} onChange={e => setDeliveryForm(f => ({ ...f, intercom: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Желаемая дата доставки</label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={deliveryForm.delivery_date}
                        onChange={e => setDeliveryForm(f => ({ ...f, delivery_date: e.target.value }))}
                        className="bg-secondary border-border font-body text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Оставьте пустым для доставки сегодня. Товары под заказ — 1–2 дня.</p>
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Комментарий курьеру</label>
                      <Textarea placeholder="Позвоните за 10 минут..." rows={3} value={deliveryForm.comment} onChange={e => setDeliveryForm(f => ({ ...f, comment: e.target.value }))} className="bg-secondary border-border font-body text-sm resize-none" />
                    </div>
                    <Button
                      onClick={handleDeliverySubmit}
                      disabled={deliverySending || !deliveryForm.name || !deliveryForm.phone || !deliveryForm.street || !deliveryForm.house || !deliveryForm.district || !deliveryInfo}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-display tracking-wide h-12"
                    >
                      <Icon name="Send" size={16} className="mr-2" />
                      {deliverySending ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ ЗАКАЗ'}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 py-10 px-2">
                    {cancelled ? (
                      <>
                        <Icon name="XCircle" size={56} className="text-red-500" />
                        <p className="font-display text-2xl font-bold">Заказ отменён</p>
                        <p className="text-sm text-muted-foreground">Ваш заказ был успешно отменён.</p>
                      </>
                    ) : (
                      <>
                        <Icon name="CheckCircle" size={56} className="text-green-500" />
                        <p className="font-display text-2xl font-bold">Заказ принят!</p>
                        {deliveryInfo && (
                          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3">
                            <p className="font-body text-base font-semibold text-green-800">Ваш заказ приедет через {deliveryInfo.deliveryMinutes} мин</p>
                            <p className="font-body text-sm text-green-700">Ориентировочно к {deliveryInfo.arrivalStr}</p>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">Курьер свяжется с вами перед приездом.</p>
                        {cancelSeconds > 0 && (
                          <div className="w-full border border-red-200 bg-red-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                            <p className="text-xs text-red-600">Отменить можно в течение {Math.floor(cancelSeconds / 60)}:{String(cancelSeconds % 60).padStart(2, '0')}</p>
                            <Button
                              variant="outline"
                              className="border-red-400 text-red-600 hover:bg-red-100 w-full"
                              disabled={cancelLoading}
                              onClick={async () => {
                                setCancelLoading(true);
                                await fetch("https://functions.poehali.dev/36d594d4-0de1-47a0-8704-a93dc25f659a", {
                                  method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ order_id: lastOrderId, name: deliveryForm.name, phone: deliveryForm.phone })
                                });
                                setCancelLoading(false);
                                setCancelled(true);
                                setCancelSeconds(0);
                              }}
                            >
                              {cancelLoading ? 'Отменяем...' : 'Отменить заказ'}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    <Button className="bg-primary text-white mt-2" onClick={() => { setCartOpen(false); setCart({}); setShowPayment(false); setShowDelivery(false); setDeliverySent(false); setCancelled(false); setCancelSeconds(0); }}>
                      Закрыть
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP ЛОЯЛЬНОСТИ */}
      {showLoyaltyPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLoyaltyPopup(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center z-10 border border-primary/30">
            <div className="text-5xl mb-4">🎉</div>
            <p className="font-display text-2xl font-bold mb-2">Вы наш постоянный клиент!</p>
            <p className="text-muted-foreground text-sm mb-4">У вас уже <span className="font-bold text-foreground">{orderCount}</span> {orderCount < 5 ? 'заказа' : 'заказов'} — вам полагается скидка</p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl py-4 px-6 mb-6">
              <p className="font-display text-5xl font-bold text-primary">{discount}%</p>
              <p className="text-sm text-muted-foreground mt-1">применена к вашему заказу</p>
            </div>
            <Button className="w-full bg-primary text-white" onClick={() => setShowLoyaltyPopup(false)}>
              Отлично, спасибо!
            </Button>
          </div>
        </div>
      )}

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

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:88004441419"
              className="flex items-center gap-2 font-body text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              <Icon name="Phone" size={16} className="text-primary" />
              8 800 444-14-19
            </a>
            <a
              href="mailto:yupomosh@yandex.ru"
              className="flex items-center gap-2 font-body text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              <Icon name="Mail" size={16} className="text-primary" />
              yupomosh@yandex.ru
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" style={{zIndex: 9999, position: 'relative'}}>
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
              🔥 Доставка от 15 минут · Под заказ 1–2 дня · На вашу дату
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
                { value: "15мин", label: "Скорость доставки" },
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
          {productsLoading && Array.from({length: 8}).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-secondary" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-secondary rounded w-1/2" />
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-3 bg-secondary rounded w-full" />
                <div className="h-8 bg-secondary rounded w-1/3 mt-3" />
              </div>
            </div>
          ))}
          {!productsLoading && filtered.map((product, i) => (
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
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-end">
                    <div className="w-full bg-orange-500 text-white text-center py-1.5 font-body text-xs font-semibold">
                      Под заказ{product.availableDate ? ` — с ${product.availableDate}` : ''}
                    </div>
                  </div>
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
                    className={`w-9 h-9 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${product.inStock !== false ? 'bg-primary hover:bg-primary/80' : 'bg-orange-500 hover:bg-orange-600'}`}
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
                { icon: "Clock", text: "Доставка от 15 минут после оформления заказа" },
                { icon: "Package", text: "Бесплатная доставка по городу при заказе от 2000 ₽" },
                { icon: "MapPin", text: "Бесплатная доставка по району при заказе от 3000 ₽" },
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
                <span className="text-muted-foreground">По городу от 2000 ₽</span>
                <span className="font-semibold text-primary">Бесплатно</span>
              </div>
              <div className="flex justify-between font-body text-sm mt-2">
                <span className="text-muted-foreground">По району от 3000 ₽</span>
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
                { icon: "QrCode", text: "Оплата по QR-коду через приложение банка" },
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
                {["💳 Карта", "📱 СБП", "📲 QR-код", "💵 Наличные"].map(m => (
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

      {/* ПРОГРАММА ЛОЯЛЬНОСТИ */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-body text-primary text-sm font-medium mb-2 uppercase tracking-widest">Для постоянных клиентов</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">ПРОГРАММА ЛОЯЛЬНОСТИ</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Чем больше заказываете — тем больше экономите. Скидка применяется автоматически при оформлении заказа.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { orders: '3 заказа', discount: '5%', icon: '🥩', desc: 'Начало пути', color: 'border-amber-200 bg-amber-50', textColor: 'text-amber-700' },
            { orders: '10 заказов', discount: '15%', icon: '🏆', desc: 'Постоянный клиент', color: 'border-primary/30 bg-primary/5', textColor: 'text-primary' },
            { orders: '20 заказов', discount: '25%', icon: '👑', desc: 'VIP клиент', color: 'border-purple-200 bg-purple-50', textColor: 'text-purple-700' },
          ].map((tier, i) => (
            <div key={i} className={`border-2 ${tier.color} rounded-2xl p-8 text-center`}>
              <div className="text-5xl mb-4">{tier.icon}</div>
              <p className={`font-display text-5xl font-bold ${tier.textColor} mb-2`}>{tier.discount}</p>
              <p className="font-display text-lg font-semibold mb-1">от {tier.orders}</p>
              <p className="font-body text-sm text-muted-foreground">{tier.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">Скидка определяется автоматически по номеру телефона при оформлении заказа</p>
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

              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:88004441419"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-display text-sm tracking-wide transition-colors duration-200"
                >
                  <Icon name="Phone" size={16} />
                  8 800 444-14-19
                </a>
                <a
                  href="mailto:yupomosh@yandex.ru"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-display text-sm tracking-wide transition-colors duration-200"
                >
                  <Icon name="Mail" size={16} />
                  yupomosh@yandex.ru
                </a>
              </div>

              <div className="mt-6 bg-card border border-border rounded-2xl p-5">
                <p className="font-display text-sm font-bold mb-3 flex items-center gap-2"><Icon name="Building2" size={16} className="text-primary" /> Реквизиты</p>
                <div className="space-y-1.5 text-xs font-body text-muted-foreground">
                  <p><span className="text-foreground font-semibold">Наименование:</span> ООО "ЮРКО"</p>
                  <p><span className="text-foreground font-semibold">ИНН / КПП:</span> 3849111690 / 384901001</p>
                  <p><span className="text-foreground font-semibold">ОГРН:</span> 1253800021430</p>
                  <p><span className="text-foreground font-semibold">Банк:</span> АО «ТБАНК»</p>
                  <p><span className="text-foreground font-semibold">БИК:</span> 044525974</p>
                  <p><span className="text-foreground font-semibold">Р/с:</span> 40702810910002031736</p>
                  <p><span className="text-foreground font-semibold">К/с:</span> 30101810145250000974</p>
                </div>
              </div>


            </div>

            <div className="bg-background border border-border rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold mb-6">Обратная связь</h3>
              {formSent ? (
                <div className="text-center py-8">
                  <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-lg">Заявка отправлена!</p>
                  <p className="text-sm text-muted-foreground mt-1">Мы свяжемся с вами в ближайшее время</p>
                  <Button variant="outline" className="mt-4" onClick={() => setFormSent(false)}>Отправить ещё</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1.5 block">Ваше имя *</label>
                      <Input placeholder="Иван Иванов" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1.5 block">Телефон *</label>
                      <Input placeholder="+7 (___) ___-__-__" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1.5 block">Email</label>
                    <Input placeholder="your@email.ru" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary border-border font-body text-sm" />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1.5 block">Сообщение</label>
                    <Textarea placeholder="Ваш вопрос или пожелание..." rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="bg-secondary border-border font-body text-sm resize-none" />
                  </div>
                  <Button onClick={handleFormSubmit} disabled={formSending || !form.name || !form.phone} className="w-full bg-primary hover:bg-primary/90 text-white font-display tracking-wide h-11">
                    <Icon name="Send" size={16} className="mr-2" />
                    {formSending ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ СООБЩЕНИЕ'}
                  </Button>
                </div>
              )}
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

            <div className="flex items-center gap-4">
              <p className="font-body text-xs text-muted-foreground">
                © 2025 Фабрикант Юрко. Все права защищены.
              </p>
              <a href="/admin" className="font-body text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors">⚙</a>
            </div>
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

      {/* БАННЕР УСТАНОВКИ PWA */}
      {showInstallBanner && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-sm mx-auto">
          <img src="https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/files/f9d2965e-3ea3-4a4e-8366-8f81bef1f4bc.jpg" className="w-12 h-12 rounded-xl shrink-0 object-cover" alt="icon" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Установить приложение</p>
            <p className="text-xs text-muted-foreground">Быстрый доступ с экрана телефона</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={dismissInstall} className="text-muted-foreground hover:text-foreground p-1"><Icon name="X" size={16} /></button>
            <Button size="sm" className="bg-primary text-white text-xs px-3" onClick={handleInstall}>Установить</Button>
          </div>
        </div>
      )}

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