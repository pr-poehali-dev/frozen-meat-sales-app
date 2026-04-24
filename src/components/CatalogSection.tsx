import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

interface Product { id: number; name: string; category: string; desc: string; price: number; priceUnit: string; badge: string | null; img: string; }

interface CatalogSectionProps {
  products: Product[];
  productsLoading: boolean;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  addToCart: (id: number) => void;
}

export default function CatalogSection({ products, productsLoading, activeCategory, setActiveCategory, addToCart }: CatalogSectionProps) {
  const categories = ["Все", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = activeCategory === "Все" ? products : products.filter(p => p.category === activeCategory);

  return (
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
        {productsLoading && Array.from({ length: 8 }).map((_, i) => (
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
        {!productsLoading && filtered.map((product) => (
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
  );
}
