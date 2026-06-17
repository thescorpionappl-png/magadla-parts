import { useState, useEffect, useCallback } from "react";

// Supabase REST client
const SUPABASE_URL = "https://eeeujeboftmhblfmyabp.supabase.co";
const SUPABASE_KEY = "sb_publishable_yqvuNDeTLydBw4NMTq6Cdw_6SE94_fm";

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
    throw new Error(`Supabase error: ${res.status}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// DB Layer
const DB = {
  async getCategoryTree() {
    const rows = await sb("categories?select=*&order=sort_order.asc");
    const byId = {};
    rows.forEach(r => { byId[r.id] = { id:r.id, name:r.name, icon:r.icon, children:[] }; });
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
        phone: user.phone, name: user.name, role: user.role || "customer",
        customer_type: "private", biz_approved: false,
        vehicles: user.vehicles || [], cart: [],
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
    if (updates.role !== undefined) body.role = updates.role;
    if (updates.customerType !== undefined) body.customer_type = updates.customerType;
    if (updates.bizApproved !== undefined) body.biz_approved = updates.bizApproved;
    if (updates.bizData !== undefined) body.biz_data = updates.bizData;
    if (updates.vehicles !== undefined) body.vehicles = updates.vehicles;
    if (updates.cart !== undefined) body.cart = updates.cart;
    const rows = await sb(`users?phone=eq.${encodeURIComponent(phone)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return rows && rows[0] ? { ...rows[0], vehicles: rows[0].vehicles || [], cart: rows[0].cart || [] } : null;
  },
};

// Main App
export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [parts, setParts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("mg_session");
    if (storedPhone) {
      setPage("home");
      loadUser(storedPhone);
    }
  }, []);

  const loadUser = async (phone) => {
    try {
      let u = await DB.getUserByPhone(phone);
      if (!u) {
        u = await DB.createUser({ phone, name: "משתמש" });
      }
      setUser(u);
    } catch (e) {
      setError("שגיאה בטעינת המשתמש");
    }
  };

  const loadData = async () => {
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
      setError("שגיאה בטעינת נתונים מ-Supabase");
    }
  };

  useEffect(() => {
    if (page === "home" || page === "orders") loadData();
  }, [page]);

  const handleLogin = async (phone) => {
    try {
      await loadUser(phone);
      localStorage.setItem("mg_session", phone);
      setPage("home");
    } catch (e) {
      setError("שגיאה בהתחברות");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mg_session");
    setUser(null);
    setPage("login");
  };

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} error={error} />;
  }

  return (
    <CustomerApp 
      user={user} 
      cats={cats} 
      parts={parts} 
      providers={providers}
      page={page}
      setPage={setPage}
      onLogout={handleLogout}
      error={error}
    />
  );
}

function LoginPage({ onLogin, error }) {
  const [phone, setPhone] = useState("");

  return (
    <div style={{ background: "#0A0F1E", color: "#fff", padding: "40px", textAlign: "center", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>חלקי חילוף מגאדלה</h1>
      <input
        type="tel"
        placeholder="הכנס מספר טלפון"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "200px" }}
      />
      <button
        onClick={() => onLogin(phone)}
        style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer" }}
      >
        התחברות
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

function CustomerApp({ user, cats, parts, providers, page, setPage, onLogout, error }) {
  return (
    <div style={{ background: "#0A0F1E", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>מגאדלה</h2>
        <button onClick={onLogout} style={{ cursor: "pointer" }}>התנתקות</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {page === "home" && <HomePage cats={cats} parts={parts} setPage={setPage} />}
      {page === "providers" && <ProvidersPage providers={providers} setPage={setPage} />}
      {page === "orders" && <OrdersPage user={user} setPage={setPage} />}
    </div>
  );
}

function HomePage({ cats, parts, setPage }) {
  return (
    <div>
      <h3>קטגוריות</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
        {cats.map(cat => (
          <div key={cat.id} style={{ background: "#1a1f2e", padding: "10px", cursor: "pointer" }}>
            {cat.name}
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: "20px" }}>חלקים</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
        {parts.slice(0, 6).map(p => (
          <div key={p.id} style={{ background: "#1a1f2e", padding: "10px" }}>
            <h4>{p.name}</h4>
            <p>₪{p.price}</p>
            <button style={{ cursor: "pointer" }}>הוסף לעגלה</button>
          </div>
        ))}
      </div>
      <button onClick={() => setPage("providers")} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
        חנויות וסדנות
      </button>
    </div>
  );
}

function ProvidersPage({ providers, setPage }) {
  return (
    <div>
      <button onClick={() => setPage("home")} style={{ marginBottom: "20px", cursor: "pointer" }}>← חזרה</button>
      <h3>חנויות וסדנות</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
        {providers.map(p => (
          <div key={p.id} style={{ background: "#1a1f2e", padding: "15px" }}>
            <h4>{p.name}</h4>
            <p>{p.type === "shop" ? "חנות" : "סדנה"}</p>
            <p>☎️ {p.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersPage({ user, setPage }) {
  return (
    <div>
      <button onClick={() => setPage("home")} style={{ marginBottom: "20px", cursor: "pointer" }}>← חזרה</button>
      <h3>ההזמנות שלי</h3>
      {user && user.cart && user.cart.length > 0 ? (
        <div>
          {user.cart.map((item, i) => (
            <div key={i} style={{ background: "#1a1f2e", padding: "10px", marginBottom: "10px" }}>
              {item.name} - ₪{item.price}
            </div>
          ))}
        </div>
      ) : (
        <p>אין הזמנות</p>
      )}
      <button onClick={() => setPage("home")} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
        חזרה לעמוד הבית
      </button>
    </div>
  );
}
