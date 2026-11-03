import {
  AttendanceSession,
  AttendanceStatus,
  Student,
  StudentAttendanceStats,
  SystemSettings,
} from '../types/attendance';

const STORAGE_KEYS = {
  STUDENTS: 'attendease_students_v1',
  SESSIONS: 'attendease_sessions_v1',
  SETTINGS: 'attendease_settings_v1',
};

export const DEFAULT_SETTINGS: SystemSettings = {
  lowAttendanceThreshold: 75,
  lateWeight: 0.5,
  institutionName: 'AttendEase Academy of Technology',
  academicYear: '2026-2027',
  defaultDepartment: 'All',
};

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Mechanical Engg',
  'Civil Engg',
] as const;

export const SECTIONS = ['Section A', 'Section B', 'Section C'] as const;

const AVATAR_COLORS = [
  '#2563eb', // blue
  '#0d9488', // teal
  '#d97706', // amber
  '#7c3aed', // purple
  '#e11d48', // rose
  '#059669', // emerald
  '#4f46e5', // indigo
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-101',
    rollNumber: 'CS-2024-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-15',
    gender: 'Male',
    parentName: 'Vikram Sharma',
    parentPhone: '+1 (555) 901-2345',
    parentEmail: 'v.sharma@example.com',
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: 'STU-102',
    rollNumber: 'CS-2024-002',
    name: 'Sophia Patel',
    email: 'sophia.patel@example.edu',
    phone: '+1 (555) 345-6789',
    department: 'Computer Science',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-15',
    gender: 'Female',
    parentName: 'Raj Patel',
    parentPhone: '+1 (555) 902-3456',
    parentEmail: 'r.patel@example.com',
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: 'STU-103',
    rollNumber: 'CS-2024-003',
    name: 'Ethan Chen',
    email: 'ethan.chen@example.edu',
    phone: '+1 (555) 456-7890',
    department: 'Computer Science',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-16',
    gender: 'Male',
    parentName: 'David Chen',
    parentPhone: '+1 (555) 903-4567',
    parentEmail: 'd.chen@example.com',
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: 'STU-104',
    rollNumber: 'CS-2024-004',
    name: 'Maya Rodriguez',
    email: 'maya.rodriguez@example.edu',
    phone: '+1 (555) 567-8901',
    department: 'Computer Science',
    batch: 'Batch 2024-28',
    section: 'Section B',
    enrolledDate: '2024-08-16',
    gender: 'Female',
    parentName: 'Elena Rodriguez',
    parentPhone: '+1 (555) 904-5678',
    parentEmail: 'elena.r@example.com',
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: 'STU-105',
    rollNumber: 'IT-2024-012',
    name: 'Liam Walker',
    email: 'liam.walker@example.edu',
    phone: '+1 (555) 678-9012',
    department: 'Information Technology',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-17',
    gender: 'Male',
    parentName: 'Thomas Walker',
    parentPhone: '+1 (555) 905-6789',
    parentEmail: 't.walker@example.com',
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: 'STU-106',
    rollNumber: 'IT-2024-015',
    name: 'Zara Al-Mansoor',
    email: 'zara.mansoor@example.edu',
    phone: '+1 (555) 789-0123',
    department: 'Information Technology',
    batch: 'Batch 2024-28',
    section: 'Section B',
    enrolledDate: '2024-08-17',
    gender: 'Female',
    parentName: 'Tariq Mansoor',
    parentPhone: '+1 (555) 906-7890',
    parentEmail: 'tariq.m@example.com',
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: 'STU-107',
    rollNumber: 'EC-2024-021',
    name: 'Noah Gallagher',
    email: 'noah.gallagher@example.edu',
    phone: '+1 (555) 890-1234',
    department: 'Electronics & Comm',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-18',
    gender: 'Male',
    parentName: 'Sean Gallagher',
    parentPhone: '+1 (555) 907-8901',
    parentEmail: 's.gallagher@example.com',
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: 'STU-108',
    rollNumber: 'EC-2024-025',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.edu',
    phone: '+1 (555) 901-2345',
    department: 'Electronics & Comm',
    batch: 'Batch 2024-28',
    section: 'Section B',
    enrolledDate: '2024-08-18',
    gender: 'Female',
    parentName: 'Kalyan Iyer',
    parentPhone: '+1 (555) 908-9012',
    parentEmail: 'k.iyer@example.com',
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: 'STU-109',
    rollNumber: 'ME-2024-033',
    name: 'Lucas Silva',
    email: 'lucas.silva@example.edu',
    phone: '+1 (555) 012-3456',
    department: 'Mechanical Engg',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-19',
    gender: 'Male',
    parentName: 'Mateo Silva',
    parentPhone: '+1 (555) 909-0123',
    parentEmail: 'm.silva@example.com',
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: 'STU-110',
    rollNumber: 'ME-2024-037',
    name: 'Chloe Kim',
    email: 'chloe.kim@example.edu',
    phone: '+1 (555) 123-4567',
    department: 'Mechanical Engg',
    batch: 'Batch 2024-28',
    section: 'Section B',
    enrolledDate: '2024-08-19',
    gender: 'Female',
    parentName: 'Min-Jun Kim',
    parentPhone: '+1 (555) 910-1234',
    parentEmail: 'minjun.kim@example.com',
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: 'STU-111',
    rollNumber: 'CE-2024-041',
    name: 'Daniel Brooks',
    email: 'daniel.brooks@example.edu',
    phone: '+1 (555) 234-9876',
    department: 'Civil Engg',
    batch: 'Batch 2024-28',
    section: 'Section A',
    enrolledDate: '2024-08-20',
    gender: 'Male',
    parentName: 'Jonathan Brooks',
    parentPhone: '+1 (555) 911-2345',
    parentEmail: 'j.brooks@example.com',
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: 'STU-112',
    rollNumber: 'CE-2024-045',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@example.edu',
    phone: '+1 (555) 345-0987',
    department: 'Civil Engg',
    batch: 'Batch 2024-28',
    section: 'Section B',
    enrolledDate: '2024-08-20',
    gender: 'Female',
    parentName: 'Ibrahim Zahra',
    parentPhone: '+1 (555) 912-3456',
    parentEmail: 'i.zahra@example.com',
    avatarColor: AVATAR_COLORS[4],
  },
] as any[];

