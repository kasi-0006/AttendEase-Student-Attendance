export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  batch: string;
  section: string;
  enrolledDate: string;
  gender?: 'Male' | 'Female' | 'Other';
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  avatarColor?: string;
}

export interface StudentRecordEntry {
  status: AttendanceStatus;
  remarks?: string;
  timeMarked?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  department: string; // e.g. "All" or specific
  section: string;    // e.g. "All" or "A", "B"
  subject?: string;
  records: Record<string, StudentRecordEntry>; // studentId -> StudentRecordEntry
  markedAt: string;
  markedBy?: string;
  notes?: string;
}

export interface StudentAttendanceStats {
  student: Student;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  effectivePresent: number;
  percentage: number;
  isLowAttendance: boolean;
  shortfallSessions: number; // sessions needed to reach threshold
  consecutiveAbsences: number;
  recentRecords: { date: string; status: AttendanceStatus; subject?: string; remarks?: string }[];
}

export interface SystemSettings {
  lowAttendanceThreshold: number; // default 75
  lateWeight: number; // default 0.5 (or 1.0 or 0)
  institutionName: string;
  academicYear: string;
  defaultDepartment: string;
}
