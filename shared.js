/* SmartServices Shared Shell v4 — imported by every portal */

const SS_USERS = [
  { id:'U001', name:'Rashida Khanam', phone:'01711000001', password:'1234', role:'customer',   avatar:'RK', sub:'Individual Account · Baridhara' },
  { id:'U002', name:'Mizanur Rahman', phone:'01711000002', password:'1234', role:'customer',   avatar:'MR', sub:'Building Account · Gulshan' },
  { id:'U003', name:'Karim Ahmed',    phone:'01711000003', password:'1234', role:'technician', avatar:'KA', sub:'AC Specialist · TEC-0041' },
  { id:'U004', name:'Sumaiya Islam',  phone:'01711000004', password:'1234', role:'technician', avatar:'SI', sub:'Cleaning Lead · TEC-0022' },
  { id:'U005', name:'Mostofa Karim', phone:'01711000005', password:'1234', role:'collector',  avatar:'MK', sub:'Cash Collector · Zone A' },
  { id:'U006', name:'Admin User',     phone:'01711000006', password:'1234', role:'admin',      avatar:'AD', sub:'Super Admin · Full Access' },
];

const SS_PORTAL = { customer:'customer.html', technician:'technician.html', collector:'collector.html', admin:'admin.html' };
const SS_ROLE_COLOR = { customer:'#1A6B47', technician:'#1A4A8A', collector:'#C27B2A', admin:'#9B2335' };
const SS_ROLE_LABEL = { customer:'Customer Portal', technician:'Technician App', collector:'Collector App', admin:'Admin Control Tower' };

