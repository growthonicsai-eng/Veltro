const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_KEY = 'veltro_supabase_session';
export const supabaseConfigured = Boolean(url && anonKey);

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
function setSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  listeners.forEach(fn => fn(session));
}
const listeners = new Set();

async function request(path, options = {}) {
  const headers = { apikey: anonKey, ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  const session = getSession();
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  const res = await fetch(`${url}${path}`, { ...options, headers });
  const text = await res.text();
  let data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || data?.error_description || data?.hint || `Supabase request failed (${res.status})`);
  return data;
}

class Query {
  constructor(table, action='select', body=null) { this.table=table; this.action=action; this.body=body; this.filters=[]; this.orders=[]; this.limitValue=null; this.selectValue=null; this.singleValue=false; this.maybe=false; }
  select(value='*') { this.selectValue=value; return this; }
  eq(k,v) { this.filters.push([k,'eq',v]); return this; }
  order(k,{ascending=true}={}) { this.orders.push([k,ascending]); return this; }
  limit(n) { this.limitValue=n; return this; }
  single() { this.singleValue=true; return this; }
  maybeSingle() { this.maybe=true; return this; }
  then(resolve,reject) { return this.execute().then(resolve,reject); }
  async execute() {
    let path = `/rest/v1/${this.table}`;
    const params = new URLSearchParams();
    if (this.action === 'select') params.set('select', this.selectValue || '*');
    for (const [k,op,v] of this.filters) params.set(k, `${op}.${v}`);
    for (const [k,asc] of this.orders) params.set('order', `${k}.${asc?'asc':'desc'}`);
    if (this.limitValue) params.set('limit', this.limitValue);
    let data;
    if (this.action === 'insert' || this.action === 'upsert') {
      if (this.selectValue) params.set('select', this.selectValue);
      const headers = { Prefer: this.action === 'upsert' ? 'resolution=merge-duplicates,return=representation' : (this.selectValue ? 'return=representation' : 'return=minimal') };
      if (this.action === 'upsert') params.set('on_conflict','ref');
      data = await request(`${path}?${params}`, { method:'POST', headers, body:JSON.stringify(this.body) });
    } else if (this.action === 'delete') {
      data = await request(`${path}?${params}`, { method:'DELETE', headers:{Prefer:'return=representation'} });
    } else if (this.action === 'update') {
      if (this.selectValue) params.set('select', this.selectValue);
      data = await request(`${path}?${params}`, { method:'PATCH', headers:{Prefer:'return=representation'}, body:JSON.stringify(this.body) });
    } else {
      data = await request(`${path}?${params}`);
    }
    if (this.singleValue) return { data: Array.isArray(data) ? data[0] : data, error: null };
    if (this.maybe) return { data: Array.isArray(data) ? (data[0] || null) : data, error: null };
    return { data, error:null };
  }
}
function from(table) {
  return {
    select: () => new Query(table,'select').select('*'),
    insert: (body) => new Query(table,'insert',body),
    upsert: (body) => new Query(table,'upsert',body),
    delete: () => new Query(table,'delete'),
    update: (body) => new Query(table,'update',body),
  };
}

export const supabase = supabaseConfigured ? {
  from,
  auth: {
    async getSession() { return { data: { session: getSession() }, error: null }; },
    async signInWithPassword({email,password}) {
      try {
        const session = await request('/auth/v1/token?grant_type=password', { method:'POST', body:JSON.stringify({email,password}) });
        setSession(session);
        return { data:{session}, error:null };
      } catch (error) { return { data:null, error }; }
    },
    async signOut() { setSession(null); return { error:null }; },
    onAuthStateChange(fn) { listeners.add(fn); return { data:{ subscription:{ unsubscribe:()=>listeners.delete(fn) } } }; }
  },
  storage: {
    from(bucket) {
      return {
        async upload(path, file, options={}) {
          const session=getSession();
          const headers={ apikey:anonKey, Authorization:`Bearer ${session?.access_token || anonKey}`, 'Content-Type':options.contentType || file.type || 'application/octet-stream', 'x-upsert':String(Boolean(options.upsert)) };
          const res=await fetch(`${url}/storage/v1/object/${bucket}/${path}`,{method:'POST',headers,body:file});
          if(!res.ok) { let e={}; try{e=await res.json()}catch{} return {data:null,error:new Error(e.message||`Upload failed (${res.status})`)}; }
          return {data:await res.json(),error:null};
        },
        async createSignedUrl(path, expiresIn=600) {
          const session=getSession();
          const headers={ apikey:anonKey, Authorization:`Bearer ${session?.access_token || anonKey}`, 'Content-Type':'application/json' };
          const res=await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`,{method:'POST',headers,body:JSON.stringify({expiresIn})});
          if(!res.ok) { let e={}; try{e=await res.json()}catch{} return {data:null,error:new Error(e.message||`Signed URL failed (${res.status})`)}; }
          const body=await res.json();
          return {data:{signedUrl:`${url}/storage/v1${body.signedURL}`},error:null};
        }
      };
    }
  },
  functions: {
    async invoke(name,{body}) {
      try { return { data: await request(`/functions/v1/${name}`,{method:'POST',headers:{Authorization:`Bearer ${getSession()?.access_token || anonKey}`},body:JSON.stringify(body)}), error:null }; }
      catch(error){ return {data:null,error}; }
    }
  }
} : null;