/**
 * Generate 12 past sessions for weekdays leading up to current date
 */
export function generateSeedSessions(students: Student[]): AttendanceSession[] {
  const sessions: AttendanceSession[] = [];
  const today = new Date();
  
  // Create past dates (skip weekends)
  const pastDates: string[] = [];
  let d = new Date(today);
  d.setDate(d.getDate() - 1); // start yesterday
  
  while (pastDates.length < 12) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
      pastDates.unshift(d.toISOString().slice(0, 10));
    }
    d.setDate(d.getDate() - 1);
  }

  // Pre-seed known profiles for realistic variance:
  // e.g. Liam Walker and Lucas Silva have lower attendance to trigger alert
  pastDates.forEach((dateStr, sessionIndex) => {
    const records: Record<string, { status: AttendanceStatus; remarks?: string }> = {};

    students.forEach((student) => {
      let status: AttendanceStatus = 'present';
      let remarks: string | undefined = undefined;

      if (student.rollNumber === 'IT-2024-012') {
        // Liam Walker - low attendance (~60%)
        if (sessionIndex % 3 === 0) {
          status = 'absent';
          remarks = 'Unexcused absence';
        } else if (sessionIndex === 7) {
          status = 'late';
          remarks = 'Arrived 20 mins late';
        }
      } else if (student.rollNumber === 'ME-2024-033') {
        // Lucas Silva - borderline low (~68%)
        if (sessionIndex === 2 || sessionIndex === 5 || sessionIndex === 9) {
          status = 'absent';
          remarks = 'Family function';
        } else if (sessionIndex === 11) {
          status = 'late';
        }
      } else if (student.rollNumber === 'CS-2024-003') {
        // Ethan Chen - occasional late or excused
        if (sessionIndex === 4) {
          status = 'excused';
          remarks = 'Athletic tournament permit';
        } else if (sessionIndex === 8) {
          status = 'late';
          remarks = 'Commute delay';
        }
      } else {
        // High attendance students: ~90-100%
        if (sessionIndex === 6 && student.rollNumber === 'CE-2024-041') {
          status = 'absent';
          remarks = 'Sick leave';
        } else if (sessionIndex === 3 && student.rollNumber === 'CS-2024-004') {
          status = 'late';
        }
      }

      records[student.id] = {
        status,
        remarks,
      };
    });

    sessions.push({
      id: `SES-${dateStr}-ALL`,
      date: dateStr,
      department: 'All',
      section: 'All',
      subject: 'Core Academic Sessions',
      records,
      markedAt: `${dateStr}T09:30:00.000Z`,
      markedBy: 'Prof. Anderson (Dean of Academics)',
      notes: 'Morning Roll Call',
    });
  });

  return sessions;
}

// Storage operations
export function getSavedStudents(): Student[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading students from localStorage', err);
  }
  // If empty, initialize with defaults
  saveStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to localStorage', err);
  }
}

