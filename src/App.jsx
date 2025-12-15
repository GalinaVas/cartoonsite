import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Лендинг (React) без мест под картинки.
 * Стиль: яркая «мульт-студия», неон, мягкие тени, много воздуха.
 * Внизу: заметная большая кнопка «Записаться на курс» + модальное окно.
 */

const css = `
:root{
  --bg0:#070A13;
  --bg1:#0B1022;
  --text:rgba(255,255,255,.92);
  --muted:rgba(255,255,255,.72);
  --muted2:rgba(255,255,255,.58);

  --shadow: 0 14px 40px rgba(0,0,0,.45);
  --shadow2: 0 10px 26px rgba(0,0,0,.32);
  --radius: 22px;

  --a:#7C3AED;
  --b:#22D3EE;
  --c:#F97316;
  --d:#F43F5E;
  --e:#A3E635;

  --glowA: 0 0 28px rgba(124,58,237,.38);
  --glowB: 0 0 28px rgba(34,211,238,.32);
  --glowC: 0 0 28px rgba(249,115,22,.28);

  --max: 1180px;
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  color:var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
  background:
    radial-gradient(1400px 900px at 12% 10%, rgba(124,58,237,.35), transparent 55%),
    radial-gradient(1200px 800px at 85% 20%, rgba(34,211,238,.28), transparent 55%),
    radial-gradient(1200px 900px at 55% 90%, rgba(244,63,94,.20), transparent 55%),
    linear-gradient(180deg, var(--bg0), var(--bg1));
  overflow-x:hidden;
}

a{color:inherit}

/* subtle grain */
.grain{
  pointer-events:none;
  position:fixed; inset:0;
  background-image: radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.6px);
  background-size: 22px 22px;
  opacity:.05;
  mix-blend-mode: overlay;
  animation: drift 18s linear infinite;
}
@keyframes drift{ from{transform:translate3d(0,0,0)} to{transform:translate3d(-44px,-66px,0)} }

/* studio backdrop */
.studio{ position:fixed; inset:-120px; pointer-events:none; opacity:.85; filter:saturate(1.08); }
.studio .layer{ position:absolute; inset:0; }
.studio .bg{
  background:
    radial-gradient(1400px 800px at 50% 30%, rgba(255,255,255,.06), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0));
}
.studio .panels{
  background:
    linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255,255,255,.08) 1px, transparent 1px);
  background-size: 120px 120px;
  opacity:.25;
  transform:skewY(-3deg);
}
.studio .monitors{
  position:absolute; left:6%; right:6%; bottom:20%; height:40%;
  display:grid; grid-template-columns: 1.1fr .9fr 1fr; gap:22px;
  opacity:.55;
}
.monitor{
  border-radius: 18px;
  border:1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.03));
  box-shadow: 0 20px 40px rgba(0,0,0,.38);
  overflow:hidden;
}
.monitor::before{
  content:""; display:block; height:100%;
  background:
    radial-gradient(280px 160px at 30% 25%, rgba(34,211,238,.28), transparent 60%),
    radial-gradient(260px 140px at 75% 55%, rgba(124,58,237,.26), transparent 60%),
    radial-gradient(260px 140px at 40% 75%, rgba(249,115,22,.18), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,0));
}
.studio .desk{
  position:absolute; left:-10%; right:-10%; bottom:-12%; height:36%;
  background:
    radial-gradient(900px 260px at 45% 12%, rgba(34,211,238,.18), transparent 55%),
    radial-gradient(900px 260px at 68% 30%, rgba(124,58,237,.16), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
  border-top:1px solid rgba(255,255,255,.14);
  box-shadow: 0 -24px 60px rgba(0,0,0,.55);
  transform: perspective(1200px) rotateX(14deg);
  border-radius: 44px 44px 0 0;
}

/* layout */
.wrap{position:relative; z-index:2;}
.container{max-width:var(--max); margin:0 auto; padding: 22px 18px 110px;}

.nav{
  display:flex; align-items:center; justify-content:space-between;
  gap:14px;
  padding: 14px;
  margin: 10px auto 0;
  border:1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.04));
  border-radius: 18px;
  box-shadow: var(--shadow2);
  backdrop-filter: blur(10px);
}
.brand{display:flex; align-items:center; gap:10px; min-width: 220px;}
.logo{
  width:40px; height:40px; border-radius: 14px;
  background:
    radial-gradient(16px 16px at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,0)),
    linear-gradient(135deg, var(--a), var(--b));
  box-shadow: var(--glowA), var(--glowB);
  border:1px solid rgba(255,255,255,.18);
}
.brand h1{font-size:14px; margin:0; letter-spacing:.3px}
.brand p{margin:0; font-size:12px; color:var(--muted2)}

.navlinks{display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end}
.navlinks a{
  text-decoration:none;
  font-size:13px;
  color:var(--muted);
  padding: 8px 10px;
  border-radius: 12px;
  border:1px solid transparent;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.navlinks a:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.14);
}

.hero{
  display:grid;
  grid-template-columns: 1.12fr .88fr;
  gap: 18px;
  margin-top: 18px;
  align-items:stretch;
}

/* key: darker glass for readability */
.card{
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(12,16,32,.78), rgba(10,14,28,.40));
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  overflow:hidden;
}
.card.section{
  background: linear-gradient(180deg, rgba(12,16,32,.84), rgba(10,14,28,.46));
}

.heroMain{padding: 26px 22px 22px; position:relative;}
.heroMain:before{
  content:"";
  position:absolute; inset:-2px;
  background:
    radial-gradient(520px 280px at 18% 16%, rgba(34,211,238,.22), transparent 60%),
    radial-gradient(520px 280px at 82% 26%, rgba(124,58,237,.22), transparent 60%),
    radial-gradient(520px 280px at 52% 84%, rgba(249,115,22,.18), transparent 60%);
  opacity:.9;
  pointer-events:none;
  filter:saturate(1.12);
}
.heroMain > *{position:relative; z-index:1}

.badgeRow{display:flex; gap:10px; flex-wrap:wrap; align-items:center}
.badge{
  display:inline-flex; align-items:center; gap:8px;
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: rgba(255,255,255,.88);
  border:1px solid rgba(255,255,255,.16);
  background: rgba(0,0,0,.14);
}
.dot{width:10px; height:10px; border-radius:999px; background: linear-gradient(135deg, var(--b), var(--a)); box-shadow: var(--glowB)}

.title{ margin: 14px 0 10px; font-size: clamp(28px, 3.8vw, 44px); line-height: 1.06; letter-spacing: -.5px; }
.subtitle{ margin: 0 0 16px; color: var(--muted); font-size: 15.5px; line-height: 1.55; max-width: 64ch; }

.ctaRow{display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin-top: 14px}
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:10px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.16);
  cursor:pointer;
  color: rgba(255,255,255,.94);
  background: rgba(255,255,255,.06);
  text-decoration:none;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
  box-shadow: 0 10px 22px rgba(0,0,0,.22);
}
.btn:hover{transform: translateY(-2px); box-shadow: 0 16px 30px rgba(0,0,0,.28); background: rgba(255,255,255,.09)}
.btnPrimary{
  background: linear-gradient(135deg, rgba(124,58,237,.98), rgba(34,211,238,.92));
  border-color: rgba(255,255,255,.18);
  box-shadow: var(--glowA), var(--glowB), 0 14px 30px rgba(0,0,0,.30);
}
.btnPrimary:hover{transform: translateY(-2px) scale(1.01)}
.btnSmall{padding: 10px 12px; border-radius: 14px; font-size: 13px}

.meta{display:flex; gap:12px; flex-wrap:wrap; margin-top: 14px; color: var(--muted2); font-size: 13px;}
.meta span{
  display:inline-flex; align-items:center; gap:8px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(0,0,0,.12);
  border:1px solid rgba(255,255,255,.12);
}

.heroSide{padding: 16px; display:flex; flex-direction:column; gap:14px;}

.infoCard{
  padding: 16px;
  border-radius: 20px;
  border:1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(0,0,0,.18), rgba(255,255,255,.03));
  box-shadow: 0 14px 28px rgba(0,0,0,.24);
  transition: transform .18s ease, border-color .18s ease;
}
.infoCard:hover{transform: translateY(-2px); border-color: rgba(255,255,255,.22)}
.infoCard h3{margin:0 0 8px; font-size: 15px}
.infoCard p{margin:0; color:var(--muted); line-height: 1.55; font-size: 13.5px}

.quickItem{
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.16);
  color: rgba(255,255,255,.86);
  font-size: 13px;
  display:flex;
  align-items:center;
  gap:10px;
}
.qdot{
  width:10px; height:10px; border-radius:999px;
  background: linear-gradient(135deg, var(--c), var(--d));
  box-shadow: var(--glowC);
  flex: 0 0 auto;
}

.section{margin-top: 18px; padding: 22px;}
.sectionHead{display:flex; align-items:flex-end; justify-content:space-between; gap:12px; flex-wrap:wrap}
.sectionHead h2{margin:0; font-size: 20px; letter-spacing: -.2px;}
.sectionHead p{margin:0; color:var(--muted); max-width: 72ch; line-height: 1.55}

.grid3{display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; margin-top: 14px}
.grid2{display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; margin-top: 14px}

.pill{
  display:inline-flex; align-items:center; gap:8px;
  padding: 8px 10px;
  border-radius: 999px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.12);
  color: rgba(255,255,255,.86);
  font-size: 12px;
}

/* Program */
.program{margin-top: 14px; display:grid; grid-template-columns: 1fr; gap: 12px;}
.lesson{
  position:relative;
  border-radius: 20px;
  border:1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
  box-shadow: 0 14px 30px rgba(0,0,0,.24);
  overflow:hidden;
}
.lesson::before{
  content:"";
  position:absolute; inset:0;
  background:
    radial-gradient(520px 220px at 10% 18%, rgba(34,211,238,.16), transparent 60%),
    radial-gradient(520px 220px at 90% 30%, rgba(124,58,237,.16), transparent 60%),
    radial-gradient(520px 220px at 40% 85%, rgba(249,115,22,.12), transparent 60%);
  opacity:.7;
  pointer-events:none;
}
.lessonInner{position:relative; padding: 16px; display:grid; grid-template-columns: 150px 1fr; gap:14px; align-items:stretch}

.lessonBadge{
  border-radius: 18px;
  border:1px solid rgba(255,255,255,.14);
  background:
    radial-gradient(200px 140px at 25% 30%, rgba(244,63,94,.20), transparent 60%),
    radial-gradient(220px 160px at 75% 70%, rgba(34,211,238,.18), transparent 60%),
    linear-gradient(180deg, rgba(0,0,0,.18), rgba(255,255,255,.03));
  min-height: 110px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  padding: 12px;
}
.lessonBadge .n{
  width:36px; height:36px; border-radius: 14px;
  display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, rgba(34,211,238,.92), rgba(124,58,237,.94));
  box-shadow: var(--glowB);
  border:1px solid rgba(255,255,255,.18);
  font-weight:800;
}
.lessonBadge .film{font-size:12px; color: rgba(255,255,255,.84); line-height:1.35}

.lessonTop{display:flex; align-items:flex-start; justify-content:space-between; gap:10px; flex-wrap:wrap}
.lessonTop h3{margin:0; font-size: 15.5px; letter-spacing: -.2px}
.lessonTop .tags{display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end}
.lessonBody{margin-top: 8px; color: var(--muted); line-height: 1.55; font-size: 13.5px}
.result{
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.12);
  color: rgba(255,255,255,.86);
  font-size: 13px;
}

.twoCol{display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top: 14px}

.bullets{
  margin: 10px 0 0; padding: 0; list-style: none;
  display:grid; gap: 10px;
}
.bullets li{
  display:flex; gap:10px;
  padding: 12px 12px;
  border-radius: 18px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
}
.bullets li .ic{
  width:34px; height:34px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(34,211,238,.92), rgba(124,58,237,.94));
  box-shadow: var(--glowB);
  flex: 0 0 auto;
  display:flex; align-items:center; justify-content:center;
  border:1px solid rgba(255,255,255,.18);
}
.bullets li .txt strong{display:block; margin-bottom: 2px; color: rgba(255,255,255,.92)}
.bullets li .txt{color: var(--muted); font-size: 13.5px; line-height: 1.45}

/* nice "journey" block without images */
.journey{
  border-radius: 22px;
  border:1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(0,0,0,.18), rgba(255,255,255,.03));
  box-shadow: 0 14px 28px rgba(0,0,0,.24);
  padding: 16px;
}
.route{
  margin-top: 12px;
  display:grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.stop{
  display:flex; align-items:center; justify-content:space-between;
  gap: 10px;
  padding: 12px 12px;
  border-radius: 18px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.12);
}
.stop strong{font-size: 13.5px}
.stop span{font-size: 12.5px; color: var(--muted)}
.stop .chip{
  padding: 8px 10px;
  border-radius: 999px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.88);
  font-size: 12px;
}

/* pricing */
.priceGrid{display:grid; grid-template-columns: 1.1fr .9fr; gap:14px; margin-top: 14px}
.priceBig{
  padding: 18px;
  border-radius: 22px;
  border:1px solid rgba(255,255,255,.16);
  background:
    radial-gradient(520px 240px at 15% 20%, rgba(34,211,238,.18), transparent 60%),
    radial-gradient(520px 240px at 85% 30%, rgba(124,58,237,.18), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.03));
  box-shadow: var(--shadow);
}
.priceBig h3{margin:0 0 10px; font-size: 16px}
.priceBig .num{font-size: 38px; letter-spacing: -.8px; margin: 2px 0 6px;}
.priceBig .sub{color: var(--muted); margin:0; line-height: 1.55}

.priceSide{
  padding: 18px;
  border-radius: 22px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  box-shadow: 0 14px 26px rgba(0,0,0,.24);
}
.priceSide h3{margin:0 0 10px; font-size: 16px}
.priceSide .num{font-size: 28px; margin: 2px 0 6px}
.priceSide p{margin:0; color: var(--muted); line-height:1.55}

.notice{
  margin-top: 14px;
  padding: 14px 14px;
  border-radius: 20px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.12);
  color: rgba(255,255,255,.86);
  line-height: 1.55;
}

/* sticky CTA */
.sticky{
  position:fixed; left:0; right:0; bottom:0;
  z-index: 50;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(7,10,19,0), rgba(7,10,19,.76) 22%, rgba(7,10,19,.92));
  backdrop-filter: blur(10px);
}
.stickyInner{
  max-width: var(--max);
  margin: 0 auto;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.14);
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
  box-shadow: var(--shadow);
  padding: 12px;
  display:flex; align-items:center; justify-content:space-between;
  gap: 10px;
}
.stickyInner .left{display:flex; flex-direction:column; gap:2px}
.stickyInner .left strong{font-size: 13.5px}
.stickyInner .left span{font-size: 12.5px; color: var(--muted)}
.stickyInner .right{display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:flex-end}

.hugeCta{
  padding: 14px 18px;
  border-radius: 18px;
  font-weight: 800;
  letter-spacing: .2px;
  background: linear-gradient(135deg, rgba(249,115,22,.96), rgba(244,63,94,.92));
  box-shadow: var(--glowC), 0 18px 34px rgba(0,0,0,.36);
  border:1px solid rgba(255,255,255,.18);
  transition: transform .18s ease, filter .18s ease;
}
.hugeCta:hover{transform: translateY(-2px) scale(1.01); filter:saturate(1.05)}

/* modal */
.modalOverlay{ position:fixed; inset:0; z-index: 80; background: rgba(0,0,0,.60); display:flex; align-items:center; justify-content:center; padding: 18px; }
.modal{ width:min(720px, 100%); border-radius: 24px; border:1px solid rgba(255,255,255,.16); background: linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,.05)); box-shadow: var(--shadow); backdrop-filter: blur(14px); overflow:hidden; }
.modalHead{ padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.12); display:flex; align-items:center; justify-content:space-between; gap: 10px; }
.modalHead strong{font-size: 14px}
.xbtn{ appearance:none; border:none; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.9); padding: 8px 10px; border-radius: 14px; cursor:pointer; transition: transform .18s ease, background .18s ease; }
.xbtn:hover{transform: translateY(-1px); background: rgba(255,255,255,.10)}
.modalBody{ padding: 16px; display:grid; grid-template-columns: 1fr 1fr; gap:12px }
.field{ display:flex; flex-direction:column; gap:6px }
.field label{ font-size: 12px; color: var(--muted2) }
.field input, .field textarea, .field select{
  width:100%;
  padding: 12px 12px;
  border-radius: 16px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.16);
  color: rgba(255,255,255,.92);
  outline:none;
}
.field textarea{ min-height: 96px; resize: vertical; grid-column: 1 / -1 }
.modalFoot{ padding: 14px 16px; border-top: 1px solid rgba(255,255,255,.12); display:flex; gap:10px; align-items:center; justify-content:flex-end; flex-wrap:wrap; }

/* responsive */
@media (max-width: 980px){
  .hero{grid-template-columns: 1fr;}
  .nav{flex-direction:column; align-items:stretch}
  .brand{min-width: unset}
  .navlinks{justify-content:flex-start}
  .grid3{grid-template-columns: 1fr}
  .grid2{grid-template-columns: 1fr}
  .priceGrid{grid-template-columns: 1fr}
  .lessonInner{grid-template-columns: 1fr;}
  .modalBody{grid-template-columns: 1fr}
  .twoCol{grid-template-columns: 1fr}
}

@media (prefers-reduced-motion: reduce){
  *{scroll-behavior:auto !important; transition:none !important; animation:none !important}
}
`;

