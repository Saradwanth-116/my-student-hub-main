const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export type AttendanceRecord = {
  subject: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
};

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

export async function fetchAttendanceData(token: string): Promise<AttendanceRecord[]> {
  return apiFetch<AttendanceRecord[]>("/api/student/attendance", token);
}

export async function fetchMarksData(token: string): Promise<Record<string, MarksEntry[]>> {
  return apiFetch<Record<string, MarksEntry[]>>("/api/student/marks", token);
}
