import React from 'react'
import { useNavigate } from 'react-router-dom'

const TeacherLogin = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[480px] flex flex-col gap-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10" onClick={() => navigate('/') }>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
                        <span className="material-symbols-outlined text-[40px] text-primary">menu_book</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Türkçe Okuma Koçu</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-1">Öğretmen Girişi</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 p-8 w-full">
                    <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); navigate('/teacher/dashboard'); }}>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-white text-sm font-medium leading-none">E-posta Adresi</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                                </div>
                                <input className="form-input block w-full rounded-lg border-0 py-3.5 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary" placeholder="ogretmen@okul.com" type="email" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-slate-900 dark:text-white text-sm font-medium leading-none">Şifre</label>
                            </div>
                            <div className="relative flex w-full rounded-lg shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-primary dark:ring-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                                </div>
                                <input className="block flex-1 border-0 bg-transparent py-3.5 pl-10 pr-10 focus:ring-0 sm:text-sm" placeholder="••••••" type="password" />
                                <div className="flex items-center justify-center pr-3 cursor-pointer text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                </div>
                            </div>
                            <div className="flex justify-end pt-1">
                                <a className="text-primary hover:text-primary-hover text-sm font-medium hover:underline transition-all" href="#">Şifremi unuttum?</a>
                            </div>
                        </div>
                        <button type="submit" onClick={() => navigate('/teacher/dashboard')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary hover:bg-primary-hover text-white text-base font-bold h-12 px-5 transition-all shadow-md">
                            <span className="truncate">Giriş Yap</span>
                        </button>
                    </form>
                    <div className="relative mt-8">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-slate-800 px-3 text-sm text-slate-500 dark:text-slate-400">veya</span>
                        </div>
                    </div>
                    <div className="mt-6 text-center space-y-4">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Öğrenci misiniz? <a className="text-primary font-semibold hover:underline cursor-pointer" onClick={() => navigate('/student/login')}>Öğrenci Girişi Yapın</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherLogin
