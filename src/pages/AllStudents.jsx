import React, { useState } from 'react'
import TeacherSidebar from '../components/TeacherSidebar'
import { Link } from 'react-router-dom'

const AllStudents = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const students = [
        { id: 1, name: "Ali Yılmaz", class: "3-A" },
        { id: 2, name: "Zeynep Demir", class: "3-A" },
        { id: 3, name: "Mehmet Kaya", class: "1-A" },
        { id: 4, name: "Ayşe Çelik", class: "2-B" },
        { id: 5, name: "Can Yıldız", class: "4-C" },
    ];

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
         <div className="flex h-screen overflow-hidden">
            <TeacherSidebar />
             <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                 <header className="h-16 bg-surface-light border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <h2 className="text-lg font-bold">Tüm Öğrenciler</h2>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-primary transition-colors">search</span>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Öğrenci veya sınıf ara..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm w-64 outline-none"
                        />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <tr><th className="px-6 py-4">Öğrenci Adı</th><th className="px-6 py-4">Sınıf</th><th className="px-6 py-4 text-right">İşlem</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 font-bold">{student.name}</td>
                                            <td className="px-6 py-4">{student.class}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to="/teacher/student-detail" className="text-primary font-bold text-sm">Detay</Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                            Aradığınız kriterlere uygun öğrenci bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                </div>
             </main>
         </div>
    )
}

export default AllStudents
