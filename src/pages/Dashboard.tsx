import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAttendanceData, type AttendanceRecord } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { User, BookOpen, CalendarCheck, TrendingUp, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile, session } = useAuth();

  const { data: attendanceData = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", session?.user?.id],
    queryFn: () => fetchAttendanceData(session!.access_token),
    enabled: !!session,
  });

  const overallAttendance =
    attendanceData.length > 0
      ? Math.round(
        attendanceData.reduce((sum, s) => sum + s.percentage, 0) /
        attendanceData.length
      )
      : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Welcome, {profile?.name?.split(" ")[0] ?? "Student"}
          </h1>
          <p className="text-muted-foreground">Here's your academic overview</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Roll Number", value: profile?.roll_no ?? "—", icon: User, color: "text-primary" },
            { label: "Department", value: profile?.department ?? "—", icon: BookOpen, color: "text-secondary dark:text-primary" },
            { label: "Semester", value: profile ? `Sem ${profile.semester}` : "—", icon: CalendarCheck, color: "text-accent dark:text-primary" },
            { label: "Overall Attendance", value: `${overallAttendance}%`, icon: TrendingUp, color: "text-success" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl bg-muted p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="font-heading text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance Quick View */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {attendanceData.length === 0 && (
              <p className="text-sm text-muted-foreground">No attendance data yet.</p>
            )}
            {attendanceData.map((s) => (
              <div key={s.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{s.subject}</span>
                  <span
                    className={`font-semibold ${s.percentage >= 85
                        ? "text-success"
                        : s.percentage >= 75
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                  >
                    {s.percentage}%
                  </span>
                </div>
                <Progress value={s.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
