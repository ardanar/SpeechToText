import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherSidebar from '../components/TeacherSidebar'

const ClassDetail = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('students');

    return (
        <div className="flex h-screen overflow-hidden">
            <TeacherSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50 dark:bg-background-dark">
                <header className="flex flex-col bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-gray-800 shrink-0 z-10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/teacher/classes')} className="group flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                            </button>
                            <h1 className="text-xl font-bold dark:text-white">1-A Sınıfı</h1>
                        </div>
                        {activeTab === 'students' ? (
                            <div className="flex gap-2">
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-hover transition-colors text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                                    <span className="material-symbols-outlined text-[20px]">add</span> Öğrenci Ekle
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsTextModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-hover transition-colors text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                                    <span className="material-symbols-outlined text-[20px]">add</span> Metin Ekle
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex px-6 gap-6 border-t border-gray-100 dark:border-gray-800">
                        <button onClick={() => setActiveTab('students')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'students' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}>
                            Öğrenciler
                        </button>
                        <button onClick={() => setActiveTab('texts')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'texts' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}>
                            Metinler
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'students' ? (
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <tr><th className="px-6 py-4">Öğrenci</th><th className="px-6 py-4">Kodu</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4 text-right">İşlemler</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                    <tr>
                                        <td className="px-6 py-4 font-bold dark:text-white">Ali Yılmaz</td>
                                        <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-slate-700 dark:text-gray-300 px-2 py-1 rounded text-sm font-mono">TR-1024</span></td>
                                        <td className="px-6 py-4"><span className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-bold">Aktif</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Detay">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Düzenle">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sil">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-bold dark:text-white">Zeynep Demir</td>
                                        <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-slate-700 dark:text-gray-300 px-2 py-1 rounded text-sm font-mono">TR-1045</span></td>
                                        <td className="px-6 py-4"><span className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-bold">Aktif</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Detay">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Düzenle">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sil">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Başlık</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Zorluk</th>
                                        <th className="px-6 py-4 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                    <tr>
                                        <td className="px-6 py-4 font-bold dark:text-white">Küçük Prens'in Gezegenleri</td>
                                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase">Hikaye</span></td>
                                        <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Kolay</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Düzenle">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sil">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-bold dark:text-white">Ormandaki Macera</td>
                                        <td className="px-6 py-4"><span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-bold uppercase">Masal</span></td>
                                        <td className="px-6 py-4"><span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-bold">Orta</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Düzenle">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sil">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yeni Öğrenci Ekle</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">TC Kimlik No</label>
                                    <div className="relative">
                                         <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <span className="material-symbols-outlined text-[20px]">badge</span>
                                        </span>
                                        <input type="text" className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="11 haneli TC no" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Adı</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Ali" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Soyadı</label>
                                        <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Yılmaz" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Şifre</label>
                                     <div className="relative">
                                         <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                        </span>
                                        <input type="password" className="w-full pl-10 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="******" />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">İptal</button>
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">Kaydet</button>
                            </div>
                        </div>
                    </div>
                )}

                {isTextModalOpen && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yeni Metin Ekle</h3>
                                <button onClick={() => setIsTextModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                 <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Metin Başlığı</label>
                                    <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Örn: Küçük Prens'in Gezegenleri" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Metin İçeriği</label>
                                    <textarea rows="6" className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" placeholder="Metin içeriğini buraya yapıştırın..."></textarea>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Zorluk Seviyesi</label>
                                        <select className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                                            <option>Kolay</option>
                                            <option>Orta</option>
                                            <option>Zor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Kategori</label>
                                        <select className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                                            <option>Hikaye</option>
                                            <option>Masal</option>
                                            <option>Bilgilendirici</option>
                                            <option>Şiir</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => setIsTextModalOpen(false)} className="px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">İptal</button>
                                <button onClick={() => setIsTextModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">Kaydet</button>
                            </div>
                        </div>
                     </div>
                )}
            </main>
        </div>
    )
}

export default ClassDetail