export function getSavedSessions(): AttendanceSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading sessions from localStorage', err);
  }
  // Initialize with seed sessions
  const students = getSavedStudents();
  const seedSessions = generateSeedSessions(students);
  saveSessions(seedSessions);
  return seedSessions;
}

export function saveSessions(sessions: AttendanceSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions to localStorage', err);
  }
}

export function getSavedSettings(): SystemSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('Error reading settings from localStorage', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: SystemSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage', err);
  }
}

export function resetAllDataToDemo(): { students: Student[]; sessions: AttendanceSession[]; settings: SystemSettings } {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);

  const students = [...INITIAL_STUDENTS];
  const sessions = generateSeedSessions(students);
  const settings = { ...DEFAULT_SETTINGS };

  saveStudents(students);
  saveSessions(sessions);
  saveSettings(settings);

  return { students, sessions, settings };
}

/**
 * Calculate statistical breakdown for a single student across all sessions
 */
export function calculateStudentStats(
  student: Student,
  sessions: AttendanceSession[],
  settings: SystemSettings
): StudentAttendanceStats {
  // Sort sessions chronological ascending
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;
  let totalSessions = 0;

  const recentRecords: { date: string; status: AttendanceStatus; subject?: string; remarks?: string }[] = [];

  sortedSessions.forEach((session) => {
    // Check if session applies to this student (e.g. session department is 'All' or matches student's)
    const deptMatch = session.department === 'All' || session.department === student.department;
    const secMatch = session.section === 'All' || session.section === student.section;

    if (deptMatch && secMatch) {
      const entry = session.records[student.id];
      if (entry) {
        totalSessions++;
        if (entry.status === 'present') presentCount++;
        else if (entry.status === 'absent') absentCount++;
        else if (entry.status === 'late') lateCount++;
        else if (entry.status === 'excused') excusedCount++;

        recentRecords.push({
          date: session.date,
          status: entry.status,
          subject: session.subject,
          remarks: entry.remarks,
        });
      }
    }
  });

  // Effective presence: present = 1, late = lateWeight (e.g. 0.5)
  const lateWeight = typeof settings.lateWeight === 'number' ? settings.lateWeight : 0.5;
  const effectivePresent = presentCount + lateCount * lateWeight;

  // Percentage:
  const percentage = totalSessions > 0 ? Number(((effectivePresent / totalSessions) * 100).toFixed(1)) : 100;
  const isLowAttendance = totalSessions > 0 && percentage < settings.lowAttendanceThreshold;

  // Calculate consecutive absences from the end of the history
  let consecutiveAbsences = 0;
  for (let i = recentRecords.length - 1; i >= 0; i--) {
    if (recentRecords[i].status === 'absent') {
      consecutiveAbsences++;
    } else {
      break;
    }
  }

  // Shortfall sessions calculation to hit threshold T
  // (effectivePresent + N) / (totalSessions + N) >= T / 100
  let shortfallSessions = 0;
  if (isLowAttendance && totalSessions > 0) {
    const targetRatio = settings.lowAttendanceThreshold / 100;
    if (targetRatio < 1) {
      const requiredN = (targetRatio * totalSessions - effectivePresent) / (1 - targetRatio);
      shortfallSessions = Math.max(0, Math.ceil(requiredN));
    }
  }

  return {
    student,
    totalSessions,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
    effectivePresent,
    percentage,
    isLowAttendance,
    shortfallSessions,
    consecutiveAbsences,
    recentRecords: recentRecords.reverse(), // latest first
  };
}

/**
 * Calculates overall institutional stats
 */
export function calculateOverallStats(
  students: Student[],
  sessions: AttendanceSession[],
  settings: SystemSettings
) {
  const studentStats = students.map((s) => calculateStudentStats(s, sessions, settings));

  const totalStudents = students.length;
  const lowAttendanceStudents = studentStats.filter((s) => s.isLowAttendance);
  const lowAttendanceCount = lowAttendanceStudents.length;

  const avgPercentage =
    totalStudents > 0
      ? Number(
          (
            studentStats.reduce((sum, s) => sum + s.percentage, 0) / totalStudents
          ).toFixed(1)
        )
      : 0;

  // Total session count
  const totalSessionsCount = sessions.length;

  // Latest session stats
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestSession = sortedSessions[0] || null;

  let latestSessionPresentRate = 0;
  if (latestSession) {
    const entries = Object.values(latestSession.records);
    if (entries.length > 0) {
      const presentCount = entries.filter(
        (e) => e.status === 'present' || e.status === 'late'
      ).length;
      latestSessionPresentRate = Number(
        ((presentCount / entries.length) * 100).toFixed(1)
      );
    }
  }

  return {
    totalStudents,
    totalSessionsCount,
    avgPercentage,
    lowAttendanceCount,
    lowAttendanceStudents,
    studentStats,
    latestSession,
    latestSessionPresentRate,
  };
}

