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

import supabase from "./supabase";

export async function fetchAttendanceData(token: string): Promise<AttendanceRecord[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("code");

  if (error) throw error;
  return data as AttendanceRecord[];
}

export async function fetchMarksData(token: string): Promise<Record<string, MarksEntry[]>> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("marks")
    .select("*")
    .eq("user_id", user.id)
    .order("code");

  if (error) throw error;

  const grouped: Record<string, MarksEntry[]> = {};
  for (const row of data || []) {
    const yearLabel = row.year_label || "Unknown";
    // We don't necessarily need to delete the extra keys (like user_id, id) in JS,
    // but the backend did it. To match the type perfectly, we just group them.
    if (!grouped[yearLabel]) {
      grouped[yearLabel] = [];
    }
    
    grouped[yearLabel].push({
      subject: row.subject,
      code: row.code,
      mid1: row.mid1,
      mid1Total: row.mid1Total,
      mid2: row.mid2,
      mid2Total: row.mid2Total,
      semester: row.semester,
      semesterTotal: row.semesterTotal,
      grade: row.grade,
    } as MarksEntry);
  }

  return grouped;
}

export async function fetchPeerAverages(token: string): Promise<Record<string, number>> {
  // Call the Supabase Postgres function securely to get all peer averages
  const { data, error } = await supabase.rpc('get_peer_averages');
  
  if (error) {
    console.error("Failed to fetch peer averages from Supabase:", error);
    return {};
  }
  
  return data as Record<string, number>;
}

export type TeacherMarkEntry = MarksEntry & {
  profiles: {
    name: string;
    roll_no: string;
  };
};

export async function fetchAllMarksWithProfiles(): Promise<TeacherMarkEntry[]> {
  const { data, error } = await supabase.rpc('get_all_marks_with_profiles');
  
  if (error) {
    console.error("Failed to fetch all marks:", error);
    return [];
  }
  
  return (data as any[]).map((row: any) => ({
    subject: row.subject,
    code: row.code,
    mid1: row.mid1,
    mid1Total: row.mid1Total,
    mid2: row.mid2,
    mid2Total: row.mid2Total,
    semester: row.semester,
    semesterTotal: row.semesterTotal,
    grade: row.grade,
    profiles: {
      name: row.student_name,
      roll_no: row.student_roll_no
    }
  }));
}
