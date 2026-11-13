'use client';

import React from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { BookOpen, GraduationCap, Award, Compass, Sparkles } from 'lucide-react';

export default function TalimPage() {
  const { t } = useLanguage();

  const programs = [
    {
      title: "Chuqurlashtirilgan o'quv dasturi",
      desc: "Davlat ta'lim standartlari asosida tuzilgan, xalqaro ilg'or tajribalarga moslashtirilgan o'quv rejalari.",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Olimpiada to'garaklari",
      desc: "Xalqaro va respublika miqyosidagi fan olimpiadalariga tayyorlovchi ixtisoslashgan maxsus darslar.",
      icon: Award,
      color: "emerald",
    },
    {
      title: "Amaliy laboratoriya mashg'ulotlari",
      desc: "Zamonaviy fizika, kimyo va biologiya laboratoriyalarida real tajribalar o'tkazish imkoniyati.",
      icon: Compass,
      color: "purple",
    },
    {
      title: "Chet tillarini chuqur o'rganish",
      desc: "Ingliz tili darslari xalqaro standartlar asosida olib borilib, IELTS va CEFR sertifikatlariga tayyorlanadi.",
      icon: GraduationCap,
      color: "amber",
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-pill mb-3">{t.nav.schoolLife}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.education} jarayoni va metodikasi
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            To‘rtko‘l ixtisoslashtirilgan maktabida ta’lim sifati, o‘quv standartlari va o‘quvchilar imkoniyatlari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="card-bento p-8 sm:p-10 flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