/**
 * CSV Generation & Download Helpers
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportStudentsSummaryCSV(
  students: Student[],
  sessions: AttendanceSession[],
  settings: SystemSettings
): void {
  const statsList = students.map((s) => calculateStudentStats(s, sessions, settings));

  const headers = [
    'Roll Number',
    'Full Name',
    'Department',
    'Section',
    'Batch',
    'Email',
    'Phone',
    'Total Sessions',
    'Present Days',
    'Absent Days',
    'Late Days',
    'Excused Days',
    'Attendance %',
    'Status (Threshold: ' + settings.lowAttendanceThreshold + '%)',
    'Sessions Needed for ' + settings.lowAttendanceThreshold + '%',
  ];

  const rows = statsList.map((stat) => [
    `"${stat.student.rollNumber}"`,
    `"${stat.student.name.replace(/"/g, '""')}"`,
    `"${stat.student.department}"`,
    `"${stat.student.section}"`,
    `"${stat.student.batch}"`,
    `"${stat.student.email}"`,
    `"${stat.student.phone}"`,
    stat.totalSessions,
    stat.presentCount,
    stat.absentCount,
    stat.lateCount,
    stat.excusedCount,
    `${stat.percentage}%`,
    stat.isLowAttendance ? 'CRITICAL / LOW' : 'REGULAR / NORMAL',
    stat.shortfallSessions,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`AttendEase_Student_Attendance_Summary_${dateStr}.csv`, csvContent);
}

export function exportAttendanceLedgerCSV(
  sessions: AttendanceSession[],
  students: Student[]
): void {
  const studentMap = new Map(students.map((s) => [s.id, s]));

  const headers = [
    'Date',
    'Subject / Session',
    'Department Filter',
    'Roll Number',
    'Student Name',
    'Department',
    'Section',
    'Attendance Status',
    'Remarks',
    'Marked By',
  ];

  const rows: string[][] = [];

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  sortedSessions.forEach((session) => {
    Object.entries(session.records).forEach(([studentId, entry]) => {
      const student = studentMap.get(studentId);
      if (student) {
        rows.push([
          `"${session.date}"`,
          `"${(session.subject || 'Standard Session').replace(/"/g, '""')}"`,
          `"${session.department}"`,
          `"${student.rollNumber}"`,
          `"${student.name.replace(/"/g, '""')}"`,
          `"${student.department}"`,
          `"${student.section}"`,
          `"${entry.status.toUpperCase()}"`,
          `"${(entry.remarks || '').replace(/"/g, '""')}"`,
          `"${(session.markedBy || 'Faculty').replace(/"/g, '""')}"`,
        ]);
      }
    });
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`AttendEase_Detailed_Attendance_Ledger_${dateStr}.csv`, csvContent);
}

export function exportLowAttendanceCSV(
  lowAttendanceStats: StudentAttendanceStats[],
  settings: SystemSettings
): void {
  const headers = [
    'Roll Number',
    'Student Name',
    'Department',
    'Section',
    'Student Email',
    'Student Phone',
    'Parent Contact',
    'Parent Phone',
    'Parent Email',
    'Total Sessions Held',
    'Total Attended (Present)',
    'Total Absent',
    'Total Late',
    'Current Attendance %',
    `Threshold Required %`,
    'Consecutive Absences',
    'Immediate Sessions Needed to Reach Threshold',
  ];

  const rows = lowAttendanceStats.map((stat) => [
    `"${stat.student.rollNumber}"`,
    `"${stat.student.name.replace(/"/g, '""')}"`,
    `"${stat.student.department}"`,
    `"${stat.student.section}"`,
    `"${stat.student.email}"`,
    `"${stat.student.phone}"`,
    `"${(stat.student.parentName || 'Guardian').replace(/"/g, '""')}"`,
    `"${stat.student.parentPhone || 'N/A'}"`,
    `"${stat.student.parentEmail || 'N/A'}"`,
    stat.totalSessions,
    stat.presentCount,
    stat.absentCount,
    stat.lateCount,
    `${stat.percentage}%`,
    `${settings.lowAttendanceThreshold}%`,
    stat.consecutiveAbsences,
    stat.shortfallSessions,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`AttendEase_Low_Attendance_Warning_List_${dateStr}.csv`, csvContent);
}
