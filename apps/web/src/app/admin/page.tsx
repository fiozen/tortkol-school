'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  LogOut,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Search,
  School,
  Sparkles,
  Database,
  Calendar,
  Phone,
  Eye,
  Check,
  ArrowUpRight,
  Clock,
  Layers,
  BookOpen,
  Filter,
  X,
  MessageSquare
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'teachers' | 'messages' | 'settings'>('overview');
  
  // Ma'lumotlar state'lari
  const [postsList, setPostsList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [leadersList, setLeadersList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Qidiruv va filtrlar
  const [searchQuery, setSearchQuery] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState<'all' | 'news' | 'education'>('all');
  const [teacherSubTab, setTeacherSubTab] = useState<'leaders' | 'teachers'>('leaders');
  const [messageFilter, setMessageFilter] = useState<'all' | 'new' | 'read'>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Yangi post formasi
  const [newPost, setNewPost] = useState({
    title: '',
    type: 'news',
    status: 'published',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  });

  // 1. Auth tekshiruvi
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/admin/login');
          return;
        }
        setAdminUser(data.user);
      } catch {
        router.replace('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router]);

  // 2. Barcha ma'lumotlarni yuklash
  const loadData = async () => {
    try {
      setLoadingData(true);
      const [resPosts, resTeachers, resLeaders, resMessages] = await Promise.all([
        fetch('/api/posts').then(r => r.json()).catch(() => ({ posts: [] })),
        fetch('/api/teachers?scope=teachers').then(r => r.json()).catch(() => ({ teachers: [] })),
        fetch('/api/teachers?scope=leaders').then(r => r.json()).catch(() => ({ leaders: [] })),
        fetch('/api/contact').then(r => r.json()).catch(() => ({ messages: [] })),
      ]);

      if (resPosts.posts) setPostsList(resPosts.posts);
      if (resTeachers.teachers) setTeachersList(resTeachers.teachers);
      if (resLeaders.leaders) setLeadersList(resLeaders.leaders);
      if (resMessages.messages) setMessagesList(resMessages.messages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      loadData();
    }
  }, [checkingAuth]);

  // Chiqish (Logout)
  const handleLogout = async () => {
    if (confirm('Admin tizimidan chiqmoqchimisiz?')) {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
    }
  };

  // Yangi post yaratish
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Post yaratishda xatolik yuz berdi');

      setFeedback({
        type: 'success',
        message: data.message || "Post muvaffaqiyatli saqlandi va fonda tarjima navbatiga qo'shildi!",
      });

      setNewPost({
        title: '',
        type: 'news',
        status: 'published',
        excerpt: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      });

      setShowNewPostModal(false);
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Postni o'chirish
  const handleDeletePost = async (id: number | string, title: string) => {
    if (!confirm(`"${title}" sarlavhali postni o'chirishni tasdiqlaysizmi?`)) return;

    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "O'chirishda xatolik");

      setFeedback({ type: 'success', message: "Post muvaffaqiyatli o'chirildi" });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Murojaat statusini yangilash
  const handleUpdateMessageStatus = async (id: number | string, status: string) => {
    try {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setMessagesList(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrlangan postlar
  const filteredPosts = useMemo(() => {
    return postsList.filter((p) => {
      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = postTypeFilter === 'all' || p.type === postTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [postsList, searchQuery, postTypeFilter]);

  // Filtrlangan murojaatlar
  const filteredMessages = useMemo(() => {
    return messagesList.filter((m) => {
      if (messageFilter === 'new') return m.status === 'new';
      if (messageFilter === 'read') return m.status === 'read';
      return true;
    });
  }, [messagesList, messageFilter]);

  const unreadMessagesCount = useMemo(() => {
    return messagesList.filter(m => m.status === 'new').length;
  }, [messagesList]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-slate-200/80 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#0047AB]" />
        </div>
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Admin sessiyasi tekshirilmoqda...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-800 flex flex-col md:flex-row antialiased font-poppins selection:bg-blue-100 selection:text-blue-900">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          {/* Logo va Brend */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00265B] via-[#003B8E] to-[#0047AB] flex items-center justify-center text-white shadow-md shadow-blue-900/20">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900 leading-tight">To‘rtko‘l Maktabi</div>
                <div className="text-[11px] font-semibold text-[#0047AB] tracking-wide mt-0.5">Boshqaruv Paneli</div>
              </div>
            </div>
          </div>

          {/* Menyu Navigatsiyasi */}
          <div className="p-4 space-y-6">
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Asosiy Boshqaruv
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[#0047AB] text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    activeTab === 'overview' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Asosiy
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('posts')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'posts'
                      ? 'bg-[#0047AB] text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span>Postlar & Materiallar</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    activeTab === 'posts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {postsList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'teachers'
                      ? 'bg-[#0047AB] text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>O‘qituvchilar tarkibi</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    activeTab === 'teachers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {(teachersList.length || 6) + (leadersList.length || 4)}
                  </span>
                </button>
              </nav>
            </div>

            <div>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Muloqot & Tizim
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-[#0047AB] text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <span>Kelgan murojaatlar</span>
                  </span>
                  {unreadMessagesCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white animate-pulse">
                      {unreadMessagesCount} yangi
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-[#0047AB] text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Baza & Sozlamalar</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Profil va Chiqish */}
        <div className="p-4 border-t border-slate-100 space-y-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0047AB] hover:bg-blue-50/60 transition-all border border-transparent hover:border-blue-100"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-[#0047AB]" />
              <span>Saytni ko‘rish</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0047AB] to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{adminUser?.username || 'admin'}</div>
                <div className="text-[10px] text-slate-500 font-medium">Bosh Administrator</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===================== ASOSIY ISH MAYDONI ===================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Yuqori Header Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-10 py-4 sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>To‘rtko‘l Maktabi</span>
                <span>/</span>
                <span className="text-[#0047AB]">
                  {activeTab === 'overview' && 'Boshqaruv Paneli'}
                  {activeTab === 'posts' && 'Postlar va Maqolalar'}
                  {activeTab === 'teachers' && 'Pedagogik Jamoa'}
                  {activeTab === 'messages' && 'Murojaatlar Pochtasi'}
                  {activeTab === 'settings' && 'Tizim va Baza'}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'posts' && 'Postlar boshqaruvi'}
                {activeTab === 'teachers' && 'O‘qituvchilar va Rahbariyat'}
                {activeTab === 'messages' && 'Kelgan murojaatlar'}
                {activeTab === 'settings' && 'Baza va Tizim holati'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tezkor qidiruv */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Materiallardan qidirish..."
                className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0047AB] focus:ring-2 focus:ring-blue-100 outline-none w-56 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={loadData}
              disabled={loadingData}
              title="Ma'lumotlarni yangilash"
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#0047AB] hover:border-blue-200 hover:bg-blue-50/50 transition-all disabled:opacity-50 shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-[#0047AB]' : ''}`} />
            </button>

            <button
              onClick={() => {
                setActiveTab('posts');
                setShowNewPostModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0047AB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi post</span>
            </button>
          </div>
        </header>

        {/* Kontent Konteyneri */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {/* Bildirishnoma (Feedback toast) */}
          {feedback && (
            <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between mb-6 shadow-sm border ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ==================== TAB 1: OVERVIEW (DASHBOARD) ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Xush kelibsiz banneri */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-sky-50 border border-blue-100/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
                <div className="max-w-2xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-blue-200 text-[#0047AB] text-xs font-bold mb-3 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#0047AB]" />
                    <span>To‘rtko‘l Maktabi Rasmiy Boshqaruv Markazi</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Xush kelibsiz, Bosh Administrator! 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Ushbu paneldan yangiliklar, ta'lim materiallari, pedagoglar jamoasi va ota-onalar tomonidan yuborilgan murojaatlarni real vaqt rejimida boshqaring.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#0047AB]" />
                    <span>{new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-700">Supabase Cloud Baza: Faol</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0047AB]" />
                    <span className="text-[#0047AB]">Avto-tarjima quvvati: 100%</span>
                  </div>
                </div>
              </div>

              {/* KPI Metrik kartalari */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Postlar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jami Materiallar</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{postsList.length}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Barchasi nashrda
                    </span>
                    <span className="text-slate-400 text-[11px]">Yangilik & Ta'lim</span>
                  </div>
                </div>

                {/* 2. O'qituvchilar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pedagoglar</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{teachersList.length || 6}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span className="text-emerald-600 font-bold">Oliy va 1-toifali</span>
                    <span className="text-slate-400 text-[11px]">Faol ustozlar</span>
                  </div>
                </div>

                {/* 3. Rahbariyat */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maktab Ma'muriyati</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <School className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{leadersList.length || 4}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span className="text-purple-600 font-bold">Direktor & o‘rinbosarlar</span>
                    <span className="text-slate-400 text-[11px]">4 ta bo‘lim</span>
                  </div>
                </div>

                {/* 4. Murojaatlar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelgan Murojaatlar</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{messagesList.length || 3}</div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span className={`font-bold ${unreadMessagesCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {unreadMessagesCount > 0 ? `${unreadMessagesCount} ta o‘qilmagan` : "Barchasi ko'rilgan"}
                    </span>
                    <span className="text-slate-400 text-[11px]">Sayt orqali</span>
                  </div>
                </div>
              </div>

              {/* Asosiy 2 ustunli tuzilma: So'nggi postlar va Yon widgetlar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chap 2 ustun: So'nggi materiallar jadvali */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">So‘nggi nashr etilgan materiallar</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Bazada saqlangan yangilik va ta'lim maqolalari ro‘yxati</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('posts');
                          setShowNewPostModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0047AB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Yangi post</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50/90 text-slate-500 border-y border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">Material Sarlavhasi</th>
                            <th className="py-3 px-4">Turi</th>
                            <th className="py-3 px-4">Holati</th>
                            <th className="py-3 px-4">Sana</th>
                            <th className="py-3 px-4 text-right">Amallar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {postsList.slice(0, 5).map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                                {p.title}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.type === 'education'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-blue-50 text-[#0047AB] border border-blue-200'
                                }`}>
                                  {p.type === 'education' ? "Ta'lim" : 'Yangilik'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {p.status === 'published' ? 'Nashr qilingan' : 'Qoralama'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 font-medium">
                                {p.published_at ? new Date(p.published_at).toLocaleDateString('uz-UZ') : 'Bugun'}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/maktab-hayoti/yangiliklar/${p.slug}`}
                                    target="_blank"
                                    title="Saytda ko‘rish"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0047AB] hover:bg-blue-50 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>
                                  <button
                                    onClick={() => handleDeletePost(p.id, p.title)}
                                    title="O‘chirish"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fon Tarjima Pipeline kartasi */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">Avtomatlashtirilgan Ko‘p Tilli Tizim</h4>
                          <p className="text-xs text-slate-500">1 marta o‘zbek tilida kiritilsa, qolgan 3 tilga avtomatik moslashtiriladi</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        100% Sinxron
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">O‘zbekcha (UZ)</div>
                        <div className="font-extrabold text-sm text-[#0047AB] mt-1">Asosiy Manba</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● 100% Faol</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Qoraqalpoqcha (QQ)</div>
                        <div className="font-extrabold text-sm text-slate-800 mt-1">Fonda Tarjima</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● Sinxron</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Ruscha (RU)</div>
                        <div className="font-extrabold text-sm text-slate-800 mt-1">Fonda Tarjima</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● Sinxron</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Inglizcha (EN)</div>
                        <div className="font-extrabold text-sm text-slate-800 mt-1">Fonda Tarjima</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● Sinxron</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* O'ng 1 ustun: Tezkor harakatlar va Murojaatlar snippet */}
                <div className="space-y-6">
                  {/* Tezkor harakatlar */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm mb-4">Tezkor Harakatlar</h4>
                    <div className="space-y-2.5">
                      <button
                        onClick={() => {
                          setActiveTab('posts');
                          setShowNewPostModal(true);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0047AB] flex items-center justify-center group-hover:bg-[#0047AB] group-hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Yangi post yozish</div>
                            <div className="text-[10px] text-slate-500">Yangilik yoki darslik qo‘shish</div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB]" />
                      </button>

                      <button
                        onClick={() => setActiveTab('teachers')}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Pedagoglarni ko‘rish</div>
                            <div className="text-[10px] text-slate-500">O‘qituvchilar va ma'muriyat</div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                      </button>

                      <button
                        onClick={() => setActiveTab('messages')}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-200 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Murojaatlarni tekshirish</div>
                            <div className="text-[10px] text-slate-500">Ota-onalar savollari</div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                      </button>
                    </div>
                  </div>

                  {/* So'nggi murojaatlar preview */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-extrabold text-slate-900 text-sm">So‘nggi Murojaatlar</h4>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-[11px] font-bold text-[#0047AB] hover:underline"
                      >
                        Barchasi →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {messagesList.slice(0, 2).map((msg) => (
                        <div key={msg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{msg.full_name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              msg.status === 'new'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              {msg.status === 'new' ? 'Yangi' : 'Ko‘rilgan'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate">{msg.subject}</div>
                          <div className="text-[11px] text-slate-600 line-clamp-2 italic">
                            "{msg.message}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Baza holati mini kartasi */}
                  <div className="bg-gradient-to-br from-slate-900 to-[#00265B] text-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="w-5 h-5 text-blue-400" />
                      <div className="font-bold text-sm">Supabase Cloud Baza</div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      PostgreSQL 15 klasteri orqali ma'lumotlar real vaqtda xavfsiz sinxronlanmoqda.
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: POSTS ==================== */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {/* Harakatlar paneli */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPostTypeFilter('all')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      postTypeFilter === 'all'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Barcha materiallar ({postsList.length})
                  </button>
                  <button
                    onClick={() => setPostTypeFilter('news')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      postTypeFilter === 'news'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Yangiliklar ({postsList.filter(p => p.type === 'news').length})
                  </button>
                  <button
                    onClick={() => setPostTypeFilter('education')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      postTypeFilter === 'education'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Ta'lim materiallari ({postsList.filter(p => p.type === 'education').length})
                  </button>
                </div>

                <button
                  onClick={() => setShowNewPostModal(!showNewPostModal)}
                  className="px-5 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  {showNewPostModal ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showNewPostModal ? 'Formani yopish' : 'Yangi material yaratish'}</span>
                </button>
              </div>

              {/* Yangi post yaratish formasi (Expandable Card) */}
              {showNewPostModal && (
                <div className="bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-900/5 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Yangi material qo‘shish (O‘zbekcha)</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Siz ma'lumotni o‘zbek tilida kiritasiz. Tizim fonda QQ, RU va EN tillariga avtomatik tarjima topshiriqlarini yaratadi.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewPostModal(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePost} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Maqola sarlavhasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Masalan: Respublika fan olimpiadasida 1-o'rin sohiblari taqdirlandi"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Post turi</label>
                        <select 
                          value={newPost.type}
                          onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-[#0047AB]"
                        >
                          <option value="news">Yangilik (Maktab hayoti)</option>
                          <option value="education">Ta'lim materiali (Darslik / Metodika)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nashr holati</label>
                        <select 
                          value={newPost.status}
                          onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-[#0047AB]"
                        >
                          <option value="published">Darhol saytda nashr qilish</option>
                          <option value="draft">Qoralamada saqlash</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Muqova rasmi (URL)</label>
                      <input
                        type="url"
                        value={newPost.coverImage}
                        onChange={(e) => setNewPost({ ...newPost, coverImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Qisqa anons (Excerpt)</label>
                      <textarea
                        rows={2}
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                        placeholder="Xabarning 1-2 jumlalik qisqacha mazmuni..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        To‘liq maqola matni <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Maqola matnini bu yerga to‘liq yozing..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewPostModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{submitting ? 'Saqlanmoqda...' : 'Nashr qilish (Fonda avto-tarjima bilan)'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Postlar ro'yxati jadvali */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/90 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-6">Material</th>
                        <th className="py-3.5 px-4">Turi</th>
                        <th className="py-3.5 px-4">Holati</th>
                        <th className="py-3.5 px-4">Sana</th>
                        <th className="py-3.5 px-6 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                            Mos keluvchi materiallar topilmadi
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-6 max-w-md">
                              <div className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.excerpt || p.content?.slice(0, 80)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.type === 'education'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-blue-50 text-[#0047AB] border border-blue-200'
                              }`}>
                                {p.type === 'education' ? "Ta'lim" : 'Yangilik'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {p.status === 'published' ? 'Nashr qilingan' : 'Qoralama'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-500 font-medium">
                              {p.published_at ? new Date(p.published_at).toLocaleDateString('uz-UZ') : 'Bugun'}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/maktab-hayoti/yangiliklar/${p.slug}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-[#0047AB] hover:bg-blue-100 font-bold text-[11px] transition-colors"
                                >
                                  <span>Ochish</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </Link>
                                <button
                                  onClick={() => handleDeletePost(p.id, p.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="O‘chirish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: TEACHERS & LEADERSHIP ==================== */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              {/* Ichki sub-tablar */}
              <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs max-w-md">
                <button
                  onClick={() => setTeacherSubTab('leaders')}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    teacherSubTab === 'leaders'
                      ? 'bg-[#0047AB] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Rahbariyat ({leadersList.length || 4})
                </button>
                <button
                  onClick={() => setTeacherSubTab('teachers')}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    teacherSubTab === 'teachers'
                      ? 'bg-[#0047AB] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Pedagoglar jamoasi ({teachersList.length || 6})
                </button>
              </div>

              {/* 1. Rahbariyat kartalari */}
              {teacherSubTab === 'leaders' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {leadersList.map((leader) => (
                    <div key={leader.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00265B] to-[#0047AB] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-900/10 flex-shrink-0">
                        {leader.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'RM'}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{leader.fullName}</div>
                          <div className="text-xs font-bold text-[#0047AB] mt-0.5">{leader.role}</div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{leader.bio}</p>
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                          <span className="font-medium text-slate-500">Qabul: <b className="text-slate-800">{leader.receptionDays}</b></span>
                          <span className="text-slate-300">•</span>
                          <span className="font-medium text-slate-500">Tel: <b className="text-slate-800">{leader.phone}</b></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. O'qituvchilar kartalari */}
              {teacherSubTab === 'teachers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {teachersList.map((teacher) => (
                    <div key={teacher.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow space-y-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-sm shadow-sm flex-shrink-0">
                          {teacher.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'PJ'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">{teacher.fullName}</div>
                          <div className="text-[10px] font-bold text-emerald-600 mt-0.5">{teacher.category}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {teacher.bio}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {(teacher.subjects || [teacher.subject]).filter(Boolean).map((sub: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: MESSAGES ==================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Filtrlar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMessageFilter('all')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      messageFilter === 'all'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Barcha murojaatlar ({messagesList.length})
                  </button>
                  <button
                    onClick={() => setMessageFilter('new')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      messageFilter === 'new'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Yangi (O‘qilmagan) ({messagesList.filter(m => m.status === 'new').length})
                  </button>
                  <button
                    onClick={() => setMessageFilter('read')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      messageFilter === 'read'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Ko‘rilgan ({messagesList.filter(m => m.status === 'read').length})
                  </button>
                </div>
              </div>

              {/* Murojaatlar ro'yxati */}
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-400 font-medium">
                    Hozircha hech qanday murojaat yo‘q
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div key={msg.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center font-bold text-sm">
                            {msg.full_name?.[0] || 'M'}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                              <span>{msg.full_name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                msg.status === 'new'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {msg.status === 'new' ? 'Yangi murojaat' : 'Ko‘rilgan'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Telefon: <a href={`tel:${msg.phone}`} className="text-[#0047AB] font-semibold hover:underline">{msg.phone}</a>
                              {' • '}
                              Mavzu: <span className="font-semibold text-slate-700">{msg.subject}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.status === 'new' ? (
                            <button
                              onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Ko‘rildi deb belgilash</span>
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ko‘rib chiqilgan
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic">
                        "{msg.message}"
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Yuborilgan vaqti: {msg.created_at ? new Date(msg.created_at).toLocaleString('uz-UZ') : 'Yaqinda'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 5: SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              {/* Baza holati kartasi */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Maʼlumotlar bazasi va Tizim infratuzilmasi</h3>
                  <p className="text-xs text-slate-500 mt-1">To‘rtko‘l ixtisoslashtirilgan maktabi rasmiy portali sozlamalari</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Bulutli Ma'lumotlar Bazasi</div>
                    <div className="font-extrabold text-slate-900 text-sm">Supabase Cloud PostgreSQL</div>
                    <div className="text-xs text-slate-500 truncate">https://gpnzugnjdybdtsbazzzp.supabase.co</div>
                    <div className="pt-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● REST API Ulangan
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Yagona Administrator</div>
                    <div className="font-extrabold text-slate-900 text-sm">admin (SuperAdmin)</div>
                    <div className="text-xs text-slate-500">Xavfsiz HttpOnly sessiya bilan himoyalangan</div>
                    <div className="pt-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#0047AB] border border-blue-200">
                        ● Faol sessiya
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Ko‘p Tilli Tizim (i18n)</div>
                    <div className="font-extrabold text-slate-900 text-sm">UZ, QQ, RU, EN</div>
                    <div className="text-xs text-slate-500">Avtomatik tarjima navbati va sinxronizatsiya</div>
                    <div className="pt-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● 4 ta til faol
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Maktab Rekvizitlari</div>
                    <div className="font-extrabold text-slate-900 text-sm">To‘rtko‘l tumani ixtisoslashtirilgan maktabi</div>
                    <div className="text-xs text-slate-500">Qoraqalpog‘iston Resp., To‘rtko‘l t., Beruniy ko‘chasi, 1-uy</div>
                    <div className="pt-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        Rasmiy davlat muassasasi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Baza jadvallari va SQL schema eslatmasi */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">Bazada mavjud bo‘lgan jadvallar</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['posts', 'categories', 'teachers', 'leadership', 'contact_messages', 'translation_jobs', 'translations', 'hero_slides'].map((t) => (
                    <div key={t} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-slate-700 text-center font-semibold">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
