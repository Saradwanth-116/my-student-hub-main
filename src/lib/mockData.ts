export const studentProfile = {
  name: "Arjun Sharma",
  rollNo: "21CS1045",
  department: "Computer Science",
  semester: 6,
  year: 3,
  email: "arjun.sharma@university.edu",
};

export const attendanceData = [
  { subject: "Data Structures", code: "CS301", attended: 38, total: 42, percentage: 90 },
  { subject: "Operating Systems", code: "CS302", attended: 35, total: 40, percentage: 88 },
  { subject: "Database Systems", code: "CS303", attended: 30, total: 42, percentage: 71 },
  { subject: "Computer Networks", code: "CS304", attended: 40, total: 42, percentage: 95 },
  { subject: "Software Engineering", code: "CS305", attended: 28, total: 40, percentage: 70 },
  { subject: "Discrete Mathematics", code: "MA301", attended: 36, total: 42, percentage: 86 },
];

export type MarksEntry = {
  subject: string;
  code: string;
  mid1: number;
  mid1Total: number;
  mid2: number;
  mid2Total: number;
  semester: number;
  semesterTotal: number;
  grade: string;
};

export const marksData: Record<string, MarksEntry[]> = {
  "Year 1": [
    { subject: "Engineering Mathematics I", code: "MA101", mid1: 22, mid1Total: 30, mid2: 25, mid2Total: 30, semester: 72, semesterTotal: 100, grade: "A" },
    { subject: "Engineering Physics", code: "PH101", mid1: 18, mid1Total: 30, mid2: 20, mid2Total: 30, semester: 65, semesterTotal: 100, grade: "B+" },
    { subject: "Programming in C", code: "CS101", mid1: 28, mid1Total: 30, mid2: 27, mid2Total: 30, semester: 88, semesterTotal: 100, grade: "A+" },
    { subject: "Engineering Chemistry", code: "CH101", mid1: 20, mid1Total: 30, mid2: 22, mid2Total: 30, semester: 70, semesterTotal: 100, grade: "A" },
    { subject: "English Communication", code: "EN101", mid1: 24, mid1Total: 30, mid2: 26, mid2Total: 30, semester: 78, semesterTotal: 100, grade: "A" },
  ],
  "Year 2": [
    { subject: "Data Structures", code: "CS201", mid1: 26, mid1Total: 30, mid2: 24, mid2Total: 30, semester: 82, semesterTotal: 100, grade: "A" },
    { subject: "Digital Logic Design", code: "CS202", mid1: 20, mid1Total: 30, mid2: 23, mid2Total: 30, semester: 68, semesterTotal: 100, grade: "B+" },
    { subject: "Object Oriented Programming", code: "CS203", mid1: 27, mid1Total: 30, mid2: 28, mid2Total: 30, semester: 90, semesterTotal: 100, grade: "A+" },
    { subject: "Probability & Statistics", code: "MA201", mid1: 19, mid1Total: 30, mid2: 21, mid2Total: 30, semester: 64, semesterTotal: 100, grade: "B+" },
    { subject: "Computer Architecture", code: "CS204", mid1: 23, mid1Total: 30, mid2: 25, mid2Total: 30, semester: 75, semesterTotal: 100, grade: "A" },
  ],
  "Year 3": [
    { subject: "Operating Systems", code: "CS301", mid1: 25, mid1Total: 30, mid2: 24, mid2Total: 30, semester: 78, semesterTotal: 100, grade: "A" },
    { subject: "Database Systems", code: "CS302", mid1: 22, mid1Total: 30, mid2: 26, mid2Total: 30, semester: 74, semesterTotal: 100, grade: "A" },
    { subject: "Computer Networks", code: "CS303", mid1: 28, mid1Total: 30, mid2: 27, mid2Total: 30, semester: 85, semesterTotal: 100, grade: "A+" },
    { subject: "Software Engineering", code: "CS304", mid1: 21, mid1Total: 30, mid2: 23, mid2Total: 30, semester: 70, semesterTotal: 100, grade: "B+" },
    { subject: "Discrete Mathematics", code: "MA301", mid1: 24, mid1Total: 30, mid2: 22, mid2Total: 30, semester: 72, semesterTotal: 100, grade: "A" },
  ],
};
