import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAttendanceData, type AttendanceRecord } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const getStatusBadge = (pct: number) => {
  if (pct >= 85) return <Badge className="bg-success text-success-foreground">Good</Badge>;
  if (pct >= 75) return <Badge className="bg-warning text-warning-foreground">Low</Badge>;
  return <Badge variant="destructive">Critical</Badge>;
};

const Attendance = () => {
  const { session } = useAuth();

  const { data: attendanceData = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", session?.user?.id],
    queryFn: () => fetchAttendanceData(session!.access_token),
    enabled: !!session,
  });

  const totalAttended = attendanceData.reduce((s, a) => s + a.attended, 0);
  const totalClasses = attendanceData.reduce((s, a) => s + a.total, 0);
  const overall = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

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
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Attendance</h1>
          <p className="text-muted-foreground">Current semester attendance details</p>
        </div>

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
              <p className={`font-heading text-3xl font-bold ${overall >= 75 ? "text-success" : "text-destructive"}`}>
                {overall}%
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

export default Attendance;
