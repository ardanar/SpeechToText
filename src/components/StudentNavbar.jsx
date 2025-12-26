import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const StudentNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 lg:px-10">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/') }>
                        <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-text-main dark:text-white hidden md:block">Türkçe Okuma Koçu</h1>
                    </div>
                    
                    <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
                        <Link to="/student/dashboard" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/student/dashboard') ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                            Anasayfa
                        </Link>
                        <Link to="/student/text-selection" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/student/text-selection') ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                            Okuma Metinleri
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                     <div className="md:hidden flex items-center gap-4 mr-2">
                        <Link to="/student/dashboard" className={`text-sm font-bold ${isActive('/student/dashboard') ? 'text-primary' : 'text-slate-500'}`}>Anasayfa</Link>
                        <Link to="/student/text-selection" className={`text-sm font-bold ${isActive('/student/text-selection') ? 'text-primary' : 'text-slate-500'}`}>Metinler</Link>
                     </div>

                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                        <span className="material-symbols-outlined text-yellow-500 filled">star</span>
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">1250 Puan</span>
                    </div>
                    <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-600 shadow-sm cursor-pointer" onClick={() => navigate('/')} title="Çıkış Yap" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBqdwTsjBSz9G0FkAUDBH1bK986xSTNpdfGGjtGqOWGr8X37zPUOeeOYSbgKfrnf1guTT4hHjgB5Xf4I5N7pQFCEQ2mEvU-Z8U-ivQiXFjZeyvos-0oX5e1xYZ0-b6_D3YeacyulxlPfnJ1g349XJ3BHQGYkgwGPlKkJkXMRjvJK7lBZnyKAi71NKPrXTelsh1uWi40rCHertKzeuyqRUUdsVCWsXKOsxHuJxzDzWhVPvRKdqM-yzyk7BTdLIHG7757v0mSfFiLSfWQ)'}}></div>
                </div>
            </div>
        </header>
    )
}

export default StudentNavbar
