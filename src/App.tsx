import React, { useState, useEffect, useMemo } from 'react';
import {
  Student,
  AttendanceSession,
  SystemSettings,
  StudentAttendanceStats,
} from './types/attendance';
import {
  getSavedStudents,
  saveStudents,
  getSavedSessions,
  saveSessions,
  getSavedSettings,
  saveSettings,
  resetAllDataToDemo,
  calculateStudentStats,
  exportStudentsSummaryCSV,
  exportAttendanceLedgerCSV,
  exportLowAttendanceCSV,
} from './utils/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AttendanceMarker } from './components/AttendanceMarker';
import { StudentList } from './components/StudentList';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AttendanceHistory } from './components/AttendanceHistory';
import { AlertsAndReports } from './components/AlertsAndReports';
import { ParentNoticeModal } from './components/ParentNoticeModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attendease_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('attendease_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('attendease_theme', 'light');
    }
  }, [darkMode]);

  // Main Core State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [students, setStudents] = useState<Student[]>(() => getSavedStudents());
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => getSavedSessions());
  const [settings, setSettings] = useState<SystemSettings>(() => getSavedSettings());

  // Modals & Navigation targets
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTarget, setNoticeTarget] = useState<{
    student: Student;
    stats: StudentAttendanceStats;
  } | null>(null);

  const [markerPreselect, setMarkerPreselect] = useState<{
    date?: string;
    department?: string;
    section?: string;
  }>({});

  // Toast notification
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Compute stats for all students
  const studentStats: StudentAttendanceStats[] = useMemo(() => {
    return students.map((s) => calculateStudentStats(s, sessions, settings));
  }, [students, sessions, settings]);

  const lowAttendanceStats = useMemo(() => {
    return studentStats.filter((s) => s.isLowAttendance);
  }, [studentStats]);

  const selectedStudentStats = useMemo(() => {
    if (!selectedStudentForDetail) return null;
    return (
      studentStats.find((s) => s.student.id === selectedStudentForDetail.id) ||
      calculateStudentStats(selectedStudentForDetail, sessions, settings)
    );
  }, [selectedStudentForDetail, studentStats, sessions, settings]);

  // Handlers
  const handleSaveSession = (newSession: AttendanceSession) => {
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === newSession.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSession;
        return copy;
      }
      return [newSession, ...prev];
    });
    showToast(`Attendance session for ${newSession.date} saved to local storage`);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session record?')) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      showToast('Attendance session record deleted', 'info');
    }
  };

  const handleEditSession = (session: AttendanceSession) => {
    setMarkerPreselect({
      date: session.date,
      department: session.department,
      section: session.section,
    });
    setActiveTab('mark');
  };

  const handleSaveStudent = (student: Student) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === student.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = student;
        showToast(`Updated student profile for ${student.name}`);
        return copy;
      }
      showToast(`Registered student ${student.name} (${student.rollNumber})`);
      return [student, ...prev];
    });
    setStudentToEdit(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${student.name} (${student.rollNumber})? Their attendance history will also be removed.`
      )
    ) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      showToast(`Student ${student.name} deleted`, 'info');
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset all students and roll call sessions back to standard demo dataset?'
      )
    ) {
      const result = resetAllDataToDemo();
      setStudents(result.students);
      setSessions(result.sessions);
      setSettings(result.settings);
      showToast('Reset local storage to pristine demo dataset');
    }
  };

  const handleImportJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.students && Array.isArray(parsed.students)) {
        setStudents(parsed.students);
      }
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        setSessions(parsed.sessions);
      }
      if (parsed.settings) {
        setSettings({ ...settings, ...parsed.settings });
      }
      showToast('Successfully restored AttendEase database from backup!');
    } catch (err) {
      alert('Invalid JSON file format. Please ensure the file was exported from AttendEase.');
    }
  };

  const handleOpenNoticeDraft = (student: Student, stats: StudentAttendanceStats) => {
    setNoticeTarget({ student, stats });
    setIsNoticeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onResetData={handleResetData}
        lowAttendanceCount={lowAttendanceStats.length}
        totalStudents={students.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            students={students}
            sessions={sessions}
            settings={settings}
            studentStats={studentStats}
            lowAttendanceStats={lowAttendanceStats}
            setActiveTab={setActiveTab}
            onSelectStudent={(student) => setSelectedStudentForDetail(student)}
            onSelectSession={(session) => handleEditSession(session)}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsStudentModalOpen(true);
            }}
            onExportSummaryCSV={() =>
              exportStudentsSummaryCSV(students, sessions, settings)
            }
          />
        )}

        {activeTab === 'mark' && (
          <AttendanceMarker
            students={students}
            sessions={sessions}
            settings={settings}
            onSaveSession={handleSaveSession}
            preselectedDate={markerPreselect.date}
            preselectedDepartment={markerPreselect.department}
            preselectedSection={markerPreselect.section}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            students={students}
            studentStats={studentStats}
            settings={settings}
            onSelectStudent={(student) => setSelectedStudentForDetail(student)}
            onOpenAddModal={() => {
              setStudentToEdit(null);
              setIsStudentModalOpen(true);
            }}
            onOpenEditModal={(student) => {
              setStudentToEdit(student);
              setIsStudentModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onExportCSV={() =>
              exportStudentsSummaryCSV(students, sessions, settings)
            }
          />
        )}

        {activeTab === 'history' && (
          <AttendanceHistory
            sessions={sessions}
            students={students}
            settings={settings}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            onExportLedgerCSV={() => exportAttendanceLedgerCSV(sessions, students)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsAndReports
            students={students}
            sessions={sessions}
            settings={settings}
            studentStats={studentStats}
            lowAttendanceStats={lowAttendanceStats}
            onUpdateSettings={(newSettings) => {
              setSettings(newSettings);
              showToast('Calculation settings updated');
            }}
            onOpenNoticeDraft={handleOpenNoticeDraft}
            onSelectStudent={(student) => setSelectedStudentForDetail(student)}
            onExportSummaryCSV={() =>
              exportStudentsSummaryCSV(students, sessions, settings)
            }
            onExportLedgerCSV={() => exportAttendanceLedgerCSV(sessions, students)}
            onExportLowAttendanceCSV={() =>
              exportLowAttendanceCSV(lowAttendanceStats, settings)
            }
            onResetData={handleResetData}
            onImportJSON={handleImportJSON}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Student Details & History Modal */}
      <StudentDetailModal
        isOpen={selectedStudentForDetail !== null}
        onClose={() => setSelectedStudentForDetail(null)}
        student={selectedStudentForDetail}
        stats={selectedStudentStats}
        settings={settings}
        onOpenNoticeDraft={handleOpenNoticeDraft}
      />

      {/* Parent Warning Notice Draft Modal */}
      <ParentNoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => {
          setIsNoticeModalOpen(false);
          setNoticeTarget(null);
        }}
        student={noticeTarget?.student || null}
        stats={noticeTarget?.stats || null}
        settings={settings}
      />

      {/* Site Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 mt-12 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AttendEase
            </span>
            <span aria-hidden="true">·</span>
            <span>Student Attendance Management System</span>
          </div>
          <div>
            Data persisted in Local Storage · {students.length} students enrolled · {sessions.length} sessions logged
          </div>
        </div>
      </footer>
    </div>
  );
}
