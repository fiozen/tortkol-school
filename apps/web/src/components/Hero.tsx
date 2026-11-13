'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowUpRight, 
  Sparkles, 
  ZoomIn, 
  GraduationCap,
  Microscope,
  Award,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { ImageViewer } from './ImageViewer';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const schoolSlides = [
    {
      id: 1,
      title: "Zamonaviy maktab binosi va qulay taʼlim infratuzilmasi",
      subtitle: "Xalqaro standartlarga to‘liq javob beruvchi yorug‘ dars xonalari, keng hovli va qulay akademik muhit",
      badge: "Maktab binosi",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=85",
    },
    {
      id: 2,
      title: "Chuqurlashtirilgan kimyo va biologiya laboratoriyalari",
      subtitle: "O‘quvchilar amaliy ilmiy tadqiqotlar o‘tkazishi uchun ilg‘or zamonaviy uskunalar va xavfsiz reaktivlar",
      badge: "Ilmiy laboratoriya",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=85",
    },
    {
      id: 3,
      title: "Iqtidorli yoshlar va interaktiv dars jarayonlari",
      subtitle: "Aqlli doskalar, zamonaviy kompyuter texnologiyalari va individual chuqurlashtirilgan o‘quv rejasi",
      badge: "Dars jarayoni",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85",
    },
    {
      id: 4,
      title: "Boy axborot-resurs markazi va mutolaa zali",
      subtitle: "Aniq va tabiiy fanlar bo‘yicha fundamental ilmiy adabiyotlar hamda nufuzli xalqaro darsliklar fondi",
      badge: "Kutubxona",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=85",
    },
  ];

  // Avtomatik slayd almashtirish (har 6 soniyada)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % schoolSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, schoolSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % schoolSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + schoolSlides.length) % schoolSlides.length);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#F0F8FF] via-[#F6FAFF] to-white pt-8 pb-16 lg:pt-14 lg:pb-20 font-poppins overflow-hidden">
      {/* Moviy Yaltiroq Nur (Horizon Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#38BDF8]/20 via-[#0EA5E9]/10 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 2-Ustunli Top Blok */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-3xl">
            {/* PIIMA Nishoni */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-[#0284C7] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse" />
              <span>PIIMA Agentligi Tizimidagi Ixtisoslashtirilgan Maktab</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.16]">
              To‘rtko‘l Ixtisoslashtirilgan{' '}
              <span className="bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0EA5E9] bg-clip-text text-transparent">
                Davlat Maktabi
              </span>
            </h1>
            
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Aniq va tabiiy fanlarga ixtisoslashtirilgan, xalqaro ta'lim standartlari hamda ilg‘or zamonaviy laboratoriyalarga ega nufuzli davlat ta'lim maskani.
            </p>
          </div>

          {/* Tugmalar va < 01 / 04 > Slayd navigatsiyasi */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/biz-haqimizda/maktab-haqida"
              className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>{t.hero.learnMoreBtn}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* Slayd Navigatsiyasi */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-sky-100 shadow-xs">
              <button
                onClick={prevSlide}
                aria-label="Oldingi slayd"
                className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-[#0284C7] text-slate-700 hover:text-white flex items-center justify-center transition-all active:scale-90"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-slate-700 px-2 tracking-wider">
                0{currentSlide + 1} / 0{schoolSlides.length}
              </span>

              <button
                onClick={nextSlide}
                aria-label="Keyingi slayd"
                className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-[#0284C7] text-slate-700 hover:text-white flex items-center justify-center transition-all active:scale-90"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Katta Banner Slayderi (rounded-[36px], moviy hoshiya) */}
        <div 
          className="relative rounded-[36px] overflow-hidden shadow-2xl shadow-sky-900/10 border-2 border-sky-100/90 aspect-[16/9] sm:aspect-[21/9] bg-slate-900 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {schoolSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient soya */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              {/* Slayd ustidagi ma'lumotlar */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 text-left z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white backdrop-blur-md mb-3 border border-white/20 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                    <span>{slide.badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                    {slide.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-base text-slate-200 line-clamp-2 max-w-xl font-medium">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Kattalashtirish (Lightbox) tugmasi */}
                <button
                  onClick={() => setViewerOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all self-start sm:self-auto"
                >
                  <ZoomIn className="w-4 h-4 text-sky-300" />
                  <span>Kattalashtirib ko‘rish</span>
                </button>
              </div>
            </div>
          ))}

          {/* Pastki progress indikator chiziqlari */}
          <div className="absolute top-5 left-6 z-30 flex gap-2">
            {schoolSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-10 bg-[#38BDF8]' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slayd ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4 ta Bento Thumbnail kartasi */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {schoolSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3.5 ${
                idx === currentSlide
                  ? 'bg-white border-[#0284C7] shadow-md shadow-sky-500/15 ring-2 ring-[#0284C7]/20'
                  : 'bg-white/80 border-sky-100 hover:bg-white hover:border-sky-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <div className={`text-xs font-bold truncate ${idx === currentSlide ? 'text-[#0284C7]' : 'text-slate-900'}`}>
                  {slide.badge}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {slide.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 4 ta Asosiy Afzallik Lentalari (Feature Ribbon) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-sky-100/80">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">PIIMA Standarti</div>
              <div className="text-[11px] text-slate-500">Ixtisoslashtirilgan tizim</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold flex-shrink-0">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">STEM Laboratoriyalar</div>
              <div className="text-[11px] text-slate-500">Amaliy ilmiy tadqiqot</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Xalqaro Olimpiadalar</div>
              <div className="text-[11px] text-slate-500">G‘oliblar va sovrindorlar</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">100% OTM Natijasi</div>
              <div className="text-[11px] text-slate-500">Yetakchi universitetlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / ImageViewer modal */}
      <ImageViewer
        isOpen={viewerOpen}
        images={schoolSlides.map((s) => ({
          url: s.imageUrl,
          title: s.title,
          caption: s.subtitle,
        }))}
        currentIndex={currentSlide}
        onClose={() => setViewerOpen(false)}
        onIndexChange={(newIdx) => setCurrentSlide(newIdx)}
      />
    </section>
  );
};
