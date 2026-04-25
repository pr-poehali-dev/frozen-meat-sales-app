import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

const API_AUTH = "https://functions.poehali.dev/6687360d-0946-46fb-9ce9-015965c5b980";
const API_ORDERS = "https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b";

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  in_progress: "Готовится",
  done: "Доставлен",
  cancelled: "Отменён",
  archived: "Завершён",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  archived: "bg-gray-100 text-gray-400",
};

interface Order {
  id: number;
  status: string;
  created_at: string;
  total: number;
  delivery_cost: number;
  message: string;
  items: { name: string; qty: number; price: number; sum: number }[] | null;
}

type Mode = "login" | "register";

export default function Account() {
  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) { setChecking(false); return; }
    fetch(`${API_AUTH}?role=user&action=check`, { headers: { "X-User-Session": session } })
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setUser({ name: d.name, phone: d.phone });
          loadOrders(session);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const loadOrders = (session: string) => {
    setOrdersLoading(true);
    fetch(`${API_ORDERS}?type=my_orders`, { headers: { "X-User-Session": session } })
      .then(r => r.json())
      .then(d => { if (d.ok) setOrders(d.orders); })
      .finally(() => setOrdersLoading(false));
  };

  const handleSubmit = async () => {
    setError("");
    if (!phone || !password || (mode === "register" && !name)) {
      setError("Заполните все поля"); return;
    }
    setLoading(true);
    const action = mode === "login" ? "login" : "register";
    const body: Record<string, string> = { phone, password };
    if (mode === "register") body.name = name;

    const res = await fetch(`${API_AUTH}?role=user&action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "Ошибка сети" }));

    setLoading(false);
    if (res.ok) {
      localStorage.setItem("user_session", res.session_id);
      localStorage.setItem("user_name", res.name);
      setUser({ name: res.name, phone: res.phone });
      loadOrders(res.session_id);
    } else {
      setError(res.error || "Ошибка");
    }
  };

  const handleLogout = async () => {
    const session = localStorage.getItem("user_session") || "";
    await fetch(`${API_AUTH}?role=user&action=logout`, {
      method: "DELETE",
      headers: { "X-User-Session": session },
    });
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_name");
    setUser(null);
    setOrders([]);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🥩</div>
            <h1 className="font-display text-2xl font-bold">ФАБРИКАНТ ЮРКО</h1>
            <p className="text-muted-foreground text-sm mt-1">Личный кабинет</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex gap-2 mb-6 bg-secondary rounded-xl p-1">
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "login" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
                onClick={() => { setMode("login"); setError(""); }}
              >Войти</button>
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "register" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
                onClick={() => { setMode("register"); setError(""); }}
              >Регистрация</button>
            </div>

            <div className="space-y-3">
              {mode === "register" && (
                <Input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              )}
              <Input
                placeholder="Телефон (+79001234567)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
              />
              <div>
                <Input
                  placeholder={mode === "register" ? "Придумайте пароль" : "Пароль"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                {mode === "register" && (
                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">Придумайте любой пароль — он нужен для входа в ваш кабинет</p>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
              {loading ? "..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </div>

          <div className="text-center mt-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Вернуться в магазин
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Привет, {user.name}!</h1>
            <p className="text-muted-foreground text-sm">{user.phone}</p>
          </div>
          <div className="flex gap-2">
            <a href="/">
              <Button variant="outline" size="sm">
                <Icon name="ShoppingBag" size={16} className="mr-1" /> Магазин
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-1" /> Выйти
            </Button>
          </div>
        </div>

        <h2 className="font-display text-lg font-bold mb-4">Мои заказы</h2>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-muted-foreground">Заказов пока нет</p>
            <a href="/">
              <Button className="mt-4">Перейти в магазин</Button>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg">Заказ #{order.id}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-3">
                  {new Date(order.created_at).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
                {order.items && order.items.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.name} × {item.qty}</span>
                        <span className="text-muted-foreground">{item.sum} ₽</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-muted-foreground text-sm">Доставка: {order.delivery_cost === 0 ? "Бесплатно" : `${order.delivery_cost} ₽`}</span>
                  <span className="font-bold text-primary">{order.total} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}