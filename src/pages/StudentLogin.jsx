import React from 'react'
import { useNavigate } from 'react-router-dom'

const StudentLogin = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#0d0d1b] dark:text-[#f8f8fc] min-h-screen flex flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7e7f3] dark:border-b-[#2b2b3f] px-10 py-3 bg-white dark:bg-[#1a1a2e]">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-[32px]">menu_book</span>
                    </div>
                    <h2 className="text-[#0d0d1b] dark:text-white text-lg font-bold leading-tight">Türkçe Okuma Koçu</h2>
                </div>
                <button onClick={() => navigate('/teacher/login')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-bold">
                    <span className="truncate">Öğretmen Girişi</span>
                </button>
            </header>
            <main className="flex-1 flex justify-center py-10 px-4">
                <div className="layout-content-container flex flex-col max-w-[480px] w-full flex-1 gap-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="bg-primary/10 p-4 rounded-full text-primary mb-2">
                            <span className="material-symbols-outlined text-[48px]">school</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#0d0d1b] dark:text-white mb-2">Öğrenci Girişi</h1>
                            <p className="text-[#4c4c9a] dark:text-[#9ca3af] text-base">Okuma macerana devam etmek için giriş yap.</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-[#e7e7f3] dark:border-[#2b2b3f] p-6 sm:p-8">
                        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); navigate('/student/dashboard'); }}>
                            <label className="flex flex-col gap-2">
                                <span className="text-[#0d0d1b] dark:text-[#f8f8fc] text-base font-medium">Öğrenci Kodu / TC Kimlik</span>
                                <input className="form-input flex w-full rounded-lg border border-[#cfcfe7] dark:border-[#4b4b6f] bg-background-light dark:bg-background-dark h-14 px-4" placeholder="Örn: 12345678901" type="text" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-[#0d0d1b] dark:text-[#f8f8fc] text-base font-medium">Şifre</span>
                                <div className="relative flex w-full items-center">
                                    <input className="form-input flex w-full rounded-lg border border-[#cfcfe7] dark:border-[#4b4b6f] bg-background-light dark:bg-background-dark h-14 pl-4 pr-12" placeholder="******" type="password" />
                                    <button className="absolute right-0 top-0 bottom-0 px-4 text-[#4c4c9a] hover:text-primary" type="button">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </label>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#cfcfe7] checked:bg-primary" type="checkbox" />
                                    </div>
                                    <span className="text-sm font-medium">Beni Hatırla</span>
                                </label>
                                <a className="text-sm font-medium text-primary hover:text-blue-700" href="#">Şifremi Unuttum?</a>
                            </div>
                            <button type="submit" onClick={() => navigate('/student/dashboard')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-4 bg-primary hover:bg-blue-700 text-white text-base font-bold shadow-md hover:shadow-lg">
                                Giriş Yap
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StudentLogin
