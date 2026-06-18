import { useState, useEffect } from "react";

// ─── Translations ────────────────────────────────────────────────────────────
const LANGS = {
  he: {
    dir: "rtl",
    appName: "WHEELS",
    appSub: "חלקי חילוף לגלגלים ורכב",
    login: "כניסה / הרשמה",
    enterPhone: "הכנס מספר טלפון להתחברות או הרשמה",
    phonePlaceholder: "050-000-0000",
    next: "המשך →",
    enterName: "מה השם שלך?",
    namePlaceholder: "שם מלא",
    signIn: "כניסה →",
    changePhone: "← שנה מספר",
    noCode: "ללא קוד אימות — כניסה מיידית",
    loading: "⏳ נכנס...",
    home: "בית", providers: "סדנות", orders: "הזמנות", profile: "פרופיל",
    step1: "שלב 1 — בחר רכב",
    step2: "שלב 2 — בחר קטגוריה",
    searchPlaceholder: "🔍 חפש לפי שם חלק או קוד קטלוגי...",
    clearAll: "נקה הכל",
    addToProfile: "הוסף רכב לפרופיל",
    noVehicles: "💡 הוסף רכב בפרופיל כדי לסנן חלקים",
    partsFound: "חלקים נמצאו",
    forSelectedVehicles: "לרכבים שנבחרו",
    noPartsFound: "😕 לא נמצאו חלקים תואמים",
    addToCart: "הוסף לעגלה",
    addedToCart: "✓ נוסף לעגלה",
    inStock: "במלאי",
    outOfStock: "אזל",
    garages: "🔧 מוסכים",
    roadServices: "🚛 שירותי דרך",
    filterByBrand: "סינון לפי מותג רכב:",
    filterByService: "סינון לפי סוג שירות:",
    allBrands: "הכל",
    myOrders: "📦 ההזמנות שלי",
    noOrders: "אין הזמנות עדיין",
    myProfile: "👤 הפרופיל שלי",
    myVehicles: "🚗 הרכבים שלי",
    noVehiclesReg: "אין רכבים רשומים",
    addVehicleByPlate: "➕ הוסף רכב לפי לוחית רישוי",
    platePlaceholder: "12-345-67",
    search: "🔍 חפש",
    logout: "התנתקות",
    cart: "עגלה",
    emptyCart: "העגלה ריקה",
    backToShop: "חזרה לחנות",
    total: 'סה"כ לתשלום',
    confirmOrder: "✅ אשר הזמנה",
    clear: "נקה",
    admin: "מנהל",
    customer: "לקוח",
    manufacturer: "יצרן",
    model: "דגם",
    year: "שנת ייצור",
    color: "צבע",
    engine: "נפח מנוע",
    fuel: "סוג דלק",
    gear: "תיבת הילוכים",
    vin: "מספר שילדה",
    seats: "מספר מושבים",
    plate: "לוחית רישוי",
    notFound: "לא נמצא רכב עם לוחית רישוי זו",
    searchError: "שגיאה בחיפוש — נסה שוב",
    saved: "✓ נשמר!",
    addVehicle: "+ הוסף רכב",
    pending: "ממתין", processing: "בטיפול", shipped: "נשלח", delivered: "נמסר", cancelled: "בוטל",
  },
  ar: {
    dir: "rtl",
    appName: "WHEELS",
    appSub: "قطع غيار للسيارات",
    login: "دخول / تسجيل",
    enterPhone: "أدخل رقم الهاتف للدخول أو التسجيل",
    phonePlaceholder: "050-000-0000",
    next: "التالي →",
    enterName: "ما اسمك؟",
    namePlaceholder: "الاسم الكامل",
    signIn: "دخول →",
    changePhone: "← تغيير الرقم",
    noCode: "بدون رمز تحقق — دخول فوري",
    loading: "⏳ جاري الدخول...",
    home: "الرئيسية", providers: "ورش", orders: "طلباتي", profile: "حسابي",
    step1: "خطوة 1 — اختر سيارة",
    step2: "خطوة 2 — اختر فئة",
    searchPlaceholder: "🔍 ابحث باسم القطعة أو الكود...",
    clearAll: "مسح الكل",
    addToProfile: "أضف السيارة للملف",
    noVehicles: "💡 أضف سيارة في ملفك لتصفية القطع",
    partsFound: "قطع موجودة",
    forSelectedVehicles: "للسيارات المختارة",
    noPartsFound: "😕 لا توجد قطع مطابقة",
    addToCart: "أضف للسلة",
    addedToCart: "✓ تمت الإضافة",
    inStock: "متوفر",
    outOfStock: "نفد",
    garages: "🔧 ورش",
    roadServices: "🚛 خدمات الطريق",
    filterByBrand: "تصفية حسب الماركة:",
    filterByService: "تصفية حسب نوع الخدمة:",
    allBrands: "الكل",
    myOrders: "📦 طلباتي",
    noOrders: "لا توجد طلبات بعد",
    myProfile: "👤 حسابي",
    myVehicles: "🚗 سياراتي",
    noVehiclesReg: "لا توجد سيارات مسجلة",
    addVehicleByPlate: "➕ أضف سيارة برقم اللوحة",
    platePlaceholder: "12-345-67",
    search: "🔍 بحث",
    logout: "تسجيل خروج",
    cart: "السلة",
    emptyCart: "السلة فارغة",
    backToShop: "العودة للمتجر",
    total: "المجموع الكلي",
    confirmOrder: "✅ تأكيد الطلب",
    clear: "مسح",
    admin: "مدير",
    customer: "عميل",
    manufacturer: "الشركة المصنعة",
    model: "الموديل",
    year: "سنة الصنع",
    color: "اللون",
    engine: "حجم المحرك",
    fuel: "نوع الوقود",
    gear: "ناقل الحركة",
    vin: "رقم الهيكل",
    seats: "عدد المقاعد",
    plate: "رقم اللوحة",
    notFound: "لم يتم العثور على سيارة بهذا الرقم",
    searchError: "خطأ في البحث — حاول مجدداً",
    saved: "✓ تم الحفظ!",
    addVehicle: "+ أضف سيارة",
    pending: "قيد الانتظار", processing: "قيد المعالجة", shipped: "تم الشحن", delivered: "تم التسليم", cancelled: "ملغي",
  },
  en: {
    dir: "ltr",
    appName: "WHEELS",
    appSub: "Auto Parts & Accessories",
    login: "Sign In / Register",
    enterPhone: "Enter your phone number to sign in or register",
    phonePlaceholder: "050-000-0000",
    next: "Continue →",
    enterName: "What is your name?",
    namePlaceholder: "Full name",
    signIn: "Sign In →",
    changePhone: "← Change number",
    noCode: "No verification code — instant access",
    loading: "⏳ Signing in...",
    home: "Home", providers: "Garages", orders: "Orders", profile: "Profile",
    step1: "Step 1 — Select vehicle",
    step2: "Step 2 — Select category",
    searchPlaceholder: "🔍 Search by part name or catalog code...",
    clearAll: "Clear all",
    addToProfile: "Add vehicle to profile",
    noVehicles: "💡 Add a vehicle in your profile to filter parts",
    partsFound: "parts found",
    forSelectedVehicles: "for selected vehicles",
    noPartsFound: "😕 No matching parts found",
    addToCart: "Add to cart",
    addedToCart: "✓ Added to cart",
    inStock: "In stock",
    outOfStock: "Out of stock",
    garages: "🔧 Garages",
    roadServices: "🚛 Road Services",
    filterByBrand: "Filter by car brand:",
    filterByService: "Filter by service type:",
    allBrands: "All",
    myOrders: "📦 My Orders",
    noOrders: "No orders yet",
    myProfile: "👤 My Profile",
    myVehicles: "🚗 My Vehicles",
    noVehiclesReg: "No vehicles registered",
    addVehicleByPlate: "➕ Add vehicle by license plate",
    platePlaceholder: "12-345-67",
    search: "🔍 Search",
    logout: "Sign out",
    cart: "Cart",
    emptyCart: "Cart is empty",
    backToShop: "Back to shop",
    total: "Total",
    confirmOrder: "✅ Place Order",
    clear: "Clear",
    admin: "Admin",
    customer: "Customer",
    manufacturer: "Manufacturer",
    model: "Model",
    year: "Year",
    color: "Color",
    engine: "Engine size",
    fuel: "Fuel type",
    gear: "Transmission",
    vin: "VIN / Chassis",
    seats: "Seats",
    plate: "License plate",
    notFound: "No vehicle found with this plate number",
    searchError: "Search error — please try again",
    saved: "✓ Saved!",
    addVehicle: "+ Add vehicle",
    pending: "Pending", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
  },
};


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
  const [lang, setLang] = useState(() => localStorage.getItem("wheels_lang") || "he");
  const t = LANGS[lang] || LANGS.he;

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("wheels_lang", l);
  };
  const [cats, setCats] = useState([]);
  const [parts, setParts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Skip login - go directly to home
    setPage("home");
    setUser({ id: "guest", phone: "guest", name: "אורח", role: "customer", vehicles: [], cart: [] });
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
      // Use demo data if Supabase fails
      setCats([
        { id: "1", name: "גלגלים", icon: "🛞" },
        { id: "2", name: "בלמים", icon: "🔧" },
        { id: "3", name: "מנוע", icon: "⚙️" },
        { id: "4", name: "חשמל", icon: "⚡" },
      ]);
      setParts([
        { id: "1", catId: "1", name: "צמיג Bridgestone 205/55R16", price: 450, catalogCode: "BS-205-55", manufacturer: "Bridgestone", stock: 8, active: true, compat: [] },
        { id: "2", catId: "1", name: "חישוק אלומיניום 16 אינץ", price: 320, catalogCode: "RIM-16-AL", manufacturer: "Generic", stock: 4, active: true, compat: [] },
        { id: "3", catId: "2", name: "רפידות בלם קדמיות", price: 180, catalogCode: "BR-FRONT-01", manufacturer: "Bosch", stock: 12, active: true, compat: [] },
        { id: "4", catId: "2", name: "דיסק בלם", price: 240, catalogCode: "BR-DISC-01", manufacturer: "ATE", stock: 6, active: true, compat: [] },
        { id: "5", catId: "3", name: "פילטר שמן", price: 35, catalogCode: "OIL-FLT-01", manufacturer: "Mann", stock: 20, active: true, compat: [] },
        { id: "6", catId: "3", name: "חגורת טיימינג", price: 290, catalogCode: "TIM-BLT-01", manufacturer: "Gates", stock: 3, active: true, compat: [] },
      ]);
      setProviders([
        { id: "1", type: "shop", name: "חנות גלגלים מגאדלה", area: "מגאדלה", phone: "04-6500000", notes: "מומחים לגלגלים וצמיגים" },
        { id: "2", type: "garage", name: "מוסך אל-נור", area: "נצרת", phone: "04-6501111", notes: "כל סוגי הרכבים" },
      ]);
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
    return <LoginPage onLogin={handleLogin} loading={loading} error={error} t={t} lang={lang} onChangeLang={changeLang} />;
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
          <LangSwitcher lang={lang} onChangeLang={onChangeLang} />
          <NavBtn icon="🏠" label={t.home} active={page === "home"} onClick={() => setPage("home")} />
          <NavBtn icon="🔧" label={t.providers} active={page === "providers"} onClick={() => setPage("providers")} />
          <NavBtn icon="📦" label={t.orders} active={page === "orders"} onClick={() => setPage("orders")} />
          <NavBtn icon="👤" label={t.profile} active={page === "profile"} onClick={() => setPage("profile")} />
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
        {page === "providers" && <ProvidersPage providers={providers} t={t} />}
        {page === "cart" && (
          <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onOrder={placeOrder} setPage={setPage} t={t} />
        )}
        {page === "orders" && <OrdersPage orders={orders} t={t} />}
        {page === "profile" && (
          <ProfilePage user={user} onUpdateVehicles={updateVehicles} onLogout={handleLogout} t={t} />
        )}
      </div>
    </div>
  );
}

