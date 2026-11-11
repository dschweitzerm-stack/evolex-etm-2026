/** Cloudflare Pages Function: POST /api/leads. Requires env.DB (D1) and env.TURNSTILE_SECRET. */
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const safeText=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
export async function onRequestPost({request,env}){
  if(!env.DB||!env.TURNSTILE_SECRET)return reply({error:'Formulario pendiente de activación segura.'},503);
  if(!/^application\/json\b/i.test(request.headers.get('content-type')||''))return reply({error:'Formato no admitido.'},415);
  if(Number(request.headers.get('content-length')||0)>6000)return reply({error:'Solicitud demasiado grande.'},413);
  let data;try{data=await request.json()}catch{return reply({error:'Solicitud inválida.'},400)}
  if(!data||typeof data!=='object')return reply({error:'Solicitud inválida.'},400);
  if(safeText(data.website,200))return reply({ok:true});
  const name=safeText(data.name,100),company=safeText(data.company,120),email=safeText(data.email,160).toLowerCase(),challenge=safeText(data.challenge,80),notes=safeText(data.notes,700);
  const options=new Set(['Contratos y negociaciones','Costos y asesoría legal','Datos, ciberseguridad e IA','Inversión y crecimiento','Compliance y regulación','Otro desafío']);
  if(name.length<2||company.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!options.has(challenge)||data.consent!==true)return reply({error:'Completa los datos y autoriza el contacto.'},400);
  const token=safeText(data.turnstileToken,3000);if(!token)return reply({error:'Completa la verificación de seguridad.'},400);
  let verified=false;try{const form=new FormData();form.append('secret',env.TURNSTILE_SECRET);form.append('response',token);const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});const result=await response.json();verified=result.success===true}catch{return reply({error:'No se pudo verificar la solicitud.'},503)}
  if(!verified)return reply({error:'No pudimos completar la verificación. Inténtalo nuevamente.'},403);
  const id=crypto.randomUUID(),createdAt=new Date().toISOString();
  try{await env.DB.prepare('INSERT INTO etm_leads (id,created_at,name,company,email,challenge,notes,consent_version,source) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,createdAt,name,company,email,challenge,notes,'2026-11-11-v1','etm-day-2026').run()}catch(e){console.error('DB lead write failed',e?.message);return reply({error:'No pudimos registrar tu solicitud. Inténtalo más tarde.'},503)}
  return reply({ok:true,id});
}
export function onRequestGet(){return reply({error:'Método no permitido.'},405)}
