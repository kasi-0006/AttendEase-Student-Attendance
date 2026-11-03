import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Check,
  X,
  Clock,
  HelpCircle,
  Save,
  CheckCheck,
  Search,
  Filter,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  AttendanceSession,
  AttendanceStatus,
  Student,
  SystemSettings,
} from '../types/attendance';
import { DEPARTMENTS, SECTIONS } from '../utils/storage';

interface AttendanceMarkerProps {
  students: Student[];
  sessions: AttendanceSession[];
  settings: SystemSettings;
  onSaveSession: (session: AttendanceSession) => void;
  preselectedDate?: string;
  preselectedDepartment?: string;
  preselectedSection?: string;
}

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({
  students,
  sessions,
  settings,
  onSaveSession,
  preselectedDate,
  preselectedDepartment,
  preselectedSection,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Form Controls
  const [selectedDate, setSelectedDate] = useState<string>(preselectedDate || todayStr);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    preselectedDepartment || 'All'
  );
  const [selectedSection, setSelectedSection] = useState<string>(
    preselectedSection || 'All'
  );
  const [subject, setSubject] = useState<string>('Core Lecture / Roll Call');
  const [markedBy, setMarkedBy] = useState<string>('Prof. Faculty Lead');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Status map: studentId -> { status, remarks }
  const [records, setRecords] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Check if session exists for current Date + Department + Section
  const existingSession = useMemo(() => {
    return sessions.find(
      (s) =>
        s.date === selectedDate &&
        (selectedDepartment === 'All' || s.department === selectedDepartment) &&
        (selectedSection === 'All' || s.section === selectedSection)
    );
  }, [sessions, selectedDate, selectedDepartment, selectedSection]);

  // Filter students based on department and section selection
  const eligibleStudents = useMemo(() => {
    return students.filter((student) => {
      const matchDept =
        selectedDepartment === 'All' || student.department === selectedDepartment;
      const matchSec =
        selectedSection === 'All' || student.section === selectedSection;
      return matchDept && matchSec;
    });
  }, [students, selectedDepartment, selectedSection]);

  // Load existing records or default all to 'present' on filter/date change
  useEffect(() => {
    const newRecords: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    eligibleStudents.forEach((student) => {
      if (existingSession && existingSession.records[student.id]) {
        const prev = existingSession.records[student.id];
        newRecords[student.id] = {
          status: prev.status,
          remarks: prev.remarks || '',
        };
      } else {
        // Default to present if not marked yet
        newRecords[student.id] = {
          status: 'present',
          remarks: '',
        };
      }
    });

    if (existingSession && existingSession.subject) {
      setSubject(existingSession.subject);
    }
    if (existingSession && existingSession.markedBy) {
      setMarkedBy(existingSession.markedBy);
    }

    setRecords(newRecords);
    setSavedFeedback(null);
  }, [eligibleStudents, existingSession, selectedDate]);

  // Filtered view by search query
  const displayedStudents = useMemo(() => {
    if (!searchQuery.trim()) return eligibleStudents;
    const q = searchQuery.toLowerCase();
    return eligibleStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [eligibleStudents, searchQuery]);

  // Quick batch actions
  const handleBatchMark = (status: AttendanceStatus) => {
    const updated = { ...records };
    displayedStudents.forEach((s) => {
      updated[s.id] = {
        ...(updated[s.id] || { remarks: '' }),
        status,
      };
    });
    setRecords(updated);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'present',
        remarks,
      },
    }));
  };

  // Real-time roll call counts
  const tally = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    eligibleStudents.forEach((s) => {
      const rec = records[s.id];
      if (rec) {
        if (rec.status === 'present') present++;
        else if (rec.status === 'absent') absent++;
        else if (rec.status === 'late') late++;
        else if (rec.status === 'excused') excused++;
      }
    });

    const total = eligibleStudents.length;
    const effective = present + late * settings.lateWeight;
    const percentage = total > 0 ? Number(((effective / total) * 100).toFixed(1)) : 0;

    return { total, present, absent, late, excused, percentage };
  }, [eligibleStudents, records, settings.lateWeight]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const sessionId =
      existingSession?.id ||
      `SES-${selectedDate}-${selectedDepartment.replace(/\s+/g, '')}-${selectedSection.replace(/\s+/g, '')}`;

    const sessionData: AttendanceSession = {
      id: sessionId,
      date: selectedDate,
      department: selectedDepartment,
      section: selectedSection,
      subject: subject.trim() || 'General Roll Call',
      records,
      markedAt: new Date().toISOString(),
      markedBy: markedBy.trim() || 'Faculty Lead',
    };

    onSaveSession(sessionData);
    setSavedFeedback(
      `Attendance for ${selectedDate} saved successfully (${tally.present} Present, ${tally.absent} Absent)`
    );

    setTimeout(() => {
      setSavedFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Mark Student Attendance</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select date, department, and section to record roll call. Updates persist immediately to local storage.
            </p>
          </div>

          {/* Quick Date buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                selectedDate === todayStr
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Today
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters and Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
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
              Section / Class
            </label>
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

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Course / Subject Title
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Data Structures & Algorithms"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Instructor / Proctor Name
            </label>
            <input
              type="text"
              value={markedBy}
              onChange={(e) => setMarkedBy(e.target.value)}
              placeholder="e.g. Prof. Anderson"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Existing Session Notification Banner */}
        {existingSession && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Existing attendance found for <strong>{selectedDate}</strong> (Recorded at{' '}
                {new Date(existingSession.markedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                ). Modifying will update the saved session.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Live Tally Bar & Batch Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Real-time Tally Counters */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Total:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {tally.total}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400">Present:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {tally.present}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-slate-500 dark:text-slate-400">Absent:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {tally.absent}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-500 dark:text-slate-400">Late:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {tally.late}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-slate-500 dark:text-slate-400">Excused:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {tally.excused}
              </span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3 flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Day Rate:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {tally.percentage}%
              </span>
            </div>
          </div>

          {/* Batch Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Set all:</span>
            <button
              type="button"
              onClick={() => handleBatchMark('present')}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>All Present</span>
            </button>
            <button
              type="button"
              onClick={() => handleBatchMark('absent')}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>All Absent</span>
            </button>
            <button
              type="button"
              onClick={() => handleBatchMark('late')}
              className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>All Late</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Roll Call Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar / Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing {displayedStudents.length} of {eligibleStudents.length} students
          </span>
        </div>

        {displayedStudents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No students match the selected department, section, or search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Remarks / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedStudents.map((student, idx) => {
                  const entry = records[student.id] || {
                    status: 'present',
                    remarks: '',
                  };
                  const status = entry.status;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        status === 'absent'
                          ? 'bg-rose-50/30 dark:bg-rose-950/20'
                          : status === 'late'
                          ? 'bg-amber-50/30 dark:bg-amber-950/20'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {student.rollNumber}
                      </td>

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
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div>{student.department}</div>
                        <div className="text-[11px] text-slate-400">{student.section}</div>
                      </td>

                      {/* 4-State Toggle Segmented Control */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg gap-1 max-w-[280px] mx-auto">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                            title="Present"
                          >
                            <Check className="w-3 h-3" />
                            <span>P</span>
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                            title="Absent"
                          >
                            <X className="w-3 h-3" />
                            <span>A</span>
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
                              status === 'late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                            }`}
                            title="Late"
                          >
                            <Clock className="w-3 h-3" />
                            <span>L</span>
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'excused')}
                            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
                              status === 'excused'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                            title="Excused Leave"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>E</span>
                          </button>
                        </div>
                      </td>

                      {/* Remarks input */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={entry.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder={
                            status === 'late'
                              ? 'e.g. 15m delay'
                              : status === 'absent'
                              ? 'e.g. Uninformed absence'
                              : 'Optional notes'
                          }
                          className="w-full px-2.5 py-1 text-xs bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 border border-transparent focus:border-slate-300 dark:focus:border-slate-700 rounded text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Save Action Footer */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {savedFeedback ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{savedFeedback}</span>
              </span>
            ) : (
              <span>
                Saving commits records to localStorage and recalculates all student statistics.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Roll Call Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
