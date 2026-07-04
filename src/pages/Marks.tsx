import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMarksData, type MarksEntry } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const gradeColor = (grade: string) => {
  if (grade === "A+") return "bg-success text-success-foreground";
  if (grade === "A") return "bg-primary text-primary-foreground";
  return "bg-secondary text-secondary-foreground";
};

const Marks = () => {
  const { session } = useAuth();

  const { data: marksData = {}, isLoading } = useQuery<Record<string, MarksEntry[]>>({
    queryKey: ["marks", session?.user?.id],
    queryFn: () => fetchMarksData(session!.access_token),
    enabled: !!session,
  });

  const years = Object.keys(marksData);
  const [activeYear, setActiveYear] = useState<string>("");

  const displayYear = activeYear && years.includes(activeYear) ? activeYear : years[years.length - 1] ?? "";

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
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Exam Marks</h1>
          <p className="text-muted-foreground">Mid-term and semester exam results by year</p>
        </div>

        {years.length > 0 ? (
          <>
            <div className="flex gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${displayYear === year
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">{displayYear} — Results</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Code</TableHead>
                      <TableHead className="text-center">Mid 1</TableHead>
                      <TableHead className="text-center">Mid 2</TableHead>
                      <TableHead className="text-center">Semester</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(marksData[displayYear] ?? []).map((m) => (
                      <TableRow key={m.code}>
                        <TableCell className="font-medium">{m.subject}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{m.code}</TableCell>
                        <TableCell className="text-center">
                          {m.mid1}<span className="text-muted-foreground">/{m.mid1Total}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {m.mid2}<span className="text-muted-foreground">/{m.mid2Total}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {m.semester}<span className="text-muted-foreground">/{m.semesterTotal}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={gradeColor(m.grade)}>{m.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No marks data yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marks;
