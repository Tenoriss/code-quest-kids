import{r as x,j as e,m as d}from"./framer-motion-BueYMSic.js";import{u as b,L as h}from"./react-vendor-rvr8HjSE.js";import{B as p}from"./use-speech-C88n6UTr.js";import{a as y,b as w}from"./index-CLLs5_FE.js";import{N as j}from"./Navbar-Cq1fHPUg.js";import{F as N}from"./Footer-CvjtmWk4.js";import{A as k}from"./AIAssistant-BNw8HcyX.js";import{A as v}from"./award-BB-P1if9.js";import{D as S}from"./download-BUPN0And.js";import{A as C}from"./arrow-left-D9Edfs2x.js";import"./radix-ui-B82NCydf.js";import"./charts-DhwjuEAf.js";import"./trophy-i4g8pn8W.js";import"./user-CXog_xim.js";import"./code-Dj9sJfMF.js";function T(a){return`
    <div style="
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        inset: 15px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 20px;
        pointer-events: none;
      "></div>
      <div style="font-size: 40px; margin-bottom: 10px;">🏆</div>
      <h1 style="font-size: 48px; margin: 10px 0; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        Certificate of Completion
      </h1>
      <p style="font-size: 18px; opacity: 0.9; margin: 5px 0;">This certificate is proudly awarded to</p>
      <h2 style="font-size: 42px; margin: 15px 0; font-weight: 700; border-bottom: 3px solid rgba(255,255,255,0.5); padding-bottom: 10px;">
        ${a.studentName}
      </h2>
      <p style="font-size: 18px; opacity: 0.9; margin: 5px 0;">For completing</p>
      <h3 style="font-size: 28px; margin: 10px 0; font-weight: 600;">
        ${a.course}
      </h3>
      <p style="font-size: 16px; opacity: 0.8; margin: 5px 0;">with a score of ${a.score}</p>
      <div style="
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        width: 80%;
        font-size: 14px;
        opacity: 0.8;
      ">
        <span>Date: ${a.date}</span>
        <span>Code Quest Kids</span>
      </div>
    </div>
  `}function D(a){const r=document.createElement("div");r.innerHTML=T(a),document.body.appendChild(r);const n=document.createElement("canvas");n.width=800,n.height=600;const t=n.getContext("2d");if(!t){document.body.removeChild(r);return}const o=t.createLinearGradient(0,0,800,600);o.addColorStop(0,"#667eea"),o.addColorStop(1,"#764ba2"),t.fillStyle=o,t.fillRect(0,0,800,600),t.strokeStyle="rgba(255,255,255,0.3)",t.lineWidth=3,t.strokeRect(15,15,770,570),t.fillStyle="white",t.font="bold 48px 'Segoe UI', sans-serif",t.textAlign="center",t.fillText("🏆",400,80),t.font="bold 44px 'Segoe UI', sans-serif",t.fillText("Certificate of",400,160),t.fillText("Completion",400,215),t.font="18px 'Segoe UI', sans-serif",t.fillStyle="rgba(255,255,255,0.9)",t.fillText("This certificate is proudly awarded to",400,270),t.font="bold 42px 'Segoe UI', sans-serif",t.fillStyle="white",t.fillText(a.studentName,400,340),t.font="18px 'Segoe UI', sans-serif",t.fillStyle="rgba(255,255,255,0.9)",t.fillText("For completing",400,390),t.font="bold 28px 'Segoe UI', sans-serif",t.fillStyle="white",t.fillText(a.course,400,435),t.font="16px 'Segoe UI', sans-serif",t.fillStyle="rgba(255,255,255,0.8)",t.fillText("with a score of "+a.score,400,475),t.font="14px 'Segoe UI', sans-serif",t.fillStyle="rgba(255,255,255,0.8)",t.textAlign="left",t.fillText("Date: "+a.date,100,540),t.textAlign="right",t.fillText("Code Quest Kids",700,540);const i=document.createElement("a");i.download=`certificate-${a.studentName}.png`,i.href=n.toDataURL("image/png"),i.click(),document.body.removeChild(r)}function Q(){const{lang:a}=y(),{state:r}=w(),t=b().state,o=t?.name||"",i=t?.score||`${Math.max(...r.quizScores.map(s=>s.score),0)}/${Math.max(...r.quizScores.map(s=>s.total),10)}`,[l,g]=x.useState(o),[c,m]=x.useState(!1),f=()=>{if(!l.trim())return;m(!0);const s={studentName:l.trim(),date:new Date().toLocaleDateString(),course:"Sequence & Algorithm - Beginner 1",score:i};D(s),setTimeout(()=>m(!1),1e3)},u=new Date().toLocaleDateString(a==="en"?"en-US":"id-ID",{year:"numeric",month:"long",day:"numeric"});return e.jsxs("div",{className:"min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-yellow-50/20 dark:from-gray-950 dark:via-amber-950/5 dark:to-yellow-950/5",children:[e.jsx(j,{}),e.jsx(k,{type:"celebrate",message:a==="en"?"Congratulations! You've completed the course! Claim your certificate!":"Selamat! Kamu telah menyelesaikan kursus! Ambil sertifikatmu!",autoSpeak:!0}),e.jsx("main",{className:"pt-32 pb-20 px-4",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs(d.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},className:"text-center mb-12",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-lg mb-6",children:e.jsx(v,{className:"w-8 h-8"})}),e.jsx("h1",{className:"text-4xl sm:text-5xl font-bold mb-4",children:e.jsx("span",{className:"bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent",children:a==="en"?"Your Certificate":"Sertifikatmu"})}),e.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:a==="en"?"You've earned it! Fill in your name and download your certificate.":"Kamu telah mendapatkannya! Isi namamu dan unduh sertifikatmu."})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 items-start",children:[e.jsx(d.div,{initial:{opacity:0,x:-30},animate:{opacity:1,x:0},transition:{delay:.2},className:"bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700",children:e.jsxs("div",{className:"bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 text-white text-center relative",children:[e.jsx("div",{className:"absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none"}),e.jsx("div",{className:"absolute inset-8 border border-white/10 rounded-lg pointer-events-none"}),e.jsx(d.div,{animate:{y:[0,-5,0]},transition:{duration:3,repeat:1/0},className:"text-6xl mb-4",children:"🏆"}),e.jsxs("h2",{className:"text-3xl font-bold mb-2",children:[a==="en"?"Certificate of":"Sertifikat",e.jsx("br",{}),a==="en"?"Completion":"Penyelesaian"]}),e.jsx("p",{className:"text-sm opacity-80 mt-2",children:a==="en"?"This certificate is proudly awarded to":"Sertifikat ini dengan bangga diberikan kepada"}),e.jsx("div",{className:"my-4 py-2 px-6 bg-white/10 rounded-lg backdrop-blur-sm",children:e.jsx("p",{className:"text-2xl font-bold",children:l||(a==="en"?"Your Name":"Nama Kamu")})}),e.jsx("p",{className:"text-sm opacity-80",children:a==="en"?"For completing":"Untuk menyelesaikan"}),e.jsxs("h3",{className:"text-xl font-bold mt-1",children:["Sequence & Algorithm",e.jsx("br",{}),"(Beginner 1 - Meeting 2)"]}),e.jsxs("p",{className:"text-sm opacity-80 mt-1",children:[a==="en"?"with a score of":"dengan skor"," ",i]}),e.jsxs("div",{className:"flex justify-between mt-6 text-xs opacity-70 px-4",children:[e.jsxs("span",{children:[a==="en"?"Date: ":"Tanggal: ",u]}),e.jsx("span",{children:"Code Quest Kids"})]})]})}),e.jsxs(d.div,{initial:{opacity:0,x:30},animate:{opacity:1,x:0},transition:{delay:.3},className:"bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30",children:[e.jsx("h3",{className:"font-bold text-lg mb-4 text-gray-800 dark:text-gray-100",children:a==="en"?"Generate Your Certificate":"Buat Sertifikatmu"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-gray-500 mb-1 block",children:a==="en"?"Your Name":"Nama Kamu"}),e.jsx("input",{type:"text",value:l,onChange:s=>g(s.target.value),placeholder:a==="en"?"Enter your full name":"Masukkan nama lengkap",className:"w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-gray-500 mb-1 block",children:a==="en"?"Course":"Kursus"}),e.jsx("div",{className:"px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700",children:"Sequence & Algorithm (Beginner 1 - Meeting 2)"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-gray-500 mb-1 block",children:a==="en"?"Score":"Skor"}),e.jsx("div",{className:"px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-blue-600 border border-gray-200 dark:border-gray-700",children:i})]}),e.jsxs(p,{onClick:f,disabled:!l.trim()||c,className:"w-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white h-12 shadow-lg disabled:opacity-50",children:[e.jsx(S,{className:"w-4 h-4 mr-2"}),c?a==="en"?"Generating...":"Membuat...":a==="en"?"Download Certificate (PNG)":"Unduh Sertifikat (PNG)"]}),e.jsx("p",{className:"text-xs text-gray-400 text-center",children:a==="en"?"Your certificate will be downloaded as a PNG image.":"Sertifikatmu akan diunduh sebagai gambar PNG."})]})]})]}),e.jsx("div",{className:"text-center mt-8",children:e.jsx(h,{to:"/dashboard",children:e.jsxs(p,{variant:"outline",className:"rounded-full",children:[e.jsx(C,{className:"w-4 h-4 mr-2"})," ",a==="en"?"Back to Dashboard":"Kembali ke Dasbor"]})})})]})}),e.jsx(N,{})]})}export{Q as default};
