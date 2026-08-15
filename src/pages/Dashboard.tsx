import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAttendanceData, type AttendanceRecord } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { User, BookOpen, CalendarCheck, TrendingUp, Loader2, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getStatusBadge = (pct: number) => {
  if (pct >= 85) return <Badge className="bg-success text-success-foreground">Good</Badge>;
  if (pct >= 75) return <Badge className="bg-warning text-warning-foreground">Low</Badge>;
  return <Badge variant="destructive">Critical</Badge>;
};

const Dashboard = () => {
  const { profile, session } = useAuth();

  const { data: attendanceData = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", session?.user?.id],
    queryFn: () => fetchAttendanceData(session!.access_token),
    enabled: !!session,
  });

  const totalAttended = attendanceData.reduce((s, a) => s + a.attended, 0);
  const totalClasses = attendanceData.reduce((s, a) => s + a.total, 0);
  const overallAttendance = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Welcome, {profile?.name?.split(" ")[0] ?? "Student"}
            </h1>
            <p className="text-muted-foreground">Here's your academic overview</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="group flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                <Info className="h-5 w-5" />
                <span className="w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:w-[75px] opacity-0 group-hover:opacity-100">
                  Quick Info
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>College Credentials</DialogTitle>
                <DialogDescription>
                  Your official college digital access credentials. Do not share these with anyone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">College Email</p>
                  <p className="text-sm text-muted-foreground">{profile?.roll_no?.toLowerCase() ?? "student"}@college.edu</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Default Password</p>
                  <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded mt-1 select-all">
                    C0llege@{profile?.roll_no ?? "123"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">WiFi Access</p>
                  <p className="text-sm text-muted-foreground">Network: Eduroam</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

        {/* Subject-wise Detailed Attendance */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="font-heading text-3xl font-bold text-foreground">{totalClasses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Attended</p>
              <p className="font-heading text-3xl font-bold text-success">{totalAttended}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Overall</p>
              <p className={`font-heading text-3xl font-bold ${overallAttendance >= 75 ? "text-success" : "text-destructive"}`}>
                {overallAttendance}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attendance data yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Code</TableHead>
                    <TableHead className="text-center">Attended</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">%</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((s) => (
                    <TableRow key={s.code}>
                      <TableCell className="font-medium">{s.subject}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{s.code}</TableCell>
                      <TableCell className="text-center">{s.attended}</TableCell>
                      <TableCell className="text-center">{s.total}</TableCell>
                      <TableCell className="text-center font-semibold">{s.percentage}%</TableCell>
                      <TableCell className="text-center">{getStatusBadge(s.percentage)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
