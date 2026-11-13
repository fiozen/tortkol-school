'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { Search, Award, BookOpen, GraduationCap } from 'lucide-react';

const officialTeachers = [
  {
    id: 1,
    fullName: "Allamuratov Timur Karimovich",
    subject: "Matematika",
    category: "Oliy toifali ustoz",
    experience: "12 yil",
    bio: "Respublika va xalqaro matematika olimpiadalari g‘oliblari murabbiyi. Chuqurlashtirilgan mantiqiy masalalar muallifi.",
    initials: "AT",
    accentColor: "from-blue-600 to-indigo-600",
  },
  {
    id: 2,
    fullName: "Jumaniyazova Malika Baxtiyarovna",
    subject: "Fizika",
    category: "Oliy toifali ustoz",
    experience: "14 yil",
    bio: "Fizika fanidan zamonaviy laboratoriya mashg‘ulotlari yetakchisi, fizika olimpiadalari hakamlar hay’ati a'zosi.",
    initials: "JM",
    accentColor: "from-blue-600 to-cyan-600",
  },
  {
    id: 3,
    fullName: "Karimov Eldor Rustamovich",
    subject: "Kimyo",
    category: "Oliy toifali ustoz",
    experience: "11 yil",
    bio: "Xalqaro kimyo olimpiadasi sovrindori va murabbiyi. Kimyo laboratoriyasi mudiri.",
    initials: "KE",
    accentColor: "from-emerald-600 to-teal-600",
  },
  {
    id: 4,
    fullName: "Sodiqova Nilufar Shuhratovna",
    subject: "Biologiya",
    category: "1-toifali mutaxassis",
    experience: "9 yil",
    bio: "Xalqaro IBO biologiya olimpiadasi kuratori, genetika va amaliy biologiya mashg'ulotlari rahbari.",
    initials: "SN",
    accentColor: "from-teal-600 to-emerald-700",
  },
  {
    id: 5,
    fullName: "Xolmatov Diyor Mahmudovich",
    subject: "Informatika va IT",
    category: "Yetakchi mutaxassis",
    experience: "8 yil",
    bio: "Python, Algoritmlar va Robototexnika to‘garagi rahbari. Xalqaro IT tanlovlar koordinatori.",
    initials: "XD",
    accentColor: "from-purple-600 to-indigo-600",
  },
  {
    id: 6,
    fullName: "Madaminova Zarina Ilhomovna",
    subject: "Ingliz tili",
    category: "Xalqaro toifali (IELTS 8.5)",
    experience: "7 yil",
    bio: "CEFR va xalqaro til sertifikatlariga tayyorlash bo‘yicha ekspert. Akademik ingliz tili darslari muallifi.",
    initials: "MZ",
    accentColor: "from-rose-600 to-orange-600",
  },
];

export default function OqituvchilarPage() {
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [teachers, setTeachers] = useState<any[]>(officialTeachers);

  useEffect(() => {
    fetch('/api/teachers?scope=teachers')
      .then(res => res.json())
      .then(data => {
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers.map((teach: any, idx: number) => ({
            id: teach.id || idx + 1,
            fullName: teach.full_name || teach.fullName,
            subject: teach.subjects ? (Array.isArray(teach.subjects) ? teach.subjects.join(', ') : teach.subjects) : teach.subject || 'Ixtisos fan',
            category: teach.category,
            experience: teach.experience || '10+ yil',
            bio: teach.bio,
            initials: (teach.full_name || teach.fullName).split(' ').slice(0, 2).map((w: string) => w[0]).join(''),
            accentColor: officialTeachers[idx % officialTeachers.length]?.accentColor || "from-blue-600 to-indigo-600",
            imageUrl: teach.photo_url?.startsWith('http') && !teach.photo_url.includes('unsplash') ? teach.photo_url : null,
          })));
        }
      })
      .catch(console.error);
  }, []);

  const subjects = ['Barchasi', 'Matematika', 'Fizika', 'Kimyo', 'Biologiya', 'Informatika va IT', 'Ingliz tili'];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSubject = selectedSubject === 'Barchasi' || teacher.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-pill mb-3">{t.nav.about}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.teachers}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Maktabimizda o‘quvchilarga ta’lim beruvchi oliy toifali pedagoglar va xalqaro darajadagi mutaxassislar.
          </p>
        </div>

        {/* Filtr va Qidiruv */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Fanlar bo'yicha tablar */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedSubject === sub
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-sky-500/25'
                    : 'bg-white border border-sky-100 text-slate-700 hover:bg-sky-50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Qidiruv input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ustozni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* O'qituvchilar Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="card-bento p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {/* Surat yoki Professional Avatar */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-sm">
                    {teacher.imageUrl ? (
                      <img
                        src={teacher.imageUrl}
                        alt={teacher.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${teacher.accentColor} flex items-center justify-center text-white font-bold text-base shadow-inner`}>
                        {teacher.initials}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      {teacher.subject}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {teacher.fullName}
                    </h3>
                  </div>
                </div>

                <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                  {teacher.category}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {teacher.bio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>{teacher.experience} tajriba</span>
                </span>
                <span className="text-blue-600 font-semibold">Ixtisoslashgan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
