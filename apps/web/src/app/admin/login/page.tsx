'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  School,
  Globe,
  ShieldCheck
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'password' | 'oneid'>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login yoki parol noto‘g‘ri');
      }

      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Tizimga kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-[#F5F7FB] font-poppins p-4 sm:p-6 lg:p-8 relative">
      {/* Yuqori qism: Orqaga qaytish va Til ko'rsatkichi */}
      <div className="w-full max-w-md flex items-center justify-between pt-2 sm:pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0047AB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Maktab saytiga qaytish</span>
        </Link>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-semibold text-slate-600 shadow-sm">
          <Globe className="w-3.5 h-3.5 text-[#0047AB]" />
          <span>O‘zbekcha (UZ)</span>
        </div>
      </div>

      {/* Markaziy Login Kartasi */}
      <div className="w-full max-w-md my-auto py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 relative">
          {/* Maktab logosi va nomi */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 flex-shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-[#1C1E26] leading-tight">
                To‘rtko‘l Maktabi
              </div>
              <div className="text-[11px] font-semibold text-[#0047AB] uppercase tracking-wider mt-0.5">
                PIIMA Agentligi Tizimida
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1E26] tracking-tight">
            Tizimga kirish
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
            Maktab boshqaruv tizimiga kirish uchun maʼlumotlaringizni kiriting.
          </p>

          {/* Autentifikatsiya usuli switcheri (Kirish / OneID) */}
          <div className="mt-6 p-1 bg-[#EEF3FF] rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-[#0047AB] shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Kirish
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('oneid')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                authMethod === 'oneid'
                  ? 'bg-white text-[#0047AB] shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              OneID
            </button>
          </div>

          {/* Xatolik xabari */}
          {errorMsg && (
            <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login va Parol Formasi */}
          {authMethod === 'password' ? (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Login
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0047AB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Parol
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0047AB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-[#0047AB] hover:bg-blue-900 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Tekshirilmoqda...' : 'Tizimga kirish'}
              </button>
            </form>
          ) : (
            /* OneID Tanlovi */
            <div className="mt-6 p-6 rounded-2xl bg-[#EEF3FF] border border-blue-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0047AB] flex items-center justify-center mx-auto font-bold text-lg">
                ID
              </div>
              <div>
                <h4 className="font-bold text-[#1C1E26] text-sm">Yagona identifikatsiya tizimi (OneID)</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Davlat xizmatlari portali orqali tezkor va xavfsiz avtorizatsiya.
                </p>
              </div>
              <a
                href="https://sso.egov.uz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-900 text-white font-semibold text-xs transition-colors"
              >
                OneID orqali kirish ↗
              </a>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0047AB]" />
            <span>Xavfsiz boshqaruv tizimi</span>
          </div>
        </div>
      </div>

      {/* Pastki mualliflik qismi */}
      <div className="w-full max-w-md text-center pb-2 sm:pb-4 text-xs text-gray-400">
        © {new Date().getFullYear()} PIIMA — To‘rtko‘l ixtisoslashtirilgan maktabi
      </div>
    </div>
  );
}
