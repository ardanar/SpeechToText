import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const TeacherSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <aside className="hidden lg:flex flex-col w-64 h-full bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex-shrink-0 z-20 transition-all duration-300">
            <div className="flex items-center gap-3 px-6 py-6">
                <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Okuma Koçu</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Öğretmen Paneli</p>
                </div>
            </div>
            <nav className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto">
                <Link to="/teacher/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive('/teacher/dashboard') ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <span className={`material-symbols-outlined text-[24px] ${!isActive('/teacher/dashboard') && 'group-hover:text-primary'}`}>dashboard</span>
                    <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <Link to="/teacher/classes" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive('/teacher/classes') || isActive('/teacher/class-detail') ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <span className={`material-symbols-outlined text-[24px] ${(!isActive('/teacher/classes') && !isActive('/teacher/class-detail')) && 'group-hover:text-primary'}`}>grid_view</span>
                    <span className="text-sm font-medium">Sınıflarım</span>
                </Link>
                <Link to="/teacher/students" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive('/teacher/students') ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <span className={`material-symbols-outlined text-[24px] ${!isActive('/teacher/students') && 'group-hover:text-primary'}`}>groups</span>
                    <span className="text-sm font-medium">Öğrenciler</span>
                </Link>
                <Link to="/teacher/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive('/teacher/reports') ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <span className={`material-symbols-outlined text-[24px] ${!isActive('/teacher/reports') && 'group-hover:text-primary'}`}>bar_chart</span>
                    <span className="text-sm font-medium">Raporlar</span>
                </Link>
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 cursor-pointer" onClick={() => navigate('/') }>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white dark:ring-slate-700 shadow-sm" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDRmCc8bIWDATOkIcSg3VZQjWfq76V4i3ekvBOgJpeY7vFWT7ygfto3s2Q7JM2GqLELhyTZiAWR9I8aHDFdFWhEy4YoQj6faVoH9di-0cgeea1PlLU2FeP5rQzSIYopbCTqFS8TYBJDruv6HBRYXqKKKNdSp5N2pldSuC08KsvBJrgm92uvfjgpcDn084EYIyqoBf5W8N2EcXtW6Gl_VYp0PgT-P87A_uyRXmWt5OCPRGEB0SW-Ml_xVPUe1vnSxygc6lrHXChqL1Wc)'}}></div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-slate-900 dark:text-white text-sm font-bold truncate">Zeynep Yılmaz</p>
                        <p className="text-xs text-slate-500 truncate">Çıkış Yap</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default TeacherSidebar
