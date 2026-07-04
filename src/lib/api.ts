const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiFetch<T>(path: string, token: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  console.log("[API] Fetching:", url);
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[API] Error response:", res.status, body);
      throw new Error(`API ${res.status}: ${body}`);
    }
    const data = await res.json();
    console.log("[API] Success:", path, data);
    return data;
  } catch (err) {
    console.error("[API] Fetch failed:", path, err);
    throw err;
  }
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
