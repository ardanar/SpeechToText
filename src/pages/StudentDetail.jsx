import React from 'react'
import TeacherSidebar from '../components/TeacherSidebar'

const StudentDetail = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <TeacherSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="flex-shrink-0 px-6 py-4 border-b border-border-light bg-background-light">
                    <span className="font-medium">Ali Yılmaz</span>
                </header>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="w-full max-w-5xl mx-auto bg-surface-light rounded-2xl p-6 shadow-sm border border-border-light flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <div className="size-20 rounded-full bg-cover bg-center border-2 border-white shadow-md" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCptDeCV7qQNR7Dj-QP812rjOBW0T7BvYQWm9S3cXp6WT1gDfbFyZLwe05Y2vPRu6QqvxMKoEZQUXX2h71kysv5vZ2ZnYo1bFydDN0THHpeaj7BWEw9dO7_Dq66QlBYVbx9D8IZHiRdfaNETf7ZneSBbduSiAnDeetG5NktSzNcUy1D9oDvASI-BVrWTqmttc0bRlmYSOsDK5g8N9nPqZYyGI7Xp4SOAJrx289IivxDUcVbLI0lPb1HFGqKqXGhjhn7bu-hfHtCBC2q)'}}></div>
                            <div>
                                <h1 className="text-3xl font-bold text-text-main">Ali Yılmaz</h1>
                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">3-A Sınıfı</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-surface-light p-5 rounded-xl border border-border-light shadow-sm">
                            <p className="text-3xl font-bold">85 <span className="text-sm font-normal text-text-secondary">Kelime/dk</span></p>
                            <p className="text-sm text-text-secondary">Ortalama Hız</p>
                        </div>
                         <div className="bg-surface-light p-5 rounded-xl border border-border-light shadow-sm">
                            <p className="text-3xl font-bold">%92</p>
                            <p className="text-sm text-text-secondary">Doğruluk</p>
                        </div>
                    </div>
                     <div className="w-full max-w-5xl mx-auto bg-surface-light border border-border-light rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-background-light border-b border-border-light">
                                <tr><th className="py-3 px-4 text-xs font-semibold uppercase">Tarih</th><th className="py-3 px-4 text-xs font-semibold uppercase">Metin</th><th className="py-3 px-4 text-xs font-semibold uppercase">Hız</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                <tr><td className="py-3 px-4 text-sm">14 Ekim 2023</td><td className="py-3 px-4 text-sm">Küçük Prens</td><td className="py-3 px-4 text-sm font-bold">88</td></tr>
                                <tr><td className="py-3 px-4 text-sm">12 Ekim 2023</td><td className="py-3 px-4 text-sm">Keloğlan</td><td className="py-3 px-4 text-sm font-bold">78</td></tr>
                            </tbody>
                        </table>
                     </div>
                </div>
            </main>
        </div>
    )
}

export default StudentDetail
