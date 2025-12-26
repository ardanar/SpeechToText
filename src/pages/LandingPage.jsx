import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white">
            <header className="w-full py-6 px-8 flex justify-start items-center z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-4xl">menu_book</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-primary dark:text-indigo-400 hidden sm:block">Türkçe Okuma Koçu</span>
                </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 w-full max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-12 max-w-2xl">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                        <span className="material-symbols-outlined text-primary text-5xl">school</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-main dark:text-white mb-4 leading-tight">
                        Okuma Macerana<br/><span className="text-primary dark:text-indigo-400">Hoş Geldin!</span>
                    </h1>
                    <p className="text-lg text-text-secondary dark:text-gray-300 max-w-lg mx-auto">
                        Eğlenceli okuma dünyasına adım atmak için lütfen aşağıdan kim olduğunu seç.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    <button onClick={() => navigate('/student/login')} className="role-card group relative overflow-hidden bg-white dark:bg-slate-800 border-2 border-transparent hover:border-primary/30 rounded-2xl p-8 text-left shadow-sm hover:shadow-md flex flex-col items-center text-center md:items-start md:text-left gap-4 hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-9xl text-primary">backpack</span>
                        </div>
                        <div className="size-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-300 mb-2">
                            <span className="material-symbols-outlined text-3xl">face_6</span>
                        </div>
                        <div className="z-10">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">Öğrenci Girişi</h2>
                            <p className="text-text-secondary dark:text-gray-400 mb-6 text-sm">Ödevlerini yap, hikayeler oku ve rozetler kazan.</p>
                            <span className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-white font-medium text-sm shadow-sm group-hover:bg-primary-hover transition-colors w-full md:w-auto">
                                Giriş Yap <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                            </span>
                        </div>
                    </button>
                    <button onClick={() => navigate('/teacher/login')} className="role-card group relative overflow-hidden bg-white dark:bg-slate-800 border-2 border-transparent hover:border-purple-500/30 rounded-2xl p-8 text-left shadow-sm hover:shadow-md flex flex-col items-center text-center md:items-start md:text-left gap-4 hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-9xl text-purple-600">podium</span>
                        </div>
                        <div className="size-16 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-2">
                            <span className="material-symbols-outlined text-3xl">cast_for_education</span>
                        </div>
                        <div className="z-10">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2 group-hover:text-purple-600 transition-colors">Öğretmen Girişi</h2>
                            <p className="text-text-secondary dark:text-gray-400 mb-6 text-sm">Sınıfını yönet, öğrencilerinin gelişimini takip et.</p>
                            <span className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-white border border-gray-200 dark:border-gray-600 text-text-main dark:text-white font-medium text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full md:w-auto">
                                Giriş Yap <span className="material-symbols-outlined ml-2 text-sm">login</span>
                            </span>
                        </div>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default LandingPage
