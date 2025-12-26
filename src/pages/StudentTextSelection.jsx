import React from 'react'
import { useNavigate } from 'react-router-dom'
import StudentNavbar from '../components/StudentNavbar'

const StudentTextSelection = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main dark:text-white transition-colors duration-200 flex flex-col">
            <StudentNavbar />
            <main className="flex-1 flex flex-col items-center px-4 md:px-8 py-8 w-full max-w-7xl mx-auto">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider">
                            <span className="material-symbols-outlined text-lg">auto_stories</span>
                            <span>Senin İçin Seçildi</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-text-main dark:text-white leading-tight">
                            1. Sınıf <span className="text-primary">Okuma Metinleri</span>
                        </h2>
                        <p className="text-text-sub dark:text-gray-400 text-lg md:text-xl mt-1 font-medium">
                            Merhaba Ali! Bugün hangi maceraya atılmak istersin?
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Tümü</button>
                        <button className="px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-slate-500 dark:text-gray-300 font-semibold text-sm">Hikaye</button>
                        <button className="px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-slate-500 dark:text-gray-300 font-semibold text-sm">Masal</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full pb-10">
                    <div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer" onClick={() => navigate('/student/reading')}>
                        <div className="h-48 w-full bg-cover bg-center relative" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC2-cfbh-4ipM6ZDgfJaTEmMS0aR2aNabK1zgFV-LCWIu44vWw4ueamD0cx_0FTUG7nm1ZOeb6isIU9IIeJq5kRMH2ojVIihg7YJSyfYWCdJnB9C7kCNb7pKNozMCPRO2pvW9xHoWvVG8waq_ziOvhu2oEjZSRB2yUxUdE89ec51ovVxm46LFOb1vUnrIM4OKC1REyNhkUUTnFiMeA9BwH-svA8HDYKoJqHwcA6RttODX3ML6P_Z2b-S4FnOUQoil9OpTT2q-GlYOfK)'}}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-sm">sentiment_satisfied</span> Kolay
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">Hikaye</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">Minik Kedi Tekir</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">Tekir bahçede oyun oynarken renkli bir kelebek gördü ve peşinden koştu.</p>
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <span className="material-symbols-outlined text-lg">format_shapes</span>
                                    <span className="text-sm font-semibold">45 Kelime</span>
                                </div>
                                <button className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600">
                                    <span className="material-symbols-outlined">play_arrow</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer" onClick={() => navigate('/student/reading')}>
                        <div className="h-48 w-full bg-cover bg-center relative" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCm8j-oGsprsEIjKIgyZ_vAebmzWYytUn5WQPaT9pqZ-CutVxV6VWetrwU2sYIfKM5tIOfQvXR17faO8ZoQ5V_RB2fAgg-M42JzmissEDD2etL62X1zWjETPdxdO4hCiVacg5W-TwwMk-Qww_V5dhGQima37_igklNSfs2KQ397HLfd9eDAEY1n8tPkWriC452u4S8xvLfoXcZwymTg9SRWIN87vwDIKDRtQuHUfpq2tFhm-_kTttXyKg5-YMfyjGJ2N-CXA5tfP3Lj)'}}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-600 flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-sm">sentiment_neutral</span> Orta
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wide">Bilgi</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">Uzay Yolculuğu</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">Gezegenler, yıldızlar ve Ay hakkında ilginç bilgileri öğrenmeye hazır mısın?</p>
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <span className="material-symbols-outlined text-lg">format_shapes</span>
                                    <span className="text-sm font-semibold">60 Kelime</span>
                                </div>
                                <button className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600">
                                    <span className="material-symbols-outlined">play_arrow</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StudentTextSelection
