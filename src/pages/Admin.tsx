import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import * as XLSX from "xlsx";

const API_AUTH = "https://functions.poehali.dev/6687360d-0946-46fb-9ce9-015965c5b980";
const API_PRODUCTS = "https://functions.poehali.dev/31a8d02a-8a3f-4009-b070-959140d11490";
const API_ORDERS = "https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b";

const CATEGORIES = ["Пельмени", "Вареники", "Позы / Хинкали", "Котлеты", "Голубцы", "Тефтели / Фрикадельки", "Чебуреки", "Блины", "Разное", "Фарш"];

const STATUS_LABELS: Record<string, string> = { new: "Новая", in_progress: "В работе", done: "Выполнена", cancelled: "Отменена", archived: "Архив" };
const STATUS_COLORS: Record<string, string> = { new: "bg-blue-100 text-blue-700", in_progress: "bg-yellow-100 text-yellow-700", done: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-500", archived: "bg-gray-100 text-gray-400" };

interface Stats { count: number; revenue: number; top_items: { name: string; qty: number; sum: number }[]; by_day: { day: string; count: number; revenue: number }[] }

interface Product {
  id: number; name: string; category: string; description: string;
  price: number; price_unit: string; badge: string | null; img_url: string;
  is_active: boolean; sort_order: number; in_stock: boolean; available_date: string | null;
}
interface Order {
  id: number; name: string; phone: string; email: string;
  message: string; status: string; created_at: string;
}

const emptyProduct = (): Omit<Product, 'id'> => ({
  name: '', category: CATEGORIES[0], description: '', price: 0,
  price_unit: 'за кг', badge: '', img_url: '', is_active: true, sort_order: 0,
  in_stock: true, available_date: null
});

export default function Admin() {
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('admin_session') || '');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'orders' | 'archive' | 'stats' | 'products'>('orders');
  const [siteClosed, setSiteClosed] = useState(false);
  const [siteClosedLoading, setSiteClosedLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [archive, setArchive] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [statsLoading, setStatsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState(emptyProduct());
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionId) { setChecking(false); return; }
    fetch(`${API_AUTH}/check`, { headers: { 'X-Session-Id': sessionId } })
      .then(r => r.json())
      .then(d => { if (d.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    loadProducts();
    loadOrders();
    fetch(`${API_ORDERS}?type=site_status`, { headers: { 'X-Session-Id': sessionId } })
      .then(r => r.json()).then(d => { if (d.ok) setSiteClosed(d.site_closed); });
  }, [authed]);

  const toggleSite = async () => {
    setSiteClosedLoading(true);
    const res = await fetch(API_ORDERS, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
      body: JSON.stringify({ action: 'toggle_site', site_closed: !siteClosed })
    }).then(r => r.json());
    if (res.ok) setSiteClosed(res.site_closed);
    setSiteClosedLoading(false);
  };

  const loadProducts = () =>
    fetch(API_PRODUCTS, { headers: { 'X-Session-Id': sessionId } })
      .then(r => r.json()).then(d => d.ok && setProducts(d.products));

  const loadOrders = () =>
    fetch(API_ORDERS, { headers: { 'X-Session-Id': sessionId } })
      .then(r => r.json()).then(d => d.ok && setOrders(d.orders));

  const loadArchive = () =>
    fetch(`${API_ORDERS}?type=archive`, { headers: { 'X-Session-Id': sessionId } })
      .then(r => r.json()).then(d => d.ok && setArchive(d.orders));

  const loadStats = (period: string) => {
    setStatsLoading(true);
    fetch(`${API_ORDERS}?type=stats&period=${period}`, { headers: { 'X-Session-Id': sessionId } })
      .then(r => r.json()).then(d => { if (d.ok) setStats(d); })
      .finally(() => setStatsLoading(false));
  };

  const handleLogin = async () => {
    setLoginError('');
    const res = await fetch(API_AUTH, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    }).then(r => r.json());
    if (res.ok) {
      localStorage.setItem('admin_session', res.session_id);
      setSessionId(res.session_id);
      setAuthed(true);
    } else {
      setLoginError(res.error || 'Ошибка входа');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setSessionId(''); setAuthed(false);
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    if (editProduct) {
      await fetch(API_PRODUCTS, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
        body: JSON.stringify(editProduct)
      });
      setEditProduct(null);
    } else {
      await fetch(API_PRODUCTS, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
        body: JSON.stringify(newProduct)
      });
      setNewProduct(emptyProduct());
      setShowAddForm(false);
    }
    await loadProducts();
    setSaving(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await fetch(`${API_PRODUCTS}?id=${id}`, { method: 'DELETE', headers: { 'X-Session-Id': sessionId } });
    loadProducts();
  };

  const handleOrderStatus = async (id: number, status: string) => {
    await fetch(API_ORDERS, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
      body: JSON.stringify({ id, status })
    });
    loadOrders();
  };

  const handleArchiveOrder = async (id: number) => {
    await fetch(API_ORDERS, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
      body: JSON.stringify({ id, status: 'archived' })
    });
    loadOrders();
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm('Удалить заказ навсегда?')) return;
    await fetch(`${API_ORDERS}?id=${id}`, { method: 'DELETE', headers: { 'X-Session-Id': sessionId } });
    loadArchive();
  };

  const exportToExcel = () => {
    if (!stats) return;
    const periodLabel = statsPeriod === 'today' ? 'Сегодня' : statsPeriod === 'week' ? 'Неделя' : 'Месяц';

    const summaryData = [
      ['Период', periodLabel],
      ['Выполнено заказов', stats.count],
      ['Выручка (₽)', stats.revenue],
      [],
      ['Товар', 'Кол-во (г/шт)', 'Сумма (₽)'],
      ...stats.top_items.map(i => [i.name, i.qty, i.sum]),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }];

    const byDayData = [
      ['Дата', 'Заказов', 'Выручка (₽)'],
      ...stats.by_day.map(d => [d.day, d.count, d.revenue]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(byDayData);
    ws2['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 15 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Сводка');
    XLSX.utils.book_append_sheet(wb, ws2, 'По дням');
    XLSX.writeFile(wb, `Бухгалтерия_${periodLabel}_${new Date().toLocaleDateString('ru')}.xlsx`);
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Загрузка...</p></div>;

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 rounded-2xl border bg-card shadow-lg">
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Вход в кабинет</h1>
        <div className="space-y-4">
          <Input placeholder="Логин" value={login} onChange={e => setLogin(e.target.value)} />
          <Input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <Button className="w-full" onClick={handleLogin}>Войти</Button>
        </div>
      </div>
    </div>
  );

  const ProductForm = ({ data, onChange }: { data: Omit<Product, 'id'> | Product, onChange: (f: string, v: string | number | boolean | null) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input placeholder="Название" value={data.name} onChange={e => onChange('name', e.target.value)} />
      <select className="border rounded-md px-3 py-2 text-sm bg-background" value={data.category} onChange={e => onChange('category', e.target.value)}>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
      <Textarea placeholder="Описание" value={data.description} onChange={e => onChange('description', e.target.value)} className="md:col-span-2" />
      <Input placeholder="Цена (руб)" type="number" value={data.price} onChange={e => onChange('price', Number(e.target.value))} />
      <Input placeholder="Единица (за кг, за шт...)" value={data.price_unit} onChange={e => onChange('price_unit', e.target.value)} />
      <Input placeholder="Бейдж (Хит продаж...)" value={data.badge || ''} onChange={e => onChange('badge', e.target.value)} />
      <Input placeholder="Ссылка на фото" value={data.img_url} onChange={e => onChange('img_url', e.target.value)} />
      <div className="md:col-span-2 flex flex-col gap-3 border rounded-lg p-3 bg-secondary/40">
        <p className="text-sm font-semibold">Наличие товара</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { onChange('in_stock', true); onChange('available_date', null); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${data.in_stock !== false ? 'bg-green-500 text-white border-green-500' : 'bg-background border-border text-muted-foreground'}`}
          >
            В наличии
          </button>
          <button
            type="button"
            onClick={() => onChange('in_stock', false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${data.in_stock === false ? 'bg-orange-500 text-white border-orange-500' : 'bg-background border-border text-muted-foreground'}`}
          >
            Под заказ
          </button>
        </div>
        {data.in_stock === false && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Ближайшая дата (когда будет готово)</label>
            <Input
              type="date"
              value={data.available_date || ''}
              onChange={e => onChange('available_date', e.target.value || null)}
              className="max-w-xs"
            />
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={data.is_active} onChange={e => onChange('is_active', e.target.checked)} />
        Показывать на сайте
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Личный кабинет</h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleSite}
            disabled={siteClosedLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${siteClosed ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-green-500 text-white border-green-500 hover:bg-green-600'}`}
          >
            <Icon name={siteClosed ? "MoonStar" : "Sun"} size={14} />
            {siteClosed ? 'Не беспокоить' : 'Работаем'}
          </button>
          <a href="/" target="_blank">
            <Button variant="outline" size="sm"><Icon name="ExternalLink" size={14} className="mr-1" />На сайт</Button>
          </a>
          <Button variant="outline" size="sm" onClick={handleLogout}>Выйти</Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant={tab === 'orders' ? 'default' : 'outline'} onClick={() => setTab('orders')}>
            <Icon name="ClipboardList" size={16} className="mr-2" />
            Заявки {orders.filter(o => o.status === 'new').length > 0 && <span className="ml-1 bg-white text-primary rounded-full px-1.5 text-xs font-bold">{orders.filter(o => o.status === 'new').length}</span>}
          </Button>
          <Button variant={tab === 'archive' ? 'default' : 'outline'} onClick={() => { setTab('archive'); loadArchive(); }}>
            <Icon name="Archive" size={16} className="mr-2" /> Архив
          </Button>
          <Button variant={tab === 'stats' ? 'default' : 'outline'} onClick={() => { setTab('stats'); loadStats(statsPeriod); }}>
            <Icon name="BarChart2" size={16} className="mr-2" /> Бухгалтерия
          </Button>
          <Button variant={tab === 'products' ? 'default' : 'outline'} onClick={() => setTab('products')}>
            <Icon name="Package" size={16} className="mr-2" /> Товары ({products.length})
          </Button>
        </div>

        {/* ЗАЯВКИ */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-muted-foreground text-center py-12">Активных заявок нет</p>}
            {orders.map(order => (
              <div key={order.id} className={`border rounded-xl p-5 bg-card ${order.status === 'new' ? 'border-primary/40' : ''}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base">{order.name}</p>
                    <p className="text-sm text-muted-foreground">{order.phone} {order.email && `• ${order.email}`}</p>
                    {order.message && <p className="text-sm mt-2 text-foreground whitespace-pre-line">{order.message}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString('ru')}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || ''}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                      <select className="border rounded px-2 py-1 text-xs bg-background"
                        value={order.status} onChange={e => handleOrderStatus(order.id, e.target.value)}>
                        {Object.entries(STATUS_LABELS).filter(([v]) => v !== 'archived').map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => handleArchiveOrder(order.id)}>
                      <Icon name="CheckCheck" size={13} className="mr-1" /> В архив
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* АРХИВ */}
        {tab === 'archive' && (
          <div className="space-y-4">
            {archive.length === 0 && <p className="text-muted-foreground text-center py-12">Архив пуст</p>}
            {archive.map(order => (
              <div key={order.id} className="border rounded-xl p-5 bg-card opacity-70">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{order.name} • {order.phone}</p>
                    {order.message && <p className="text-xs mt-1 text-muted-foreground whitespace-pre-line line-clamp-3">{order.message}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString('ru')}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteOrder(order.id)}>
                    <Icon name="Trash2" size={13} className="mr-1" /> Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* БУХГАЛТЕРИЯ */}
        {tab === 'stats' && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex gap-2">
                {(['today', 'week', 'month'] as const).map(p => (
                  <Button key={p} size="sm" variant={statsPeriod === p ? 'default' : 'outline'}
                    onClick={() => { setStatsPeriod(p); loadStats(p); }}>
                    {p === 'today' ? 'Сегодня' : p === 'week' ? 'Неделя' : 'Месяц'}
                  </Button>
                ))}
              </div>
              {stats && !statsLoading && (
                <Button size="sm" variant="outline" onClick={exportToExcel}>
                  <Icon name="Download" size={14} className="mr-1" /> Скачать Excel
                </Button>
              )}
            </div>
            {statsLoading && <p className="text-muted-foreground text-center py-12">Загрузка...</p>}
            {!statsLoading && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-xl p-5 bg-card text-center">
                    <p className="text-xs text-muted-foreground mb-1">Выполнено заказов</p>
                    <p className="font-display text-4xl font-bold text-primary">{stats.count}</p>
                  </div>
                  <div className="border rounded-xl p-5 bg-card text-center">
                    <p className="text-xs text-muted-foreground mb-1">Выручка</p>
                    <p className="font-display text-4xl font-bold text-green-600">{stats.revenue.toLocaleString('ru')} ₽</p>
                  </div>
                </div>
                {stats.top_items.length > 0 && (
                  <div className="border rounded-xl bg-card overflow-hidden">
                    <div className="px-5 py-3 border-b bg-secondary/40">
                      <p className="font-semibold text-sm">Продано по товарам</p>
                    </div>
                    <div className="divide-y">
                      {stats.top_items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                          <p className="text-sm font-medium flex-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.qty % 1 === 0 ? item.qty : item.qty.toFixed(0)} г/шт</p>
                          <p className="text-sm font-bold text-green-600 w-24 text-right">{item.sum.toLocaleString('ru')} ₽</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {stats.top_items.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">Нет выполненных заказов за этот период</p>
                )}

                {stats.by_day.length > 0 && (
                  <div className="border rounded-xl bg-card overflow-hidden">
                    <div className="px-5 py-3 border-b bg-secondary/40">
                      <p className="font-semibold text-sm">Заказы по дням</p>
                    </div>
                    <div className="divide-y">
                      {stats.by_day.map((d, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                          <p className="text-sm font-medium w-28">{d.day}</p>
                          <p className="text-xs text-muted-foreground flex-1">{d.count} заказ{d.count === 1 ? '' : d.count < 5 ? 'а' : 'ов'}</p>
                          <p className="text-sm font-bold text-green-600 w-24 text-right">{d.revenue.toLocaleString('ru')} ₽</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ТОВАРЫ */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Товары отображаются на сайте в разделе каталога</p>
              <Button onClick={() => { setShowAddForm(!showAddForm); setEditProduct(null); }}>
                <Icon name="Plus" size={16} className="mr-2" /> Добавить товар
              </Button>
            </div>

            {showAddForm && !editProduct && (
              <div className="border rounded-xl p-5 bg-card mb-4">
                <h3 className="font-semibold mb-3">Новый товар</h3>
                <ProductForm data={newProduct} onChange={(f, v) => setNewProduct(p => ({ ...p, [f]: v }))} />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveProduct} disabled={saving}>Сохранить</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Отмена</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="border rounded-xl bg-card overflow-hidden">
                  {editProduct?.id === p.id ? (
                    <div className="p-5">
                      <ProductForm data={editProduct} onChange={(f, v) => setEditProduct(prev => prev ? { ...prev, [f]: v } : prev)} />
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleSaveProduct} disabled={saving}>Сохранить</Button>
                        <Button variant="outline" onClick={() => setEditProduct(null)}>Отмена</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4">
                      {p.img_url && <img src={p.img_url} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{p.name}</p>
                          {p.badge && <Badge variant="secondary" className="text-xs">{p.badge}</Badge>}
                          {!p.is_active && <Badge variant="outline" className="text-xs text-muted-foreground">Скрыт</Badge>}
                          {!p.in_stock && <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200">Под заказ{p.available_date ? ` — ${new Date(p.available_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}` : ''}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{p.category} • {p.price} руб. {p.price_unit}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => { setEditProduct(p); setShowAddForm(false); }}>
                          <Icon name="Pencil" size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(p.id)}>
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-muted-foreground text-center py-12">Товаров пока нет. Добавьте первый!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}