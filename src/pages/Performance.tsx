import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMarksData, type MarksEntry } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BrainCircuit, Activity, Lightbulb } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom X-Axis Tick that renders a circle and an SVG tooltip on hover
const CustomCircleTick = (props: { x?: number; y?: number; payload?: { value: string } }) => {
  const { x = 0, y = 0, payload } = props;
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate width based on text length roughly
  const label = payload?.value || "";
  const textWidth = Math.max(120, label.length * 8);
  const boxX = -(textWidth / 2);

  return (
    <g 
      transform={`translate(${x},${y})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ pointerEvents: 'bounding-box' }}
    >
      {/* Invisible larger circle to increase hover area */}
      <circle cx={0} cy={14} r={16} fill="transparent" className="cursor-pointer" />
      {/* Visible small circle */}
      <circle cx={0} cy={14} r={5} className={`transition-colors cursor-pointer ${isHovered ? 'fill-primary' : 'fill-muted-foreground'}`} />
      
      {/* Custom SVG Tooltip Message Box */}
      {isHovered && (
        <g transform="translate(0, 30)">
          <rect 
            x={boxX} 
            y={0} 
            width={textWidth} 
            height={28} 
            fill="hsl(var(--card))" 
            stroke="hsl(var(--border))" 
            strokeWidth={1}
            rx={6} 
          />
          <text 
            x={0} 
            y={19} 
            textAnchor="middle" 
            fill="hsl(var(--foreground))" 
            fontSize={12} 
            fontWeight={500}
            className="font-sans"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// Mock data generation for Peer Comparison
const generatePeerData = (userMarks: MarksEntry[]) => {
  return userMarks.map((m) => {
    // Generate a random anonymous peer average slightly above or below the user
    const peerAvg = Math.max(30, Math.min(100, m.semester + (Math.random() * 20 - 10)));
    return {
      subject: m.subject,
      userScore: m.semester,
      peerAverage: Math.round(peerAvg),
    };
  });
};

// Mock data generation for Total Progression
const generateTotalProgressionData = (allYearsData: Record<string, MarksEntry[]>) => {
  const data: { name: string; Mid1: number; Mid2: number; Semester: number }[] = [];
  Object.keys(allYearsData).forEach((year) => {
    allYearsData[year].forEach((m) => {
      data.push({
        name: `${year} - ${m.subject.substring(0, 10)}...`,
        Mid1: Math.round((m.mid1 / m.mid1Total) * 100),
        Mid2: Math.round((m.mid2 / m.mid2Total) * 100),
        Semester: Math.round((m.semester / m.semesterTotal) * 100),
      });
    });
  });
  return data;
};

const Performance = () => {
  const { session, profile } = useAuth();

  const { data: marksData = {}, isLoading } = useQuery<Record<string, MarksEntry[]>>({
    queryKey: ["marks", session?.user?.id],
    queryFn: () => fetchMarksData(session!.access_token),
    enabled: !!session,
  });

  const years = useMemo(() => Object.keys(marksData), [marksData]);
  const tabs = useMemo(() => [...years, "Total Performance"], [years]);
  
  // Default to the first year, or total if no years
  const [activeTab, setActiveTab] = useState<string>("");
  
  // Keep the tab in sync if data loads late
  useMemo(() => {
    if (!activeTab && tabs.length > 0) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  const isTotal = activeTab === "Total Performance";

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
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Performance ML</h1>
            <p className="text-muted-foreground">AI-driven insights and peer comparisons</p>
          </div>
        </div>

        {years.length > 0 ? (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Top Section: Interactive Graphs */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {isTotal ? "Overall Trajectory & Peer Comparison" : `${activeTab} - Peer Comparison`}
                </CardTitle>
                <CardDescription>
                  Demo Graph: Production ML Output Preview. Highlighting {profile?.name || "you"} vs anonymous peers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    {isTotal ? (
                      <LineChart data={generateTotalProgressionData(marksData)} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" tick={<CustomCircleTick />} height={40} />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                        <Legend wrapperStyle={{ paddingTop: "30px" }} />
                        <Line type="monotone" dataKey="Mid1" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Mid-term 1 (%)" />
                        <Line type="monotone" dataKey="Mid2" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Mid-term 2 (%)" />
                        <Line type="monotone" dataKey="Semester" stroke="#ffc658" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Semester Final (%)" />
                      </LineChart>
                    ) : (
                      <LineChart data={generatePeerData(marksData[activeTab] || [])} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="subject" tick={<CustomCircleTick />} height={40} />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                        <Legend wrapperStyle={{ paddingTop: "30px" }} />
                        <Line type="monotone" dataKey="peerAverage" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Anonymous Peer Average" dot={false} />
                        <Line type="monotone" dataKey="userScore" stroke="hsl(var(--primary))" strokeWidth={4} name={`${profile?.name || "You"} (Actual)`} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Middle Section: Summary */}
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    How's my performance?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  {isTotal ? (
                    <>
                      <p>
                        Based on our ML analysis across all your academic years, you are showing a <strong>positive upward trajectory</strong>. Your semester finals consistently outperform your mid-term assessments, indicating strong end-of-term study habits.
                      </p>
                      <p>
                        Compared to the anonymized student cohort, you rank in the <strong>top 15%</strong> for core technical subjects.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        In <strong>{activeTab}</strong>, your performance was highly consistent. The ML model detected that you maintained a steady lead above the peer average in almost every subject.
                      </p>
                      <p>
                        Your strongest area was theoretical subjects, where you scored on average 12% higher than the class median.
                      </p>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground/50 border-t border-border pt-4 mt-4">
                    * This is a mock ML summary for demonstration purposes.
                  </p>
                </CardContent>
              </Card>

              {/* Bottom Section: Suggestions */}
              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-warning" />
                    Actionable Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-2">
                    {isTotal ? (
                      <>
                        <li><strong>Consistency:</strong> Your Mid-1 scores are historically your weakest point. Dedicating 2 extra hours per week early in the semester could stabilize your initial grades.</li>
                        <li><strong>Peer Group:</strong> You excel in network and systems architecture. Consider forming study groups to help peers and solidify your own knowledge.</li>
                        <li><strong>Focus Area:</strong> Advanced mathematics courses show a slight dip. Our recommendation engine suggests reviewing linear algebra fundamentals before your next semester.</li>
                      </>
                    ) : (
                      <>
                        <li><strong>Subject Focus:</strong> To maximize your aggregate score, focus slightly more on practical lab sessions, where you are 3% below your own average theoretical performance.</li>
                        <li><strong>Time Management:</strong> The model predicts a 95% probability of scoring 'O' grade in your next theoretical exam if you maintain your current study frequency.</li>
                      </>
                    )}
                  </ul>
                  <p className="text-xs text-muted-foreground/50 border-t border-border pt-4 mt-4">
                    * Mock AI-generated suggestions based on peer performance deviation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No data available to run ML performance analysis.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Performance;