function useEscape(onClose) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
}

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" };

  if (name === "spark")
    return (
      <svg {...common}>
        <path d="M12 2l1.1 6.1L19 9.2l-5.9 1.1L12 16l-1.1-5.7L5 9.2l5.9-1.1L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M19.5 14l.6 3.2 3.2.6-3.2.6-.6 3.2-.6-3.2-3.2-.6 3.2-.6.6-3.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );

  if (name === "play")
    return (
      <svg {...common}>
        <path d="M10 7l8 5-8 5V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );

  if (name === "rocket")
    return (
      <svg {...common}>
        <path d="M14 4c3 1 5 3 6 6-2 2-5 5-8 8-2 2-5 2-6 1-1-1-1-4 1-6 3-3 6-6 8-8z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 8l6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M7 17l-2 5 5-2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );

  if (name === "users")
    return (
      <svg {...common}>
        <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 21c1.6-3.4 5-5 8-5s6.4 1.6 8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );

  if (name === "mic")
    return (
      <svg {...common}>
        <path d="M12 14a3 3 0 003-3V7a3 3 0 00-6 0v4a3 3 0 003 3z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19 11a7 7 0 01-14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 18v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );

  if (name === "headphones")
    return (
      <svg {...common}>
        <path d="M4 13v3a3 3 0 003 3h1v-7H7a3 3 0 00-3 3z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 13v3a3 3 0 01-3 3h-1v-7h1a3 3 0 013 3z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );

  return null;
}

const lessonsData = [
  { n: 1, title: "Знакомство в Зверополисе", film: "Zootopia",
    about: "Учимся приветствовать, знакомиться и описывать животных на английском. Изучаем базовые фразы общения и характеристики персонажей.",
    result: "Озвучка сцены знакомства Джуди и Ника своими голосами." },
  { n: 2, title: "Подводный мир Немо", film: "Finding Nemo",
    about: "Изучаем семью, морских обитателей и предлоги места. Учимся описывать, где находятся предметы и персонажи.",
    result: "Создание и презентация собственного подводного мира с озвучкой на английском." },
  { n: 3, title: "Эмоции наизнанку", film: "Inside Out",
    about: "Осваиваем названия эмоций и учимся выражать чувства по-английски. Практикуем Present Continuous для описания действий.",
    result: "Видео-дневник эмоций — запись себя на камеру с описанием своих чувств на английском." },
  { n: 4, title: "Приключения игрушек", film: "Toy Story",
    about: "Изучаем названия игрушек, комнат и мебели, осваиваем модальный глагол can/can't. Учимся говорить о способностях и просить о помощи.",
    result: "Озвучка трейлера своей коллекции игрушек в стиле Toy Story." },
  { n: 5, title: "Моана: путь к мечте", film: "Moana",
    about: "Говорим о мечтах, планах и будущем, изучаем лексику о природе и путешествиях. Осваиваем конструкции \"I want to...\" и \"I'm going to...\".",
    result: "Видео-презентация «Моя мечта» с озвучкой песни \"How Far I'll Go\"." },
  { n: 6, title: "Магия семьи Мадригаль", film: "Encanto",
    about: "Изучаем членов семьи, описание дома и комнат, говорим о талантах и способностях. Практикуем описание людей и их особенностей.",
    result: "Озвученная презентация своего семейного древа с рассказом о каждом члене семьи." },
  { n: 7, title: "Холодное сердце", film: "Frozen",
    about: "Учим погоду, времена года, одежду и описание характера персонажей. Начинаем осваивать прошедшее время (Past Simple).",
    result: "Караоке-видео с песней \"Let It Go\" и создание собственной снежинки с английскими словами." },
  { n: 8, title: "Тайна Коко: семейная память", film: "Coco",
    about: "Практикуем Past Simple, учимся рассказывать истории из прошлого. Говорим о семейных традициях и праздниках.",
    result: "Видео-история о своей семье в стиле документального фильма с озвучкой на английском." },
  { n: 9, title: "Валл-И спасает планету", film: "WALL-E",
    about: "Изучаем экологическую лексику, говорим о будущем планеты и способах её защиты. Осваиваем степени сравнения прилагательных.",
    result: "Создание и озвучка социального видео-ролика «Спасём нашу планету»." },
  { n: 10, title: "Как приручить дракона", film: "How to Train Your Dragon",
    about: "Обобщаем все изученные темы: описание внешности, характера, действий и историй. Итоговое занятие с повторением всего курса.",
    result: "Финальный проект — озвучка любимой сцены из любого мультфильма курса и вручение сертификатов." },
];

function LessonCard({ lesson }) {
  return (
    <div className="lesson" id={`lesson-${lesson.n}`}>
      <div className="lessonInner">
        <div className="lessonBadge" aria-label={`Урок ${lesson.n}`}>
          <div className="n">{lesson.n}</div>
          <div className="film">
            <strong style={{ color: "rgba(255,255,255,.92)" }}>{lesson.film}</strong>
            <br />
            путешествие #{lesson.n}
          </div>
        </div>

        <div>
          <div className="lessonTop">
            <div>
              <h3>{lesson.n}. {lesson.title}</h3>
              <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="pill">Мультфильм: {lesson.film}</span>
                <span className="pill"><Icon name="spark" /> Практика речи</span>
              </div>
            </div>
            <div className="tags">
              <span className="pill">Проект</span>
              <span className="pill">Озвучка</span>
              <span className="pill">Лексика</span>
            </div>
          </div>
          <div className="lessonBody">{lesson.about}</div>
          <div className="result"><strong>Результат:</strong> {lesson.result}</div>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose }) {
  useEscape(() => { if (open) onClose(); });
  const overlayRef = useRef(null);
  if (!open) return null;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="Запись на курс"
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="modal">
        <div className="modalHead">
          <strong>Записаться на курс</strong>
          <button className="xbtn" onClick={onClose} aria-label="Закрыть">Закрыть</button>
        </div>
        <div className="modalBody">
          <div className="field">
            <label>Имя родителя</label>
            <input placeholder="Например: Анна" />
          </div>
          <div className="field">
            <label>Телефон / мессенджер</label>
            <input placeholder="Например: +7 (999) 123-45-67" />
          </div>
          <div className="field">
            <label>Возраст ребёнка</label>
            <select defaultValue="">
              <option value="" disabled>Выберите</option>
              {Array.from({ length: 10 }, (_, i) => 7 + i).map((age) => (
                <option key={age} value={String(age)}>{age}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Уровень английского</label>
            <select defaultValue="">
              <option value="" disabled>Выберите</option>
              <option>Начинающий</option>
              <option>Продолжающий</option>
              <option>Не уверены — подскажете на диагностике</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Комментарий</label>
            <textarea placeholder="Например: удобные дни/время, опыт ребёнка, пожелания..." />
            <div style={{ marginTop: 8, color: "var(--muted2)", fontSize: 12.5, lineHeight: 1.45 }}>
              Это демонстрационная форма. Подключите отправку в Telegram/почту или замените кнопку на ссылку на Google Forms.
            </div>
          </div>
        </div>
        <div className="modalFoot">
          <button className="btn btnSmall" onClick={onClose}>Отмена</button>
          <a
            className="btn btnPrimary btnSmall"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Заявка отправлена! (демо)");
              onClose();
            }}
          >
            <Icon name="rocket" /> Отправить заявку
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => [
    { t: "Для кого", v: "7–16 лет" },
    { t: "Формат", v: "Zoom + проекты" },
    { t: "Группы", v: "до 6 детей" },
    { t: "Уроков", v: "10 занятий" },
  ], []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      <div className="studio" aria-hidden="true">
        <div className="layer bg" />
        <div className="layer panels" />
        <div className="layer monitors">
          <div className="monitor" />
          <div className="monitor" />
          <div className="monitor" />
        </div>
        <div className="desk" />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="wrap">
        <div className="container">
          <header className="nav">
            <div className="brand">
              <div className="logo" aria-hidden="true" />
              <div>
                <h1>Репетитор английского • Детские группы</h1>
                <p>Курс по мультфильмам — ярко, живо, разговорно</p>
              </div>
            </div>
            <nav className="navlinks" aria-label="Навигация">
              <a href="#about">О курсе</a>
              <a href="#forwho">Для кого</a>
              <a href="#program">Программа</a>
              <a href="#benefits">Почему любят</a>
              <a href="#needs">Что потребуется</a>
              <a href="#price">Стоимость</a>
              <a href="#apply" onClick={(e) => { e.preventDefault(); setOpen(true); }}>Запись</a>
            </nav>
          </header>

          <section className="hero">
            <div className="card heroMain">
              <div className="badgeRow">
                <span className="badge"><span className="dot" /> Английский по мультфильмам</span>
                <span className="badge"><Icon name="spark" /> Озвучка, проекты, творчество</span>
              </div>

              <h2 className="title">Курс «Английский по мультфильмам»</h2>
              <p className="subtitle">
                Забудьте о скучных учебниках и зубрёжке! Наш курс превращает изучение английского
                в увлекательное приключение вместе с любимыми мультфильмами Disney, Pixar, DreamWorks и не только.
              </p>

              <div className="ctaRow">
                <a className="btn btnPrimary" href="#apply" onClick={(e) => { e.preventDefault(); setOpen(true); }}>
                  <Icon name="rocket" /> Записаться на курс
                </a>
                <a className="btn" href="#program"><Icon name="play" /> Смотреть программу</a>
              </div>

              <div className="meta" aria-label="Ключевые факты">
                {stats.map((s) => (
                  <span key={s.t}><strong style={{ color: "rgba(255,255,255,.92)" }}>{s.t}:</strong>{" "}{s.v}</span>
                ))}
              </div>

              <div style={{ marginTop: 12, color: "var(--muted2)", fontSize: 12.5, lineHeight: 1.45 }}>
                Акцент на разговорной речи, эмоциях и юморе. Каждый урок заканчивается результатом: озвучка, мини-видео или проект.
              </div>
            </div>

            <aside className="card heroSide">
              <div className="infoCard">
                <h3 style={{ margin: 0 }}>Что будет на занятиях</h3>
                <p style={{ marginTop: 8 }}>
                  Короткие сцены, роли, повторение за героями и творческий итог каждый раз.
                </p>
                <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                  <li className="quickItem"><span className="qdot" /> Озвучка и запись голоса</li>
                  <li className="quickItem"><span className="qdot" /> Живые фразы и эмоции</li>
                  <li className="quickItem"><span className="qdot" /> Мини-проекты и презентации</li>
                  <li className="quickItem"><span className="qdot" /> Понимание без субтитров (постепенно)</li>
                </ul>
              </div>

              <div className="infoCard">
                <h3>Формат и забота</h3>
                <p>
                  Маленькие группы, понятный темп, много практики. Подбираю мультфильмы по возрасту и уровню.
                </p>
                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span className="pill"><Icon name="users" /> До 6 детей</span>
                  <span className="pill"><Icon name="headphones" /> Zoom</span>
                  <span className="pill"><Icon name="mic" /> Озвучка</span>
                </div>
              </div>
            </aside>
          </section>

          <section id="about" className="card section">
            <div className="sectionHead">
              <div>
                <h2>О курсе</h2>
                <p>
                  Изучаем английский через диалоги, эмоции и юмор — так, как он звучит в реальной жизни. Каждое занятие
                  заканчивается творческим результатом: озвучкой, мини-видео или проектом.
                </p>
              </div>
              <span className="pill"><Icon name="spark" /> «Учиться хочется ещё»</span>
            </div>

            <div className="grid3">
              <div className="infoCard">
                <h3>Разговорный английский</h3>
                <p>Не книжные фразы, а настоящий язык: интонации, реакция, живые реплики.</p>
              </div>
              <div className="infoCard">
                <h3>Произношение как у героев</h3>
                <p>Повторяя за персонажами, дети естественно ловят ритм, ударения и мелодику речи.</p>
              </div>
              <div className="infoCard">
                <h3>Словарь, который работает</h3>
                <p>Только современная лексика из сцен, которую можно применять в реальной жизни.</p>
              </div>
            </div>
          </section>

          <section id="forwho" className="card section">
            <div className="sectionHead">
              <div>
                <h2>📌 Для кого курс</h2>
                <p>
                  Для детей от 7 до 16 лет с любым уровнем английского — от начинающих до продолжающих. Мы подбираем
                  мультфильмы под возраст и уровень каждой группы.
                </p>
              </div>
              <span className="pill"><Icon name="users" /> Маленькие группы до 6</span>
            </div>

            <div className="grid2">
              <div className="infoCard">
                <h3>Подходит новичкам</h3>
                <p>Много опоры на визуал, повторение по ролям и понятные структуры фраз.</p>
              </div>
              <div className="infoCard">
                <h3>Интересно продолжающим</h3>
                <p>Диалоги, эмоции, шутки, скорость речи — то, что обычно сложно тренировать по учебнику.</p>
              </div>
            </div>
          </section>

          <section id="program" className="card section">
            <div className="sectionHead">
              <div>
                <h2>📚 Программа курса (10 уроков)</h2>
                <p>Каждый урок — отдельное путешествие в мир мультфильма. В конце — результат, которым ребёнок гордится.</p>
              </div>
              <span className="pill"><Icon name="play" /> Сцены • Озвучка • Проекты</span>
            </div>

            <div className="program">
              {lessonsData.map((l) => <LessonCard key={l.n} lesson={l} />)}
            </div>
          </section>

          <section id="benefits" className="card section">
            <div className="sectionHead">
              <div>
                <h2>✨ Почему дети обожают этот курс?</h2>
                <p>
                  Мы учимся на том, что и так хочется смотреть! «Холодное сердце», «Король Лев», «Моана», «Зверополис»,
                  «Как приручить дракона» — все эти шедевры становятся учителями английского.
                </p>
              </div>
              <span className="pill"><Icon name="spark" /> Мотивация включается сама</span>
            </div>

            <div className="twoCol">
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>Что получает ваш ребёнок?</h3>
                <ul className="bullets">
                  <li>
                    <div className="ic" aria-hidden="true"><Icon name="mic" /></div>
                    <div className="txt"><strong>Живой разговорный английский</strong>Разбираем диалоги, юмор, эмоции персонажей и учимся говорить естественно.</div>
                  </li>
                  <li>
                    <div className="ic" aria-hidden="true"><Icon name="spark" /></div>
                    <div className="txt"><strong>Произношение как у героев</strong>Дети незаметно осваивают правильную интонацию, акцент и ритм английской речи.</div>
                  </li>
                  <li>
                    <div className="ic" aria-hidden="true"><Icon name="rocket" /></div>
                    <div className="txt"><strong>Словарный запас, который реально используется</strong>Никаких устаревших слов — только современная лексика.</div>
                  </li>
                  <li>
                    <div className="ic" aria-hidden="true"><Icon name="headphones" /></div>
                    <div className="txt"><strong>Понимание на слух без субтитров</strong>Постепенно ребёнок начнёт понимать английскую речь в фильмах и видео без перевода.</div>
                  </li>
                </ul>
              </div>

              <div className="journey">
                <h3 style={{ margin: 0, fontSize: 16 }}>Путешествие по мультмирам</h3>
                <div style={{ marginTop: 8, color: "var(--muted)", lineHeight: 1.55, fontSize: 13.5 }}>
                  Без картинок — но с атмосферой: каждая тема как «остановка» маршрута. Дети чувствуют прогресс и ждут следующую серию.
                </div>
                <div className="route">
                  <div className="stop">
                    <div>
                      <strong>Moana</strong>
                      <div style={{ marginTop: 2 }}><span>мечты • планы • будущее</span></div>
                    </div>
                    <div className="chip">I’m going to…</div>
                  </div>
                  <div className="stop">
                    <div>
                      <strong>Inside Out</strong>
                      <div style={{ marginTop: 2 }}><span>эмоции • Present Continuous</span></div>
                    </div>
                    <div className="chip">I’m feeling…</div>
                  </div>
                  <div className="stop">
                    <div>
                      <strong>Frozen</strong>
                      <div style={{ marginTop: 2 }}><span>погода • одежда • Past Simple</span></div>
                    </div>
                    <div className="chip">I went…</div>
                  </div>
                  <div className="stop">
                    <div>
                      <strong>WALL‑E</strong>
                      <div style={{ marginTop: 2 }}><span>экология • сравнения</span></div>
                    </div>
                    <div className="chip">bigger / better</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="needs" className="card section">
            <div className="sectionHead">
              <div>
                <h2>💻 Что потребуется</h2>
                <p>Минимальный набор для комфортных занятий и качественного звучания.</p>
              </div>
              <span className="pill"><Icon name="headphones" /> Zoom-ready</span>
            </div>

            <div className="grid3">
              <div className="infoCard">
                <h3>Компьютер / ноутбук</h3>
                <p>Стационарный компьютер или ноутбук — так ребёнку удобнее работать и озвучивать.</p>
              </div>
              <div className="infoCard">
                <h3>Наушники и микрофон</h3>
                <p>Чтобы хорошо слышать реплики и записывать озвучку чисто и уверенно.</p>
              </div>
              <div className="infoCard">
                <h3>Интернет и Zoom</h3>
                <p>Стабильный интернет и Zoom для онлайн-встреч и совместной работы.</p>
              </div>
            </div>
          </section>

          <section id="price" className="card section">
            <div className="sectionHead">
              <div>
                <h2>💳 Стоимость</h2>
                <p>Прозрачные цены без скрытых доплат.</p>
              </div>
              <span className="pill"><Icon name="spark" /> Оплата удобным способом</span>
            </div>

            <div className="priceGrid">
              <div className="priceBig">
                <h3>Полный курс (10 уроков)</h3>
                <div className="num">12 000 руб</div>
                <p className="sub">10 занятий + проекты + финальная озвучка любимой сцены и сертификаты.</p>
                <div className="notice" style={{ marginTop: 12 }}>
                  <strong>📢 Набор открыт!</strong> Группы маленькие — максимум 6 детей, чтобы каждый получил внимание.<br />
                  <strong>Места ограничены!</strong>
                </div>
              </div>

              <div className="priceSide">
                <h3>Абонемент</h3>
                <div className="num">1 300 руб / урок</div>
                <p>Если удобнее оплачивать по занятиям — этот вариант для вас.</p>
                <div className="notice" style={{ marginTop: 12 }}>
                  Английский может быть волшебным — позвольте вашему ребёнку убедиться в этом!
                </div>
              </div>
            </div>
          </section>

          <footer className="card section" style={{ marginBottom: 24 }}>
            <div className="sectionHead">
              <div>
                <h2>Контакты репетитора</h2>
                <p>Вставьте свои контакты: Telegram/WhatsApp/телефон/ссылку на запись. Можно также добавить отзывы.</p>
              </div>
              <span className="pill">✨ Добавьте ваши ссылки</span>
            </div>

            <div className="grid3">
              <div className="infoCard"><h3>Telegram</h3><p>Ссылка или @ник</p></div>
              <div className="infoCard"><h3>WhatsApp</h3><p>Номер телефона</p></div>
              <div className="infoCard"><h3>Диагностика</h3><p>Короткое знакомство и подбор группы по уровню</p></div>
            </div>
          </footer>
        </div>

        <div className="sticky" id="apply">
          <div className="stickyInner">
            <div className="left">
              <strong>Курс «Английский по мультфильмам»</strong>
              <span>Набор открыт • группы до 6 • 7–16 лет</span>
            </div>
            <div className="right">
              <a className="btn btnSmall" href="#program"><Icon name="play" /> Программа</a>
              <button className="btn hugeCta" onClick={() => setOpen(true)}>Записаться на курс</button>
            </div>
          </div>
        </div>

        <Modal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
