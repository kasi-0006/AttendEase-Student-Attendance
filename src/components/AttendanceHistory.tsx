import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  FileSpreadsheet,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  AttendanceSession,
  Student,
  SystemSettings,
} from '../types/attendance';
import { DEPARTMENTS } from '../utils/storage';

interface AttendanceHistoryProps {
  sessions: AttendanceSession[];
  students: Student[];
  settings: SystemSettings;
  onEditSession: (session: AttendanceSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onExportLedgerCSV: () => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  sessions,
  students,
  settings,
  onEditSession,
  onDeleteSession,
  onExportLedgerCSV,
}) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const studentMap = useMemo(() => {
    return new Map(students.map((s) => [s.id, s]));
  }, [students]);

  // Sort sessions: descending by date
  const sortedSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [sessions]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sortedSessions.filter((s) => {
      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchDate = !searchDate || s.date.includes(searchDate);
      return matchDept && matchDate;
    });
  }, [sortedSessions, selectedDept, searchDate]);

  const toggleExpand = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Attendance History &amp; Logs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse and inspect recorded roll calls, examine student remarks, or edit previous entries.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportLedgerCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Export Complete Ledger CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Filter by Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search by Specific Date
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            {(selectedDept !== 'All' || searchDate) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDept('All');
                  setSearchDate('');
                }}
                className="px-3 py-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No attendance sessions found for the chosen filters.
          </div>
        ) : (
          filteredSessions.map((session) => {
            const entries = Object.values(session.records);
            const total = entries.length;
            const present = entries.filter((e) => e.status === 'present').length;
            const absent = entries.filter((e) => e.status === 'absent').length;
            const late = entries.filter((e) => e.status === 'late').length;
            const excused = entries.filter((e) => e.status === 'excused').length;

            const effective = present + late * settings.lateWeight;
            const pct = total > 0 ? Number(((effective / total) * 100).toFixed(1)) : 0;
            const isExpanded = expandedSessionId === session.id;

            return (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-all"
              >
                {/* Session Header Card */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {session.date}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {session.subject || 'Standard Roll Call'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span>Department: {session.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>Section: {session.section}</span>
                      <span aria-hidden="true">·</span>
                      <span>Marked by: {session.markedBy || 'Faculty'}</span>
                    </div>
                  </div>

                  {/* Right side stats & actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                      <div className="text-emerald-600 dark:text-emerald-400">
                        <span className="font-bold">{present}</span> Present
                      </div>
                      <div className="text-rose-600 dark:text-rose-400">
                        <span className="font-bold">{absent}</span> Absent
                      </div>
                      <div className="text-amber-600 dark:text-amber-400">
                        <span className="font-bold">{late}</span> Late
                      </div>
                      <div className="border-l border-slate-200 dark:border-slate-800 pl-3 font-bold text-slate-900 dark:text-white">
                        {pct}%
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditSession(session)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                        title="Edit this session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(session.id)}
                        className="px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Roll' : 'Inspect'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Session Student Roll Table */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Full Roll Call Roster ({Object.keys(session.records).length} Students)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                            <th className="py-2 px-3">Roll No</th>
                            <th className="py-2 px-3">Student Name</th>
                            <th className="py-2 px-3">Department</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {Object.entries(session.records).map(([studentId, entry]) => {
                            const student = studentMap.get(studentId);
                            if (!student) return null;

                            return (
                              <tr key={studentId} className="hover:bg-white/60 dark:hover:bg-slate-800/60">
                                <td className="py-2 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                                  {student.rollNumber}
                                </td>
                                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                                  {student.name}
                                </td>
                                <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                                  {student.department} · {student.section}
                                </td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded inline-block ${
                                      entry.status === 'present'
                                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                        : entry.status === 'absent'
                                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                        : entry.status === 'late'
                                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                        : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
                                    }`}
                                  >
                                    {entry.status}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-slate-500 dark:text-slate-400 italic">
                                  {entry.remarks || '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
