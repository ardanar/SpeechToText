import React from 'react'
import { useNavigate } from 'react-router-dom'

const StudentResult = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d0d1b] dark:text-white transition-colors duration-200 flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b border-[#e7e7f3] dark:border-[#2d2d3b] bg-white/80 dark:bg-[#1a1a2e]/80 backdrop-blur-md px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/') }>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                            <span className="material-symbols-outlined text-3xl">menu_book</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-[#0d0d1b] dark:text-white leading-tight">Türkçe <span className="text-primary">Okuma Koçu</span></h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
                        <a className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-surface-dark/50 transition-all">Anasayfa</a>
                        <a className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-surface-dark/50 transition-all">Okumalar</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-[#0d0d1b] dark:text-white">Ali Yılmaz</span>
                        </div>
                        <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-md cursor-pointer" onClick={() => navigate('/')} title="Çıkış Yap" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAu6p1z9MO_9iw7RjCFab5yYg47y0XysdNcVP-KNEn_cL9lNT36tOZirXZeYXnGOYOflmKTL3A76xfZDumZL1h1kkYZd0zcCbnevbHNdJOGqq_0Io-ZrVSfNZnuOtefGlNRUen9PwMFduWT-AKzs94YX3dGR2BSXStkWZg1AFr7OBv4trK6QtaMb19V7OCwOP5vcGA4kdrAjoaaEg6O5RlQOHS3Mj-o1eqQL_Oru6xVrVJWEU4iDqnMyLtFAkYyVUV585f_r02Vw0-s)', backgroundSize: 'cover'}}></div>
                    </div>
                </div>
            </header>
            <main className="flex-1 px-4 py-8 lg:px-8">
                <div className="mx-auto max-w-5xl flex flex-col gap-8">
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1a1a2e] p-8 md:p-10 shadow-lg ring-1 ring-black/5">
                        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div className="flex flex-col gap-3 max-w-2xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[16px] filled-icon">check_circle</span> Seans Tamamlandı
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0d0d1b] dark:text-white font-display">
                                    Harika İş Çıkardın, Ali! <span className="inline-block animate-bounce">🎉</span>
                                </h2>
                                <p className="text-lg text-[#6b6b80] dark:text-[#a0a0b0] leading-relaxed">
                                    Bugünkü okuma performansın süperdi! Kelimeleri daha akıcı okumaya başladın.
                                </p>
                            </div>
                            <div className="hidden md:flex flex-col items-center justify-center gap-2">
                                <div className="h-32 w-32 flex items-center justify-center rounded-full bg-gradient-to-b from-yellow-100 to-yellow-50 text-yellow-500 shadow-inner ring-4 ring-white">
                                    <span className="material-symbols-outlined text-7xl filled-icon">emoji_events</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="group flex flex-col gap-1 rounded-3xl bg-blue-50 dark:bg-blue-900/10 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm"><span className="material-symbols-outlined text-2xl">timer</span></div>
                                <span className="text-xs font-bold text-blue-400 bg-blue-100/50 px-2 py-1 rounded-lg">Süre</span>
                            </div>
                            <div><p className="text-3xl font-bold text-[#0d0d1b] dark:text-white">02:15</p><p className="text-sm font-medium text-blue-600/70">Dakika</p></div>
                        </div>
                        <div className="group flex flex-col gap-1 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm"><span className="material-symbols-outlined text-2xl">speed</span></div>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-100/50 px-2 py-1 rounded-lg">Hız</span>
                            </div>
                            <div><p className="text-3xl font-bold text-[#0d0d1b] dark:text-white">85</p><p className="text-sm font-medium text-emerald-600/70">Kelime / Dakika</p></div>
                        </div>
                        <div className="group flex flex-col gap-1 rounded-3xl bg-orange-50 dark:bg-orange-900/10 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm"><span className="material-symbols-outlined text-2xl">error_med</span></div>
                                <span className="text-xs font-bold text-orange-400 bg-orange-100/50 px-2 py-1 rounded-lg">Hata</span>
                            </div>
                            <div><p className="text-3xl font-bold text-[#0d0d1b] dark:text-white">4</p><p className="text-sm font-medium text-orange-600/70">Toplam hata</p></div>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[#e7e7f3] pt-8">
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 py-4 text-sm font-bold text-[#0d0d1b] shadow-sm hover:bg-gray-50">
                            <span className="material-symbols-outlined text-[22px]">download</span> Raporu Al
                        </button>
                        <button onClick={() => navigate('/student/text-selection')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02]">
                            <span className="material-symbols-outlined">play_circle</span> Yeni Seans
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StudentResult
