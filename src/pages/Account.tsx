import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

const API_AUTH = "https://functions.poehali.dev/6687360d-0946-46fb-9ce9-015965c5b980";
const API_ORDERS = "https://functions.poehali.dev/010513ea-3143-4cc6-9e47-d5722ea1790b";

const STATUS_LABELS: Record<string, string> = {
  new: "Новый", in_progress: "Готовится", done: "Доставлен", cancelled: "Отменён", archived: "Завершён",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700", in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-500", archived: "bg-gray-100 text-gray-400",
};

interface Order {
  id: number; status: string; created_at: string; total: number;
  delivery_cost: number; message: string;
  items: { name: string; qty: number; price: number; sum: number }[] | null;
}

type Mode = "login" | "register" | "reset";

// Валидация пароля: латиница + цифры + спецсимволы, мин. 6 символов
function validatePassword(pw: string): string | null {
  if (pw.length < 6) return "Минимум 6 символов";
  if (!/[a-zA-Z]/.test(pw)) return "Пароль должен содержать латинские буквы";
  if (!/[0-9]/.test(pw)) return "Пароль должен содержать цифры";
  if (/[а-яёА-ЯЁ]/.test(pw)) return "Только латинские буквы, цифры и спецсимволы";
  return null;
}

export default function Account() {
  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState("");

  // Смена пароля
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [changePwError, setChangePwError] = useState("");
  const [changePwOk, setChangePwOk] = useState(false);

  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) { setChecking(false); return; }
    fetch(`${API_AUTH}?role=user&action=check`, { headers: { "X-User-Session": session } })
      .then(r => r.json())
      .then(d => { if (d.ok) { setUser({ name: d.name, phone: d.phone }); loadOrders(session); } })
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
    if (mode === "register") {
      if (!phone || !password || !name || !email) { setError("Заполните все поля"); return; }
      const pwErr = validatePassword(password);
      if (pwErr) { setError(pwErr); return; }
    }
    if (mode === "login" && (!phone || !password)) { setError("Заполните все поля"); return; }
    setLoading(true);
    const body: Record<string, string> = { phone, password };
    if (mode === "register") { body.name = name; body.email = email; }
    const res = await fetch(`${API_AUTH}?role=user&action=${mode}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
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

  const handleReset = async () => {
    setError("");
    if (!phone) { setError("Введите номер телефона"); return; }
    setLoading(true);
    const res = await fetch(`${API_AUTH}?role=user&action=reset_password`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "Ошибка сети" }));
    setLoading(false);
    if (res.ok) { setResetSent(res.masked_email); }
    else { setError(res.error || "Ошибка"); }
  };

  const handleLogout = async () => {
    const session = localStorage.getItem("user_session") || "";
    await fetch(`${API_AUTH}?role=user&action=logout`, { method: "DELETE", headers: { "X-User-Session": session } });
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_name");
    setUser(null); setOrders([]);
  };

  const handleChangePassword = async () => {
    setChangePwError("");
    if (!oldPw || !newPw || !newPw2) { setChangePwError("Заполните все поля"); return; }
    if (newPw !== newPw2) { setChangePwError("Новые пароли не совпадают"); return; }
    const pwErr = validatePassword(newPw);
    if (pwErr) { setChangePwError(pwErr); return; }
    const session = localStorage.getItem("user_session") || "";
    const res = await fetch(`${API_AUTH}?role=user&action=change_password`, {
      method: "POST", headers: { "Content-Type": "application/json", "X-User-Session": session },
      body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "Ошибка" }));
    if (res.ok) {
      setChangePwOk(true);
      setTimeout(() => { setShowChangePassword(false); setChangePwOk(false); setOldPw(""); setNewPw(""); setNewPw2(""); }, 2000);
    } else { setChangePwError(res.error || "Ошибка"); }
  };

  if (checking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥩</div>
          <h1 className="font-display text-2xl font-bold">ФАБРИКАНТ ЮРКО</h1>
          <p className="text-muted-foreground text-sm mt-1">Личный кабинет</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {mode !== "reset" && (
            <div className="flex gap-2 mb-6 bg-secondary rounded-xl p-1">
              <button className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "login" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
                onClick={() => { setMode("login"); setError(""); }}>Войти</button>
              <button className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "register" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
                onClick={() => { setMode("register"); setError(""); }}>Регистрация</button>
            </div>
          )}

          {mode === "reset" ? (
            <div>
              <button onClick={() => { setMode("login"); setError(""); setResetSent(""); }} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h3 className="font-display font-bold text-lg mb-4">Восстановление пароля</h3>
              {resetSent ? (
                <div className="text-center py-2">
                  <div className="text-3xl mb-2">📧</div>
                  <p className="text-sm text-foreground font-semibold">Временный пароль отправлен</p>
                  <p className="text-xs text-muted-foreground mt-1">на {resetSent}</p>
                  <p className="text-xs text-muted-foreground mt-3">Войдите с временным паролем и смените его в личном кабинете</p>
                  <Button className="w-full mt-4" onClick={() => { setMode("login"); setResetSent(""); }}>Войти</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input placeholder="Телефон (+79001234567)" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button className="w-full" onClick={handleReset} disabled={loading}>{loading ? "..." : "Отправить временный пароль"}</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {mode === "register" && (
                <>
                  <Input placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} />
                  <Input placeholder="Email (для восстановления пароля)" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                </>
              )}
              <Input placeholder="Телефон (+79001234567)" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
              <div>
                <Input
                  placeholder={mode === "register" ? "Придумайте пароль" : "Пароль"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  type="password" onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                {mode === "register" && (
                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">Латинские буквы + цифры, мин. 6 символов. Пример: <span className="font-mono">MyPass1!</span></p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button className="w-full mt-1" onClick={handleSubmit} disabled={loading}>
                {loading ? "..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
              </Button>
              {mode === "login" && (
                <button onClick={() => { setMode("reset"); setError(""); }} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center mt-1">
                  Забыли пароль?
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Вернуться в магазин</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-display text-lg font-bold mb-4">Смена пароля</h2>
            {changePwOk ? (
              <p className="text-green-600 font-semibold text-center py-4">✅ Пароль успешно изменён</p>
            ) : (
              <div className="space-y-3">
                <Input type="password" placeholder="Текущий пароль" value={oldPw} onChange={e => setOldPw(e.target.value)} />
                <div>
                  <Input type="password" placeholder="Новый пароль" value={newPw} onChange={e => setNewPw(e.target.value)} />
                  <p className="text-xs text-muted-foreground mt-1 ml-1">Латинские буквы + цифры, мин. 6 символов</p>
                </div>
                <Input type="password" placeholder="Повторите новый пароль" value={newPw2} onChange={e => setNewPw2(e.target.value)} />
                {changePwError && <p className="text-red-500 text-sm">{changePwError}</p>}
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleChangePassword}>Сохранить</Button>
                  <Button variant="outline" className="flex-1" onClick={() => { setShowChangePassword(false); setChangePwError(""); setOldPw(""); setNewPw(""); setNewPw2(""); }}>Отмена</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Привет, {user.name}!</h1>
            <p className="text-muted-foreground text-sm">{user.phone}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
              <Icon name="KeyRound" size={15} className="mr-1" /> Сменить пароль
            </Button>
            <a href="/"><Button variant="outline" size="sm"><Icon name="ShoppingBag" size={15} className="mr-1" /> Магазин</Button></a>
            <Button variant="ghost" size="sm" onClick={handleLogout}><Icon name="LogOut" size={15} className="mr-1" /> Выйти</Button>
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
            <a href="/"><Button className="mt-4">Перейти в магазин</Button></a>
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
                        <span>{item.name} × {item.qty}</span>
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
