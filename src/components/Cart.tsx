import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QR_URL = "https://cdn.poehali.dev/projects/304bf6cf-bb93-4762-8412-559a2722c1ba/bucket/23de37a0-6e3e-470a-aad2-4570b0f3757c.png";

interface Product { id: number; name: string; category: string; desc: string; price: number; priceUnit: string; badge: string | null; img: string; }

interface CartProps {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  cartItems: Product[];
  cartTotal: number;
  cart: Record<number, number>;
  setCart: (v: Record<number, number>) => void;
  cartForm: { name: string; phone: string };
  setCartForm: (v: { name: string; phone: string }) => void;
  cartOrderSent: boolean;
  cartOrderSending: boolean;
  handleCartOrder: () => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  getQtyStep: (p: { priceUnit: string }) => number;
  getQtyLabel: (p: Product) => string;
  getItemPrice: (p: Product) => number;
}

export default function Cart({
  cartOpen, setCartOpen, cartItems, cartTotal, setCart,
  cartForm, setCartForm, cartOrderSent, cartOrderSending, handleCartOrder,
  removeFromCart, updateQty, getQtyStep, getQtyLabel, getItemPrice,
}: CartProps) {
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
      <div className="w-full max-w-md bg-background flex flex-col h-full shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-display text-xl font-bold">Корзина</h2>
          <button onClick={() => setCartOpen(false)} className="p-1 hover:text-primary"><Icon name="X" size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Корзина пуста</p>
              <p className="text-sm text-muted-foreground mt-1">Добавьте товары из каталога</p>
            </div>
          ) : cartItems.map(p => (
            <div key={p.id} className="bg-card border rounded-xl p-3">
              <div className="flex items-center gap-3">
                <img src={p.img} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.price} ₽ {p.priceUnit}</p>
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
        {cartItems.length > 0 && (
          <div className="border-t px-5 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">Итого:</span>
              <span className="font-display text-2xl font-bold text-primary">{cartTotal} ₽</span>
            </div>

            <div className="flex justify-center">
              <img src={QR_URL} alt="QR СБП" className="w-72 h-72 rounded-2xl" />
            </div>
            <Button variant="outline" className="w-full" onClick={() => setCart({})}>Очистить корзину</Button>
          </div>
        )}
      </div>
    </div>
  );
}
