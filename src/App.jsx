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
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── Translations ────────────────────────────────────────────────────────────
const LANGS = {
  he: {
    dir: "rtl",
    appName: "WHEELS",
    appSub: "חלקי חילוף לגלגלים ורכב",
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
    saved: "✓ נשמר!",
    addVehicle: "+ הוסף רכב",
    notFound: "לא נמצא רכב עם לוחית רישוי זו",
    searchError: "שגיאה בחיפוש — נסה שוב",
    quickAccess: "גישה מהירה",
  },
  ar: {
    dir: "rtl",
    appName: "WHEELS",
    appSub: "قطع غيار للسيارات",
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
    saved: "✓ تم الحفظ!",
    addVehicle: "+ أضف سيارة",
    notFound: "لم يتم العثور على سيارة بهذا الرقم",
    searchError: "خطأ في البحث — حاول مجدداً",
    quickAccess: "وصول سريع",
  },
  en: {
    dir: "ltr",
    appName: "WHEELS",
    appSub: "Auto Parts & Accessories",
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
    saved: "✓ Saved!",
    addVehicle: "+ Add vehicle",
    notFound: "No vehicle found with this plate",
    searchError: "Search error — please try again",
    quickAccess: "Quick Access",
  },
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: { padding: "0", margin: "0" },
  card: { background: "#141824", border: `1px solid #1f2937`, borderRadius: "16px", padding: "16px", marginBottom: "12px" },
  input: { background: "#0B0F1A", color: "#fff", border: `1px solid #374151`, borderRadius: "10px", padding: "10px 12px", fontSize: "14px", outline: "none" },
  btn: (type = "primary") => ({
    primary: { background: "#F59E0B", color: "#0B0F1A", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" },
    ghost: { background: "transparent", color: "#9CA3AF", border: `1px solid #374151`, borderRadius: "10px", cursor: "pointer", fontWeight: "500" },
    danger: { background: "#EF4444", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" },
  })[type],
  badge: (color) => ({ background: color + "22", color: color, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", display: "inline-block" }),
  text: "#fff",
  muted: "#9CA3AF",
  accent: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  info: "#3B82F6",
  border: "#374151",
  bg: "#0B0F1A",
};

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
      background: active ? S.accent : "transparent",
      color: active ? "#0B0F1A" : S.muted,
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

function HomePage({ cats, parts, onAddToCart, user, t }) {
  const [search, setSearch] = useState("");
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [added, setAdded] = useState({});

  const vehicles = user?.vehicles || [];
  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));

  const filtered = parts.filter(p => {
    const matchSearch = !search || p.name.includes(search) || (p.catalogCode || "").includes(search);
    const matchCat = selectedCats.length === 0 || selectedCats.includes(p.catId);
    const matchVehicle = selectedVehicles.length === 0 || !p.compat || p.compat.length === 0 ||
      selectedVehicles.some(v => p.compat.some(c => c.make === v.make && c.model === v.model));
    return matchSearch && matchCat && matchVehicle;
  });

  const handleAdd = (part) => {
    onAddToCart(part);
    setAdded(a => ({ ...a, [part.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [part.id]: false })), 1500);
  };

  const quickActions = [
    { icon: "🛍️", label: t.dir === "rtl" ? "חנות חלקים" : (t.dir === "ltr" && "Parts Store") || "متجر قطع" },
    { icon: "🔧", label: t.dir === "rtl" ? "מוסכים" : (t.dir === "ltr" && "Garages") || "ورش" },
    { icon: "🚨", label: t.dir === "rtl" ? "חירום וחילוץ" : (t.dir === "ltr" && "Emergency") || "طوارئ" },
    { icon: "🚗", label: t.dir === "rtl" ? "התמחויות" : (t.dir === "ltr" && "Specialty") || "تخصص" },
    { icon: "⭐", label: t.dir === "rtl" ? "מקצועי" : (t.dir === "ltr" && "Pro" ) || "احترافي" },
    { icon: "📞", label: t.dir === "rtl" ? "צור קשר" : (t.dir === "ltr" && "Contact") || "تواصل" },
  ];

  return (
    <div>
      {/* Step 1: Vehicles */}
      <div style={{ background: "#0D1120", borderBottom: `1px solid ${S.border}`, padding: "12px 0", marginBottom: "0" }}>
        <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: S.muted, fontSize: "11px", fontWeight: "700" }}>{t.step1}</span>
          {selectedVehicleIds.length > 0 && (
            <button onClick={() => setSelectedVehicleIds([])} style={{ background: "none", border: "none", color: S.danger, fontSize: "11px", cursor: "pointer" }}>{t.clear}</button>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {vehicles.length === 0 ? (
            <span style={{ color: S.muted, fontSize: "13px" }}>{t.noVehicles}</span>
          ) : (
            vehicles.map(v => (
              <button key={v.id} onClick={() => setSelectedVehicleIds(prev => prev.includes(v.id) ? prev.filter(x => x !== v.id) : [...prev, v.id])}
                style={{
                  background: selectedVehicleIds.includes(v.id) ? S.accent : "#1a2035",
                  color: selectedVehicleIds.includes(v.id) ? "#0B0F1A" : S.text,
                  border: `2px solid ${selectedVehicleIds.includes(v.id) ? S.accent : S.border}`,
                  borderRadius: "10px", padding: "8px 14px", cursor: "pointer",
                  fontWeight: selectedVehicleIds.includes(v.id) ? "700" : "400", fontSize: "13px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                }}>
                <span>🚗</span>
                <span>{v.make} {v.model}</span>
                <span style={{ fontSize: "11px", opacity: 0.7 }}>{v.plate}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Step 2: Categories */}
      <div style={{ background: "#0F1425", borderBottom: `1px solid ${S.border}`, padding: "10px 0", marginBottom: "20px" }}>
        <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: S.muted, fontSize: "11px", fontWeight: "700" }}>{t.step2}</span>
          {selectedCats.length > 0 && (
            <button onClick={() => setSelectedCats([])} style={{ background: "none", border: "none", color: S.danger, fontSize: "11px", cursor: "pointer" }}>{t.clear}</button>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {cats.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCats(prev => prev.includes(cat.id) ? prev.filter(x => x !== cat.id) : [...prev, cat.id])}
              style={{
                background: selectedCats.includes(cat.id) ? "#3B82F6" : "#1a2035",
                color: selectedCats.includes(cat.id) ? "#fff" : S.muted,
                border: `1px solid ${selectedCats.includes(cat.id) ? "#3B82F6" : S.border}`,
                borderRadius: "20px", padding: "5px 12px", cursor: "pointer",
                fontWeight: selectedCats.includes(cat.id) ? "700" : "400", fontSize: "13px",
              }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input style={{ ...S.input, flex: 1 }}
          placeholder={t.searchPlaceholder} value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(selectedVehicleIds.length + selectedCats.length > 0) && (
          <button onClick={() => { setSelectedVehicleIds([]); setSelectedCats([]); setSearch(""); }}
            style={{ ...S.btn("danger"), padding: "10px 16px", whiteSpace: "nowrap" }}>
            {t.clearAll}
          </button>
        )}
      </div>

      {/* Quick Access */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ color: S.muted, fontSize: "11px", fontWeight: "700", marginBottom: "8px" }}>{t.quickAccess}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {quickActions.map((action, i) => (
            <button key={i} style={{
              background: `linear-gradient(135deg, #F59E0B22, #3B82F611)`,
              border: `1px solid #374151`,
              borderRadius: "12px", padding: "12px 8px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            }}>
              <span style={{ fontSize: "24px" }}>{action.icon}</span>
              <span style={{ color: "#F59E0B", fontSize: "12px", fontWeight: "700", textAlign: "center", lineHeight: "1.2" }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ color: S.muted, fontSize: "13px", marginBottom: "12px" }}>
        {filtered.length} {t.partsFound}
        {selectedVehicleIds.length > 0 && ` ${t.forSelectedVehicles}`}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: S.muted, padding: "40px" }}>
            {t.noPartsFound}
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} style={{ ...S.card, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: S.muted, fontSize: "12px" }}>{p.catalogCode}</div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>{p.name}</div>
            {p.manufacturer && <div style={{ color: S.muted, fontSize: "12px" }}>🏭 {p.manufacturer}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              <span style={{ color: S.accent, fontWeight: "800", fontSize: "16px" }}>₪{p.price}</span>
              <span style={{ ...S.badge(p.stock > 0 ? S.success : S.danger) }}>
                {p.stock > 0 ? `${t.inStock}` : t.outOfStock}
              </span>
            </div>
            <button onClick={() => handleAdd(p)} disabled={p.stock === 0}
              style={{ ...S.btn(added[p.id] ? "ghost" : "primary"), width: "100%", opacity: p.stock === 0 ? 0.5 : 1 }}>
              {added[p.id] ? t.addedToCart : t.addToCart}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartPage({ cart, onRemove, onUpdateQty, onOrder, setPage, t }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
        <h2 style={{ color: S.muted }}>{t.emptyCart}</h2>
        <button onClick={() => setPage("home")} style={{ ...S.btn(), marginTop: "16px", padding: "12px 32px" }}>{t.backToShop}</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>🛒 {t.cart}</h2>
      {cart.map((item, i) => (
        <div key={i} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: "700" }}>{item.name}</div>
            <div style={{ color: S.muted, fontSize: "13px" }}>₪{item.price} × {item.qty}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{ ...S.btn("ghost"), padding: "6px 10px" }}>−</button>
            <input type="number" value={item.qty} onChange={e => onUpdateQty(item.id, parseInt(e.target.value) || 1)}
              style={{ ...S.input, width: "50px", textAlign: "center" }} min="1" />
            <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ ...S.btn("ghost"), padding: "6px 10px" }}>+</button>
            <button onClick={() => onRemove(item.id)} style={{ ...S.btn("danger"), padding: "6px 10px" }}>✕</button>
          </div>
        </div>
      ))}
      <div style={{ ...S.card, marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px", fontWeight: "800" }}>
          <span>{t.total}</span>
          <span style={{ color: S.accent }}>₪{total.toFixed(2)}</span>
        </div>
      </div>
      <button onClick={onOrder} style={{ ...S.btn(), width: "100%", padding: "14px", marginTop: "16px", fontSize: "16px" }}>
        {t.confirmOrder}
      </button>
    </div>
  );
}

function OrdersPage({ orders, t }) {
  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
        <h2 style={{ color: S.muted }}>{t.noOrders}</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>{t.myOrders}</h2>
      {orders.map((o, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontWeight: "700" }}>#{i + 1}</span>
            <span style={{ color: S.accent, fontWeight: "800" }}>₪{o.total}</span>
          </div>
          {(o.items || []).map((item, j) => (
            <div key={j} style={{ display: "flex", justifyContent: "space-between", color: S.muted, fontSize: "13px", marginBottom: "4px" }}>
              <span>{item.name} × {item.qty}</span>
              <span>₪{item.price * item.qty}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const CAR_BRANDS = ["הכל", "מרצדס", "BMW", "אאודי", "טויוטה", "יונדאי", "קיה", "סובארו"];
const ROAD_SERVICES = [
  { key: "towing", label: "🚛 גרירה" },
  { key: "rescue", label: "🆘 חילוץ" },
  { key: "locksmith", label: "🔑 מנעולן" },
  { key: "battery", label: "🔋 טעינת סוללה" },
];

function ProvidersPage({ providers, t }) {
  const [tab, setTab] = useState("garages");
  const [brandFilter, setBrandFilter] = useState("הכל");
  const [serviceFilter, setServiceFilter] = useState("");

  const garages = providers.filter(p => p.type === "garage" || p.type === "shop");
  const roadServices = providers.filter(p => p.type === "road");
  const filteredGarages = garages.filter(p => brandFilter === "הכל" || (p.specialBrands || []).includes(brandFilter));
  const filteredRoad = roadServices.filter(p => !serviceFilter || (p.serviceKinds || []).includes(serviceFilter));

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setTab("garages")} style={{
          flex: 1, padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer",
          background: tab === "garages" ? S.accent : S.card,
          color: tab === "garages" ? "#0B0F1A" : S.muted,
          fontWeight: "700", fontSize: "14px",
        }}>{t.garages}</button>
        <button onClick={() => setTab("road")} style={{
          flex: 1, padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer",
          background: tab === "road" ? "#8B5CF6" : S.card,
          color: tab === "road" ? "#fff" : S.muted,
          fontWeight: "700", fontSize: "14px",
        }}>{t.roadServices}</button>
      </div>

      {tab === "garages" && (
        <div>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: S.muted, fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>{t.filterByBrand}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {CAR_BRANDS.map(b => (
                <button key={b} onClick={() => setBrandFilter(b)} style={{
                  ...S.btn(brandFilter === b ? "primary" : "ghost"),
                  padding: "5px 12px", fontSize: "12px", whiteSpace: "nowrap"
                }}>{b}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {filteredGarages.map(p => (
              <div key={p.id} style={S.card}>
                <div style={{ fontWeight: "700", marginBottom: "8px" }}>{p.name}</div>
                {p.area && <div style={{ color: S.muted, fontSize: "12px", marginBottom: "6px" }}>📍 {p.area}</div>}
                {p.phone && <a href={`tel:${p.phone}`} style={{ color: S.accent, textDecoration: "none", fontWeight: "700", display: "block" }}>📞 {p.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "road" && (
        <div>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: S.muted, fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>{t.filterByService}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => setServiceFilter("")} style={{ ...S.btn(!serviceFilter ? "primary" : "ghost"), padding: "5px 12px", fontSize: "12px" }}>{t.allBrands}</button>
              {ROAD_SERVICES.map(s => (
                <button key={s.key} onClick={() => setServiceFilter(s.key)} style={{
                  ...S.btn(serviceFilter === s.key ? "primary" : "ghost"),
                  padding: "5px 12px", fontSize: "12px"
                }}>{s.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {filteredRoad.map(p => (
              <div key={p.id} style={S.card}>
                <div style={{ fontWeight: "700", marginBottom: "8px" }}>{p.name}</div>
                {p.phone && <a href={`tel:${p.phone}`} style={{ color: S.accent, textDecoration: "none", fontWeight: "700", display: "block" }}>📞 {p.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
      const clean = plate.replace(/-/g, "").trim();
      const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=${clean}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      const record = data?.result?.records?.[0];
      if (!record) {
        setLookupError(t.notFound);
      } else {
        setLookupResult({
          plate: clean,
          make: record.tozeret_nm || "",
          model: record.kinuy_mishari || "",
          year: record.shnat_yitzur || "",
          color: record.tzeva_rechev || "",
          engine: record.nefah_manoa || "",
          fuel: record.sug_delek_nm || "",
          gear: record.technologiat_hanaa_nm || "",
          vin: record.misgeret || "",
        });
      }
    } catch (e) {
      setLookupError(t.searchError);
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

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>{t.myProfile}</h2>
      <div style={{ ...S.card, marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "16px" }}>{user?.name}</div>
            <div style={{ color: S.muted, fontSize: "13px" }}>📱 {user?.phone}</div>
          </div>
          <button onClick={onLogout} style={{ ...S.btn("danger") }}>{t.logout}</button>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={{ marginBottom: "12px" }}>{t.myVehicles}</h3>
        {vehicles.length === 0 && <p style={{ color: S.muted }}>{t.noVehiclesReg}</p>}
        {vehicles.map(v => (
          <div key={v.id} style={{ background: "#0B0F1A", borderRadius: "8px", padding: "10px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700" }}>{v.make} {v.model}</span>
            <button onClick={() => removeVehicle(v.id)} style={{ ...S.btn("danger"), padding: "4px 8px" }}>✕</button>
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: "12px", marginTop: "12px" }}>
          <h4 style={{ marginBottom: "10px" }}>{t.addVehicleByPlate}</h4>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <input style={{ ...S.input, flex: 1, fontSize: "18px", textAlign: "center", letterSpacing: "2px", fontWeight: "800" }}
              placeholder={t.platePlaceholder} value={plate}
              onChange={e => setPlate(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookupPlate()}
              maxLength="8"
            />
            <button onClick={lookupPlate} style={{ ...S.btn(), padding: "10px 16px", whiteSpace: "nowrap" }}
              disabled={lookupLoading}>
              {lookupLoading ? "⏳" : t.search}
            </button>
          </div>

          {lookupError && <p style={{ color: S.danger, fontSize: "13px", marginBottom: "12px" }}>{lookupError}</p>}

          {lookupResult && (
            <div style={{ background: "#0B0F1A", borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
              <div style={{ fontWeight: "800", fontSize: "18px", marginBottom: "12px", color: S.accent }}>
                🚗 {lookupResult.make} {lookupResult.model} ({lookupResult.year})
              </div>
              <div style={{ background: "#141824", borderRadius: "8px", padding: "10px", marginBottom: "12px", fontSize: "13px" }}>
                {lookupResult.engine && <div>🔧 נפח מנוע: {lookupResult.engine}cc</div>}
                {lookupResult.fuel && <div>⛽ דלק: {lookupResult.fuel}</div>}
                {lookupResult.gear && <div>⚙️ הילוכים: {lookupResult.gear}</div>}
                {lookupResult.color && <div>🎨 צבע: {lookupResult.color}</div>}
              </div>
              <button onClick={addVehicle} style={{ ...S.btn(), width: "100%", padding: "12px" }}>
                {saved ? t.saved : t.addVehicle}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerApp({ user, cats, parts, providers, page, setPage, onLogout, error, t, lang, onChangeLang }) {
  const cart = user?.cart || [];

  return (
    <div style={{ background: "#0B0F1A", color: "#fff", minHeight: "100vh", padding: "20px", direction: t.dir }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: "0", color: S.accent, fontSize: "24px" }}>WHEELS</h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <LangSwitcher lang={lang} onChangeLang={onChangeLang} />
          <NavBtn icon="🏠" label={t.home} active={page === "home"} onClick={() => setPage("home")} />
          <NavBtn icon="🔧" label={t.providers} active={page === "providers"} onClick={() => setPage("providers")} />
          <NavBtn icon="📦" label={t.orders} active={page === "orders"} onClick={() => setPage("orders")} />
          <NavBtn icon="👤" label={t.profile} active={page === "profile"} onClick={() => setPage("profile")} />
          <button onClick={() => setPage("cart")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>
            🛒
            {cart.length > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-8px", background: S.danger, color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pages */}
      {page === "home" && <HomePage cats={cats} parts={parts} onAddToCart={onAddToCart} user={user} t={t} />}
      {page === "providers" && <ProvidersPage providers={providers} t={t} />}
      {page === "cart" && <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onOrder={placeOrder} setPage={setPage} t={t} />}
      {page === "orders" && <OrdersPage orders={user?.orders || []} t={t} />}
      {page === "profile" && <ProfilePage user={user} onUpdateVehicles={updateVehicles} onLogout={onLogout} t={t} />}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("wheels_user");
    if (saved) return JSON.parse(saved);
    return {
      id: Date.now(),
      name: "Guest",
      phone: "050-0000000",
      role: "customer",
      vehicles: [],
      cart: [],
      orders: [],
    };
  });
  const [lang, setLang] = useState(() => localStorage.getItem("wheels_lang") || "he");
  const [error, setError] = useState("");

  const t = LANGS[lang] || LANGS.he;

  const onAddToCart = (part) => {
    setUser(u => {
      const cart = u.cart || [];
      const existing = cart.find(x => x.id === part.id);
      const updated = existing
        ? cart.map(x => x.id === part.id ? { ...x, qty: x.qty + 1 } : x)
        : [...cart, { ...part, qty: 1 }];
      const newUser = { ...u, cart: updated };
      localStorage.setItem("wheels_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const removeFromCart = (id) => {
    setUser(u => {
      const updated = { ...u, cart: (u.cart || []).filter(x => x.id !== id) };
      localStorage.setItem("wheels_user", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setUser(u => {
      const updated = { ...u, cart: (u.cart || []).map(x => x.id === id ? { ...x, qty } : x) };
      localStorage.setItem("wheels_user", JSON.stringify(updated));
      return updated;
    });
  };

  const placeOrder = async () => {
    const cart = user.cart || [];
    if (cart.length === 0) return;
    try {
      const order = { items: cart, total: cart.reduce((s, i) => s + i.price * i.qty, 0), status: "pending" };
      const newUser = { ...user, cart: [], orders: [...(user.orders || []), order] };
      setUser(newUser);
      localStorage.setItem("wheels_user", JSON.stringify(newUser));
      setPage("orders");
    } catch (e) {
      setError("שגיאה בהזמנה");
    }
  };

  const updateVehicles = (vehicles) => {
    setUser(u => {
      const updated = { ...u, vehicles };
      localStorage.setItem("wheels_user", JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("wheels_user");
    window.location.reload();
  };

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("wheels_lang", l);
  };

  // Mock data
  const cats = [
    { id: 1, name: "גלגלים", icon: "🛞" },
    { id: 2, name: "שמן", icon: "🛢️" },
    { id: 3, name: "סוללה", icon: "🔋" },
  ];

  const parts = [
    { id: 1, name: "גלגל 205/55R16", price: 450, stock: 10, catalogCode: "W001", catId: 1, compat: [{ make: "טויוטה", model: "Corolla" }] },
    { id: 2, name: "שמן מנוע 5W30", price: 80, stock: 25, catalogCode: "O001", catId: 2, compat: [] },
    { id: 3, name: "סוללה 60Ah", price: 320, stock: 5, catalogCode: "B001", catId: 3, compat: [] },
  ];

  const providers = [
    { id: 1, name: "מוסך אלון", type: "garage", area: "תל אביב", phone: "03-1234567", specialBrands: ["טויוטה", "BMW"] },
    { id: 2, name: "חנות גלגלים רון", type: "shop", area: "ירושלים", phone: "02-5555555" },
    { id: 3, name: "שירות דרך 24/7", type: "road", phone: "1-800-999-999", serviceKinds: ["towing", "rescue"] },
  ];

  return <CustomerApp user={user} cats={cats} parts={parts} providers={providers} page={page} setPage={setPage} onLogout={handleLogout} error={error} t={t} lang={lang} onChangeLang={changeLang} />;
}
