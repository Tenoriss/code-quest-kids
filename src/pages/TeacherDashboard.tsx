import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, TrendingUp, Award, Calendar, BarChart3, BookOpen, CheckCircle2,
  Search, Download, Star, Flame, Zap, Clock, Target, GraduationCap,
  PieChart, Activity, ChevronDown, X, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Byte } from "@/components/layout/Byte";

// Types
interface LessonInfo {
  id: string;
  title: { en: string; id: string };
  icon: string;
  category: string;
}
interface StudentData {
  id: number; name: { en: string; id: string }; nickname: string; email: string;
  grade: number; avatar: string; xp: number; level: number; completed: string[];
  streak: number; quizScores: { score: number; total: number; date: string }[];
  totalTime: number; lastActive: string; achievements: string[]; country: string;
  attendance: number[];
}
type TabView = "overview" | "students" | "analytics" | "attendance";
type SortField = "name" | "xp" | "level" | "streak" | "grade" | "completed";
interface AnalyticsData {
  total: number; avgXP: number; avgLevel: number; avgScore: number;
  totalLessons: number; avgStreak: number; totalTime: number; activeToday: number;
  lessonRates: (LessonInfo & { completed: number; rate: number })[];
  gradeDist: Record<number, number>;
  xpRanges: { range: string; count: number }[];
}

// Data
const LESSONS: LessonInfo[] = [
  { id:"sequence_lesson", title:{en:"What is Sequence?",id:"Apa itu Urutan?"}, icon:"📋", category:"lesson" },
  { id:"sequence_game", title:{en:"Sequence Game",id:"Game Urutan"}, icon:"🎮", category:"game" },
  { id:"algorithm_lesson", title:{en:"What is Algorithm?",id:"Apa itu Algoritma?"}, icon:"💡", category:"lesson" },
  { id:"algorithm_game", title:{en:"Algorithm Game",id:"Game Algoritma"}, icon:"🎯", category:"game" },
  { id:"practice", title:{en:"Practice",id:"Latihan"}, icon:"✏️", category:"practice" },
  { id:"quiz", title:{en:"Quiz",id:"Kuis"}, icon:"🧠", category:"quiz" },
];
const WEEKDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const STUDENTS: StudentData[] = [
  { id:1, name:{en:"Alice Johnson",id:"Alice Johnson"}, nickname:"Ali", email:"alice@ex.com", grade:4, avatar:"A", xp:450, level:5, completed:["sequence_lesson","sequence_game","algorithm_lesson","algorithm_game","practice","quiz"], streak:12, quizScores:[{score:10,total:10,date:"2026-07-20"},{score:9,total:10,date:"2026-07-15"},{score:8,total:10,date:"2026-07-10"}], totalTime:185, lastActive:"2026-07-22", achievements:["first_lesson","five_lessons","perfect_quiz","sequence_master","algorithm_whiz","collector"], country:"USA", attendance:[92,95,88,96,90,75,50] },
  { id:2, name:{en:"Bob Martinez",id:"Bob Martinez"}, nickname:"Bob", email:"bob@ex.com", grade:5, avatar:"B", xp:380, level:4, completed:["sequence_lesson","sequence_game","algorithm_lesson","algorithm_game","practice"], streak:8, quizScores:[{score:8,total:10,date:"2026-07-19"},{score:7,total:10,date:"2026-07-12"}], totalTime:150, lastActive:"2026-07-21", achievements:["first_lesson","sequence_master"], country:"Mexico", attendance:[85,90,82,88,92,60,30] },
  { id:3, name:{en:"Charlie Kim",id:"Charlie Kim"}, nickname:"Charlie", email:"charlie@ex.com", grade:3, avatar:"C", xp:290, level:3, completed:["sequence_lesson","sequence_game","algorithm_lesson"], streak:5, quizScores:[{score:6,total:10,date:"2026-07-18"}], totalTime:95, lastActive:"2026-07-20", achievements:["first_lesson"], country:"South Korea", attendance:[78,85,72,90,80,55,20] },
  { id:4, name:{en:"Diana Patel",id:"Diana Patel"}, nickname:"Di", email:"diana@ex.com", grade:4, avatar:"D", xp:220, level:3, completed:["sequence_lesson","sequence_game"], streak:3, quizScores:[{score:5,total:10,date:"2026-07-16"}], totalTime:65, lastActive:"2026-07-19", achievements:["first_lesson"], country:"India", attendance:[70,75,65,80,72,40,15] },
  { id:5, name:{en:"Ethan Williams",id:"Ethan Williams"}, nickname:"E", email:"ethan@ex.com", grade:2, avatar:"E", xp:150, level:2, completed:["sequence_lesson"], streak:1, quizScores:[], totalTime:30, lastActive:"2026-07-17", achievements:[], country:"UK", attendance:[65,70,55,72,60,35,10] },
  { id:6, name:{en:"Fiona Chen",id:"Fiona Chen"}, nickname:"Fi", email:"fiona@ex.com", grade:5, avatar:"F", xp:510, level:6, completed:["sequence_lesson","sequence_game","algorithm_lesson","algorithm_game","practice","quiz"], streak:15, quizScores:[{score:10,total:10,date:"2026-07-21"},{score:10,total:10,date:"2026-07-14"}], totalTime:210, lastActive:"2026-07-22", achievements:["first_lesson","five_lessons","perfect_quiz","sequence_master","algorithm_whiz","collector","ten_streak"], country:"China", attendance:[98,95,100,92,96,85,60] },
  { id:7, name:{en:"George Brown",id:"George Brown"}, nickname:"Geo", email:"george@ex.com", grade:3, avatar:"G", xp:180, level:2, completed:["sequence_lesson","sequence_game"], streak:2, quizScores:[{score:4,total:10,date:"2026-07-15"}], totalTime:45, lastActive:"2026-07-18", achievements:["first_lesson"], country:"Canada", attendance:[55,60,48,65,58,30,5] },
  { id:8, name:{en:"Hannah Lee",id:"Hannah Lee"}, nickname:"Han", email:"hannah@ex.com", grade:4, avatar:"H", xp:340, level:4, completed:["sequence_lesson","sequence_game","algorithm_lesson","algorithm_game","practice"], streak:7, quizScores:[{score:7,total:10,date:"2026-07-17"},{score:8,total:10,date:"2026-07-11"}], totalTime:120, lastActive:"2026-07-21", achievements:["first_lesson","sequence_master"], country:"Australia", attendance:[82,86,78,90,84,65,35] },
];

