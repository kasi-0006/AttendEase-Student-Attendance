import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpDown,
  UserPlus,
} from 'lucide-react';
import {
  Student,
  StudentAttendanceStats,
  SystemSettings,
} from '../types/attendance';
import { DEPARTMENTS, SECTIONS } from '../utils/storage';

interface StudentListProps {
  students: Student[];
  studentStats: StudentAttendanceStats[];
  settings: SystemSettings;
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onExportCSV: () => void;
}

type SortField = 'rollNumber' | 'name' | 'department' | 'percentage' | 'absentCount';
type SortOrder = 'asc' | 'desc';

export const StudentList: React.FC<StudentListProps> = ({
  students,
  studentStats,
  settings,
  onSelectStudent,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStudent,
  onExportCSV,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'good'>('all');
  const [sortField, setSortField] = useState<SortField>('rollNumber');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Map studentId to stats
  const statsMap = useMemo(() => {
    const map = new Map<string, StudentAttendanceStats>();
    studentStats.forEach((s) => map.set(s.student.id, s));
    return map;
  }, [studentStats]);

  // Filter and Sort
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchDept = selectedDept === 'All' || student.department === selectedDept;
      const matchSec = selectedSection === 'All' || student.section === selectedSection;

      const stat = statsMap.get(student.id);
      const isLow = stat ? stat.isLowAttendance : false;

      let matchStatus = true;
      if (statusFilter === 'low') matchStatus = isLow;
      if (statusFilter === 'good') matchStatus = !isLow;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.rollNumber.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.phone.toLowerCase().includes(q);

      return matchDept && matchSec && matchStatus && matchSearch;
    });
  }, [students, selectedDept, selectedSection, statusFilter, searchQuery, statsMap]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      const statA = statsMap.get(a.id);
      const statB = statsMap.get(b.id);

      if (sortField === 'rollNumber') {
        comparison = a.rollNumber.localeCompare(b.rollNumber);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'department') {
        comparison = a.department.localeCompare(b.department);
      } else if (sortField === 'percentage') {
        const pA = statA ? statA.percentage : 0;
        const pB = statB ? statB.percentage : 0;
        comparison = pA - pB;
      } else if (sortField === 'absentCount') {
        const abA = statA ? statA.absentCount : 0;
        const abB = statB ? statB.absentCount : 0;
        comparison = abA - abB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredStudents, sortField, sortOrder, statsMap]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Student Management Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total of {students.length} enrolled students across classes. Track individual rates, records, and guardians.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll no, email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div>
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

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Sections</option>
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Attendance Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Attendance Levels</option>
              <option value="low">Low Attendance (&lt; {settings.lowAttendanceThreshold}%)</option>
              <option value="good">Normal / Good (≥ {settings.lowAttendanceThreshold}%)</option>
            </select>
          </div>
        </div>

        {/* Status Count and Active Filter Tag Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{sortedStudents.length}</span> students
            {statusFilter === 'low' && (
              <span className="ml-2 text-rose-600 dark:text-rose-400 font-medium">
                (Filtered by Critical Low Attendance)
              </span>
            )}
          </div>
          {(selectedDept !== 'All' || selectedSection !== 'All' || searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedDept('All');
                setSelectedSection('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {sortedStudents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No students found
            </p>
            <p className="mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('rollNumber')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Roll Number</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Student Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('department')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Department / Class</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Sessions</th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('percentage')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Rate (%)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Status &amp; Recovery</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedStudents.map((student) => {
                  const stat = statsMap.get(student.id);
                  const isLow = stat ? stat.isLowAttendance : false;
                  const pct = stat ? stat.percentage : 100;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Roll Number */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {student.rollNumber}
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{
                              backgroundColor: student.avatarColor || '#2563eb',
                            }}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {isLow && (
                                <span title="Attendance below required minimum" className="inline-flex">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {student.email} · {student.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department / Section */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {student.department}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {student.section} · {student.batch}
                        </div>
                      </td>

                      {/* Sessions Attended / Absent */}
                      <td className="py-3 px-4 text-center">
                        <div className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
                          {stat ? stat.presentCount + stat.lateCount : 0} /{' '}
                          {stat ? stat.totalSessions : 0}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stat ? stat.absentCount : 0} absent
                        </div>
                      </td>

                      {/* Rate % */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono text-sm font-bold tabular-nums">
                          <span
                            className={
                              isLow
                                ? 'text-rose-600 dark:text-rose-400'
                                : pct >= 90
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }
                          >
                            {pct}%
                          </span>
                        </div>
                        {/* Mini progress track */}
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full ml-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLow
                                ? 'bg-rose-500'
                                : pct >= 90
                                ? 'bg-emerald-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>
                      </td>

                      {/* Status / Recovery */}
                      <td className="py-3 px-4">
                        {isLow ? (
                          <div className="text-[11px] text-rose-700 dark:text-rose-300 font-medium leading-tight">
                            <div>Low Attendance</div>
                            <div className="text-[10px] text-rose-600/80 dark:text-rose-400/80">
                              Needs {stat?.shortfallSessions || 1} consecutive sessions
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            Eligible &amp; Good Standing
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectStudent(student)}
                            title="View attendance history card"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEditModal(student)}
                            title="Edit student details"
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteStudent(student.id)}
                            title="Delete student"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
