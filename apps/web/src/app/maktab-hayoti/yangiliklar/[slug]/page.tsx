'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Tag, CheckCircle2 } from 'lucide-react';

export default function YangilikDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const [copied, setCopied] = React.useState(false);
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/posts?slug=${unwrappedParams.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [unwrappedParams.slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const title = post?.title || "O‘quvchilarimiz Xalqaro olimpiadada munosib ishtirok etib sovrinli o'rinlarni egallashdi";
  const excerpt = post?.excerpt || "Maktabimiz iqtidorli o‘quvchilari matematika va biologiya fanlari bo‘yicha xalqaro nufuzli musobaqalarda yuqori natijalarni qayd etishdi.";
  const content = post?.content || "To‘rtko‘l ixtisoslashtirilgan maktabi o‘quvchilari xalqaro miqyosdagi bilimlarni egallab, o‘z salohiyatlarini xalqaro olimpiadalarda muvaffaqiyatli namoyon etmoqdalar. Xususan, joriy oyda bo‘lib o‘tgan xalqaro fan olimpiadasida maktabimizning 10 va 11-sinf o‘quvchilari terma jamoa safida ishtirok etishdi.\n\nO‘quvchilarimiz murakkab amaliy va nazariy masalalarni yechishda yuqori mantiqiy fikrlash qobiliyatini namoyon etib, kumush va bronza medallariga sazovor bo‘lishdi. Bu natija maktabimizda chuqurlashtirilgan aniq va tabiiy fanlar bo‘yicha yo‘lga qo‘yilgan sifatli ta’lim tizimining yaqqol isbotidir.";
  const coverImage = post?.cover_image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
  const dateFormatted = post?.published_at ? new Date(post.published_at).toLocaleDateString('uz-UZ') : "2026-yil 10-noyabr";
  const category = post?.categories?.name || post?.category || (post?.type === 'education' ? "Ta'lim" : "Olimpiada");

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Orqaga qaytish */}
        <div className="mb-8">
          <Link
            href="/maktab-hayoti/yangiliklar"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Yangiliklar ro‘yxatiga qaytish</span>
          </Link>
        </div>

        {/* Maqola bosh qismi */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
              {category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Asosiy muqova rasmi */}
        <div className="my-10 rounded-3xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-md">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Maqola matni */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
          <p>
            To‘rtko‘l ixtisoslashtirilgan maktabi o‘quvchilari xalqaro miqyosdagi bilimlarni egallab, o‘z salohiyatlarini xalqaro olimpiadalarda muvaffaqiyatli namoyon etmoqdalar. Xususan, joriy oyda bo‘lib o‘tgan xalqaro fan olimpiadasida maktabimizning 10 va 11-sinf o‘quvchilari terma jamoa safida ishtirok etishdi.
          </p>

          <p>
            O‘quvchilarimiz murakkab amaliy va nazariy masalalarni yechishda yuqori mantiqiy fikrlash qobiliyatini namoyon etib, kumush va bronza medallariga sazovor bo‘lishdi. Bu natija maktabimizda chuqurlashtirilgan aniq va tabiiy fanlar bo‘yicha yo‘lga qo‘yilgan sifatli ta’lim tizimining yaqqol isbotidir.
          </p>

          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 my-8">
            <h4 className="font-bold text-slate-900 text-base mb-2">
              Ustozlarning hissasi
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              O‘quvchilarimizning bu yutug‘ida ularga tinimsiz saboq berib kelayotgan oliy toifali ustozlarimiz va laboratoriya murabbiylarining mehnati beqiyos. Maktab ma’muriyati g‘olib o‘quvchilar va ularning ustozlarini ushbu yuksak g‘alaba bilan samimiy tabriklaydi!
            </p>
          </div>

          <p>
            Kelgusida o‘quvchilarimizni yanada nufuzli xalqaro tanlovlarga tayyorlash bo‘yicha yangi qo‘shimcha to‘garaklar va mahorat darslari tashkil etilishi rejalashtirilgan.
          </p>
        </div>

        {/* Ulashish va orqaga qaytish paneli */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Teglar:</span>
            <span className="text-xs font-semibold text-blue-600">#Olimpiada</span>
            <span className="text-xs font-semibold text-blue-600">#Matematika</span>
            <span className="text-xs font-semibold text-blue-600">#Yutuqlar</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Havola nusxalandi!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Havolani ulashish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
