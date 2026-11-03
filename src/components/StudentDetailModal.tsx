import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
  Send,
  User,
} from 'lucide-react';
import {
  Student,
  StudentAttendanceStats,
  SystemSettings,
} from '../types/attendance';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  stats: StudentAttendanceStats | null;
  settings: SystemSettings;
  onOpenNoticeDraft: (student: Student, stats: StudentAttendanceStats) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  stats,
  settings,
  onOpenNoticeDraft,
}) => {
  const [historyFilter, setHistoryFilter] = useState<'all' | 'absent' | 'late'>('all');

  if (!isOpen || !student || !stats) return null;

  const filteredHistory = stats.recentRecords.filter((rec) => {
    if (historyFilter === 'absent') return rec.status === 'absent';
    if (historyFilter === 'late') return rec.status === 'late';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-xs"
              style={{ backgroundColor: student.avatarColor || '#2563eb' }}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {student.name}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                  {student.rollNumber}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                <span>{student.department}</span>
                <span aria-hidden="true">·</span>
                <span>{student.section}</span>
                <span aria-hidden="true">·</span>
                <span>{student.batch}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Attendance Rate</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`font-mono text-2xl font-bold tabular-nums ${
                    stats.isLowAttendance
                      ? 'text-rose-600 dark:text-rose-400'
                      : stats.percentage >= 90
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {stats.percentage}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Threshold: {settings.lowAttendanceThreshold}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Attended / Total</span>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {stats.presentCount + stats.lateCount} / {stats.totalSessions}
              </div>
              <span className="text-[10px] text-slate-400">Recorded sessions</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Absences</span>
              <div className="mt-1 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {stats.absentCount}
              </div>
              <span className="text-[10px] text-slate-400">
                {stats.consecutiveAbsences > 1
                  ? `${stats.consecutiveAbsences} consecutive`
                  : 'Unexcused tally'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Late / Excused</span>
              <div className="mt-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {stats.lateCount}L · {stats.excusedCount}E
              </div>
              <span className="text-[10px] text-slate-400">Late weight: {settings.lateWeight}</span>
            </div>
          </div>

          {/* Low Attendance Notice Banner (if applicable) */}
          {stats.isLowAttendance && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-rose-900 dark:text-rose-100">
                    Attendance Warning: Below {settings.lowAttendanceThreshold}%
                  </h4>
                  <p className="text-rose-700 dark:text-rose-300 mt-0.5">
                    This student must attend the next{' '}
                    <strong>{stats.shortfallSessions} consecutive sessions</strong> to achieve the
                    mandatory {settings.lowAttendanceThreshold}% rate.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenNoticeDraft(student, stats)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Draft Warning Notice</span>
              </button>
            </div>
          )}

          {/* Contact & Guardian Details Card */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Contact &amp; Guardian Info</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Student Phone:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {student.phone || 'Not recorded'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Student Email:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {student.email || 'Not recorded'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Guardian Name:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {student.parentName || 'Guardian on file'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Guardian Contact:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {student.parentPhone || student.parentEmail || 'Not recorded'}
                </span>
              </div>
            </div>
          </div>

          {/* Chronological History Log */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Session Attendance Timeline ({stats.recentRecords.length})</span>
              </h4>

              {/* Segmented Filter */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('all')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    historyFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All ({stats.recentRecords.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('absent')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    historyFilter === 'absent'
                      ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Absent ({stats.absentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('late')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    historyFilter === 'late'
                      ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Late ({stats.lateCount})
                </button>
              </div>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No records match the filter.
                </div>
              ) : (
                filteredHistory.map((rec, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {rec.status === 'present' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {rec.status === 'absent' && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      {rec.status === 'late' && (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      {rec.status === 'excused' && (
                        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                      )}

                      <div>
                        <span className="font-mono font-medium text-slate-900 dark:text-white mr-2">
                          {rec.date}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {rec.subject || 'Academic Session'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {rec.remarks && (
                        <span className="text-slate-400 italic text-[11px] max-w-[180px] truncate">
                          "{rec.remarks}"
                        </span>
                      )}
                      <span
                        className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded ${
                          rec.status === 'present'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : rec.status === 'absent'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : rec.status === 'late'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Student record active in database
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
