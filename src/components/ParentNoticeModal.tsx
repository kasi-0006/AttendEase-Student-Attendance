import React, { useState } from 'react';
import { X, Copy, Check, Mail, ExternalLink, AlertTriangle } from 'lucide-react';
import { Student, StudentAttendanceStats, SystemSettings } from '../types/attendance';

interface ParentNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  stats: StudentAttendanceStats | null;
  settings: SystemSettings;
}

export const ParentNoticeModal: React.FC<ParentNoticeModalProps> = ({
  isOpen,
  onClose,
  student,
  stats,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !student || !stats) return null;

  const guardianRecipient = student.parentName || 'Parent / Legal Guardian';
  const parentEmail = student.parentEmail || student.email;
  const subject = `Official Attendance Shortfall Notice: ${student.name} (${student.rollNumber})`;

  const messageBody = `OFFICIAL ATTENDANCE SHORTFALL WARNING

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Institution: ${settings.institutionName}
Academic Term: ${settings.academicYear}

Dear ${guardianRecipient},

This is an official administrative notice regarding the attendance record of your ward, ${student.name} (Roll Number: ${student.rollNumber}), currently enrolled in ${student.department}, ${student.section}.

Current Attendance Record:
- Total Academic Sessions Held: ${stats.totalSessions}
- Sessions Attended (Present): ${stats.presentCount}
- Sessions Late: ${stats.lateCount}
- Total Unexcused Absences: ${stats.absentCount}
- Consecutive Current Absences: ${stats.consecutiveAbsences}
- Current Attendance Rate: ${stats.percentage}%
- Minimum Mandatory Requirement: ${settings.lowAttendanceThreshold}%

According to academic regulations, an attendance rate below ${settings.lowAttendanceThreshold}% disqualifies the student from appearing in mid-term and semester examination evaluations.

Action Required:
To regain eligibility and reach the mandatory ${settings.lowAttendanceThreshold}% threshold, ${student.name} must attend the next ${stats.shortfallSessions} consecutive sessions without unexcused absences.

Kindly contact the academic department coordinator or proctor office if you have any questions or to submit legitimate medical documentation.

Office of Academic Records & Attendance Management
${settings.institutionName}
Contact: dean.academics@example.edu`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoUrl = `mailto:${encodeURIComponent(parentEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(messageBody)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Official Attendance Shortfall Notice
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Notice drafted for {student.name} ({student.rollNumber})
              </p>
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Recipient:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {guardianRecipient} ({parentEmail || 'No email registered'})
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Current Rate:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {stats.percentage}% / {settings.lowAttendanceThreshold}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Notice Draft Preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={11}
              value={messageBody}
              className="w-full p-3 font-mono text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy Notice'}</span>
            </button>

            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open in Email Client</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
