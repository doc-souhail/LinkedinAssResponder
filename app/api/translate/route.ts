import {NextResponse} from 'next/server'
import {MODES,TONES,buildSystem} from '@/lib/modes'
const hits=new Map<string,number[]>()
export async function POST(req:Request){
const key=process.env.ANTHROPIC_API_KEY
if(!key||key.startsWith('your-'))return NextResponse.json({error:'Server is missing ANTHROPIC_API_KEY. See README.'},{status:500})
const ip=req.headers.get('x-forwarded-for')?.split(',')[0]??'local'
const now=Date.now(),recent=(hits.get(ip)??[]).filter(t=>now-t<60000)
if(recent.length>=10)return NextResponse.json({error:'Too many requests. Synergy needs rest.'},{status:429})
hits.set(ip,[...recent,now])
let b:any;try{b=await req.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
const text=String(b.text??'').trim(),level=Number(b.level)
if(!text||text.length>500)return NextResponse.json({error:'Text must be 1–500 characters.'},{status:400})
if(!MODES.some(m=>m.id===b.mode)||!TONES.includes(b.tone)||![1,2,3,4].includes(level))return NextResponse.json({error:'Invalid options.'},{status:400})
try{
const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},
body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-sonnet-5-5',max_tokens:600,system:buildSystem(b.mode,level,b.tone),messages:[{role:'user',content:text}]})})
if(!r.ok)return NextResponse.json({error:'The AI is in a meeting. Try again shortly.'},{status:502})
const d=await r.json()
return NextResponse.json({result:d.content?.map((c:any)=>c.text??'').join('').trim()})
}catch{return NextResponse.json({error:'Network error. Please retry.'},{status:502})}}