// Helpers
const loc = (o: {en:string;id:string}, l:string) => o[l as "en"|"id"];
const grdCol = (g:number) => ({1:"bg-red-100 text-red-600",2:"bg-orange-100 text-orange-600",3:"bg-yellow-100 text-yellow-600",4:"bg-green-100 text-green-600",5:"bg-blue-100 text-blue-600",6:"bg-purple-100 text-purple-600",7:"bg-pink-100 text-pink-600",8:"bg-indigo-100 text-indigo-600"}[g] || "bg-gray-100 text-gray-600");
const scrCol = (s:number) => s >= 90 ? "text-green-500" : s >= 70 ? "text-yellow-500" : "text-red-500";
const strEm = (s:number) => s >= 10 ? "🔥" : s >= 5 ? "⭐" : s >= 1 ? "✨" : "🌱";

function analytics(students: StudentData[]): AnalyticsData {
  const t=students.length, aX=Math.round(students.reduce((s,st)=>s+st.xp,0)/t),
    aL=Math.round(students.reduce((s,st)=>s+st.level,0)*10/t)/10,
    sc=students.filter(s=>s.quizScores.length>0),
    aSc=sc.length>0?Math.round(sc.reduce((s,st)=>s+(st.quizScores[0]?.score||0)/(st.quizScores[0]?.total||10)*100,0)/sc.length):0,
    tL=students.reduce((s,st)=>s+st.completed.length,0),
    aSt=Math.round(students.reduce((s,st)=>s+st.streak,0)*10/t)/10,
    tT=students.reduce((s,st)=>s+st.totalTime,0),
    aT=students.filter(s=>s.lastActive==="2026-07-22").length,
    lR=LESSONS.map(l=>({...l,completed:students.filter(s=>s.completed.includes(l.id)).length,rate:Math.round(students.filter(s=>s.completed.includes(l.id)).length/t*100)})),
    gD=students.reduce((a:Record<number,number>,s)=>{a[s.grade]=(a[s.grade]||0)+1;return a;},{});
  return {total:t,avgXP:aX,avgLevel:aL,avgScore:aSc,totalLessons:tL,avgStreak:aSt,totalTime:tT,activeToday:aT,lessonRates:lR,gradeDist:gD,xpRanges:[{range:"0-100",count:students.filter(s=>s.xp<=100).length},{range:"101-250",count:students.filter(s=>s.xp>100&&s.xp<=250).length},{range:"251-400",count:students.filter(s=>s.xp>250&&s.xp<=400).length},{range:"400+",count:students.filter(s=>s.xp>400).length}]};
}

