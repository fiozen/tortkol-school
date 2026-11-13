'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { ArrowRight, Users, Award, TrendingUp, Sparkles } from 'lucide-react';

export const BentoStats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white font-poppins border-y border-sky-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Ustunli "Biz haqimizda" Struktura: [Matn 40%] - [Foto 30%] - [Statistika 30%] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Ustun 1: Maktab haqida kirish matni (5 ustun) */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[#0284C7] font-bold text-xs sm:text-sm tracking-wider uppercase block">
              BIZ HAQIMIZDA
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              To‘rtko‘l Ixtisoslashtirilgan Maktabi
            </h2>

            <p className="text-slate-600 text-[15px] leading-relaxed">
              O‘quvchilarimizga fundamental fanlar bo‘yicha chuqur bilim berish, ularning intellektual salohiyatini ro‘yobga chiqarish va respublikamizning yetakchi oliygohlari hamda nufuzli xalqaro universitetlariga tayyorlash asosiy maqsadimizdir.
            </p>

            <p className="text-slate-600 text-[15px] leading-relaxed">
              Maktabimizda zamonaviy IT va tabiiy fanlar laboratoriyalari, interaktiv dars xonalari hamda boy kutubxona tarmog‘i faoliyat ko‘rsatmoqda.
            </p>

            <div className="pt-2">
              <Link
                href="/biz-haqimizda/maktab-haqida"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg transition-all active:scale-95"
              >
                <span>Maktab haqida to‘liq maʼlumot</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Ustun 2: Asosiy Foto Kartochkasi (3.5 ustun) */}
          <div className="lg:col-span-3.5">
            <div className="rounded-[32px] overflow-hidden shadow-xl border border-sky-100 aspect-[3/4] relative group bg-sky-50">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=85"
                alt="To'rtko'l maktabi dars jarayoni"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0369A1]/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-bold text-sky-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Iqtidorli Yoshlar</span>
                </div>
                <div className="text-sm font-bold leading-snug">
                  Xalqaro olimpiadalar va ilmiy loyihalar ishtirokchilari
                </div>
              </div>
            </div>
          </div>

          {/* Ustun 3: Katak Ko'rsatkichlar (3.5 ustun) */}
          <div className="lg:col-span-3.5 flex flex-col gap-4">
            {/* Statistika 1: O'quvchilar */}
            <div className="bg-gradient-to-br from-sky-50/90 via-blue-50/40 to-white border border-sky-100 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] bg-clip-text text-transparent">
                {t.stats.students}
              </div>
              <div className="text-slate-900 font-extrabold text-sm sm:text-base mt-2">
                O‘quvchilar soni
              </div>
              <div className="text-slate-500 text-xs mt-0.5">
                {t.stats.studentsDesc}
              </div>
            </div>

            {/* Statistika 2: Ustozlar */}
            <div className="bg-gradient-to-br from-sky-50/90 via-blue-50/40 to-white border border-sky-100 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] bg-clip-text text-transparent">
                {t.stats.teachers}
              </div>
              <div className="text-slate-900 font-extrabold text-sm sm:text-base mt-2">
                Oliy toifali ustozlar
              </div>
              <div className="text-slate-500 text-xs mt-0.5">
                {t.stats.teachersDesc}
              </div>
            </div>

            {/* Statistika 3: OTM natijasi */}
            <div className="bg-gradient-to-br from-sky-50/90 via-blue-50/40 to-white border border-sky-100 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] bg-clip-text text-transparent">
                {t.stats.admissionRate}
              </div>
              <div className="text-slate-900 font-extrabold text-sm sm:text-base mt-2">
                OTMga kirish natijasi
              </div>
              <div className="text-slate-500 text-xs mt-0.5">
                {t.stats.admissionRateDesc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
