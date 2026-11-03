import React, { useState } from 'react';
import {
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Upload,
  Settings,
  Send,
  RotateCcw,
  Sliders,
  Check,
  ShieldAlert,
  Eye,
} from 'lucide-react';
import {
  Student,
  StudentAttendanceStats,
  SystemSettings,
  AttendanceSession,
} from '../types/attendance';

interface AlertsAndReportsProps {
  students: Student[];
  sessions: AttendanceSession[];
  settings: SystemSettings;
  studentStats: StudentAttendanceStats[];
  lowAttendanceStats: StudentAttendanceStats[];
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onOpenNoticeDraft: (student: Student, stats: StudentAttendanceStats) => void;
  onSelectStudent: (student: Student) => void;
  onExportSummaryCSV: () => void;
  onExportLedgerCSV: () => void;
  onExportLowAttendanceCSV: () => void;
  onResetData: () => void;
  onImportJSON: (jsonString: string) => void;
}

export const AlertsAndReports: React.FC<AlertsAndReportsProps> = ({
  students,
  sessions,
  settings,
  studentStats,
  lowAttendanceStats,
  onUpdateSettings,
  onOpenNoticeDraft,
  onSelectStudent,
  onExportSummaryCSV,
  onExportLedgerCSV,
  onExportLowAttendanceCSV,
  onResetData,
  onImportJSON,
}) => {
  const [thresholdInput, setThresholdInput] = useState<number>(
    settings.lowAttendanceThreshold
  );
  const [lateWeightInput, setLateWeightInput] = useState<number>(
    settings.lateWeight
  );
  const [instName, setInstName] = useState<string>(settings.institutionName);
  const [academicYear, setAcademicYear] = useState<string>(settings.academicYear);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      lowAttendanceThreshold: Number(thresholdInput),
      lateWeight: Number(lateWeightInput),
      institutionName: instName.trim() || 'AttendEase Academy',
      academicYear: academicYear.trim() || '2026-2027',
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleBackupJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      system: 'AttendEase',
      settings,
      students,
      sessions,
    };
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AttendEase_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <span>Low-Attendance Alerts &amp; CSV Reports</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor at-risk students falling short of academic requirements, draft guardian notices, and download reports.
        </p>
      </div>

      {/* Threshold Setting & Live Counter Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Attendance Threshold Target</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Students whose attendance falls below this rate are immediately flagged for intervention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Required:
            </span>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-white tabular-nums bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              {thresholdInput}%
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={thresholdInput}
              onChange={(e) => {
                const val = Number(e.target.value);
                setThresholdInput(val);
                onUpdateSettings({ ...settings, lowAttendanceThreshold: val });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>50% (Lenient)</span>
              <span>75% (Standard University)</span>
              <span>90% (Strict)</span>
            </div>
          </div>

          <div className="shrink-0 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <div>
              <span className="font-semibold text-rose-900 dark:text-rose-200">
                {lowAttendanceStats.length} Student{lowAttendanceStats.length === 1 ? '' : 's'} Flagged
              </span>
              <div className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                Currently below {thresholdInput}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Students List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Flagged Defaulter Roster ({lowAttendanceStats.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recovery shortfall calculated using exact session probability formula
            </p>
          </div>

          {lowAttendanceStats.length > 0 && (
            <button
              type="button"
              onClick={onExportLowAttendanceCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Alert CSV</span>
            </button>
          )}
        </div>

        {lowAttendanceStats.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              No students below threshold!
            </p>
            <p className="mt-1">
              Every enrolled student currently maintains ≥ {settings.lowAttendanceThreshold}% attendance.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-right">Attendance Rate</th>
                  <th className="py-3 px-4">Consecutive Recovery</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lowAttendanceStats.map((stat) => (
                  <tr
                    key={stat.student.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {stat.student.rollNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: stat.student.avatarColor || '#2563eb',
                          }}
                        >
                          {stat.student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {stat.student.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {stat.student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <div>{stat.student.department}</div>
                      <div className="text-[11px] text-slate-400">{stat.student.section}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                        {stat.percentage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {stat.absentCount} of {stat.totalSessions} absent
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md text-[11px]">
                        <span>Must attend <strong>{stat.shortfallSessions}</strong> consecutive sessions</span>
                      </div>
                      {stat.consecutiveAbsences > 1 && (
                        <div className="text-[10px] text-rose-600 mt-0.5">
                          {stat.consecutiveAbsences} continuous absences
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {stat.student.parentName || 'Guardian'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {stat.student.parentPhone || stat.student.parentEmail || 'No contact info'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectStudent(stat.student)}
                          title="Inspect Student Record"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenNoticeDraft(stat.student, stat)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Draft Notice</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV Export Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Attendance CSV Export Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Download standard spreadsheet files formatted for university registries and department analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Card 1: Student Master Summary */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs">
                Student Attendance Summary CSV
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                All {students.length} students with calculated percentages, total present, absent, late days, and eligibility standing.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportSummaryCSV}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export Summary CSV</span>
            </button>
          </div>

          {/* Card 2: Low-Attendance Report */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs">
                Low-Attendance Warning List CSV
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Filter of {lowAttendanceStats.length} students under {settings.lowAttendanceThreshold}%, with parent contacts and recovery shortfalls.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportLowAttendanceCSV}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Export Low Attendance CSV</span>
            </button>
          </div>

          {/* Card 3: Full Session Ledger */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs">
                Detailed Roll Call Ledger CSV
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Full session logs ({sessions.length} sessions) with individual date entries, instructor signatures, and student remarks.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportLedgerCSV}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export Ledger CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Settings & Local Storage Utilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>System Calculation Rules</span>
            </h3>
            {settingsSavedToast && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Settings Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Academic Term
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Late Attendance Credit Weight
                </label>
                <select
                  value={lateWeightInput}
                  onChange={(e) => setLateWeightInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0.5}>0.5 (Half presence credit)</option>
                  <option value={1.0}>1.0 (Full presence credit)</option>
                  <option value={0.0}>0.0 (Treated as absence)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-xs transition-all"
            >
              Update Calculation Settings
            </button>
          </form>
        </div>

        {/* Local Storage Backup & Recovery */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Local Storage Backup &amp; Recovery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All records reside in your browser's Local Storage. Export or restore backups at any time.
              </p>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Export JSON Snapshot
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Includes {students.length} students &amp; {sessions.length} sessions
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBackupJSON}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Restore From JSON Backup
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Upload a previously exported AttendEase JSON file
                  </div>
                </div>
                <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Need fresh sample data?
            </span>
            <button
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
