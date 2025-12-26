import React, { useState } from 'react'
import TeacherSidebar from '../components/TeacherSidebar'

const Reports = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const reportsData = [
        { id: 1, name: "Ahmet Yılmaz", class: "3-A", type: "Hız", status: "Tamamlandı", typeClass: "text-blue-700 bg-blue-50" },
        { id: 2, name: "Ayşe Demir", class: "3-A", type: "Kelime", status: "Tamamlandı", typeClass: "text-purple-700 bg-purple-50" },
        { id: 3, name: "Mehmet Kaya", class: "3-B", type: "Okuma", status: "Bekliyor", typeClass: "text-orange-700 bg-orange-50" },
    ];

    const filteredReports = reportsData.filter(report => 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden">
            <TeacherSidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-light">
                <header className="bg-surface-light border-b border-slate-200 px-6 py-5 shrink-0 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Raporlar</h1>
                     <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-primary transition-colors">search</span>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Öğrenci ara..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm w-64 outline-none"
                        />
                    </div>
                </header>
                 <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-surface-light rounded-xl border border-slate-200 shadow-sm">
                        <div className="p-5 border-b border-slate-200 flex justify-between">
                            <h2 className="text-lg font-bold">Rapor Listesi</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 text-xs font-semibold uppercase">Öğrenci</th>
                                    <th className="p-4 text-xs font-semibold uppercase">Sınıf</th>
                                    <th className="p-4 text-xs font-semibold uppercase">Tür</th>
                                    <th className="p-4 text-xs font-semibold uppercase">Durum</th>
                                    <th className="p-4 text-xs font-semibold uppercase text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredReports.map((report) => (
                                    <tr key={report.id}>
                                        <td className="p-4 font-medium">{report.name}</td>
                                        <td className="p-4 text-slate-600">{report.class}</td>
                                        <td className="p-4"><span className={`${report.typeClass} px-2 py-1 rounded text-xs font-bold`}>{report.type}</span></td>
                                        <td className="p-4"><span className="text-green-600 font-bold text-xs">{report.status}</span></td>
                                        <td className="p-4 text-right">
                                            <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-colors">
                                                <span className="material-symbols-outlined text-[16px]">download</span> İndir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </main>
        </div>
    )
}

export default Reports
