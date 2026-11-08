'use client'
import {useEffect,useRef,useState} from 'react'
import {toPng} from 'html-to-image'
import {MODES,LEVELS,TONES,EXAMPLES,SURPRISES} from '@/lib/modes'
export default function Home(){
const [text,setText]=useState(''),[mode,setMode]=useState('linkedin'),[level,setLevel]=useState(2),[tone,setTone]=useState('Funny')
const [out,setOut]=useState(''),[src,setSrc]=useState(''),[loading,setLoading]=useState(false),[err,setErr]=useState(''),[copied,setCopied]=useState(false)
const card=useRef<HTMLDivElement>(null)
useEffect(()=>{if(localStorage.theme==='dark'||(!localStorage.theme&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')},[])
const toggle=()=>{const d=document.documentElement.classList.toggle('dark');localStorage.theme=d?'dark':'light'}
async function run(t=text,m=mode){
if(!t.trim())return setErr('Type something unprofessional first.')
setLoading(true);setErr('');setCopied(false)
try{const r=await fetch('/api/translate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:t,mode:m,level,tone})})
const d=await r.json();if(!r.ok)throw new Error(d.error||'Something went wrong.');setOut(d.result);setSrc(t)}
catch(e:any){setErr(e.message)}finally{setLoading(false)}}
const surprise=()=>{const s=SURPRISES[Math.floor(Math.random()*SURPRISES.length)];setText(s);run(s)}
const pick=(id:string)=>{setMode(id);if(out&&text.trim())run(text,id)}
const copy=async()=>{await navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),1500)}
async function exportImg(){if(!card.current)return;const u=await toPng(card.current,{pixelRatio:2});
const f=await (await fetch(u)).blob();const file=new File([f],'corporateify.png',{type:'image/png'})
if(navigator.canShare?.({files:[file]}))try{await navigator.share({files:[file],title:'Corporateify'});return}catch{}
const a=document.createElement('a');a.href=u;a.download='corporateify.png';a.click()}
const m=MODES.find(x=>x.id===mode)!
const box='rounded-xl border border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
const btn='rounded-lg border border-stone-300 px-3 py-2 dark:border-neutral-700'
return <main className="mx-auto max-w-5xl px-5 pb-16">
<nav className="flex items-center justify-between py-5"><div><b className="display text-xl">Corporateify</b><span className="ml-3 hidden text-xs text-stone-500 sm:inline">Synergy as a service</span></div>
<div className="flex items-center gap-4 text-sm"><a href="#how" className="text-stone-500">How it works</a><button onClick={toggle} aria-label="Toggle theme" className={btn}>◐</button></div></nav>
<header className="py-10 text-center"><h1 className="display mx-auto max-w-3xl text-4xl font-semibold sm:text-6xl">Because saying what you actually mean is unprofessional.</h1>
<p className="mt-4 text-lg text-stone-500">Translate your brutally honest thoughts into corporate excellence.</p>
<p className="mx-auto mt-5 max-w-md text-sm italic text-stone-500">“I got fired.” → “Thrilled to announce I’m embracing a new chapter 🚀”</p></header>
<section className={box+' p-5 sm:p-6'}>
<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{MODES.map(x=><button key={x.id} onClick={()=>pick(x.id)} className={'rounded-lg border px-3 py-2.5 text-left text-sm transition '+(mode===x.id?'border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-black':'border-stone-200 hover:border-stone-400 dark:border-neutral-700')}><span className="mr-1">{x.emoji}</span>{x.name}</button>)}</div>
<div className="relative mt-4"><textarea value={text} maxLength={500} onChange={e=>setText(e.target.value)} placeholder="e.g. I have been arrested for fraud." rows={4} className="w-full resize-none rounded-lg border border-stone-200 bg-transparent p-4 outline-none focus:border-stone-900 dark:border-neutral-700 dark:focus:border-white"/><span className="absolute bottom-3 right-3 text-xs text-stone-400">{text.length}/500</span></div>
<div className="mt-4 grid gap-4 sm:grid-cols-2">
<label className="text-sm"><span className="text-stone-500">Corporate level: <b className="text-stone-900 dark:text-white">{level} – {LEVELS[level-1]}</b></span><input type="range" min={1} max={4} value={level} onChange={e=>setLevel(+e.target.value)} className="mt-2 w-full accent-stone-900 dark:accent-white"/></label>
<label className="text-sm"><span className="text-stone-500">Tone</span><select value={tone} onChange={e=>setTone(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 bg-transparent p-2 dark:border-neutral-700">{TONES.map(t=><option key={t} className="text-black">{t}</option>)}</select></label></div>
<div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>run()} disabled={loading} className="rounded-lg bg-stone-900 px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60 dark:bg-white dark:text-black">{loading?'Leveraging synergies…':'Corporateify ✨'}</button>
<button onClick={surprise} disabled={loading} className={btn+' py-3 text-sm'}>🎲 Surprise me</button>
<button onClick={()=>{setText('');setOut('');setErr('')}} className="px-3 py-3 text-sm text-stone-500">Reset</button></div>
{err&&<p role="alert" className="fade mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">{err}</p>}
{loading&&<div className="mt-5 space-y-2">{[90,75,60].map(w=><div key={w} style={{width:w+'%'}} className="h-3 animate-pulse rounded bg-stone-200 dark:bg-neutral-800"/>)}</div>}
{out&&!loading&&<div className="fade mt-6">
<div className="grid gap-3 md:grid-cols-2"><div className="rounded-lg bg-stone-100 p-4 dark:bg-neutral-800"><p className="mb-1 text-xs uppercase tracking-wide text-stone-500">Before</p><p>{src}</p></div>
<div className="rounded-lg border-2 border-stone-900 p-4 dark:border-white"><p className="mb-1 text-xs uppercase tracking-wide text-stone-500">After · {m.name}</p><p className="whitespace-pre-wrap">{out}</p></div></div>
<div className="mt-3 flex flex-wrap gap-2 text-sm"><button onClick={copy} className={btn}>{copied?'Copied ✓':'Copy'}</button><button onClick={()=>run(src,mode)} className={btn}>↻ Regenerate</button><button onClick={exportImg} className={btn}>Share as image</button></div>
<div className="absolute -left-[9999px]"><div ref={card} className="w-[600px] bg-stone-50 p-8 text-stone-900"><p className="text-sm text-stone-500">Before</p><p className="mb-5 text-lg">“{src}”</p><p className="text-sm text-stone-500">After · {m.emoji} {m.name}</p><p className="whitespace-pre-wrap text-lg font-medium">{out}</p><p className="mt-6 text-xs text-stone-400">corporateify · say what you mean, professionally</p></div></div></div>}
</section>
<section className="mt-12"><h2 className="display text-2xl">Popular translations</h2><div className="mt-4 flex flex-wrap gap-2">{EXAMPLES.map(e=><button key={e} onClick={()=>{setText(e);run(e)}} className="rounded-full border border-stone-200 px-4 py-2 text-sm hover:border-stone-500 dark:border-neutral-700">{e}</button>)}</div></section>
<section id="how" className="mt-12 grid gap-4 text-sm text-stone-600 dark:text-stone-400 sm:grid-cols-3"><p><b className="block text-stone-900 dark:text-white">1. Confess</b>Type the honest thing.</p><p><b className="block text-stone-900 dark:text-white">2. Choose your poison</b>Pick a persona, a level and a tone.</p><p><b className="block text-stone-900 dark:text-white">3. Circle back</b>Copy it or export a card. Your text is never stored.</p></section>
<footer className="mt-16 text-center text-xs text-stone-400">Corporateify — let’s take this offline. 🚀</footer>
</main>}
