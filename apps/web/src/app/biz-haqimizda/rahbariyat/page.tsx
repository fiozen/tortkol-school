'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { Calendar, Phone, Mail, Award, UserCheck } from 'lucide-react';

const officialLeaders = [
  {
    id: 1,
    fullName: "Ismailov Fazliddin Baxriddinovich",
    role: "Maktab direktori",
    receptionDays: "Dushanba - Chorshanba, 14:00 - 17:00",
    phone: "+998 (61) 512-24-40",
    email: "direktor@tortkol-maktab.uz",
    bio: "Fizika-matematika fanlari nomzodi. Ta’lim boshqaruvi va ixtisoslashtirilgan maktablar tizimida ko‘p yillik rahbarlik tajribasiga ega.",
    initials: "IF",
    accentColor: "from-blue-600 to-indigo-700",
  },
  {
    id: 2,
    fullName: "Utepov Sanjar Shamuratovich",
    role: "O‘quv ishlari bo‘yicha direktor o‘rinbosari",
    receptionDays: "Seshanba - Payshanba, 10:00 - 13:00",
    phone: "+998 (61) 512-24-41",
    email: "oquv@tortkol-maktab.uz",
    bio: "Oliy toifali pedagog. Chuqurlashtirilgan davlat ta’lim standartlari, dars jadvallari va ilmiy metodik jarayonlar koordinatori.",
    initials: "US",
    accentColor: "from-blue-600 to-cyan-600",
  },
  {
    id: 3,
    fullName: "Davidova Dilrabo Tajibayevna",
    role: "Ixtisos fanlar bo‘yicha direktor o‘rinbosari",
    receptionDays: "Chorshanba - Juma, 14:00 - 16:00",
    phone: "+998 (61) 512-24-42",
    email: "ixtisos@tortkol-maktab.uz",
    bio: "Biologiya va kimyo fanlari bo‘yicha yetakchi metodist. Zamonaviy laboratoriyalar va amaliy tadqiqotlar rahbari.",
    initials: "DT",
    accentColor: "from-emerald-600 to-teal-700",
  },
  {
    id: 4,
    fullName: "Odiljonov Ulug‘bek Komiljonovich",
    role: "Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari",
    receptionDays: "Har kuni, 09:00 - 12:00",
    phone: "+998 (61) 512-24-43",
    email: "manaviyat@tortkol-maktab.uz",
    bio: "Yoshlar siyosati, ijtimoiy-madaniy tadbirlar, vatanparvarlik tarbiyasi va to‘garaklar faoliyatini muvofiqlashtiruvchi mas'ul.",
    initials: "UO",
    accentColor: "from-purple-600 to-indigo-700",
  },
];

export default function RahbariyatPage() {
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState<any[]>(officialLeaders);

  useEffect(() => {
    fetch('/api/teachers?scope=leaders')
      .then(res => res.json())
      .then(data => {
        if (data.leaders && data.leaders.length > 0) {
          setLeaders(data.leaders.map((l: any, idx: number) => ({
            id: l.id || idx + 1,
            fullName: l.full_name || l.fullName,
            role: l.role,
            receptionDays: l.reception_days || l.receptionDays,
            phone: l.phone || "+998 (61) 512-24-40",
            email: l.email || "info@tortkol-maktab.uz",
            bio: l.bio,
            initials: (l.full_name || l.fullName).split(' ').slice(0, 2).map((w: string) => w[0]).join(''),
            accentColor: officialLeaders[idx % officialLeaders.length]?.accentColor || "from-blue-600 to-indigo-700",
            imageUrl: l.photo_url?.startsWith('http') && !l.photo_url.includes('unsplash') ? l.photo_url : null,
          })));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha qismi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-pill mb-3">{t.nav.about}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.leadership}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            To‘rtko‘l ixtisoslashtirilgan maktabining ma’muriy va ilmiy boshqaruv jamoasi.
          </p>
        </div>

        {/* Rahbariyat kartalari Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leaders.map((leader) => (
            <div 
              key={leader.id} 
              className="card-bento p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              {/* Surat yoki Professional Rasmiy Avatar */}
              <div className="w-full sm:w-40 aspect-[4/5] rounded-2xl overflow-hidden flex-shrink-0 relative shadow-sm">
                {leader.imageUrl ? (
                  <img
                    src={leader.imageUrl}
                    alt={leader.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${leader.accentColor} flex flex-col items-center justify-center text-white p-4 text-center select-none`}>
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-2xl tracking-wider shadow-inner mb-2">
                      {leader.initials}
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                      Rahbariyat
                    </div>
                  </div>
                )}
              </div>

              {/* Ma'lumotlar */}
              <div className="flex-grow flex flex-col justify-between h-full">
                <div>
                  <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200/80 mb-2.5">
                    {leader.role}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {leader.fullName}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed font-normal">
                    {leader.bio}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-sky-100/80 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
                    <span><strong className="text-slate-800">Qabul kunlari:</strong> {leader.receptionDays}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
                    <span><strong className="text-slate-800">Aloqa:</strong> {leader.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