const SS = {
  login(phone, password) {
    const u = SS_USERS.find(x => x.phone===phone && x.password===password);
    if (!u) return null;
    localStorage.setItem('ss_user', JSON.stringify(u));
    return u;
  },
  logout() { localStorage.removeItem('ss_user'); window.location.href='login.html'; },
  getUser() { try { return JSON.parse(localStorage.getItem('ss_user')); } catch { return null; } },
  requireAuth(role) {
    const u = this.getUser();
    if (!u) { window.location.href='login.html'; return null; }
    if (role && u.role!==role) { window.location.href=SS_PORTAL[u.role]||'login.html'; return null; }
    return u;
  },

  /* shared state */
  getJobs()         { try{return JSON.parse(localStorage.getItem('ss_jobs'))||[];}catch{return[];} },
  saveJobs(j)       { localStorage.setItem('ss_jobs',JSON.stringify(j)); },
  getInvoices()     { try{return JSON.parse(localStorage.getItem('ss_invoices'))||[];}catch{return[];} },
  saveInvoices(i)   { localStorage.setItem('ss_invoices',JSON.stringify(i)); },
  getCollections()  { try{return JSON.parse(localStorage.getItem('ss_cols'))||[];}catch{return[];} },
  saveCollections(c){ localStorage.setItem('ss_cols',JSON.stringify(c)); },
  newId(p)          { return p+'-'+Date.now().toString(36).toUpperCase(); },

  seedIfEmpty() {
    if (this.getJobs().length>0) return;
    this.saveJobs([
      {id:'JOB-001',customerId:'U001',customerName:'Rashida Khanam',service:'AC Servicing',detail:'2 Split Units — Cleaning',address:'Apt 4B, Baridhara',date:'2025-06-22',slot:'Morning',status:'in_progress',techId:'U003',techName:'Karim Ahmed',estimate:1200,parts:[],createdAt:Date.now()-3600000},
      {id:'JOB-002',customerId:'U001',customerName:'Rashida Khanam',service:'Deep Cleaning',detail:'Full Apartment',address:'Apt 4B, Baridhara',date:'2025-06-15',slot:'Morning',status:'completed',techId:'U004',techName:'Sumaiya Islam',estimate:3500,parts:[],rating:5,feedback:'Excellent work!',createdAt:Date.now()-604800000},
      {id:'JOB-003',customerId:'U002',customerName:'Mizanur Rahman',service:'Security Guard',detail:'Monthly Contract',address:'Road 11, Gulshan',date:'2025-06-01',slot:'Full Day',status:'completed',techId:'U003',techName:'Rafiq Mia',estimate:48000,parts:[],createdAt:Date.now()-1800000},
      {id:'JOB-004',customerId:'U001',customerName:'Rashida Khanam',service:'Pest Control',detail:'Full Apartment',address:'Apt 4B, Baridhara',date:'2025-06-25',slot:'Afternoon',status:'pending',estimate:2200,parts:[],createdAt:Date.now()-900000},
      {id:'JOB-005',customerId:'U002',customerName:'Mizanur Rahman',service:'FM Contract',detail:'Common Areas',address:'Road 11, Gulshan',date:'2025-06-25',slot:'Morning',status:'pending',estimate:65000,parts:[],createdAt:Date.now()-600000,urgent:true},
    ]);
    this.saveInvoices([
      {id:'INV-001',jobId:'JOB-001',customerId:'U001',customerName:'Rashida Khanam',desc:'AC Servicing · 2 Units',amount:1200,type:'adhoc',status:'unpaid',createdAt:Date.now()-3600000},
      {id:'INV-002',jobId:'JOB-002',customerId:'U001',customerName:'Rashida Khanam',desc:'Deep Cleaning',amount:3500,type:'adhoc',status:'paid',paidVia:'bKash',createdAt:Date.now()-604800000},
      {id:'INV-003',jobId:'JOB-003',customerId:'U002',customerName:'Mizanur Rahman',desc:'Security — Monthly',amount:48000,type:'monthly',status:'unpaid',createdAt:Date.now()-1800000},
    ]);
    this.saveCollections([
      {id:'COL-001',invoiceId:'INV-001',customerId:'U001',customerName:'Rashida Khanam',address:'Apt 4B, Baridhara',amount:1200,date:'2025-06-23',slot:'Morning',status:'scheduled',collectorId:'U005'},
    ]);
  },

  renderTopbar(user, title, notifCount) {
    const rc = SS_ROLE_COLOR[user.role]||'#666';
    const nb = notifCount>0 ? `<span style="position:absolute;top:-3px;right:-3px;width:16px;height:16px;background:#9B2335;border-radius:50%;font-size:9px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;border:1.5px solid #0F1923">${notifCount}</span>`:'' ;
    return `<div id="ss-topbar" style="background:#0F1923;height:56px;display:flex;align-items:center;padding:0 1.5rem;gap:1rem;position:sticky;top:0;z-index:100;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.08)">
      <a href="login.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0">
        <div style="width:28px;height:28px;background:#D4A017;border-radius:7px;display:flex;align-items:center;justify-content:center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F1923" stroke-width="2.5" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <span style="font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:#fff;letter-spacing:-0.02em">Smart<span style="color:#D4A017">Services</span></span>
      </a>
      <div style="width:1px;height:20px;background:rgba(255,255,255,0.1)"></div>
      <span id="ss-topbar-title" style="font-size:13px;font-weight:500;color:rgba(255,255,255,0.75)">${title}</span>
      <div style="margin-left:auto;display:flex;align-items:center;gap:10px">
        <div style="position:relative;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background=''" onclick="document.getElementById('ss-notif-panel').style.display=document.getElementById('ss-notif-panel').style.display==='none'?'block':'none'">
          ${nb}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:4px 12px 4px 4px;cursor:pointer" onclick="SS.toggleUserMenu()">
          <div style="width:28px;height:28px;border-radius:50%;background:${rc};display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${user.avatar}</div>
          <div style="line-height:1.25">
            <div style="font-size:12px;font-weight:600;color:#fff">${user.name.split(' ')[0]}</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.4);font-family:monospace;letter-spacing:0.05em;text-transform:uppercase">${user.role}</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </div>
    <div id="ss-user-menu" style="display:none;position:fixed;top:62px;right:1.5rem;background:#fff;border:1px solid #E8E4DC;border-radius:16px;box-shadow:0 12px 40px rgba(15,25,35,0.18);z-index:500;min-width:230px;overflow:hidden">
      <div style="padding:1rem 1.25rem;background:#FAFAF7;border-bottom:1px solid #E8E4DC">
        <div style="width:36px;height:36px;border-radius:50%;background:${rc};display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:8px">${user.avatar}</div>
        <div style="font-size:14px;font-weight:700;color:#0F1923">${user.name}</div>
        <div style="font-size:11px;color:#718096;margin-top:2px;font-family:monospace">${user.phone}</div>
        <div style="font-size:11px;color:#718096;margin-top:1px">${user.sub}</div>
        <div style="display:inline-block;margin-top:6px;font-size:10px;font-weight:600;padding:3px 10px;border-radius:100px;background:${rc}20;color:${rc};font-family:monospace;text-transform:uppercase;letter-spacing:0.06em">${user.role}</div>
      </div>
      <div style="padding:6px">
        <div class="ss-menu-item" onclick="SS.toggleUserMenu()" style="padding:9px 12px;border-radius:10px;font-size:13px;color:#2C3E50;cursor:pointer;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#F4F2ED'" onmouseout="this.style.background=''">
          <span style="font-size:16px">⚙️</span> Settings & Profile
        </div>
        <div style="height:1px;background:#E8E4DC;margin:4px 0"></div>
        <div onclick="SS.logout()" style="padding:9px 12px;border-radius:10px;font-size:13px;color:#9B2335;cursor:pointer;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#FDEAEC'" onmouseout="this.style.background=''">
          <span style="font-size:16px">🚪</span> Sign Out
        </div>
      </div>
    </div>
    <div id="ss-notif-panel" style="display:none;position:fixed;top:62px;right:5rem;background:#fff;border:1px solid #E8E4DC;border-radius:16px;box-shadow:0 12px 40px rgba(15,25,35,0.15);z-index:500;min-width:300px;max-width:340px;overflow:hidden">
      <div style="padding:.875rem 1.25rem;border-bottom:1px solid #E8E4DC;display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:13px;font-weight:700;color:#0F1923">Notifications</div>
        <div style="font-size:11px;color:#B8860B;cursor:pointer;font-weight:500">Mark all read</div>
      </div>
      <div id="ss-notif-list" style="padding:6px;max-height:320px;overflow-y:auto"></div>
    </div>`;
  },

  toggleUserMenu() {
    const m = document.getElementById('ss-user-menu');
    const n = document.getElementById('ss-notif-panel');
    if (n) n.style.display='none';
    if (m) m.style.display = m.style.display==='none'?'block':'none';
  },

  renderNotifs(jobs, user) {
    const el = document.getElementById('ss-notif-list');
    if (!el) return;
    let items = [];
    if (user.role==='customer') {
      jobs.filter(j=>j.customerId===user.id).forEach(j=>{
        if (j.status==='in_progress') items.push({icon:'🔧',text:`${j.service} is in progress`,sub:'Technician on site now',color:'#1A4A8A'});
        if (j.status==='pending') items.push({icon:'⏳',text:`${j.service} awaiting confirmation`,sub:'Admin reviewing your request',color:'#C27B2A'});
      });
    }
    if (user.role==='admin') {
      jobs.filter(j=>j.status==='pending').forEach(j=>{
        items.push({icon:'🚨',text:`New booking: ${j.service}`,sub:`${j.customerName} · ${j.urgent?'URGENT':'Standard'}`,color:'#9B2335'});
      });
    }
    if (user.role==='technician') {
      jobs.filter(j=>j.techId===user.id&&j.status==='in_progress').forEach(j=>{
        items.push({icon:'🔧',text:`Active: ${j.service}`,sub:j.address,color:'#1A4A8A'});
      });
    }
    if (items.length===0) items.push({icon:'✓',text:'All caught up',sub:'No new notifications',color:'#1A6B47'});
    el.innerHTML = items.map(i=>`<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:10px;cursor:pointer" onmouseover="this.style.background='#F4F2ED'" onmouseout="this.style.background=''">
      <div style="width:32px;height:32px;border-radius:50%;background:${i.color}18;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${i.icon}</div>
      <div><div style="font-size:12px;font-weight:600;color:#0F1923">${i.text}</div><div style="font-size:11px;color:#718096;margin-top:1px">${i.sub}</div></div>
    </div>`).join('');
  },

  fmt(n) { return '৳'+Number(n).toLocaleString(); },
  badge(text,color,bg) { return `<span style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;background:${bg};color:${color};font-family:monospace;white-space:nowrap">${text}</span>`; },
  statusBadge(s) {
    const m={pending:['Pending','#C27B2A','#FFF3E0'],in_progress:['In Progress','#1A4A8A','#EAF0FB'],completed:['Completed','#1A6B47','#E8F5EE'],cancelled:['Cancelled','#9B2335','#FDEAEC']};
    const [l,c,b]=m[s]||['Unknown','#666','#eee']; return this.badge(l,c,b);
  },
};
