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
import { Button } from "@/components/ui/button";

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
                  Profile
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Student Profile</DialogTitle>
                <DialogDescription>
                  Your official academic records and personal details.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Name</p>
                    <p className="text-sm text-muted-foreground">{profile?.name ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Roll Number</p>
                    <p className="text-sm text-muted-foreground">{profile?.roll_no ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Year & Semester</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.semester ? `Year ${Math.ceil(profile.semester / 2)}, Sem ${profile.semester}` : "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Branch</p>
                    <p className="text-sm text-muted-foreground">{profile?.department ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Phone</p>
                    <p className="text-sm text-muted-foreground italic">Not provided</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Address</p>
                    <p className="text-sm text-muted-foreground italic">Not provided</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Bio Details</p>
                  <p className="text-sm text-muted-foreground italic">No additional details</p>
                </div>

                <div className="mt-2 border-t border-border pt-4">
                  <Button variant="outline" className="w-full" onClick={() => { }}>
                    Request Profile Update
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Information can only be changed by submitting an official request to administration.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile & Deadlines */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col justify-center">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.name ?? "Student"}</h2>
                  <p className="text-muted-foreground">{profile?.roll_no ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground ml-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{profile?.department ?? "—"} &bull; Sem {profile?.semester ?? "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="h-5 w-5 text-warning" />
                <h3 className="font-semibold">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-l-2 border-destructive pl-3">
                  <div>
                    <p className="text-sm font-medium">OS Assignment 2</p>
                    <p className="text-xs text-muted-foreground">Operating Systems</p>
                  </div>
                  <p className="text-sm font-bold text-destructive">Tomorrow</p>
                </div>
                <div className="flex items-center justify-between border-l-2 border-primary pl-3">
                  <div>
                    <p className="text-sm font-medium">DBMS Mini Project</p>
                    <p className="text-xs text-muted-foreground">Database Systems</p>
                  </div>
                  <p className="text-sm font-bold">Oct 25</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
