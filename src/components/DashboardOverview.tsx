import React from 'react';
import {
  Users,
  CalendarCheck,
  Percent,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Download,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AttendanceSession,
  Student,
  StudentAttendanceStats,
  SystemSettings,
} from '../types/attendance';
import { ActiveTab } from './Navbar';
import { DEPARTMENTS } from '../utils/storage';

interface DashboardOverviewProps {
  students: Student[];
  sessions: AttendanceSession[];
  settings: SystemSettings;
  studentStats: StudentAttendanceStats[];
  lowAttendanceStats: StudentAttendanceStats[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectStudent: (student: Student) => void;
  onSelectSession: (session: AttendanceSession) => void;
  onOpenAddStudent: () => void;
  onExportSummaryCSV: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  sessions,
  settings,
  studentStats,
  lowAttendanceStats,
  setActiveTab,
  onSelectStudent,
  onSelectSession,
  onOpenAddStudent,
  onExportSummaryCSV,
}) => {
  const totalStudents = students.length;
  const totalSessions = sessions.length;

  const avgAttendance =
    totalStudents > 0
      ? Number(
          (
            studentStats.reduce((acc, curr) => acc + curr.percentage, 0) /
            totalStudents
          ).toFixed(1)
        )
      : 0;

  // Department statistics
  const deptStats = DEPARTMENTS.map((dept) => {
    const deptStudents = studentStats.filter(
      (s) => s.student.department === dept
    );
    const count = deptStudents.length;
    const avg =
      count > 0
        ? Number(
            (
              deptStudents.reduce((acc, curr) => acc + curr.percentage, 0) /
              count
            ).toFixed(1)
          )
        : 0;
    return { dept, count, avg };
  }).filter((d) => d.count > 0);

  // Latest 4 sessions
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const todayStr = new Date().toISOString().slice(0, 10);
  const isTodayMarked = sessions.some((s) => s.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Row */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-200">
            <span>{settings.institutionName}</span>
            <span aria-hidden="true">·</span>
            <span>Academic Term {settings.academicYear}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Student Attendance Dashboard
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Monitor real-time roll call, track low-attendance shortfalls, and manage attendance records across all departments with local storage persistence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('mark')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-white hover:bg-blue-50 rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>{isTodayMarked ? "Edit Today's Roll" : "Take Today's Roll"}</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddStudent}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/20 border border-white/20 rounded-lg transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Enrolled
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              students
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Across {deptStats.length} academic departments
          </div>
        </div>

        {/* Overall Attendance Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average Attendance
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {avgAttendance}%
            </span>
            <span
              className={`text-xs font-medium ${
                avgAttendance >= settings.lowAttendanceThreshold
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {avgAttendance >= settings.lowAttendanceThreshold
                ? 'Healthy Rate'
                : 'Below Standard'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Threshold minimum: {settings.lowAttendanceThreshold}%
          </div>
        </div>

        {/* Total Sessions Recorded */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Sessions Recorded
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalSessions}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              roll calls
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {recentSessions.length > 0
              ? `Latest: ${recentSessions[0].date}`
              : 'No sessions yet'}
          </div>
        </div>

        {/* Low Attendance Warning */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Attendance Alerts
            </span>
            <div
              className={`p-2 rounded-lg ${
                lowAttendanceStats.length > 0
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`font-mono text-3xl font-bold tabular-nums ${
                lowAttendanceStats.length > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {lowAttendanceStats.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              critical &lt; {settings.lowAttendanceThreshold}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {lowAttendanceStats.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className="text-rose-600 dark:text-rose-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>View alert list</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              'All students meeting attendance goal'
            )}
          </div>
        </div>
      </div>

      {/* Critical Alert Warning Bar (if students are low) */}
      {lowAttendanceStats.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-100">
                  {lowAttendanceStats.length} Student{lowAttendanceStats.length > 1 ? 's' : ''} Below Attendance Threshold ({settings.lowAttendanceThreshold}%)
                </h3>
                <p className="text-xs text-rose-800/80 dark:text-rose-300/80 mt-0.5">
                  Action required: Issue parent notices or schedule counseling before semester cutoff.
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {lowAttendanceStats.slice(0, 3).map((s) => (
                    <button
                      key={s.student.id}
                      onClick={() => onSelectStudent(s.student)}
                      className="px-2 py-1 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded text-xs font-medium hover:border-rose-500 transition-colors"
                    >
                      {s.student.name} ({s.percentage}%) · Needs {s.shortfallSessions} session{s.shortfallSessions > 1 ? 's' : ''}
                    </button>
                  ))}
                  {lowAttendanceStats.length > 3 && (
                    <span className="self-center text-xs text-rose-700 dark:text-rose-300">
                      +{lowAttendanceStats.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-200 bg-white dark:bg-slate-900 hover:bg-rose-100 dark:hover:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors shrink-0 whitespace-nowrap"
            >
              Manage Alerts &amp; Notice Drafts
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Split: Department Breakdown + Recent Roll Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Department Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Department Breakdown</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Target: {settings.lowAttendanceThreshold}%
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {deptStats.map((item) => {
                const isUnder = item.avg < settings.lowAttendanceThreshold;
                return (
                  <div key={item.dept} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {item.dept}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">
                          {item.count} student{item.count > 1 ? 's' : ''}
                        </span>
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            isUnder
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.avg}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnder
                            ? 'bg-rose-500'
                            : item.avg >= 85
                            ? 'bg-emerald-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, item.avg))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onExportSummaryCSV}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export Department Summary CSV</span>
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Recent Sessions & Quick Roll Call */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent Attendance Sessions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all logs ({sessions.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No attendance sessions recorded yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('mark')}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark First Attendance
              </button>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {recentSessions.map((session) => {
                const entries = Object.values(session.records);
                const total = entries.length;
                const present = entries.filter(
                  (e) => e.status === 'present'
                ).length;
                const late = entries.filter((e) => e.status === 'late').length;
                const absent = entries.filter(
                  (e) => e.status === 'absent'
                ).length;
                const effective = present + late * settings.lateWeight;
                const sessionPct =
                  total > 0 ? Number(((effective / total) * 100).toFixed(1)) : 0;

                return (
                  <div
                    key={session.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {session.date}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {session.subject || 'Standard Roll Call'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>Dept: {session.department}</span>
                        <span aria-hidden="true">·</span>
                        <span>{session.markedBy || 'Faculty'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Attendance breakdown pills */}
                      <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold" title="Present">
                          {present}P
                        </span>
                        <span className="text-amber-600 dark:text-amber-400" title="Late">
                          {late}L
                        </span>
                        <span className="text-rose-600 dark:text-rose-400" title="Absent">
                          {absent}A
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {sessionPct}%
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectSession(session)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors border border-blue-200 dark:border-blue-900"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Attending Students & Quick Directory Snapshot */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Student Attendance Leaderboard &amp; Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consistent attendance tracking with rapid inspection
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Full Student Directory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Roll No</th>
                <th className="py-2.5 px-3 font-semibold">Student Name</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold text-right">Attended</th>
                <th className="py-2.5 px-3 font-semibold text-right">Absent</th>
                <th className="py-2.5 px-3 font-semibold text-right">Rate (%)</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentStats.slice(0, 6).map((stat) => (
                <tr
                  key={stat.student.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {stat.student.rollNumber}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: stat.student.avatarColor || '#2563eb' }}
                      >
                        {stat.student.name.charAt(0)}
                      </div>
                      <span>{stat.student.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {stat.student.department} · {stat.student.section}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {stat.presentCount + stat.lateCount} / {stat.totalSessions}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {stat.absentCount}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right tabular-nums font-bold">
                    <span
                      className={
                        stat.isLowAttendance
                          ? 'text-rose-600 dark:text-rose-400'
                          : stat.percentage >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }
                    >
                      {stat.percentage}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center text-[11px] font-medium ${
                        stat.isLowAttendance
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {stat.isLowAttendance ? 'Low Attendance' : 'Good Standing'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectStudent(stat.student)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      View Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
