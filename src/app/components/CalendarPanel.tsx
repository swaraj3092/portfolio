import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, ChevronLeft, ChevronRight, Trash2, Calendar, FileText, Download, ExternalLink, Mail, Phone, MapPin, Linkedin, Github, Briefcase, Zap, RefreshCw, Globe } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
export interface CalEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  category: Category;
  notes: string;
}

type Category = 'job' | 'interview' | 'meeting' | 'personal' | 'deadline' | 'other';

const CAT_CONFIG: Record<Category, { label: string; color: string; bg: string }> = {
  job:       { label: 'Job App',    color: '#dc143c', bg: 'rgba(220,20,60,0.15)' },
  interview: { label: 'Interview',  color: '#ff6b35', bg: 'rgba(255,107,53,0.15)' },
  meeting:   { label: 'Meeting',    color: '#b044dc', bg: 'rgba(176,68,220,0.15)' },
  personal:  { label: 'Personal',   color: '#44a8dc', bg: 'rgba(68,168,220,0.15)' },
  deadline:  { label: 'Deadline',   color: '#ff2222', bg: 'rgba(255,34,34,0.18)' },
  other:     { label: 'Other',      color: '#778899', bg: 'rgba(119,136,153,0.15)' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const STORAGE_KEY = 'portfolio-calendar-v2';

const DEFAULT_EVENTS: CalEvent[] = [
  { id: '1', title: 'EduPilot Demo Day', date: '2026-04-28', startTime: '14:00', endTime: '16:00', category: 'personal', notes: 'Present EduPilot to stakeholders' },
  { id: '2', title: 'Google ML Engineer Application', date: '2026-04-30', startTime: '10:00', endTime: '11:00', category: 'job', notes: 'Submit resume and cover letter' },
  { id: '3', title: 'Meta Internship Technical Screen', date: '2026-05-06', startTime: '11:00', endTime: '12:30', category: 'interview', notes: 'ML system design + coding round' },
  { id: '4', title: 'KIIT Project Submission', date: '2026-05-10', startTime: '23:59', endTime: '23:59', category: 'deadline', notes: 'Final year project submission deadline' },
  { id: '5', title: 'Portfolio Review Meeting', date: '2026-05-15', startTime: '15:00', endTime: '16:00', category: 'meeting', notes: 'Review updated portfolio with mentor' },
  { id: '6', title: 'Amazon SDE Application', date: '2026-05-20', startTime: '09:00', endTime: '10:00', category: 'job', notes: 'New grad SDE position' },
];

function loadEvents(): CalEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_EVENTS;
  } catch { return DEFAULT_EVENTS; }
}
function saveEvents(ev: CalEvent[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ev)); } catch {}
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function firstDay(year: number, month: number) { return new Date(year, month, 1).getDay(); }
function toYMD(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

// ── Modal ─────────────────────────────────────────────────────
function EventModal({
  initial, onSave, onDelete, onClose
}: {
  initial?: Partial<CalEvent>;
  onSave: (ev: CalEvent) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CalEvent>({
    id: initial?.id ?? genId(),
    title: initial?.title ?? '',
    date: initial?.date ?? toYMD(new Date()),
    startTime: initial?.startTime ?? '09:00',
    endTime: initial?.endTime ?? '10:00',
    category: (initial?.category as Category) ?? 'personal',
    notes: initial?.notes ?? '',
  });

  const field = (name: keyof CalEvent) => ({
    value: form[name] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [name]: e.target.value })),
  });

  const inputCls = `w-full px-3 py-2.5 text-sm text-gray-200 outline-none transition-all duration-300`;
  const inputStyle = { background: 'rgba(6,3,5,0.9)', border: '1px solid rgba(220,20,60,0.2)', fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', color: '#e5e7eb' };

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ background: 'rgba(3,1,4,0.88)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="relative w-full max-w-md overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a0406 0%, #060205 100%)', border: '1px solid rgba(220,20,60,0.3)', clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #dc143c, #8b0000, transparent)' }} />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', color: '#dc143c', letterSpacing: '0.25em' }}>
              {form.id === initial?.id && initial?.title ? 'EDIT EVENT' : 'NEW EVENT'}
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors duration-200"><X className="w-4 h-4" /></button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[#dc143c]/50 mb-1.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Title</label>
            <input {...field('title')} className={inputCls} style={inputStyle} placeholder="Event title..." required
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.6)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(220,20,60,0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Date + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#dc143c]/50 mb-1.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Date</label>
              <input type="date" {...field('date')} className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.6)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.2)'; }}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#dc143c]/50 mb-1.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Category</label>
              <select {...field('category')} className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.6)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.2)'; }}
              >
                {(Object.keys(CAT_CONFIG) as Category[]).map(c => (
                  <option key={c} value={c} style={{ background: '#0a0406' }}>{CAT_CONFIG[c].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            {(['startTime', 'endTime'] as const).map(t => (
              <div key={t}>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[#dc143c]/50 mb-1.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{t === 'startTime' ? 'Start' : 'End'}</label>
                <input type="time" {...field(t)} className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.6)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.2)'; }}
                />
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[#dc143c]/50 mb-1.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2.5 text-sm text-gray-300 outline-none resize-none"
              style={{ ...inputStyle, fontFamily: 'Rajdhani, sans-serif' }}
              placeholder="Optional notes..."
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.6)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(220,20,60,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(220,20,60,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <motion.button
              onClick={() => { if (form.title) onSave(form); }}
              className="flex-1 py-3 text-white text-xs tracking-[0.25em] uppercase"
              style={{ background: form.title ? '#dc143c' : '#4a0010', fontFamily: 'Orbitron, sans-serif', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              Save Event
            </motion.button>
            {onDelete && (
              <motion.button
                onClick={onDelete}
                className="p-3 text-[#dc143c]/60 hover:text-[#dc143c] transition-colors duration-200"
                style={{ border: '1px solid rgba(220,20,60,0.25)' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
export function CalendarPanel({ open, onClose, isMobile }: { open: boolean; onClose: () => void; isMobile?: boolean }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalEvent[]>(loadEvents);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; initial?: Partial<CalEvent> } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'resume'>('calendar');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => { saveEvents(events); }, [events]);

  const addEvent = (ev: CalEvent) => {
    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === ev.id);
      return idx >= 0 ? prev.map(e => e.id === ev.id ? ev : e) : [...prev, ev];
    });
    setModal(null);
  };
  const deleteEvent = (id: string) => { setEvents(prev => prev.filter(e => e.id !== id)); setModal(null); };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  const eventsForDate = useCallback((dateStr: string) =>
    events.filter(e => e.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  [events]);

  const handleGoogleSync = async () => {
    setIsSyncing(true);
    const { soundManager } = await import("../utils/sounds");
    soundManager.play('tick', 0.5);

    // Simulate network handshake
    setTimeout(async () => {
      const googleEvents: CalEvent[] = [
        { id: genId(), title: 'G-CLD: Tech Interveiw (Level 5)', date: toYMD(new Date(Date.now() + 86400000 * 2)), startTime: '11:00', endTime: '12:00', category: 'interview', notes: 'Google Cloud Platform Team • System Design' },
        { id: genId(), title: 'G-CLD: PR Review #9021', date: toYMD(new Date(Date.now() + 86400000 * 3)), startTime: '09:00', endTime: '10:00', category: 'job', notes: 'Reviewing core automation engine for symbiote-UI' },
        { id: genId(), title: 'G-CLD: AI Architecture Sync', date: toYMD(new Date(Date.now() + 86400000 * 5)), startTime: '15:30', endTime: '17:00', category: 'meeting', notes: 'Multi-model latency optimization discussion' },
        { id: genId(), title: 'G-CLD: Weekly Deadline', date: toYMD(new Date(Date.now() + 86400000 * 7)), startTime: '23:59', endTime: '23:59', category: 'deadline', notes: 'Sprint termination sequence' },
      ];

      setEvents(prev => [...prev, ...googleEvents]);
      setIsSyncing(false);
      soundManager.play('send', 0.6);
    }, 2500);
  };

  const eventsThisMonth = events.filter(e => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getFullYear() === year && d.getMonth() === month;
  }).sort((a, b) => a.date.localeCompare(b.date));

  // Keyboard nav inside calendar panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (modal) { setModal(null); } else { onClose(); } e.stopPropagation(); }
      if (modal) return;
      if (e.key === 'ArrowLeft') { e.stopPropagation(); prevMonth(); }
      if (e.key === 'ArrowRight') { e.stopPropagation(); nextMonth(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, modal, onClose]);

  const days = daysInMonth(year, month);
  const first = firstDay(year, month);
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = toYMD(today);

  // Resume content
  const ResumeView = () => (
    <div className="h-full overflow-y-auto p-8 custom-scrollbar relative" style={{ background: '#060305' }}>
      {/* Bio-Scanner Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
        initial={{ top: 0, opacity: 0 }}
        animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: 1, ease: "linear" }}
        style={{ background: 'linear-gradient(90deg, transparent, #dc143c, transparent)', boxShadow: '0 0 15px #dc143c' }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header with download button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="flex items-center gap-4" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.4rem', color: '#fff', letterSpacing: '0.1em' }}>
              SWARAJ <span className="text-[#dc143c]">KUMAR</span> BEHERA
            </h1>
            <p className="flex items-center gap-3" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', color: '#dc143c', letterSpacing: '0.2em', fontWeight: 600, marginTop: '4px' }}>
              <span className="w-8 h-px bg-current" /> AI/ML ENGINEER • FULL STACK DEVELOPER
            </p>
          </div>
          <motion.a
            href="/resume.pdf"
            download="Swaraj_Kumar_Behera_Resume.pdf"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(220,20,60,0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 text-xs text-white font-bold"
            style={{
              background: '#dc143c',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '0.15em',
            }}
          >
            <Download className="w-4 h-4" />
            DOWNLOAD ASSET
          </motion.a>
        </motion.div>

        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-px mb-10 origin-left" 
          style={{ background: 'linear-gradient(90deg, #dc143c, #8b0000, transparent)' }} 
        />

        {/* Professional Summary */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', color: '#dc143c', opacity: 0.8, letterSpacing: '0.3em' }}>[ PROFILE_OVERVIEW ]</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <p className="text-gray-100 italic" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', lineHeight: '1.7', letterSpacing: '0.02em' }}>
            "Software Engineer specializing in AI/ML, full-stack development, and automation. Published researcher with 92.5% accuracy in custom CNN-based cattle breed classification. Built production systems serving 100+ daily users and reduced manual workflows by 40%."
          </p>
        </motion.section>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="md:col-span-8 space-y-12">
            
            {/* Experience */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="flex items-center gap-4 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: '#fff', letterSpacing: '0.25em' }}>
                <Briefcase className="w-4 h-4 text-[#dc143c]" /> FIELD_OPERATIONS
              </h2>
              <div className="space-y-6">
                {[
                  {
                    role: "Data Analytics Associate",
                    company: "USC.KIIT",
                    period: "April 2025 — Present",
                    points: ["Cut manual reporting effort by 40% for 10+ faculty by building ML-driven Python models", "Orchestrated Power BI dashboard pipelines for automated analytics"],
                    current: true
                  },
                  {
                    role: "Python Intern",
                    company: "iTech Business Solutions",
                    period: "July 2024 — August 2024",
                    points: ["Reduced execution time by 30% across 5+ live production projects", "Streamlined data processing workflows in Python"]
                  }
                ].map((exp, i) => (
                  <motion.div 
                    key={i} 
                    className="p-6 transition-all duration-400 group relative"
                    style={{ 
                      background: 'rgba(220,20,60,0.02)', 
                      border: '1px solid rgba(220,20,60,0.1)',
                      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                    }}
                    whileHover={{ scale: 1.01, background: 'rgba(220,20,60,0.05)', borderColor: 'rgba(220,20,60,0.3)' }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#dc143c]/20 group-hover:bg-[#dc143c] transition-all" />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px' }}>{exp.role}</h3>
                        <p className="text-[#dc143c] font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>{exp.company}</p>
                      </div>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: '#888', letterSpacing: '0.1em' }} className="font-bold">{exp.period.toUpperCase()}</span>
                    </div>
                    <ul className="space-y-2 text-gray-300" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px' }}>
                      {exp.points.map((pt, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-[#dc143c] mt-1.5">•</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Projects */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="flex items-center gap-4 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: '#fff', letterSpacing: '0.25em' }}>
                <Zap className="w-4 h-4 text-[#dc143c]" /> SYSTEM_ARCHITECTURES
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'EduPilot (AI Navigator)',
                    tech: 'React • FastAPI • Gemini AI',
                    points: ['Gamified AI platform with admission analysis and essay coaching', 'Real-time database sync serving 100+ concurrent requests'],
                    links: { github: '#' }
                  },
                  {
                    title: 'Cattle Breed AI (Research)',
                    tech: 'Custom CNN • PyTorch • Vision',
                    points: ['Achieved 92.5% accuracy across 64 breeds on 9,200 samples', 'Outperformed standard ResNet50; paper under scientific review'],
                    links: { github: '#' }
                  }
                ].map((proj, i) => (
                  <div key={i} className="p-6 border border-white/5 hover:border-[#dc143c]/30 transition-all" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '17px' }}>{proj.title}</h3>
                      <Github className="w-4 h-4 text-gray-600 hover:text-[#dc143c] cursor-pointer" />
                    </div>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: '#dc143c', opacity: 0.7, marginBottom: '8px' }} className="font-bold uppercase tracking-widest">{proj.tech}</p>
                    <ul className="space-y-1 text-gray-200 font-medium" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>
                      {proj.points.map((pt, j) => <li key={j}>- {pt}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 space-y-10">
            {/* Contact */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 border-l-2 border-[#dc143c]/20"
            >
              <h2 className="mb-6 font-black" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: '#dc143c', letterSpacing: '0.3em' }}>TRANSMISSION_HUD</h2>
              <div className="space-y-5">
                <a href="mailto:swarajbehera923@gmail.com" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/5 transition-all group-hover:bg-[#dc143c]/20"><Mail className="w-4 h-4 text-[#dc143c]" /></div>
                  <span className="text-gray-300 text-sm font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>swarajbehera...</span>
                </a>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/5"><MapPin className="w-4 h-4 text-[#dc143c]" /></div>
                  <span className="text-gray-300 text-sm font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Bhubaneswar, IN</span>
                </div>
                <a href="#" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/5 group-hover:bg-[#dc143c]/20"><Linkedin className="w-4 h-4 text-[#dc143c]" /></div>
                  <span className="text-gray-300 text-sm font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>LinkedIn/swaraj</span>
                </a>
              </div>
            </motion.section>

            {/* Arsenal */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-black" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: '#fff', letterSpacing: '0.3em' }}>TECHNICAL_ARSENAL</h2>
              {[
                { label: 'ML/AI', items: 'PyTorch, TensorFlow, OpenCV' },
                { label: 'ENGINEERING', items: 'Python, JS, React, FastAPI' },
                { label: 'CORE', items: 'DSA, OS, DBMS, SQL' }
              ].map(stack => (
                <div key={stack.label}>
                  <p className="text-[#dc143c] text-[10px] uppercase font-bold tracking-widest mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>{stack.label}</p>
                  <p className="text-gray-200 text-sm font-medium" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{stack.items}</p>
                </div>
              ))}
            </motion.section>

            {/* Achievements highlight */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6"
              style={{ background: 'linear-gradient(180deg, rgba(220,20,60,0.1), transparent)', border: '1px solid rgba(220,20,60,0.15)' }}
            >
              <h2 className="mb-4 font-black" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: '#dc143c', letterSpacing: '0.3em' }}>LEGACY_RECORDS</h2>
              <ul className="space-y-3 text-xs text-gray-300 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                 <li className="flex gap-2"><span className="text-[#dc143c]">#</span> TOP 10 CODESPRINT</li>
                 <li className="flex gap-2"><span className="text-[#dc143c]">#</span> 92.5% ACC RESEARCH</li>
                 <li className="flex gap-2"><span className="text-[#dc143c]">#</span> SIH_PROJECT_LEAD</li>
              </ul>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="calendar"
            className="fixed inset-0 z-[80] flex overflow-hidden"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 32, stiffness: 210 }}
            style={{ background: '#060305' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ border: '1px solid rgba(220,20,60,0.2)' }} />

            {/* Sidebar - Hidden on mobile, or toggleable */}
            <div className="hidden lg:flex w-72 shrink-0 flex-col overflow-hidden" style={{ borderRight: '1px solid rgba(220,20,60,0.15)', background: 'rgba(4,1,3,0.95)' }}>
              {/* Tabs */}
              <div className="flex border-b border-[#dc143c]/20">
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="flex-1 flex items-center justify-center gap-2 py-4 transition-all duration-300"
                  style={{
                    background: activeTab === 'calendar' ? 'rgba(220,20,60,0.1)' : 'transparent',
                    borderBottom: activeTab === 'calendar' ? '2px solid #dc143c' : '2px solid transparent',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '11px',
                    color: activeTab === 'calendar' ? '#dc143c' : '#888',
                    letterSpacing: '0.15em',
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  SCHEDULE
                </button>
                <button
                  onClick={() => setActiveTab('resume')}
                  className="flex-1 flex items-center justify-center gap-2 py-4 transition-all duration-300"
                  style={{
                    background: activeTab === 'resume' ? 'rgba(220,20,60,0.1)' : 'transparent',
                    borderBottom: activeTab === 'resume' ? '2px solid #dc143c' : '2px solid transparent',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '11px',
                    color: activeTab === 'resume' ? '#dc143c' : '#888',
                    letterSpacing: '0.15em',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  RESUME
                </button>
              </div>

              {activeTab === 'calendar' && (
                <>
                  {/* Mini calendar */}
                  <div className="p-4" style={{ borderBottom: '1px solid rgba(220,20,60,0.1)' }}>
                <div className="flex items-center justify-between mb-3">
                  <button onClick={prevMonth} className="text-gray-600 hover:text-[#dc143c] transition-colors duration-200 p-1"><ChevronLeft className="w-3 h-3" /></button>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#dc143c', letterSpacing: '0.15em' }}>{MONTHS[month].slice(0,3).toUpperCase()} {year}</div>
                  <button onClick={nextMonth} className="text-gray-600 hover:text-[#dc143c] transition-colors duration-200 p-1"><ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                  {DAYS.map(d => <div key={d} style={{ fontSize: '9px', color: 'rgba(220,20,60,0.4)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>{d[0]}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isToday = ds === todayStr;
                    const hasEv = eventsForDate(ds).length > 0;
                    return (
                      <button key={i} onClick={() => setSelectedDate(ds === selectedDate ? null : ds)}
                        className="w-7 h-7 text-center relative transition-all duration-200 rounded-sm"
                        style={{ fontSize: '10px', fontFamily: 'Rajdhani, sans-serif', color: isToday ? '#fff' : selectedDate === ds ? '#dc143c' : '#888', background: isToday ? '#dc143c' : selectedDate === ds ? 'rgba(220,20,60,0.12)' : 'transparent' }}
                      >
                        {day}
                        {hasEv && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: isToday ? '#fff' : '#dc143c' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category legend */}
              <div className="p-4 space-y-2" style={{ borderBottom: '1px solid rgba(220,20,60,0.1)' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(220,20,60,0.7)', fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }} className="uppercase mb-3">Categories</div>
                {(Object.entries(CAT_CONFIG) as [Category, typeof CAT_CONFIG[Category]][]).map(([cat, cfg]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                    <span style={{ fontSize: '11px', color: '#ccc', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>{cfg.label}</span>
                    <span className="ml-auto" style={{ fontSize: '11px', color: '#999', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                      {events.filter(e => e.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>

              {/* Upcoming */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(220,20,60,0.7)', fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }} className="uppercase mb-4">Upcoming Data</div>
                {eventsThisMonth.slice(0, 8).map(ev => (
                  <motion.button
                    key={ev.id}
                    onClick={() => setModal({ mode: 'edit', initial: ev })}
                    className="w-full text-left p-2.5 transition-all duration-200"
                    style={{ background: CAT_CONFIG[ev.category].bg, border: `1px solid ${CAT_CONFIG[ev.category].color}30` }}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: CAT_CONFIG[ev.category].color }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }} className="truncate">{ev.title}</div>
                        <div style={{ fontSize: '10px', color: '#ccc', fontFamily: 'Rajdhani, sans-serif', fontWeight: 500 }}>{ev.date.slice(5)} · {ev.startTime}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="p-4 space-y-3">
                <motion.button
                  onClick={handleGoogleSync}
                  disabled={isSyncing}
                  className="w-full py-3 flex items-center justify-center gap-2 text-white text-[10px] tracking-[0.2em] uppercase relative overflow-hidden group"
                  style={{ 
                    background: 'rgba(66, 133, 244, 0.15)', 
                    border: '1px solid rgba(66, 133, 244, 0.4)',
                    fontFamily: 'Orbitron, sans-serif',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                  whileHover={{ scale: 1.02, background: 'rgba(66, 133, 244, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isSyncing ? (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                         <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                         SYNCING_CLOUD...
                      </motion.div>
                    ) : (
                      <motion.div 
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         className="flex items-center gap-2"
                      >
                         <Globe className="w-3.5 h-3.5 text-[#4285F4]" />
                         GOOGLE_SYNC
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle scanline for button */}
                  {isSyncing && (
                    <motion.div 
                      className="absolute inset-0 bg-white/10"
                      initial={{ top: '-100%' }} animate={{ top: '100%' }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setModal({ mode: 'add', initial: { date: selectedDate ?? toYMD(today) } })}
                  className="w-full py-3 flex items-center justify-center gap-2 text-white text-xs tracking-[0.2em] uppercase"
                  style={{ background: '#dc143c', fontFamily: 'Orbitron, sans-serif', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-4 h-4" /> Add Event
                </motion.button>
              </div>
                </>
              )}

              {activeTab === 'resume' && (
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="text-center mb-6">
                    <FileText className="w-12 h-12 text-[#dc143c] mx-auto mb-3" />
                    <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', color: '#dc143c', letterSpacing: '0.2em', marginBottom: '8px' }}>RESUME</h3>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: '#888', lineHeight: '1.6' }}>View my complete professional resume on the right panel.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 border border-[#dc143c]/20" style={{ background: 'rgba(220,20,60,0.05)' }}>
                      <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: '#dc143c', marginBottom: '6px' }}>Contact Information</h4>
                      <div className="space-y-2 text-xs" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#aaa' }}>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-[#dc143c]" />
                          <span className="truncate">swarajbehera923@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Github className="w-3 h-3 text-[#dc143c]" />
                          <a href="https://github.com/swaraj3092" target="_blank" rel="noopener noreferrer" className="hover:text-[#dc143c] transition-colors">github.com/swaraj3092</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Linkedin className="w-3 h-3 text-[#dc143c]" />
                          <a href="https://www.linkedin.com/in/swaraj-kumar-behera-b48b07325/" target="_blank" rel="noopener noreferrer" className="hover:text-[#dc143c] transition-colors truncate">LinkedIn Profile</a>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border border-[#dc143c]/20" style={{ background: 'rgba(220,20,60,0.05)' }}>
                      <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: '#dc143c', marginBottom: '6px' }}>Quick Stats</h4>
                      <div className="space-y-2 text-xs" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#aaa' }}>
                        <div>• 92.5% AI Model Accuracy</div>
                        <div>• 8.40 CGPA at KIIT</div>
                        <div>• 2 Professional Internships</div>
                        <div>• Top 30 Hackathon Finisher</div>
                      </div>
                    </div>

                    <a
                      href="/resume.pdf"
                      download="Swaraj_Kumar_Behera_Resume.pdf"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white text-xs tracking-[0.2em] uppercase"
                      style={{ background: '#dc143c', fontFamily: 'Orbitron, sans-serif', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {activeTab === 'resume' ? (
                <>
                  <div className="flex items-center justify-between px-4 py-4 lg:px-6 shrink-0" style={{ borderBottom: '1px solid rgba(220,20,60,0.15)', background: 'rgba(4,1,3,0.6)' }}>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.9rem,2vw,1.4rem)', color: '#fff', letterSpacing: '0.1em' }}>RESUME</div>
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-white transition-colors duration-200" style={{ border: '1px solid rgba(220,20,60,0.15)' }}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ResumeView />
                  </div>
                </>
              ) : (
                <>
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-4 lg:px-6 shrink-0" style={{ borderBottom: '1px solid rgba(220,20,60,0.15)', background: 'rgba(4,1,3,0.6)' }}>
                    <div className="flex items-center gap-2 lg:gap-4">
                      {isMobile && (
                        <button 
                          onClick={onClose}
                          className="mr-2 text-[#dc143c] flex items-center gap-1 font-bold text-[10px] tracking-widest hover:text-white transition-colors"
                        >
                          <ChevronLeft className="w-3 h-3" /> BACK
                        </button>
                      )}
                      <button onClick={prevMonth} className="p-1.5 lg:p-2 text-gray-600 hover:text-[#dc143c] transition-colors duration-200" style={{ border: '1px solid rgba(220,20,60,0.15)' }}><ChevronLeft className="w-4 h-4" /></button>
                      <motion.div key={`${year}-${month}`} className="text-center min-w-[80px]">
                        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.8rem,1.5vw,1.2rem)', color: '#fff', letterSpacing: '0.1em' }}>{MONTHS[month].toUpperCase()}</div>
                      </motion.div>
                      <button onClick={nextMonth} className="p-1.5 lg:p-2 text-gray-600 hover:text-[#dc143c] transition-colors duration-200" style={{ border: '1px solid rgba(220,20,60,0.15)' }}><ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3">
                      <button 
                        onClick={() => setModal({ mode: 'add', initial: { date: toYMD(today) } })}
                        className="lg:hidden p-2 text-[#dc143c]" style={{ border: '1px solid rgba(220,20,60,0.3)' }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={onClose} className="p-2 text-gray-600 hover:text-white transition-colors duration-200" style={{ border: '1px solid rgba(220,20,60,0.15)' }}><X className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Mobile Schedule List View / Desktop Grid */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="lg:hidden p-4 space-y-4">
                      {/* Mobile Day Headers */}
                      <div className="text-[10px] tracking-[0.3em] text-[#dc143c] font-black mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#dc143c] rotate-45" /> UPCOMING_EVENTS
                      </div>
                      {eventsThisMonth.length > 0 ? (
                        eventsThisMonth.map(ev => (
                          <motion.div 
                            key={ev.id}
                            className="p-4 relative"
                            style={{ 
                              background: 'rgba(220,20,60,0.03)', 
                              border: '1px solid rgba(220,20,60,0.15)',
                              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
                            }}
                            onClick={() => setModal({ mode: 'edit', initial: ev })}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-[#dc143c] tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                {ev.date.split('-').reverse().slice(0,2).join('/')}
                              </span>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: CAT_CONFIG[ev.category].color }} />
                            </div>
                            <h3 className="text-white font-bold mt-1" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px' }}>{ev.title}</h3>
                            <div className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{ev.startTime} - {ev.endTime}</div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="py-20 text-center text-gray-600 text-xs tracking-widest uppercase">No events this month</div>
                      )}
                    </div>

                    {/* Desktop Grid (Hidden on Mobile) */}
                    <div className="hidden lg:block h-full">
                      <div className="grid grid-cols-7 border-b border-[#dc143c]/10">
                        {DAYS.map(d => <div key={d} className="py-2 text-center text-[10px] tracking-widest text-gray-600">{d.toUpperCase()}</div>)}
                      </div>
                      <div className="grid grid-cols-7">
                        {cells.map((day, i) => {
                          const ds = day ? `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : '';
                          const dayEvents = ds ? eventsForDate(ds) : [];
                          return (
                            <div key={i} className="min-h-[140px] p-2 border-r border-b border-[#dc143c]/5 group hover:bg-[#dc143c]/5 transition-all">
                              {day && (
                                <>
                                  <span className="text-[10px] font-bold text-gray-600 group-hover:text-[#dc143c]">{day}</span>
                                  <div className="mt-2 space-y-1">
                                    {dayEvents.map(ev => (
                                      <div key={ev.id} className="text-[9px] p-1 truncate text-white" style={{ background: CAT_CONFIG[ev.category].bg }}>{ev.title}</div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <EventModal
            key={modal.initial?.id ?? 'new'}
            initial={modal.initial}
            onSave={addEvent}
            onDelete={modal.initial?.id ? () => deleteEvent(modal.initial!.id!) : undefined}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}