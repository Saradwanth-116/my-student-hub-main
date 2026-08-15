import { useMemo, useState, useEffect } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMarksWithProfiles, type TeacherMarkEntry } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TeacherAnalytics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [namePage, setNamePage] = useState(1);
  const [subjectPage, setSubjectPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setNamePage(1);
    setSubjectPage(1);
  }, [searchQuery]);

  const { data: marks = [], isLoading } = useQuery<TeacherMarkEntry[]>({
    queryKey: ["teacher", "all-marks"],
    queryFn: fetchAllMarksWithProfiles,
  });

  const filteredMarks = useMemo(() => {
    if (!searchQuery.trim()) return marks;
    const lower = searchQuery.toLowerCase();
    return marks.filter((m) => 
      m.profiles.name.toLowerCase().includes(lower) || 
      m.profiles.roll_no.toLowerCase().includes(lower) ||
      m.subject.toLowerCase().includes(lower) ||
      m.code.toLowerCase().includes(lower)
    );
  }, [marks, searchQuery]);

  // Group by student name -> roll_no key
  const nameWiseData = useMemo(() => {
    const grouped: Record<string, TeacherMarkEntry[]> = {};
    for (const m of filteredMarks) {
      const key = `${m.profiles.name} (${m.profiles.roll_no})`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    }
    return grouped;
  }, [filteredMarks]);

  // Group by subject code
  const subjectWiseData = useMemo(() => {
    const grouped: Record<string, TeacherMarkEntry[]> = {};
    for (const m of filteredMarks) {
      const key = `${m.subject} [${m.code}]`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    }
    return grouped;
  }, [filteredMarks]);

  const renderTable = (data: TeacherMarkEntry[], isSubjectWise: boolean) => (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {isSubjectWise ? (
              <>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll No</TableHead>
              </>
            ) : (
              <TableHead>Subject</TableHead>
            )}
            <TableHead className="text-center">Mid 1</TableHead>
            <TableHead className="text-center">Mid 2</TableHead>
            <TableHead className="text-center">Semester</TableHead>
            <TableHead className="text-center">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((m, idx) => (
            <TableRow key={idx}>
              {isSubjectWise ? (
                <>
                  <TableCell className="font-medium">{m.profiles.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.profiles.roll_no}</TableCell>
                </>
              ) : (
                <TableCell className="font-medium">{m.subject}</TableCell>
              )}
              <TableCell className="text-center">{m.mid1}/{m.mid1Total}</TableCell>
              <TableCell className="text-center">{m.mid2}/{m.mid2Total}</TableCell>
              <TableCell className="text-center">{m.semester}/{m.semesterTotal}</TableCell>
              <TableCell className="text-center font-bold">{m.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const nameEntries = Object.entries(nameWiseData);
  const totalNamePages = Math.max(1, Math.ceil(nameEntries.length / ITEMS_PER_PAGE));
  const paginatedNameEntries = nameEntries.slice((namePage - 1) * ITEMS_PER_PAGE, namePage * ITEMS_PER_PAGE);

  const subjectEntries = Object.entries(subjectWiseData);
  const totalSubjectPages = Math.max(1, Math.ceil(subjectEntries.length / ITEMS_PER_PAGE));
  const paginatedSubjectEntries = subjectEntries.slice((subjectPage - 1) * ITEMS_PER_PAGE, subjectPage * ITEMS_PER_PAGE);

  return (
    <TeacherLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Class Analytics</h1>
            <p className="text-muted-foreground">Review student performance across the entire class.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="shadow-md border-border">
            <CardHeader>
              <CardTitle>Performance Records</CardTitle>
              <CardDescription>
                Browse student marks. Data is grouped dynamically for a lag-free viewing experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="name-wise" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="name-wise">Name Wise</TabsTrigger>
                    <TabsTrigger value="subject-wise">Subject Wise</TabsTrigger>
                  </TabsList>
                  
                  <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by Name, Roll, Subject..."
                      className="pl-8 bg-muted/50 border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <TabsContent value="name-wise" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full border rounded-lg p-2">
                    {paginatedNameEntries.map(([student, records], i) => (
                      <AccordionItem key={i} value={`student-${i}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-md">
                          <span className="font-semibold text-lg">{student}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                          {renderTable(records, false)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {paginatedNameEntries.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground">No students found matching your search.</p>
                    )}
                  </Accordion>
                  
                  {totalNamePages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing page {namePage} of {totalNamePages}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setNamePage(p => Math.max(1, p - 1))}
                          disabled={namePage === 1}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setNamePage(p => Math.min(totalNamePages, p + 1))}
                          disabled={namePage === totalNamePages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="subject-wise" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full border rounded-lg p-2">
                    {paginatedSubjectEntries.map(([subject, records], i) => (
                      <AccordionItem key={i} value={`subject-${i}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-md">
                          <span className="font-semibold text-lg">{subject}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                          {renderTable(records, true)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {paginatedSubjectEntries.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground">No subjects found matching your search.</p>
                    )}
                  </Accordion>
                  
                  {totalSubjectPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing page {subjectPage} of {totalSubjectPages}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSubjectPage(p => Math.max(1, p - 1))}
                          disabled={subjectPage === 1}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSubjectPage(p => Math.min(totalSubjectPages, p + 1))}
                          disabled={subjectPage === totalSubjectPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherAnalytics;
