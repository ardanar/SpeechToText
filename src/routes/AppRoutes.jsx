import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LandingPage from '../pages/LandingPage'
import StudentLogin from '../pages/StudentLogin'
import StudentDashboard from '../pages/StudentDashboard'
import StudentTextSelection from '../pages/StudentTextSelection'
import ReadingScreen from '../pages/ReadingScreen'
import StudentResult from '../pages/StudentResult'
import TeacherLogin from '../pages/TeacherLogin'
import TeacherDashboard from '../pages/TeacherDashboard'
import TeacherClasses from '../pages/TeacherClasses'
import ClassDetail from '../pages/ClassDetail'
import StudentDetail from '../pages/StudentDetail'
import Reports from '../pages/Reports'
import AllStudents from '../pages/AllStudents'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/text-selection" element={<StudentTextSelection />} />
      <Route path="/student/reading" element={<ReadingScreen />} />
      <Route path="/student/result" element={<StudentResult />} />

      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/classes" element={<TeacherClasses />} />
      <Route path="/teacher/class-detail" element={<ClassDetail />} />
      <Route path="/teacher/student-detail" element={<StudentDetail />} />
      <Route path="/teacher/students" element={<AllStudents />} />
      <Route path="/teacher/reports" element={<Reports />} />
    </Routes>
  )
}