// MAIN
export default function TeacherDashboard() {
  const {lang} = useLanguage();
  const [tab, setTab] = useState<TabView>("overview");
  const [q, setQ] = useState(""); const [sf, setSf] = useState<SortField>("xp"); const [sa, setSa] = useState(false);
  const [gf, setGf] = useState<number|null>(null); const [sel, setSel] = useState<StudentData|null>(null); const [sd, setSd] = useState(false);
  const [aw, setAw] = useState(0); const [ad, setAd] = useState(false);
  const students = useMemo(()=>STUDENTS,[]);
  const an = useMemo(()=>analytics(students),[students]);
  const filtered = useMemo(()=>{
    let r=[...students];
    if(q){const l=q.toLowerCase();r=r.filter(s=>s.name.en.toLowerCase().includes(l)||s.nickname.toLowerCase().includes(l)||s.email.toLowerCase().includes(l));}
    if(gf!==null)r=r.filter(s=>s.grade===gf);
    r.sort((a,b)=>{let c=0;switch(sf){case"name":c=a.name.en.localeCompare(b.name.en);break;case"xp":c=a.xp-b.xp;break;case"level":c=a.level-b.level;break;case"streak":c=a.streak-b.streak;break;case"grade":c=a.grade-b.grade;break;case"completed":c=a.completed.length-b.completed.length;break;}return sa?c:-c;});
    return r;
  },[students,q,sf,sa,gf]);
  const tog=(f:SortField)=>{if(sf===f)setSa(!sa);else{setSf(f);setSa(false);}};

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/20 to-teal-50/20 dark:from-gray-950 dark:via-emerald-950/5 dark:to-teal-950/5">
      <Navbar />
      <Byte mood="wave" message={lang==="en"?"Welcome, Teacher! Here's your class overview.":"Selamat datang, Guru!"} autoSpeak />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2"><span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{lang==="en"?"Teacher Dashboard":"Dasbor Guru"}</span></h1>
                <p className="text-gray-500 dark:text-gray-400">{lang==="en"?"Monitor student progress, quiz scores, and class analytics.":"Pantau kemajuan siswa, skor kuis, dan analitik kelas."}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs"><GraduationCap className="w-3 h-3 mr-1"/>{an.total} {lang==="en"?"Students":"Siswa"}</Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs bg-green-50 text-green-600 border-green-200"><Zap className="w-3 h-3 mr-1"/>{an.activeToday} {lang==="en"?"Active Today":"Aktif Hari Ini"}</Badge>
              </div>
            </div>
          </motion.div>
          <div className="flex gap-1 mb-8 bg-white/50 dark:bg-gray-800/30 rounded-2xl p-1 border border-gray-200/50 dark:border-gray-700/30 max-w-lg">
            {([["overview",Activity,{en:"Overview",id:"Ikhtisar"}],["students",Users,{en:"Students",id:"Siswa"}],["analytics",BarChart3,{en:"Analytics",id:"Analitik"}],["attendance",Calendar,{en:"Attendance",id:"Kehadiran"}]] as const).map(([id,Icon,label]) => (
              <button key={id} onClick={()=>setTab(id as TabView)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===id?"bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-300 shadow-sm":"text-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"}`}>
                <Icon className="w-4 h-4"/><span className="hidden sm:inline">{label[lang]}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {tab==="overview"&&<Overview key="ov" an={an} students={students} lang={lang} />}
            {tab==="students"&&<Students key="st" students={filtered} q={q} setQ={setQ} sf={sf} sa={sa} tog={tog} gf={gf} setGf={setGf} sel={sel} setSel={setSel} sd={sd} setSd={setSd} lang={lang} />}
            {tab==="analytics"&&<Analytics key="an" an={an} students={students} lang={lang} />}
            {tab==="attendance"&&<Attendance key="at" students={students} aw={aw} setAw={setAw} sel={sel} sd={ad} setSd={setAd} onSelect={(s:StudentData)=>{setSel(s);setAd(true)}} onClose={()=>setAd(false)} lang={lang} />}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// OVERVIEW
function Overview({an,students,lang}:{an:AnalyticsData;students:StudentData[];lang:"en"|"id"}) {
  const stats=[
    {icon:Users,value:an.total,label:{en:"Total Students",id:"Total Siswa"},sub:`${an.activeToday} active today`,color:"from-blue-400 to-cyan-500"},
    {icon:TrendingUp,value:an.avgXP,label:{en:"Average XP",id:"Rata-rata XP"},sub:`Level ${an.avgLevel} avg`,color:"from-green-400 to-emerald-500"},
    {icon:Award,value:`${an.avgScore}%`,label:{en:"Avg Quiz Score",id:"Rata-rata Skor"},sub:`${an.totalLessons} lessons done`,color:"from-purple-400 to-pink-500"},
    {icon:Flame,value:an.avgStreak,label:{en:"Avg Streak",id:"Rata-rata Rantai"},sub:`${an.totalTime} total min`,color:"from-yellow-400 to-orange-500"},
  ];
  return (
    <motion.div key="ov" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s,i)=>{
          const Icon=s.icon;
          return <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-lg">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}><Icon className="w-5 h-5 text-white"/></div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{loc(s.label,lang)}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
          </motion.div>;
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-500"/>{lang==="en"?"Lesson Completion":"Penyelesaian Pelajaran"}</h3>
          {an.lessonRates.map(lr=>(
            <div key={lr.id} className="mb-3">
              <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span>{lr.icon}</span><span className="text-sm text-gray-700 dark:text-gray-200">{loc(lr.title,lang)}</span></div><span className="text-xs font-medium text-gray-500">{lr.rate}%</span></div>
              <Progress value={lr.rate} className="h-2 rounded-full" />
            </div>
          ))}
        </div>
        <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-500"/>{lang==="en"?"XP Distribution":"Distribusi XP"}</h3>
          {an.xpRanges.map((r,i)=>{
            const mc=Math.max(...an.xpRanges.map(x=>x.count)),w=mc>0?(r.count/mc)*100:0;
            return <div key={i} className="mb-4"><div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-600 dark:text-gray-400">{r.range} XP</span><span className="text-sm font-bold text-gray-800 dark:text-gray-100">{r.count} {lang==="en"?"students":"siswa"}</span></div><div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3"><motion.div initial={{width:0}} animate={{width:`${w}%`}} transition={{duration:0.8,delay:i*0.1}} className={`h-3 rounded-full ${["bg-blue-400","bg-green-400","bg-yellow-400","bg-purple-400"][i]}`}/></div></div>;
          })}
        </div>
        <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-purple-500"/>{lang==="en"?"Grade Distribution":"Distribusi Kelas"}</h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {Object.entries(an.gradeDist).map(([grade,count],i)=>{
              const cols=["#f87171","#fb923c","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6","#818cf8"];
              return <motion.div key={grade} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.1,type:"spring"}} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg" style={{background:cols[i%cols.length]}}>{count}</div>
                <p className="text-xs font-medium mt-1 text-gray-600 dark:text-gray-400">{lang==="en"?`Grade ${grade}`:`Kelas ${grade}`}</p><p className="text-[10px] text-gray-400">{Math.round(count/an.total*100)}%</p>
              </motion.div>;
            })}
          </div>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500"/>{lang==="en"?"Top Performers":"Siswa Terbaik"}</h3>
          {[...students].sort((a,b)=>b.xp-a.xp).slice(0,5).map((s,i)=>(
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 mb-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow">{s.avatar}</div>
                <div><p className="text-sm font-bold text-gray-800 dark:text-gray-100">{s.name[lang]}</p><p className="text-[10px] text-gray-400">Grade {s.grade}</p></div>
              </div>
              <div className="text-right"><p className="text-sm font-bold text-yellow-600">{s.xp} XP</p><p className="text-[10px] text-gray-400">{lang==="en"?"Level":"Level"} {s.level}</p></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// STUDENTS
function Students({students,q,setQ,sf,sa,tog,gf,setGf,sel,setSel,sd,setSd,lang}:{
  students:StudentData[];q:string;setQ:(v:string)=>void;sf:SortField;sa:boolean;tog:(f:SortField)=>void;
  gf:number|null;setGf:(v:number|null)=>void;sel:StudentData|null;setSel:(v:StudentData|null)=>void;
  sd:boolean;setSd:(v:boolean)=>void;lang:"en"|"id";
}) {
  return (
    <motion.div key="st" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="en"?"Search students...":"Cari siswa..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
        </div>
        <div className="flex gap-2">
          {[null,2,3,4,5].map(g=><button key={g===null?"all":String(g)} onClick={()=>setGf(g)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${gf===g?"bg-emerald-500 text-white shadow-sm":"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}>
            {g===null?(lang==="en"?"All":"Semua"):`G${g}`}
          </button>)}
        </div>
        <Button variant="outline" size="sm" className="rounded-xl text-xs"><Download className="w-3 h-3 mr-1"/>{lang==="en"?"Export":"Ekspor"}</Button>
      </div>
      <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
              {(["name","grade","xp","level","completed","streak"] as SortField[]).map(f=>
                <th key={f} onClick={()=>tog(f)} className="text-left py-3 px-3 text-gray-500 font-medium text-xs cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none">
                  <div className="flex items-center gap-1">
                    {f==="name"?(lang==="en"?"Student":"Siswa"):f==="grade"?(lang==="en"?"Grade":"Kelas"):f==="xp"?"XP":f==="level"?"Lv":f==="completed"?(lang==="en"?"Done":"Selesai"):(lang==="en"?"Streak":"Rantai")}
                    {sf===f&&<span className="text-[10px]">{sa?"↑":"↓"}</span>}
                  </div>
                </th>
              )}
              <th className="text-center py-3 px-3 text-gray-500 font-medium text-xs">{lang==="en"?"Score":"Skor"}</th>
              <th className="text-right py-3 px-3 text-gray-500 font-medium text-xs">{lang==="en"?"Active":"Aktif"}</th>
            </tr></thead>
            <tbody>
              {students.length===0?<tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">{lang==="en"?"No students found":"Tidak ada siswa ditemukan"}</td></tr>
              :students.map((student,i)=>{
                const avg=student.quizScores.length>0?Math.round(student.quizScores.reduce((s,q)=>s+(q.score/q.total)*100,0)/student.quizScores.length):null;
                return <motion.tr key={student.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                  className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${sel?.id===student.id?"bg-emerald-50 dark:bg-emerald-900/20":""}`}
                  onClick={()=>{setSel(student);setSd(true);}}>
                  <td className="py-3 px-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow shrink-0">{student.avatar}</div><div><p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[140px]">{student.name[lang]}</p><p className="text-[10px] text-gray-400 truncate max-w-[140px]">{student.nickname}</p></div></div></td>
                  <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${grdCol(student.grade)}`}>G{student.grade}</span></td>
                  <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-100">{student.xp}</td>
                  <td className="py-3 px-3"><Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">{student.level}</Badge></td>
                  <td className="py-3 px-3"><div className="flex items-center gap-1"><Progress value={(student.completed.length/6)*100} className="w-16 h-1.5 rounded-full"/><span className="text-[10px] text-gray-500 ml-1">{student.completed.length}/6</span></div></td>
                  <td className="py-3 px-3"><span className="flex items-center gap-1 text-xs">{strEm(student.streak)} {student.streak}</span></td>
                  <td className="py-3 px-3 text-center">{avg!==null?<span className={`font-semibold text-sm ${scrCol(avg)}`}>{avg}%</span>:<span className="text-gray-300 dark:text-gray-600">—</span>}</td>
                  <td className="py-3 px-3 text-right"><span className="text-[10px] text-gray-400">{student.lastActive}</span></td>
                </motion.tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">{lang==="en"?`Showing ${students.length} students`:`Menampilkan ${students.length} siswa`}</div>
      </div>
      <AnimatePresence>{sd&&sel&&<StudentModal student={sel} onClose={()=>setSd(false)} lang={lang}/>}</AnimatePresence>
    </motion.div>
  );
}

// STUDENT MODAL
function StudentModal({student,onClose,lang}:{student:StudentData;onClose:()=>void;lang:"en"|"id"}) {
  const avg=student.quizScores.length>0?Math.round(student.quizScores.reduce((s,q)=>s+(q.score/q.total)*100,0)/student.quizScores.length):null;
  const icons:Record<string,string>={first_lesson:"🎯",five_lessons:"📚",perfect_quiz:"🏆",ten_streak:"🔥",sequence_master:"⭐",algorithm_whiz:"💡",collector:"🏅"};
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9,y:20}} className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"><X className="w-4 h-4"/></button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white/30">{student.avatar}</div>
            <div><h2 className="text-2xl font-bold">{student.name[lang]}</h2><p className="text-sm opacity-80">{student.nickname} · {student.email}</p><div className="flex items-center gap-2 mt-1"><span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">{lang==="en"?"Grade":"Kelas"} {student.grade}</span><span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">{student.country}</span></div></div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {icon:Star,value:student.xp,label:"XP"},
              {icon:Trophy,value:`Lv.${student.level}`,label:lang==="en"?"Level":"Level"},
              {icon:Flame,value:`${student.streak}d`,label:lang==="en"?"Streak":"Rantai"},
              {icon:Clock,value:`${student.totalTime}m`,label:lang==="en"?"Time":"Waktu"},
            ].map((s,i)=>{const Icon=s.icon;return <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center"><Icon className="w-4 h-4 mx-auto mb-1 text-emerald-500"/><p className="text-lg font-bold text-gray-800 dark:text-gray-100">{s.value}</p><p className="text-[10px] text-gray-400">{s.label}</p></div>;})}
          </div>
          <div><div className="flex justify-between text-sm mb-1"><span className="text-gray-600 dark:text-gray-400">{lang==="en"?"Progress":"Kemajuan"}</span><span className="font-bold text-gray-800 dark:text-gray-100">{student.completed.length}/6</span></div><Progress value={(student.completed.length/6)*100} className="h-3 rounded-full"/></div>
          <div><h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">{lang==="en"?"Lesson Status":"Status Pelajaran"}</h3>{LESSONS.map(l=>{const d=student.completed.includes(l.id);return <div key={l.id} className={`flex items-center justify-between p-2.5 rounded-xl mb-2 ${d?"bg-green-50 dark:bg-green-900/20":"bg-gray-50 dark:bg-gray-700/30"}`}><div className="flex items-center gap-2"><span>{l.icon}</span><span className={`text-sm ${d?"text-gray-800 dark:text-gray-100 font-medium":"text-gray-400"}`}>{loc(l.title,lang)}</span></div>{d?<CheckCircle2 className="w-4 h-4 text-green-500"/>:<span className="text-[10px] text-gray-400">{lang==="en"?"Not done":"Belum"}</span>}</div>;})}</div>
          {student.quizScores.length>0&&<div><h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">{lang==="en"?"Quiz History":"Riwayat Kuis"}</h3>{student.quizScores.map((q,i)=><div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 mb-2"><span className="text-xs text-gray-500">{q.date}</span><span className={`text-sm font-bold ${q.score===q.total?"text-green-500":"text-blue-500"}`}>{q.score}/{q.total}</span></div>)}
          {avg!==null&&<div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"><span className="text-xs font-medium text-gray-600">{lang==="en"?"Average":"Rata-rata"}</span><span className="text-sm font-bold text-emerald-600">{avg}%</span></div>}</div>}
          <div><h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">{lang==="en"?"Achievements":"Pencapaian"} ({student.achievements.length})</h3><div className="flex flex-wrap gap-2">{student.achievements.length>0?student.achievements.map(a=><Badge key={a} className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 border-yellow-200 rounded-full text-xs">{icons[a]||"🎖️"} {a.replace(/_/g," ")}</Badge>):<p className="text-xs text-gray-400">{lang==="en"?"No achievements yet":"Belum ada pencapaian"}</p>}</div></div>
          <div className="text-center text-xs text-gray-400">{lang==="en"?"Last active":"Terakhir aktif"}: {student.lastActive}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ANALYTICS
function Analytics({an,students,lang}:{an:AnalyticsData;students:StudentData[];lang:"en"|"id"}) {
  const [metric,setMetric]=useState<"xp"|"score"|"time"|"streak">("xp");
  const cd=useMemo(()=>[...students].sort((a,b)=>{switch(metric){case"xp":return b.xp-a.xp;case"score":return(b.quizScores[0]?.score||0)-(a.quizScores[0]?.score||0);case"time":return b.totalTime-a.totalTime;case"streak":return b.streak-a.streak;default:return 0;}}).slice(0,8),[students,metric]);
  return (
    <motion.div key="an" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {([["xp",Star,{en:"XP Ranking",id:"Peringkat XP"}],["score",Award,{en:"Quiz Scores",id:"Skor Kuis"}],["time",Clock,{en:"Learning Time",id:"Waktu Belajar"}],["streak",Flame,{en:"Streaks",id:"Rantai"}]] as const).map(([id,Icon,label])=>(
          <button key={id} onClick={()=>setMetric(id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${metric===id?"bg-emerald-500 text-white shadow-md":"bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100"}`}>
            <Icon className="w-4 h-4"/>{loc(label,lang)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">
            {metric==="xp"?(lang==="en"?"Top Students by XP":"Siswa Teratas berdasarkan XP"):metric==="score"?(lang==="en"?"Top Quiz Scores":"Skor Kuis Teratas"):metric==="time"?(lang==="en"?"Learning Time":"Waktu Belajar"):(lang==="en"?"Learning Streaks":"Rantai Belajar")}
          </h3>
          {cd.map((s,i)=>{
            const val=metric==="xp"?s.xp:metric==="score"?(s.quizScores[0]?.score||0)*10:metric==="time"?s.totalTime:s.streak;
            const mv=Math.max(...cd.map(x=>metric==="xp"?x.xp:metric==="score"?(x.quizScores[0]?.score||0)*10:metric==="time"?x.totalTime:x.streak));
            const w=mv>0?(val/mv)*100:0;
            return <div key={s.id} className="flex items-center gap-3 mb-3"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{s.avatar}</div><span className="text-xs text-gray-600 dark:text-gray-400 w-20 truncate">{s.nickname}</span><div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${w}%`}} transition={{duration:0.8,delay:i*0.05}} className="h-5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-end px-2"><span className="text-[10px] text-white font-bold drop-shadow-sm">{val}</span></motion.div></div></div>;
          })}
        </div>
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500"/>{lang==="en"?"Performance Summary":"Ringkasan Kinerja"}</h3>
            {[
              {label:{en:"Avg XP per Student",id:"Rata-rata XP per Siswa"},value:an.avgXP,color:"from-blue-400 to-cyan-400"},
              {label:{en:"Avg Quiz Score",id:"Rata-rata Skor Kuis"},value:`${an.avgScore}%`,color:"from-purple-400 to-pink-400"},
              {label:{en:"Avg Streak",id:"Rata-rata Rantai"},value:`${an.avgStreak} days`,color:"from-yellow-400 to-orange-400"},
              {label:{en:"Total Learning Time",id:"Total Waktu Belajar"},value:`${an.totalTime} min`,color:"from-green-400 to-teal-400"},
              {label:{en:"Lessons Completed",id:"Pelajaran Selesai"},value:an.totalLessons,color:"from-red-400 to-pink-400"},
              {label:{en:"Active Today",id:"Aktif Hari Ini"},value:an.activeToday,color:"from-cyan-400 to-blue-400"},
            ].map((item,i)=>(
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 mb-2">
                <span className="text-xs text-gray-500">{loc(item.label,lang)}</span>
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`}/><span className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.value}</span></div>
              </div>
            ))}
          </div>
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500"/>{lang==="en"?"Grade Performance":"Kinerja per Kelas"}</h3>
            {Object.entries(an.gradeDist).map(([grade,count])=>{
              const gs=students.filter(s=>s.grade===Number(grade)),gXP=Math.round(gs.reduce((s,st)=>s+st.xp,0)/count);
              const gSc=gs.filter(s=>s.quizScores.length>0),gScr=gSc.length>0?Math.round(gSc.reduce((s,st)=>s+(st.quizScores[0]?.score||0)/(st.quizScores[0]?.total||10)*100,0)/gSc.length):0;
              return <div key={grade} className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 mb-3">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-gray-800 dark:text-gray-100">{lang==="en"?`Grade ${grade}`:`Kelas ${grade}`}</span><span className="text-xs text-gray-500">{count} {lang==="en"?"students":"siswa"}</span></div>
                <div className="flex gap-4 text-xs"><span className="text-blue-600">XP: {gXP}</span><span className="text-purple-600">{lang==="en"?"Score":"Skor"}: {gScr}%</span></div>
              </div>;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ATTENDANCE
function Attendance({students,aw,setAw,sel,sd,setSd,onSelect,onClose,lang}:{
  students:StudentData[];aw:number;setAw:(w:number)=>void;sel:StudentData|null;sd:boolean;setSd:(v:boolean)=>void;
  onSelect:(s:StudentData)=>void;onClose:()=>void;lang:"en"|"id";
}) {
  const dates=Array.from({length:7},(_,i)=>new Date(2026,6,19+i).getDate());
  const wa=[[92,95,88,96,90,75,50],[85,90,82,88,92,60,30],[78,85,72,90,80,55,20],[70,75,65,80,72,40,15],[65,70,55,72,60,35,10],[98,95,100,92,96,85,60],[55,60,48,65,58,30,5],[82,86,78,90,84,65,35]];
  const ca=wa[aw]||wa[0];const aa=Math.round(ca.reduce((a,b)=>a+b,0)/ca.length);
  return (
    <motion.div key="at" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500"/><h3 className="font-bold text-gray-800 dark:text-gray-100">{lang==="en"?"Weekly Attendance":"Kehadiran Mingguan"}</h3></div>
              <div className="flex items-center gap-1">
                <button onClick={()=>setAw(Math.max(0,aw-1))} disabled={aw===0} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4 rotate-90"/></button>
                <span className="text-xs text-gray-500 w-16 text-center">{lang==="en"?"Week":"Minggu"} {aw+1}</span>
                <button onClick={()=>setAw(Math.min(3,aw+1))} disabled={aw===3} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"><ChevronDown className="w-4 h-4 -rotate-90"/></button>
              </div>
            </div>
            <div className="flex items-end justify-between gap-3 h-48 mb-4">
              {ca.map((val:number,i:number)=>{
                const h=Math.max(val*2.5,10),c=val>=80?"from-emerald-400 to-green-500":val>=60?"from-yellow-400 to-amber-500":"from-red-400 to-rose-500";
                return <div key={i} className="flex-1 flex flex-col items-center gap-1"><span className="text-xs font-bold text-gray-500">{val}%</span><motion.div initial={{height:0}} animate={{height:`${h}px`}} transition={{duration:0.6,delay:i*0.1}} className={`w-full rounded-lg bg-gradient-to-t ${c} max-h-44`} style={{minHeight:8}}/><span className="text-[10px] text-gray-500">{dates[i]}</span><span className="text-[8px] text-gray-400 uppercase">{WEEKDAYS[i]}</span></div>;
              })}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">{lang==="en"?"Weekly Average":"Rata-rata Mingguan"}</span><span className={`text-lg font-bold ${aa>=80?"text-green-600":aa>=60?"text-yellow-600":"text-red-600"}`}>{aa}%</span></div>
              <Progress value={aa} className="h-2 mt-2 rounded-full"/>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-500"/>{lang==="en"?"Student Attendance":"Kehadiran Siswa"}</h3>
            {[...students].sort((a,b)=>b.attendance[aw]-a.attendance[aw]).map(s=>{
              const at=s.attendance[aw]||0,ac=at>=80?"bg-green-100 text-green-600":at>=60?"bg-yellow-100 text-yellow-600":"bg-red-100 text-red-600";
              return <button key={s.id} onClick={()=>onSelect(s)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-1">
                <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{s.avatar}</div><span className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-[100px]">{s.nickname}</span></div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ac}`}>{at}%</span>
              </button>;
            })}
          </div>
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500"/>{lang==="en"?"Insights":"Wawasan"}</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>📊 {lang==="en"?`Best: ${WEEKDAYS[ca.indexOf(Math.max(...ca))]}`:`Terbaik: ${WEEKDAYS[ca.indexOf(Math.max(...ca))]}`}</p>
              <p>📉 {lang==="en"?`Needs: ${WEEKDAYS[ca.indexOf(Math.min(...ca))]}`:`Butuh: ${WEEKDAYS[ca.indexOf(Math.min(...ca))]}`}</p>
              <p>🎯 {lang==="en"?"Target: 80% attendance":"Target: 80% kehadiran"}</p>
              <p>👑 {lang==="en"?`Highest: ${[...students].sort((a,b)=>b.attendance.reduce((x,y)=>x+y,0)-a.attendance.reduce((x,y)=>x+y,0))[0]?.nickname}`:`Tertinggi: ${[...students].sort((a,b)=>b.attendance.reduce((x,y)=>x+y,0)-a.attendance.reduce((x,y)=>x+y,0))[0]?.nickname}`}</p>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>{sd&&sel&&<StudentModal student={sel} onClose={onClose} lang={lang}/>}</AnimatePresence>
    </motion.div>
  );
}
