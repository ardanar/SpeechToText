import React from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherSidebar from '../components/TeacherSidebar'

const TeacherClasses = () => {
    const navigate = useNavigate();

    const classesData = [
        { id: 1, title: "1. Sınıflar", desc: "Okuma yazma öğreniyorum", count: 24, icon: "looks_one" },
        { id: 2, title: "2. Sınıflar", desc: "Temel okuma becerileri", count: 22, icon: "looks_two" },
        { id: 3, title: "3. Sınıflar", desc: "Akıcı okuma ve anlama", count: 20, icon: "looks_3" },
        { id: 4, title: "4. Sınıflar", desc: "İleri okuma teknikleri", count: 18, icon: "looks_4" },
        { id: 5, title: "5. Sınıflar", desc: "Eleştirel okuma analizi", count: 25, icon: "looks_5" },
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            <TeacherSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-surface-light border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <h2 className="text-lg font-bold">Sınıflarım</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                        {classesData.map((cls) => (
                            <div key={cls.id} onClick={() => navigate('/teacher/class-detail')} className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-[120px] text-primary select-none">{cls.icon}</span>
                                </div>
                                <div className="p-6 flex flex-col flex-1 z-10">
                                    <div className="mb-4">
                                        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white font-black text-2xl mb-4 shadow-lg shadow-primary/30">{cls.id}</div>
                                        <h3 className="text-xl font-bold text-text-main dark:text-white">{cls.title}</h3>
                                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{cls.desc}</p>
                                    </div>
                                    <div className="flex flex-col gap-3 mb-6">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-background-light">
                                            <span className="text-sm font-medium text-text-secondary">Öğrenci</span>
                                            <span className="text-sm font-bold text-text-main">{cls.count}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-medium">Aktif</span>
                                        <span className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">Detaya Git <span className="material-symbols-outlined text-base">arrow_forward</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TeacherClasses
