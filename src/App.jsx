import { useState, useEffect } from "react";

const SUPABASE_URL = "https://eeeujeboftmhblfmyabp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZXVqZWJvZnRtaGJsZm15YWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzg1OTUsImV4cCI6MjA5Njk1NDU5NX0.BI6JUYmuXWWi7dQpm8eC6AmMq-owK3E79e_omtHmQQc";

async function sb(path, opts = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  if (opts.method && opts.method !== "GET") {
    headers["Prefer"] = opts.prefer || "return=representation";
  }
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase error: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const DB = {
  async getCategoryTree() {
    const rows = await sb("categories?select=*&order=sort_order.asc");
    const byId = {};
    rows.forEach(r => { byId[r.id] = { id: r.id, name: r.name, icon: r.icon, children: [] }; });
    const roots = [];
    rows.forEach(r => {
      const node = byId[r.id];
      if (r.parent_id && byId[r.parent_id]) byId[r.parent_id].children.push(node);
      else roots.push(node);
    });
    const clean = n => { if (!n.children.length) delete n.children; else n.children.forEach(clean); return n; };
    roots.forEach(clean);
    return roots;
  },

  async getParts() {
    const rows = await sb("parts?select=*&active=eq.true&order=created_at.asc");
    return rows.map(r => ({
      id: r.id, catId: r.category_id, name: r.name, price: Number(r.price),
      catalogCode: r.catalog_code, manufacturer: r.manufacturer,
      stock: r.stock, active: r.active, compat: r.compat || [],
    }));
  },

  async getProviders() {
    const rows = await sb("providers?select=*&active=eq.true&order=created_at.asc");
    return rows.map(r => ({
      id: r.id, type: r.type, name: r.name, area: r.area, phone: r.phone,
      hours: r.hours || {}, specialBrands: r.special_brands || [],
      serviceKinds: r.service_kinds || [], replacementCar: r.replacement_car,
      active: r.active, notes: r.notes,
    }));
  },

  async getUserByPhone(phone) {
    const rows = await sb(`users?select=*&phone=eq.${encodeURIComponent(phone)}`);
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id, phone: r.phone, name: r.name, role: r.role,
      customerType: r.customer_type, bizApproved: r.biz_approved,
      bizData: r.biz_data, vehicles: r.vehicles || [], cart: r.cart || [],
    };
  },

  async createUser(user) {
    const rows = await sb("users", {
      method: "POST",
      body: JSON.stringify({
        phone: user.phone, name: user.name || "משתמש", role: "customer",
        customer_type: "private", biz_approved: false,
        vehicles: [], cart: [],
      }),
    });
    const r = rows[0];
    return {
      id: r.id, phone: r.phone, name: r.name, role: r.role,
      customerType: r.customer_type, bizApproved: r.biz_approved,
      bizData: r.biz_data, vehicles: r.vehicles || [], cart: r.cart || [],
    };
  },

  async updateUser(phone, updates) {
    const body = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.vehicles !== undefined) body.vehicles = updates.vehicles;
    if (updates.cart !== undefined) body.cart = updates.cart;
    const rows = await sb(`users?phone=eq.${encodeURIComponent(phone)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return rows && rows[0] ? rows[0] : null;
  },

  async createOrder(order) {
    const rows = await sb("orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
    return rows && rows[0] ? rows[0] : null;
  },

  async getOrders(userId) {
    const rows = await sb(`orders?select=*&user_id=eq.${userId}&order=created_at.desc`);
    return rows || [];
  },
};

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  // Colors
  bg: "#0B0F1A",
  card: "#141824",
  cardHover: "#1C2235",
  accent: "#F59E0B",   // amber - wheels/automotive feel
  accentDark: "#D97706",
  text: "#F0F4FF",
  muted: "#6B7280",
  border: "#1E2640",
  success: "#10B981",
  danger: "#EF4444",
  info: "#3B82F6",

  // Common styles
  page: {
    background: "#0B0F1A",
    color: "#F0F4FF",
    minHeight: "100vh",
    direction: "rtl",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  header: {
    background: "#0D1120",
    borderBottom: "1px solid #1E2640",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#F59E0B",
    letterSpacing: "-0.5px",
  },
  btn: (variant = "primary") => ({
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    background: variant === "primary" ? "#F59E0B" :
      variant === "danger" ? "#EF4444" :
      variant === "ghost" ? "transparent" : "#1E2640",
    color: variant === "ghost" ? "#6B7280" : "#0B0F1A",
    ...(variant === "ghost" ? { color: "#9CA3AF", border: "1px solid #1E2640" } : {}),
  }),
  card: {
    background: "#141824",
    border: "1px solid #1E2640",
    borderRadius: "12px",
    padding: "16px",
  },
  input: {
    background: "#0D1120",
    border: "1px solid #1E2640",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#F0F4FF",
    fontSize: "15px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  },
  badge: (color = "#F59E0B") => ({
    background: color + "22",
    color: color,
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  }),
};

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [parts, setParts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("wheels_session");
    if (storedPhone) {
      loadUser(storedPhone).then(() => setPage("home"));
    }
  }, []);

  const loadUser = async (phone) => {
    try {
      let u = await DB.getUserByPhone(phone);
      if (!u) u = await DB.createUser({ phone });
      setUser(u);
      setCart(u.cart || []);
      return u;
    } catch (e) {
      setError("שגיאה בטעינת המשתמש");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, p, pr] = await Promise.all([
        DB.getCategoryTree(),
        DB.getParts(),
        DB.getProviders(),
      ]);
      setCats(c);
      setParts(p);
      setProviders(pr);
    } catch (e) {
      setError("שגיאה בטעינת נתונים");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page !== "login") loadData();
  }, [page === "home"]);

  const loadOrders = async () => {
    if (!user) return;
    try {
      const o = await DB.getOrders(user.id);
      setOrders(o);
    } catch (e) {}
  };

  useEffect(() => {
    if (page === "orders") loadOrders();
  }, [page]);

  const handleLogin = async (phone, name) => {
    setLoading(true);
    setError("");
    try {
      let u = await DB.getUserByPhone(phone);
      if (!u) u = await DB.createUser({ phone, name: name || "משתמש" });
      setUser(u);
      setCart(u.cart || []);
      localStorage.setItem("wheels_session", phone);
      setPage("home");
    } catch (e) {
      setError("שגיאה בהתחברות — נסה שוב");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("wheels_session");
    setUser(null);
    setCart([]);
    setPage("login");
  };

  const addToCart = async (part) => {
    const existing = cart.find(i => i.id === part.id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i.id === part.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...cart, { id: part.id, name: part.name, price: part.price, qty: 1 }];
    }
    setCart(newCart);
    if (user) await DB.updateUser(user.phone, { cart: newCart });
  };

  const removeFromCart = async (partId) => {
    const newCart = cart.filter(i => i.id !== partId);
    setCart(newCart);
    if (user) await DB.updateUser(user.phone, { cart: newCart });
  };

  const updateQty = async (partId, qty) => {
    if (qty < 1) return removeFromCart(partId);
    const newCart = cart.map(i => i.id === partId ? { ...i, qty } : i);
    setCart(newCart);
    if (user) await DB.updateUser(user.phone, { cart: newCart });
  };

  const placeOrder = async () => {
    if (!user || cart.length === 0) return;
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    try {
      await DB.createOrder({
        user_id: user.id,
        items: cart,
        total,
        status: "pending",
        created_at: new Date().toISOString(),
      });
      const newCart = [];
      setCart(newCart);
      await DB.updateUser(user.phone, { cart: newCart });
      setPage("orders");
    } catch (e) {
      setError("שגיאה בשמירת ההזמנה");
    }
  };

  const updateVehicles = async (vehicles) => {
    const updated = { ...user, vehicles };
    setUser(updated);
    await DB.updateUser(user.phone, { vehicles });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} loading={loading} error={error} />;
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "24px" }}>🛞</span>
          <span style={S.logo}>WHEELS</span>
          <span style={{ color: S.muted, fontSize: "13px", marginRight: "4px" }}>חלקי גלגלים</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <NavBtn icon="🏠" label="בית" active={page === "home"} onClick={() => setPage("home")} />
          <NavBtn icon="🔧" label="סדנות" active={page === "providers"} onClick={() => setPage("providers")} />
          <NavBtn icon="📦" label="הזמנות" active={page === "orders"} onClick={() => setPage("orders")} />
          <NavBtn icon="👤" label="פרופיל" active={page === "profile"} onClick={() => setPage("profile")} />
          <button
            onClick={() => setPage("cart")}
            style={{ ...S.btn("primary"), position: "relative", padding: "8px 14px" }}
          >
            🛒 {cartCount > 0 && <span style={{
              background: S.danger, color: "#fff", borderRadius: "50%",
              fontSize: "11px", padding: "1px 5px", marginRight: "4px"
            }}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#EF444422", color: S.danger, padding: "12px 20px", textAlign: "center" }}>
          {error} <button onClick={() => setError("")} style={{ background: "none", border: "none", color: S.danger, cursor: "pointer" }}>✕</button>
        </div>
      )}

      <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
        {loading && <div style={{ textAlign: "center", color: S.muted, padding: "40px" }}>⏳ טוען...</div>}

        {!loading && page === "home" && (
          <HomePage cats={cats} parts={parts} onAddToCart={addToCart} user={user} />
        )}
        {page === "providers" && <ProvidersPage providers={providers} />}
        {page === "cart" && (
          <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onOrder={placeOrder} setPage={setPage} />
        )}
        {page === "orders" && <OrdersPage orders={orders} />}
        {page === "profile" && (
          <ProfilePage user={user} onUpdateVehicles={updateVehicles} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "#F59E0B22" : "transparent",
      color: active ? S.accent : S.muted,
      border: "none", cursor: "pointer",
      padding: "6px 12px", borderRadius: "8px",
      fontSize: "13px", fontWeight: active ? "700" : "400",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─── Login Page ─────────────────────────────────────────────────────────────
function LoginPage({ onLogin, loading, error }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1); // 1=phone, 2=name

  const handlePhoneNext = () => {
    if (phone.length >= 9) setStep(2);
  };

  const handleSubmit = () => {
    onLogin(phone, name);
  };

  return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...S.card, width: "340px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🛞</div>
        <h1 style={{ color: S.accent, fontSize: "28px", margin: "0 0 4px" }}>WHEELS</h1>
        <p style={{ color: S.muted, marginBottom: "24px", fontSize: "14px" }}>חלקי חילוף לגלגלים ורכב</p>

        {step === 1 && (
          <>
            <p style={{ color: S.muted, fontSize: "13px", marginBottom: "12px" }}>
              הכנס מספר טלפון להתחברות או הרשמה
            </p>
            <input
              style={{ ...S.input, marginBottom: "16px", fontSize: "18px", textAlign: "center", letterSpacing: "2px" }}
              type="tel"
              placeholder="050-000-0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handlePhoneNext()}
              autoFocus
            />
            <button
              onClick={handlePhoneNext}
              style={{ ...S.btn(), width: "100%", padding: "12px" }}
              disabled={phone.length < 9 || loading}
            >
              המשך →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: S.muted, fontSize: "13px", marginBottom: "12px" }}>
              מה השם שלך?
            </p>
            <div style={{ ...S.badge(S.accent), marginBottom: "16px", fontSize: "14px" }}>📱 {phone}</div>
            <input
              style={{ ...S.input, marginBottom: "16px", fontSize: "16px" }}
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              style={{ ...S.btn(), width: "100%", padding: "12px", marginBottom: "8px" }}
              disabled={!name.trim() || loading}
            >
              {loading ? "⏳ נכנס..." : "כניסה →"}
            </button>
            <button
              onClick={() => setStep(1)}
              style={{ ...S.btn("ghost"), width: "100%", padding: "8px" }}
            >
              ← שנה מספר
            </button>
          </>
        )}

        {error && <p style={{ color: S.danger, marginTop: "12px", fontSize: "14px" }}>{error}</p>}
        <p style={{ color: S.muted, fontSize: "11px", marginTop: "16px" }}>
          ללא קוד אימות — כניסה מיידית
        </p>
      </div>
    </div>
  );
}

// ─── Home Page ──────────────────────────────────────────────────────────────
function HomePage({ cats, parts, onAddToCart, user }) {
  const [search, setSearch] = useState("");
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [added, setAdded] = useState({});

  const vehicles = user?.vehicles || [];
  const makes = [...new Set(vehicles.map(v => v.make))];

  const filtered = parts.filter(p => {
    const matchSearch = !search || p.name.includes(search) || (p.catalogCode || "").includes(search);
    const matchCat = !selectedCat || p.catId === selectedCat;
    const matchCompat = !filterMake || !p.compat || p.compat.length === 0 ||
      p.compat.some(c =>
        (!filterMake || c.make === filterMake) &&
        (!filterModel || c.model === filterModel) &&
        (!filterYear || String(c.year) === filterYear)
      );
    return matchSearch && matchCat && matchCompat;
  });

  const handleAdd = (part) => {
    onAddToCart(part);
    setAdded(a => ({ ...a, [part.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [part.id]: false })), 1500);
  };

  return (
    <div>
      {/* Hero search */}
      <div style={{ ...S.card, marginBottom: "20px", background: "linear-gradient(135deg, #141824, #1a2035)" }}>
        <h2 style={{ color: S.accent, margin: "0 0 16px", fontSize: "20px" }}>🔍 חפש חלקים</h2>
        <input
          style={{ ...S.input, marginBottom: "12px" }}
          placeholder="שם חלק, קוד קטלוגי..." value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {vehicles.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select style={{ ...S.input, width: "auto", flex: 1 }} value={filterMake} onChange={e => setFilterMake(e.target.value)}>
              <option value="">כל המותגים</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input style={{ ...S.input, flex: 1 }} placeholder="דגם" value={filterModel} onChange={e => setFilterModel(e.target.value)} />
            <input style={{ ...S.input, flex: 1, maxWidth: "100px" }} placeholder="שנה" value={filterYear} onChange={e => setFilterYear(e.target.value)} />
          </div>
        )}
        {vehicles.length === 0 && (
          <p style={{ color: S.muted, fontSize: "13px", margin: "8px 0 0" }}>💡 הוסף רכב בפרופיל שלך כדי לסנן לפי תאימות</p>
        )}
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button
          onClick={() => setSelectedCat(null)}
          style={{ ...S.btn(selectedCat === null ? "primary" : "ghost"), padding: "6px 14px", fontSize: "13px" }}
        >הכל</button>
        {cats.map(cat => (
          <button key={cat.id}
            onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
            style={{ ...S.btn(selectedCat === cat.id ? "primary" : "ghost"), padding: "6px 14px", fontSize: "13px" }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Parts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: S.muted, padding: "40px" }}>
            😕 לא נמצאו חלקים
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} style={{ ...S.card, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: S.muted, fontSize: "12px" }}>{p.catalogCode}</div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: S.text }}>{p.name}</div>
            {p.manufacturer && <div style={{ color: S.muted, fontSize: "13px" }}>🏭 {p.manufacturer}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              <span style={{ color: S.accent, fontWeight: "800", fontSize: "18px" }}>₪{p.price}</span>
              <span style={{ ...S.badge(p.stock > 0 ? S.success : S.danger) }}>
                {p.stock > 0 ? `במלאי (${p.stock})` : "אזל"}
              </span>
            </div>
            <button
              onClick={() => handleAdd(p)}
              disabled={p.stock === 0}
              style={{
                ...S.btn(added[p.id] ? "ghost" : "primary"),
                width: "100%", opacity: p.stock === 0 ? 0.5 : 1,
              }}
            >
              {added[p.id] ? "✓ נוסף לעגלה" : "הוסף לעגלה"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cart Page ───────────────────────────────────────────────────────────────
function CartPage({ cart, onRemove, onUpdateQty, onOrder, setPage }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
        <h2 style={{ color: S.muted }}>העגלה ריקה</h2>
        <button onClick={() => setPage("home")} style={S.btn()}>חזרה לחנות</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>🛒 עגלת קניות</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        {cart.map(item => (
          <div key={item.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700" }}>{item.name}</div>
              <div style={{ color: S.accent, fontWeight: "800" }}>₪{item.price}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{ ...S.btn("ghost"), padding: "4px 10px" }}>−</button>
              <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "700" }}>{item.qty}</span>
              <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ ...S.btn("ghost"), padding: "4px 10px" }}>+</button>
            </div>
            <div style={{ fontWeight: "800", minWidth: "70px", textAlign: "center" }}>₪{item.price * item.qty}</div>
            <button onClick={() => onRemove(item.id)} style={{ ...S.btn("danger"), padding: "6px 12px" }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: S.muted, fontSize: "14px" }}>סה"כ לתשלום</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: S.accent }}>₪{total}</div>
        </div>
        <button onClick={onOrder} style={{ ...S.btn(), padding: "14px 32px", fontSize: "16px" }}>
          ✅ אשר הזמנה
        </button>
      </div>
    </div>
  );
}

// ─── Orders Page ─────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  pending: { label: "ממתין", color: "#F59E0B" },
  processing: { label: "בטיפול", color: "#3B82F6" },
  shipped: { label: "נשלח", color: "#8B5CF6" },
  delivered: { label: "נמסר", color: "#10B981" },
  cancelled: { label: "בוטל", color: "#EF4444" },
};

function OrdersPage({ orders }) {
  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
        <h2 style={{ color: S.muted }}>אין הזמנות עדיין</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>📦 ההזמנות שלי</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {orders.map(o => {
          const st = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
          const date = new Date(o.created_at).toLocaleDateString("he-IL");
          return (
            <div key={o.id} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "16px" }}>הזמנה #{String(o.id).slice(0, 8)}</div>
                  <div style={{ color: S.muted, fontSize: "13px" }}>{date}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={S.badge(st.color)}>{st.label}</span>
                  <span style={{ color: S.accent, fontWeight: "800" }}>₪{o.total}</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: "12px" }}>
                {(o.items || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", color: S.muted, fontSize: "14px", marginBottom: "4px" }}>
                    <span>{item.name} × {item.qty}</span>
                    <span>₪{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Providers Page ───────────────────────────────────────────────────────────
function ProvidersPage({ providers }) {
  const [filter, setFilter] = useState("all");
  const filtered = providers.filter(p => filter === "all" || p.type === filter);

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>🔧 חנויות וסדנות</h2>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[["all", "הכל"], ["shop", "חנויות"], ["garage", "סדנות"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ ...S.btn(filter === v ? "primary" : "ghost"), padding: "6px 16px" }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
        {filtered.length === 0 && <div style={{ color: S.muted }}>אין תוצאות</div>}
        {filtered.map(p => (
          <div key={p.id} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontWeight: "700", fontSize: "16px" }}>{p.name}</span>
              <span style={S.badge(p.type === "shop" ? S.info : S.accent)}>
                {p.type === "shop" ? "🛍️ חנות" : "🔧 סדנה"}
              </span>
            </div>
            {p.area && <div style={{ color: S.muted, fontSize: "13px", marginBottom: "6px" }}>📍 {p.area}</div>}
            {p.phone && (
              <a href={`tel:${p.phone}`} style={{ color: S.accent, textDecoration: "none", fontWeight: "600" }}>
                📞 {p.phone}
              </a>
            )}
            {p.notes && <div style={{ color: S.muted, fontSize: "13px", marginTop: "8px" }}>{p.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ user, onUpdateVehicles, onLogout }) {
  const [vehicles, setVehicles] = useState(user?.vehicles || []);
  const [newV, setNewV] = useState({ make: "", model: "", year: "", plate: "" });
  const [saved, setSaved] = useState(false);

  const addVehicle = () => {
    if (!newV.make || !newV.model) return;
    const updated = [...vehicles, { ...newV, id: Date.now() }];
    setVehicles(updated);
    onUpdateVehicles(updated);
    setNewV({ make: "", model: "", year: "", plate: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeVehicle = (id) => {
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    onUpdateVehicles(updated);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>👤 הפרופיל שלי</h2>

      <div style={{ ...S.card, marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "18px" }}>{user?.name}</div>
            <div style={{ color: S.muted, fontSize: "14px" }}>📱 {user?.phone}</div>
            <div style={{ marginTop: "6px" }}>
              <span style={S.badge(user?.role === "admin" ? S.accent : S.info)}>
                {user?.role === "admin" ? "מנהל" : "לקוח"}
              </span>
            </div>
          </div>
          <button onClick={onLogout} style={{ ...S.btn("danger") }}>התנתקות</button>
        </div>
      </div>

      {/* Vehicles */}
      <div style={S.card}>
        <h3 style={{ marginBottom: "16px" }}>🚗 הרכבים שלי</h3>

        {vehicles.length === 0 && (
          <p style={{ color: S.muted, marginBottom: "16px" }}>אין רכבים רשומים</p>
        )}

        {vehicles.map(v => (
          <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: S.bg, borderRadius: "8px", marginBottom: "8px" }}>
            <div>
              <span style={{ fontWeight: "700" }}>{v.make} {v.model}</span>
              {v.year && <span style={{ color: S.muted, marginRight: "8px" }}> ({v.year})</span>}
              {v.plate && <span style={{ ...S.badge(S.muted), marginRight: "8px" }}>{v.plate}</span>}
            </div>
            <button onClick={() => removeVehicle(v.id)} style={{ ...S.btn("danger"), padding: "4px 10px" }}>✕</button>
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: "16px", marginTop: "8px" }}>
          <h4 style={{ marginBottom: "12px", color: S.muted }}>הוסף רכב</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <input style={S.input} placeholder="מותג (Toyota, BMW...)" value={newV.make} onChange={e => setNewV(v => ({ ...v, make: e.target.value }))} />
            <input style={S.input} placeholder="דגם (Corolla, X5...)" value={newV.model} onChange={e => setNewV(v => ({ ...v, model: e.target.value }))} />
            <input style={S.input} placeholder="שנה" value={newV.year} onChange={e => setNewV(v => ({ ...v, year: e.target.value }))} />
            <input style={S.input} placeholder="מספר רישוי" value={newV.plate} onChange={e => setNewV(v => ({ ...v, plate: e.target.value }))} />
          </div>
          <button onClick={addVehicle} style={{ ...S.btn(), width: "100%" }}>
            {saved ? "✓ נשמר!" : "+ הוסף רכב"}
          </button>
        </div>
      </div>
    </div>
  );
}
