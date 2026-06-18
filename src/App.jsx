import { useState } from "react";

const S = {
  card: { background: "#141824", border: "1px solid #374151", borderRadius: "12px", padding: "14px" },
  input: { background: "#0B0F1A", color: "#fff", border: "1px solid #374151", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none", width: "100%" },
  btn: (type = "primary") => ({
    primary: { background: "#F59E0B", color: "#0B0F1A", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", padding: "10px 16px" },
    ghost: { background: "#1a2035", color: "#9CA3AF", border: "1px solid #374151", borderRadius: "8px", cursor: "pointer", padding: "10px 16px" },
    danger: { background: "#EF4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", padding: "10px 16px" },
  })[type],
  badge: (color = "#F59E0B") => ({ background: color + "22", color: color, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }),
  text: "#fff",
  muted: "#9CA3AF",
  accent: "#F59E0B",
  danger: "#EF4444",
  border: "#374151",
};

const BRAND_FILTERS = ["מרצדס", "BMW", "אאודי", "טויוטה", "יונדאי", "קיה", "סובארו", "מאזדה", "פולקסווגן", "פורד", "ניסן", "הונדה"];
const SERVICE_FILTERS = ["מכונאות כללית", "חשמל רכב", "מיזוג אוויר", "גומים", "סוללות", "מצברים", "זכוכיות", "בדיקה טכנית"];
const EMERGENCY_FILTERS = ["גרירה", "חילוץ", "טעינת סוללה", "פנצ'ר", "דלק חירום", "מנעולן"];

export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState(() => localStorage.getItem("wheels_lang") || "he");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("wheels_user");
    return saved ? JSON.parse(saved) : { id: 1, name: "Guest", vehicles: [], cart: [], orders: [] };
  });
  const [cart, setCart] = useState(user.cart || []);

  const t = {
    he: {
      home: "בית", profile: "פרופיל", cart: "עגלה", orders: "הזמנות", providers: "סדנות",
      searchPlaceholder: "🔍 חפש חלק...", addToCart: "הוסף לעגלה", addedToCart: "✓ נוסף",
      myVehicles: "🚗 הרכבים שלי", noVehicles: "אין רכבים", addVehicle: "הוסף רכב לפי לוחית",
      plateSearch: "לוחית רישוי", search: "חפש", manufacturer: "יצרן", model: "דגם",
      year: "שנה", engine: "מנוע", fuel: "דלק", gear: "הילוכים", color: "צבע",
      notFound: "לא נמצא", searchError: "שגיאה בחיפוש", saved: "✓ נשמר", inStock: "במלאי",
      total: "סה\"כ", confirmOrder: "אישור הזמנה", emptyCart: "עגלה ריקה",
      myOrders: "הזמנותיי", noOrders: "אין הזמנות", allParts: "כל החלקים",
    },
    ar: {
      home: "الرئيسية", profile: "حسابي", cart: "السلة", orders: "طلباتي", providers: "ورش",
      searchPlaceholder: "🔍 ابحث...", addToCart: "أضف للسلة", addedToCart: "✓ تمت",
      myVehicles: "🚗 سياراتي", noVehicles: "لا توجد سيارات", addVehicle: "أضف سيارة",
      plateSearch: "رقم اللوحة", search: "بحث", manufacturer: "الصانع", model: "الموديل",
      year: "السنة", engine: "المحرك", fuel: "الوقود", gear: "الناقل", color: "اللون",
      notFound: "لم يجد", searchError: "خطأ البحث", saved: "✓ تم", inStock: "متوفر",
      total: "المجموع", confirmOrder: "تأكيد", emptyCart: "فارغة",
      myOrders: "طلباتي", noOrders: "لا توجد", allParts: "كل القطع",
    },
    en: {
      home: "Home", profile: "Profile", cart: "Cart", orders: "Orders", providers: "Garages",
      searchPlaceholder: "🔍 Search...", addToCart: "Add", addedToCart: "✓ Added",
      myVehicles: "🚗 My Vehicles", noVehicles: "No vehicles", addVehicle: "Add by plate",
      plateSearch: "License plate", search: "Search", manufacturer: "Brand", model: "Model",
      year: "Year", engine: "Engine", fuel: "Fuel", gear: "Transmission", color: "Color",
      notFound: "Not found", searchError: "Error", saved: "✓ Saved", inStock: "In stock",
      total: "Total", confirmOrder: "Order", emptyCart: "Empty",
      myOrders: "My Orders", noOrders: "No orders", allParts: "All parts",
    }
  }[lang];

  const parts = [
    { id: 1, name: "Tire 205/55R16", price: 450, stock: 10, code: "W001", brand: "Michelin" },
    { id: 2, name: "Oil 5W30", price: 80, stock: 25, code: "O001", brand: "Shell" },
    { id: 3, name: "Battery 60Ah", price: 320, stock: 5, code: "B001", brand: "Varta" },
    { id: 4, name: "Air Filter", price: 120, stock: 15, code: "F001", brand: "Bosch" },
  ];

  const providers = [
    { id: 1, name: "Garage Alon", type: "garage", area: "Tel Aviv", phone: "03-1234567" },
    { id: 2, name: "Tire Shop Ron", type: "shop", area: "Jerusalem", phone: "02-5555555" },
    { id: 3, name: "24/7 Roadside", type: "road", phone: "1-800-999-999" },
  ];

  const saveUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("wheels_user", JSON.stringify(newUser));
  };

  const addToCart = (part) => {
    const existing = cart.find(x => x.id === part.id);
    const newCart = existing
      ? cart.map(x => x.id === part.id ? { ...x, qty: x.qty + 1 } : x)
      : [...cart, { ...part, qty: 1 }];
    setCart(newCart);
    saveUser({ ...user, cart: newCart });
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(x => x.id !== id);
    setCart(newCart);
    saveUser({ ...user, cart: newCart });
  };

  const updateCartQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    const newCart = cart.map(x => x.id === id ? { ...x, qty } : x);
    setCart(newCart);
    saveUser({ ...user, cart: newCart });
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    const order = { items: cart, total: cart.reduce((s, i) => s + i.price * i.qty, 0), date: new Date().toLocaleDateString() };
    const newOrders = [...(user.orders || []), order];
    setCart([]);
    saveUser({ ...user, cart: [], orders: newOrders });
    setPage("orders");
  };

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("wheels_lang", l);
    window.location.reload();
  };

  return (
    <div style={{ background: "#0B0F1A", color: "#fff", minHeight: "100vh", padding: "16px", direction: lang === "ar" ? "rtl" : "ltr" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: `1px solid ${S.border}` }}>
        <h1 style={{ margin: "0", color: S.accent, fontSize: "24px" }}>🛞 WHEELS</h1>
        <div style={{ display: "flex", gap: "6px" }}>
          {[["he", "עב"], ["ar", "ع"], ["en", "EN"]].map(([l, label]) => (
            <button key={l} onClick={() => changeLang(l)} style={{
              ...S.btn(lang === l ? "primary" : "ghost"),
              padding: "6px 10px", fontSize: "11px"
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[["home", "🏠"], ["profile", "👤"], ["providers", "🔧"], ["orders", "📦"]].map(([p, icon]) => (
          <button key={p} onClick={() => setPage(p)} style={{
            ...S.btn(page === p ? "primary" : "ghost"),
            fontSize: "12px"
          }}>{icon} {t[p]}</button>
        ))}
        <button onClick={() => setPage("cart")} style={{
          ...S.btn(page === "cart" ? "primary" : "ghost"),
          fontSize: "12px", position: "relative"
        }}>
          🛒 {cart.length > 0 && `(${cart.length})`}
        </button>
      </div>

      {/* Home with Filters */}
      {page === "home" && (
        <div>
          {/* Filters Section */}
          <div style={{ ...S.card, marginBottom: "20px", background: "#0D1120" }}>
            <h3 style={{ marginTop: "0", marginBottom: "14px" }}>🔍 פילטרים</h3>
            
            {/* Brand Filters */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: S.muted, fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>🚗 מותגי רכב</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {BRAND_FILTERS.map(brand => (
                  <button key={brand} style={{
                    ...S.btn("ghost"),
                    padding: "6px 12px", fontSize: "12px"
                  }}>{brand}</button>
                ))}
              </div>
            </div>

            {/* Service Filters */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: S.muted, fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>🔧 סוגי שירות</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {SERVICE_FILTERS.map(service => (
                  <button key={service} style={{
                    ...S.btn("ghost"),
                    padding: "6px 12px", fontSize: "12px"
                  }}>{service}</button>
                ))}
              </div>
            </div>

            {/* Emergency Filters */}
            <div>
              <div style={{ color: S.muted, fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>🚨 שירותי חירום</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {EMERGENCY_FILTERS.map(emergency => (
                  <button key={emergency} style={{
                    ...S.btn("ghost"),
                    padding: "6px 12px", fontSize: "12px"
                  }}>{emergency}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Parts */}
          <h2>🛍️ {t.allParts}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
            {parts.map(p => (
              <div key={p.id} style={S.card}>
                <div style={{ fontSize: "12px", color: S.muted }}>{p.code}</div>
                <div style={{ fontWeight: "700", marginBottom: "6px" }}>{p.name}</div>
                <div style={{ fontSize: "12px", color: S.muted, marginBottom: "8px" }}>{p.brand}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: S.accent, fontWeight: "800" }}>₪{p.price}</span>
                  <span style={{ ...S.badge(p.stock > 0 ? "#10B981" : "#EF4444"), fontSize: "11px" }}>
                    {p.stock > 0 ? t.inStock : "Out"}
                  </span>
                </div>
                <button onClick={() => addToCart(p)} disabled={p.stock === 0} style={{
                  ...S.btn(), width: "100%", opacity: p.stock === 0 ? 0.5 : 1
                }}>{t.addToCart}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile */}
      {page === "profile" && (
        <div>
          <h2 style={{ marginTop: "0" }}>👤 הפרופיל שלי</h2>
          
          {/* Add Vehicle Section */}
          <div style={{ ...S.card, background: "linear-gradient(135deg, #F59E0B22, #3B82F611)", border: "2px solid #F59E0B44", marginBottom: "20px" }}>
            <h3 style={{ marginTop: "0", color: S.accent }}>➕ הוסף רכב חדש</h3>
            <p style={{ color: S.muted, fontSize: "13px", margin: "0 0 12px" }}>הקלד לוחית רישוי → המידע יטען אוטומטית</p>
            <VehicleLookup user={user} saveUser={saveUser} t={t} />
          </div>

          {/* My Vehicles Section */}
          <div>
            <h3 style={{ marginTop: "0", marginBottom: "12px" }}>🚗 הרכבים שלי ({user.vehicles?.length || 0})</h3>
            
            {user.vehicles?.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: S.muted, padding: "40px 20px" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚗</div>
                <p>{t.noVehicles}</p>
              </div>
            ) : (
              user.vehicles.map((v, i) => (
                <div key={i} style={{ ...S.card, marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "800", fontSize: "18px", marginBottom: "4px" }}>
                        {v.make} {v.model}
                      </div>
                      <div style={{ fontSize: "14px", color: S.accent, fontWeight: "800", marginBottom: "12px" }}>
                        🏷️ {v.plate}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                        {v.year && <div><span style={{ color: S.accent }}>📅</span> {v.year}</div>}
                        {v.engine && <div><span style={{ color: S.accent }}>🔧</span> {v.engine}cc</div>}
                        {v.fuel && <div><span style={{ color: S.accent }}>⛽</span> {v.fuel}</div>}
                        {v.gear && <div><span style={{ color: S.accent }}>⚙️</span> {v.gear}</div>}
                        {v.drive && <div><span style={{ color: S.accent }}>🚗</span> {v.drive}</div>}
                        {v.color && <div><span style={{ color: S.accent }}>🎨</span> {v.color}</div>}
                      </div>
                    </div>
                    <button onClick={() => saveUser({ ...user, vehicles: user.vehicles.filter((_, j) => j !== i) })} 
                      style={{ ...S.btn("danger"), padding: "6px 10px", whiteSpace: "nowrap", height: "fit-content" }}>
                      🗑️ מחק
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Providers */}
      {page === "providers" && (
        <div>
          <h2 style={{ marginTop: "0" }}>🔧 סדנות וספקים</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {providers.map(p => (
              <div key={p.id} style={S.card}>
                <div style={{ fontWeight: "700", marginBottom: "6px" }}>{p.name}</div>
                {p.area && <div style={{ fontSize: "12px", color: S.muted }}>📍 {p.area}</div>}
                <a href={`tel:${p.phone}`} style={{ color: S.accent, textDecoration: "none", fontWeight: "700", display: "block", marginTop: "8px" }}>
                  📞 {p.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart */}
      {page === "cart" && (
        <div>
          <h2 style={{ marginTop: "0" }}>🛒 עגלה</h2>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: S.muted }}>{t.emptyCart}</div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "700" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: S.muted }}>₪{item.price} × {item.qty}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={{ ...S.btn("ghost"), padding: "4px 8px" }}>−</button>
                    <input type="number" value={item.qty} onChange={e => updateCartQty(item.id, parseInt(e.target.value) || 1)} style={{ ...S.input, width: "50px", textAlign: "center", padding: "4px" }} />
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ ...S.btn("ghost"), padding: "4px 8px" }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ ...S.btn("danger"), padding: "4px 8px" }}>✕</button>
                  </div>
                </div>
              ))}
              <div style={{ ...S.card, marginTop: "16px", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "18px" }}>
                <span>{t.total}</span>
                <span style={{ color: S.accent }}>₪{cart.reduce((s, i) => s + i.price * i.qty, 0)}</span>
              </div>
              <button onClick={placeOrder} style={{ ...S.btn(), width: "100%", marginTop: "12px", fontSize: "14px" }}>{t.confirmOrder}</button>
            </>
          )}
        </div>
      )}

      {/* Orders */}
      {page === "orders" && (
        <div>
          <h2 style={{ marginTop: "0" }}>{t.myOrders}</h2>
          {!user.orders || user.orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: S.muted }}>{t.noOrders}</div>
          ) : (
            user.orders.map((o, i) => (
              <div key={i} style={S.card}>
                <div style={{ fontWeight: "700", marginBottom: "8px" }}>#{i + 1} - {o.date}</div>
                {o.items.map((item, j) => (
                  <div key={j} style={{ fontSize: "12px", color: S.muted, display: "flex", justifyContent: "space-between" }}>
                    <span>{item.name} × {item.qty}</span>
                    <span>₪{item.price * item.qty}</span>
                  </div>
                ))}
                <div style={{ fontWeight: "700", color: S.accent, marginTop: "8px" }}>סה"כ: ₪{o.total}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function VehicleLookup({ user, saveUser, t }) {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!plate.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const clean = plate.replace(/-/g, "").trim();
      const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=${clean}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      const record = data?.result?.records?.[0];
      if (!record) {
        setError(t.notFound);
      } else {
        setResult({
          plate: clean,
          make: record.tozeret_nm || "Unknown",
          model: record.kinuy_mishari || "Unknown",
          year: record.shnat_yitzur || "-",
          engine: record.nefah_manoa || "-",
          fuel: record.sug_delek_nm || "-",
          gear: record.mispar_halukot ? (record.mispar_halukot === "0" ? "יד" : "אוטומט") : "-",
          drive: record.sug_hanaa_nm || "-",
          color: record.tzeva_rechev || "-",
          vin: record.misgeret || "-",
          firstDate: record.taarich_reshum || "-",
        });
      }
    } catch (e) {
      setError(t.searchError);
    }
    setLoading(false);
  };

  const addVehicle = () => {
    if (!result) return;
    const newVehicles = [...(user.vehicles || []), result];
    saveUser({ ...user, vehicles: newVehicles });
    setPlate("");
    setResult(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input style={S.input}
          placeholder={t.plateSearch}
          value={plate}
          onChange={e => setPlate(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          maxLength="8"
        />
        <button onClick={lookup} style={{ ...S.btn(), whiteSpace: "nowrap" }} disabled={loading}>
          {loading ? "⏳" : t.search}
        </button>
      </div>

      {error && <p style={{ color: "#EF4444", fontSize: "12px" }}>{error}</p>}

      {result && (
        <div style={{ background: "#0B0F1A", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
          <div style={{ fontWeight: "800", color: "#F59E0B", marginBottom: "12px", fontSize: "16px" }}>
            🚗 {result.make} {result.model}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
            <div style={{ background: "#141824", borderRadius: "6px", padding: "8px" }}>
              <div style={{ color: "#9CA3AF", fontSize: "10px" }}>📅 שנה</div>
              <div style={{ fontWeight: "700", color: "#F59E0B", marginTop: "4px" }}>{result.year}</div>
            </div>
            <div style={{ background: "#141824", borderRadius: "6px", padding: "8px" }}>
              <div style={{ color: "#9CA3AF", fontSize: "10px" }}>🔧 מנוע</div>
              <div style={{ fontWeight: "700", color: "#F59E0B", marginTop: "4px" }}>{result.engine}cc</div>
            </div>
            <div style={{ background: "#141824", borderRadius: "6px", padding: "8px" }}>
              <div style={{ color: "#9CA3AF", fontSize: "10px" }}>⛽ דלק</div>
              <div style={{ fontWeight: "700", color: "#F59E0B", marginTop: "4px" }}>{result.fuel}</div>
            </div>
            <div style={{ background: "#141824", borderRadius: "6px", padding: "8px" }}>
              <div style={{ color: "#9CA3AF", fontSize: "10px" }}>⚙️ הילוכים</div>
              <div style={{ fontWeight: "700", color: "#F59E0B", marginTop: "4px" }}>{result.gear}</div>
            </div>
            <div style={{ background: "#141824", borderRadius: "6px", padding: "8px" }}>
              <div style={{ color: "#9CA3AF", fontSize: "10px" }}>🚗 הנעה</div>
              <div style={{ fontWeight: "700", color: "#F59E0B", marginTop: "4px" }}>{result.drive}</div>
            </div>
            <div style={{ background: "#141824", borderRadius: "6px", padding: "8px" }}>
              <div style={{ color: "#9CA3AF", fontSize: "10px" }}>🎨 צבע</div>
              <div style={{ fontWeight: "700", color: "#F59E0B", marginTop: "4px" }}>{result.color}</div>
            </div>
          </div>
          <button onClick={addVehicle} style={{ ...S.btn(), width: "100%", marginTop: "12px" }}>
            ✅ הוסף רכב
          </button>
        </div>
      )}
    </div>
  );
}
