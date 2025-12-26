import React from 'react'
import TeacherSidebar from '../components/TeacherSidebar'

const TeacherDashboard = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <TeacherSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-surface-light border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <h2 className="text-lg font-bold">Dashboard</h2>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>add</span> Yeni Seans
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main tracking-tight">Hoş geldin, Zeynep Öğretmen! 👋</h2>
                            <p className="text-text-secondary mt-1">İşte bugünkü sınıf performans özeti.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-surface-light rounded-xl p-5 border border-gray-100 shadow-soft">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><span className="material-symbols-outlined">psychology</span></div>
                                <span className="flex items-center text-xs font-medium text-accent-green bg-green-50 px-2 py-1 rounded-full">+20%</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium">Bugün Yapılan Seans</p>
                            <h3 className="text-2xl font-bold text-text-main mt-1">12</h3>
                        </div>
                        <div className="bg-surface-light rounded-xl p-5 border border-gray-100 shadow-soft">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-orange-50 text-orange-600 p-2 rounded-lg"><span className="material-symbols-outlined">speed</span></div>
                                <span className="flex items-center text-xs font-medium text-accent-green bg-green-50 px-2 py-1 rounded-full">+5%</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium">Ortalama Hız</p>
                            <h3 className="text-2xl font-bold text-text-main mt-1">85</h3>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-text-main">Son Seanslar</h2>
                    <div className="bg-surface-light rounded-xl border border-gray-200 shadow-soft overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                                <tr><th className="px-6 py-4">Öğrenci Adı</th><th className="px-6 py-4">Sınıf</th><th className="px-6 py-4">Süre</th><th className="px-6 py-4">İşlem</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                <tr><td className="px-6 py-4 font-medium">Ali Yılmaz</td><td className="px-6 py-4 text-text-secondary">3-A</td><td className="px-6 py-4">04:12</td><td className="px-6 py-4"><button className="text-primary font-bold">Rapor</button></td></tr>
                                <tr><td className="px-6 py-4 font-medium">Ayşe Demir</td><td className="px-6 py-4 text-text-secondary">3-A</td><td className="px-6 py-4">03:45</td><td className="px-6 py-4"><button className="text-primary font-bold">Rapor</button></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TeacherDashboard
