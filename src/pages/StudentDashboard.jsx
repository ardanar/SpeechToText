import React from 'react'
import { useNavigate } from 'react-router-dom'
import StudentNavbar from '../components/StudentNavbar'

const StudentDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main dark:text-white transition-colors duration-200 flex flex-col">
            <StudentNavbar />
            <main className="flex-1 flex flex-col px-4 md:px-8 py-8 w-full max-w-7xl mx-auto gap-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Hoş geldin, Ali! 👋</h1>
                        <p className="text-blue-100 text-lg font-medium max-w-lg">Bugün okuma hedefini tamamlamak için harika bir gün. Maceraya hazır mısın?</p>
                        <button onClick={() => navigate('/student/text-selection')} className="mt-4 bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform w-fit mx-auto md:mx-0 flex items-center gap-2">
                            <span className="material-symbols-outlined">auto_stories</span>
                            Hemen Okumaya Başla
                        </button>
                    </div>
                    <div className="relative z-10 hidden md:block">
                        <div className="size-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-inner">
                            <span className="text-5xl">🚀</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><span className="material-symbols-outlined">menu_book</span></div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Okunan Kitap</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white">12</span>
                        <span className="text-sm font-medium text-green-600">+2 bu hafta</span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><span className="material-symbols-outlined">timer</span></div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Okuma Süresi</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white">45 dk</span>
                        <span className="text-sm font-medium text-blue-600">Hedefe %80 ulaşıldı</span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><span className="material-symbols-outlined">speed</span></div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Kelime Hızı</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white">85</span>
                        <span className="text-sm font-medium text-purple-600">dk / kelime</span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><span className="material-symbols-outlined">emoji_events</span></div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Toplam Puan</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800 dark:text-white">1250</span>
                        <span className="text-sm font-medium text-yellow-600">Sıralama: 5.</span>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StudentDashboard