function LangSwitcher({ lang, onChangeLang }) {
  return (
    <div style={{ display: "flex", gap: "4px", background: "#0D1120", borderRadius: "8px", padding: "3px" }}>
      {[["he", "עב"], ["ar", "ع"], ["en", "EN"]].map(([l, label]) => (
        <button key={l} onClick={() => onChangeLang(l)} style={{
          background: lang === l ? "#F59E0B" : "transparent",
          color: lang === l ? "#0B0F1A" : "#6B7280",
          border: "none", borderRadius: "6px", padding: "4px 8px",
          cursor: "pointer", fontWeight: lang === l ? "700" : "400",
          fontSize: "12px", minWidth: "28px",
        }}>{label}</button>
      ))}
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
function LoginPage({ onLogin, loading, error, t, lang, onChangeLang }) {
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
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", direction: t.dir }}>
      <div style={{ ...S.card, width: "340px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🛞</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <LangSwitcher lang={lang} onChangeLang={onChangeLang} />
        </div>
        <h1 style={{ color: S.accent, fontSize: "28px", margin: "0 0 4px" }}>{t.appName}</h1>
        <p style={{ color: S.muted, marginBottom: "24px", fontSize: "14px" }}>{t.appSub}</p>

        {step === 1 && (
          <>
            <p style={{ color: S.muted, fontSize: "13px", marginBottom: "12px" }}>{t.enterPhone}</p>
            <input
              style={{ ...S.input, marginBottom: "16px", fontSize: "18px", textAlign: "center", letterSpacing: "2px" }}
              type="tel"
              placeholder={t.phonePlaceholder}
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
              {t.next}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: S.muted, fontSize: "13px", marginBottom: "12px" }}>{t.enterName}</p>
            <div style={{ ...S.badge(S.accent), marginBottom: "16px", fontSize: "14px" }}>📱 {phone}</div>
            <input
              style={{ ...S.input, marginBottom: "16px", fontSize: "16px" }}
              type="text"
              placeholder={t.namePlaceholder}
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
              {loading ? t.loading : t.signIn}
            </button>
            <button
              onClick={() => setStep(1)}
              style={{ ...S.btn("ghost"), width: "100%", padding: "8px" }}
            >
              {t.changePhone}
            </button>
          </>
        )}

        {error && <p style={{ color: S.danger, marginTop: "12px", fontSize: "14px" }}>{error}</p>}
        <p style={{ color: S.muted, fontSize: "11px", marginTop: "16px" }}>
          {t.noCode}
        </p>
      </div>
    </div>
  );
}

// ─── Quick Access Button ─────────────────────────────────────────────────────
function QuickAccessBtn({ icon, label, color }) {
  return (
    <button style={{
      background: color + "15",
      border: "1px solid " + color + "40",
      borderRadius: "12px", padding: "12px 8px", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
      transition: "all 0.2s",
    }}>
      <span style={{ fontSize: "24px" }}>{icon}</span>
      <span style={{ color: color, fontSize: "11px", fontWeight: "700", textAlign: "center", lineHeight: "1.3" }}>{label}</span>
    </button>
  );
}

// ─── Home Page ──────────────────────────────────────────────────────────────
function HomePage({ cats, parts, onAddToCart, user, t }) {
  const [search, setSearch] = useState("");
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [added, setAdded] = useState({});

  const vehicles = user?.vehicles || [];

  // שלב 1: סינון לפי רכב (בחירה מרובה)
  const toggleVehicle = (id) => {
    setSelectedVehicleIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // שלב 2: סינון לפי קטגוריה (בחירה מרובה)
  const toggleCat = (id) => {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));

  const filtered = parts.filter(p => {
    const matchSearch = !search || p.name.includes(search) || (p.catalogCode || "").includes(search);
    const matchCat = selectedCats.length === 0 || selectedCats.includes(p.catId);
    const matchVehicle = selectedVehicles.length === 0 || !p.compat || p.compat.length === 0 ||
      selectedVehicles.some(v =>
        p.compat.some(c =>
          c.make === v.make && c.model === v.model
        )
      );
    return matchSearch && matchCat && matchVehicle;
  });

  const handleAdd = (part) => {
    onAddToCart(part);
    setAdded(a => ({ ...a, [part.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [part.id]: false })), 1500);
  };

  const activeFilters = selectedVehicleIds.length + selectedCats.length;

  return (
    <div>
      {/* ── שורה 1: פילטר רכבים ── */}
      <div style={{ background: "#0D1120", borderBottom: `1px solid ${S.border}`, padding: "12px 0", marginBottom: "0" }}>
        <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: S.muted, fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>{t.step1}</span>
          {selectedVehicleIds.length > 0 && (
            <button onClick={() => setSelectedVehicleIds([])} style={{ background: "none", border: "none", color: S.danger, fontSize: "11px", cursor: "pointer" }}>נקה</button>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {vehicles.length === 0 ? (
            <span style={{ color: S.muted, fontSize: "13px" }}>{t.noVehicles}</span>
          ) : (
            vehicles.map(v => {
              const active = selectedVehicleIds.includes(v.id);
              return (
                <button key={v.id} onClick={() => toggleVehicle(v.id)} style={{
                  background: active ? S.accent : "#1a2035",
                  color: active ? "#0B0F1A" : S.text,
                  border: `2px solid ${active ? S.accent : S.border}`,
                  borderRadius: "10px", padding: "8px 14px", cursor: "pointer",
                  fontWeight: active ? "700" : "400", fontSize: "13px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                }}>
                  <span style={{ fontSize: "18px" }}>🚗</span>
                  <span>{v.make} {v.model}</span>
                  <span style={{ fontSize: "11px", opacity: 0.7 }}>{v.plate}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── שורה 2: פילטר קטגוריות ── */}
      <div style={{ background: "#0F1425", borderBottom: `1px solid ${S.border}`, padding: "10px 0", marginBottom: "20px" }}>
        <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: S.muted, fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>{t.step2}</span>
          {selectedCats.length > 0 && (
            <button onClick={() => setSelectedCats([])} style={{ background: "none", border: "none", color: S.danger, fontSize: "11px", cursor: "pointer" }}>נקה</button>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {cats.map(cat => {
            const active = selectedCats.includes(cat.id);
            return (
              <button key={cat.id} onClick={() => toggleCat(cat.id)} style={{
                background: active ? "#3B82F6" : "#1a2035",
                color: active ? "#fff" : S.muted,
                border: `1px solid ${active ? "#3B82F6" : S.border}`,
                borderRadius: "20px", padding: "5px 12px", cursor: "pointer",
                fontWeight: active ? "700" : "400", fontSize: "13px",
              }}>
                {cat.icon} {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── חיפוש חופשי ── */}
      <div style={{ marginBottom: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {activeFilters > 0 && (
          <button onClick={() => { setSelectedVehicleIds([]); setSelectedCats([]); setSearch(""); }}
            style={{ ...S.btn("danger"), padding: "10px 16px", whiteSpace: "nowrap" }}>
            {t.clearAll} ({activeFilters})
          </button>
        )}
      </div>

      {/* ── גישה מהירה ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ color: S.muted, fontSize: "11px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>
          {t.quickAccess || "Quick Access"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          <QuickAccessBtn icon="🛍️" label="חנות חלקים" color="#F59E0B" />
          <QuickAccessBtn icon="🔧" label="מוסכים" color="#3B82F6" />
          <QuickAccessBtn icon="🚨" label="חירום" color="#EF4444" />
          <QuickAccessBtn icon="🚗" label="התמחויות" color="#10B981" />
          <QuickAccessBtn icon="⭐" label="מקצועי" color="#8B5CF6" />
          <QuickAccessBtn icon="📞" label="צור קשר" color="#6B7280" />
        </div>
      </div>

      {/* ── תוצאות ── */}
      <div style={{ color: S.muted, fontSize: "13px", marginBottom: "12px" }}>
        {filtered.length} {t.partsFound}
        {selectedVehicleIds.length > 0 && ` ${t.forSelectedVehicles}`}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: S.muted, padding: "40px" }}>
            {t.noPartsFound}
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
                {p.stock > 0 ? `${t.inStock} (${p.stock})` : t.outOfStock}
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
              {added[p.id] ? t.addedToCart : t.addToCart}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cart Page ───────────────────────────────────────────────────────────────
function CartPage({ cart, onRemove, onUpdateQty, onOrder, setPage, t }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
        <h2 style={{ color: S.muted }}>{t.emptyCart}</h2>
        <button onClick={() => setPage("home")} style={S.btn()}>{t.backToShop}</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>🛒 {t.cart}</h2>
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
          <div style={{ color: S.muted, fontSize: "14px" }}>{t.total}</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: S.accent }}>₪{total}</div>
        </div>
        <button onClick={onOrder} style={{ ...S.btn(), padding: "14px 32px", fontSize: "16px" }}>
          {t.confirmOrder}
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

function OrdersPage({ orders, t }) {
  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
        <h2 style={{ color: S.muted }}>{t.noOrders}</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>{t.myOrders}</h2>
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
const CAR_BRANDS = ["הכל", "מרצדס", "BMW", "אאודי", "טויוטה", "יונדאי", "קיה", "סובארו", "מאזדה", "פולקסווגן", "פורד", "שברולט", "ניסן", "הונדה", "מיצובישי", "סוזוקי", "פיאט", "רנו", "פיז'ו", "סיטרואן"];

const ROAD_SERVICES = [
  { key: "towing", label: "🚛 גרירה" },
  { key: "rescue", label: "🆘 חילוץ" },
  { key: "locksmith", label: "🔑 מנעולן" },
  { key: "battery", label: "🔋 טעינת סוללה" },
  { key: "tire", label: "🛞 פנצ'ר" },
  { key: "fuel", label: "⛽ דלק חירום" },
  { key: "tow_truck", label: "🏗️ רכב גרר" },
  { key: "ac", label: "❄️ מיזוג" },
];

function ProvidersPage({ providers, t }) {
  const [tab, setTab] = useState("garages"); // garages | road
  const [brandFilter, setBrandFilter] = useState("הכל");
  const [serviceFilter, setServiceFilter] = useState("");

  const garages = providers.filter(p => p.type === "garage" || p.type === "shop");
  const roadServices = providers.filter(p => p.type === "road");

  const filteredGarages = garages.filter(p => {
    if (brandFilter === "הכל") return true;
    return (p.specialBrands || []).includes(brandFilter);
  });

  const filteredRoad = roadServices.filter(p => {
    if (!serviceFilter) return true;
    return (p.serviceKinds || []).includes(serviceFilter);
  });

  const FilterBtn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      ...S.btn(active ? "primary" : "ghost"),
      padding: "5px 12px", fontSize: "13px", whiteSpace: "nowrap"
    }}>{children}</button>
  );

  const ProviderCard = ({ p }) => (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontWeight: "700", fontSize: "15px" }}>{p.name}</span>
        <span style={S.badge(p.type === "road" ? "#8B5CF6" : S.accent)}>
          {p.type === "road" ? "🚛 שירות דרך" : "🔧 מוסך"}
        </span>
      </div>
      {p.area && <div style={{ color: S.muted, fontSize: "13px", marginBottom: "6px" }}>📍 {p.area}</div>}
      {(p.specialBrands || []).length > 0 && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
          {p.specialBrands.map(b => <span key={b} style={S.badge(S.info)}>{b}</span>)}
        </div>
      )}
      {(p.serviceKinds || []).length > 0 && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
          {p.serviceKinds.map(s => {
            const found = ROAD_SERVICES.find(r => r.key === s);
            return <span key={s} style={S.badge("#8B5CF6")}>{found ? found.label : s}</span>;
          })}
        </div>
      )}
      {p.phone && (
        <a href={`tel:${p.phone}`} style={{ color: S.accent, textDecoration: "none", fontWeight: "700", fontSize: "15px", display: "block", marginTop: "8px" }}>
          📞 {p.phone}
        </a>
      )}
      {p.notes && <div style={{ color: S.muted, fontSize: "12px", marginTop: "6px" }}>{p.notes}</div>}
    </div>
  );

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button onClick={() => setTab("garages")} style={{
          flex: 1, padding: "14px", borderRadius: "10px", border: "none", cursor: "pointer",
          background: tab === "garages" ? S.accent : S.card,
          color: tab === "garages" ? "#0B0F1A" : S.muted,
          fontWeight: "700", fontSize: "16px",
        }}>{t.garages}</button>
        <button onClick={() => setTab("road")} style={{
          flex: 1, padding: "14px", borderRadius: "10px", border: "none", cursor: "pointer",
          background: tab === "road" ? "#8B5CF6" : S.card,
          color: tab === "road" ? "#fff" : S.muted,
          fontWeight: "700", fontSize: "16px",
        }}>{t.roadServices}</button>
      </div>

      {tab === "garages" && (
        <div>
          {/* Filter by brand */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: S.muted, fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>{t.filterByBrand}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {CAR_BRANDS.map(b => (
                <FilterBtn key={b} active={brandFilter === b} onClick={() => setBrandFilter(b)}>{b}</FilterBtn>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px", marginTop: "16px" }}>
            {filteredGarages.length === 0 && (
              <div style={{ color: S.muted, gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
                😕 לא נמצאו מוסכים
              </div>
            )}
            {filteredGarages.map(p => <ProviderCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {tab === "road" && (
        <div>
          {/* Filter by service type */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: S.muted, fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>{t.filterByService}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <FilterBtn active={!serviceFilter} onClick={() => setServiceFilter("")}>הכל</FilterBtn>
              {ROAD_SERVICES.map(s => (
                <FilterBtn key={s.key} active={serviceFilter === s.key} onClick={() => setServiceFilter(s.key)}>
                  {s.label}
                </FilterBtn>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px", marginTop: "16px" }}>
            {filteredRoad.length === 0 && (
              <div style={{ color: S.muted, gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
                😕 לא נמצאו שירותי דרך — הוסף ספקים מהאדמין
              </div>
            )}
            {filteredRoad.map(p => <ProviderCard key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ user, onUpdateVehicles, onLogout, t }) {
  const [vehicles, setVehicles] = useState(user?.vehicles || []);
  const [plate, setPlate] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [saved, setSaved] = useState(false);

  const lookupPlate = async () => {
    if (!plate.trim()) return;
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);
    try {
      // API רשמי של משרד התחבורה ישראל (data.gov.il)
      const clean = plate.replace(/-/g, "").trim();
      const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=${clean}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      const record = data?.result?.records?.[0];
      if (!record) {
        setLookupError("לא נמצא רכב עם לוחית רישוי זו");
      } else {
        setLookupResult({
          plate: clean,
          make: record.tozeret_nm || "",
          model: record.kinuy_mishari || "",
          year: record.shnat_yitzur || "",
          color: record.tzeva_rechev || "",
          engine: record.nefah_manoa || "",
          fuel: record.sug_delek_nm || "",
          gear: record.technologiat_hanaa_nm || record.mispar_halukot || "",
          vin: record.misgeret || "",
          owners: record.baalut || "",
          seats: record.mispar_moshavim || "",
        });
      }
    } catch (e) {
      setLookupError("שגיאה בחיפוש — נסה שוב");
    }
    setLookupLoading(false);
  };

  const addVehicle = () => {
    if (!lookupResult) return;
    const updated = [...vehicles, { ...lookupResult, id: Date.now() }];
    setVehicles(updated);
    onUpdateVehicles(updated);
    setLookupResult(null);
    setPlate("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeVehicle = (id) => {
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    onUpdateVehicles(updated);
  };

  const Field = ({ label, value }) => value ? (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${S.border}` }}>
      <span style={{ color: S.muted, fontSize: "13px" }}>{label}</span>
      <span style={{ fontWeight: "600", fontSize: "13px" }}>{value}</span>
    </div>
  ) : null;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>{t.myProfile}</h2>

      <div style={{ ...S.card, marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "18px" }}>{user?.name}</div>
            <div style={{ color: S.muted, fontSize: "14px" }}>📱 {user?.phone}</div>
            <div style={{ marginTop: "6px" }}>
              <span style={S.badge(user?.role === "admin" ? S.accent : S.info)}>
                {user?.role === "admin" ? t.admin : t.customer}
              </span>
            </div>
          </div>
          <button onClick={onLogout} style={{ ...S.btn("danger") }}>{t.logout}</button>
        </div>
      </div>

      {/* Vehicles */}
      <div style={S.card}>
        <h3 style={{ marginBottom: "16px" }}>{t.myVehicles}</h3>

        {vehicles.length === 0 && (
          <p style={{ color: S.muted, marginBottom: "16px" }}>{t.noVehiclesReg}</p>
        )}

        {vehicles.map(v => (
          <div key={v.id} style={{ background: S.bg, borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: "800", fontSize: "16px" }}>{v.make} {v.model}</span>
                {v.year && <span style={{ color: S.muted, marginRight: "8px", fontSize: "14px" }}> {v.year}</span>}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ ...S.badge(S.accent), fontSize: "14px", fontWeight: "800" }}>{v.plate}</span>
                <button onClick={() => removeVehicle(v.id)} style={{ ...S.btn("danger"), padding: "4px 10px" }}>✕</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {v.engine && <span style={{ color: S.muted, fontSize: "12px" }}>🔧 מנוע: {v.engine}cc</span>}
              {v.fuel && <span style={{ color: S.muted, fontSize: "12px" }}>⛽ דלק: {v.fuel}</span>}
              {v.gear && <span style={{ color: S.muted, fontSize: "12px" }}>⚙️ הילוכים: {v.gear}</span>}
              {v.color && <span style={{ color: S.muted, fontSize: "12px" }}>🎨 צבע: {v.color}</span>}
            </div>
          </div>
        ))}

        {/* Plate lookup */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: "16px", marginTop: "8px" }}>
          <h4 style={{ marginBottom: "12px" }}>{t.addVehicleByPlate}</h4>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <input
              style={{ ...S.input, flex: 1, fontSize: "20px", textAlign: "center", letterSpacing: "4px", fontWeight: "800" }}
              placeholder={t.platePlaceholder}
              value={plate}
              onChange={e => setPlate(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookupPlate()}
              maxLength={8}
            />
            <button onClick={lookupPlate} style={{ ...S.btn(), padding: "10px 20px", whiteSpace: "nowrap" }}
              disabled={lookupLoading}>
              {lookupLoading ? "⏳" : t.search}
            </button>
          </div>

          {lookupError && <p style={{ color: S.danger, fontSize: "14px", marginBottom: "12px" }}>{lookupError}</p>}

          {lookupResult && (
            <div style={{ background: S.bg, borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
              <div style={{ fontWeight: "800", fontSize: "18px", marginBottom: "12px", color: S.accent }}>
                🚗 {lookupResult.make} {lookupResult.model} {lookupResult.year}
              </div>
              <Field label="לוחית רישוי" value={lookupResult.plate} />
              <Field label="יצרן" value={lookupResult.make} />
              <Field label="דגם" value={lookupResult.model} />
              <Field label="שנת ייצור" value={lookupResult.year} />
              <Field label="צבע" value={lookupResult.color} />
              <Field label="נפח מנוע" value={lookupResult.engine ? lookupResult.engine + " cc" : ""} />
              <Field label="סוג דלק" value={lookupResult.fuel} />
              <Field label="תיבת הילוכים" value={lookupResult.gear} />
              <Field label="מספר שילדה" value={lookupResult.vin} />
              <Field label="מספר מושבים" value={lookupResult.seats} />
              <button onClick={addVehicle} style={{ ...S.btn(), width: "100%", marginTop: "14px", padding: "12px" }}>
                {saved ? t.saved : t.addToProfile}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
