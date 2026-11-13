'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { Image as ImageIcon, Video, Play, ZoomIn } from 'lucide-react';
import { ImageViewer } from '../../../components/ImageViewer';

export default function GalereyaPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const photoAlbums = [
    {
      id: 1,
      title: 'Fan laboratoriyalari amaliyot darslari',
      caption: 'Kimyo va biologiya laboratoriyalarida o‘quvchilar tomonidan o‘tkazilgan amaliy mashg‘ulotlar.',
      count: '16 ta surat',
      coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 2,
      title: 'Respublika fan olimpiadasi ishtirokchilari',
      caption: 'Matematika va fizika fanlaridan saralash musobaqalari va g‘olib o‘quvchilar taqdirlanishi.',
      count: '24 ta surat',
      coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 3,
      title: 'Maktab binosi, sport zali va kutubxona',
      caption: 'Maktabimizning zamonaviy infratuzilmasi, shinam dars xonalari va sport majmuasi.',
      count: '18 ta surat',
      coverUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 4,
      title: 'Madaniy tadbirlar va maʼnaviy kechalar',
      caption: 'O‘quvchilar ishtirokida o‘tkazilgan badiiy chiqishlar va bayram dasturlari.',
      count: '30 ta surat',
      coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 5,
      title: 'Axborot-resurs markazi va mustaqil taʼlim',
      caption: 'Kutubxonada ilmiy adabiyotlar bilan mustaqil ishlash va kitobxonlik kechalari.',
      count: '12 ta surat',
      coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 6,
      title: 'Interaktiv darslar va xorijiy tillar',
      caption: 'Xorijiy mutaxassislar ishtirokida o‘tkazilgan ingliz tili darslari.',
      count: '15 ta surat',
      coverUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85',
    },
  ];

  const viewerImages = photoAlbums.map(album => ({
    url: album.coverUrl,
    title: album.title,
    caption: album.caption,
  }));

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const videos = [
    {
      id: 1,
      title: "To'rtko'l ixtisoslashtirilgan maktabi haqida maxsus videorolik",
      duration: '4:15',
      coverUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube.com',
    },
    {
      id: 2,
      title: "Xalqaro olimpiada sovrindorlari bilan ochiq muloqot",
      duration: '7:40',
      coverUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube.com',
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-pill mb-3">{t.nav.about}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.gallery}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Maktabimiz hayoti, o‘quv jarayonlari va yutuqlarimizdan fotolavhalar hamda videoroliklar.
          </p>

          {/* Tablar: Fotolar / Videolar */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'photos'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Fotoalbomlar</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videolavhalar</span>
            </button>
          </div>
        </div>

        {/* Fotolar qismi */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photoAlbums.map((album, idx) => (
              <div 
                key={album.id} 
                onClick={() => openViewer(idx)}
                className="card-bento overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                    {album.count}
                  </div>

                  {/* Markazda Kattalashtirish Ikonkasi */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {album.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                    {album.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videolar qismi */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((vid) => (
              <div key={vid.id} className="card-bento overflow-hidden group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <img
                    src={vid.coverUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-white">
                    {vid.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {vid.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rasm ko'rish modali (ImageViewer Lightbox) */}
      <ImageViewer
        isOpen={viewerOpen}
        images={viewerImages}
        currentIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setViewerIndex}
      />
    </div>
  );
}
