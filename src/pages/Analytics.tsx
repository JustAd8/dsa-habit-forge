import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session.user);
    await fetchProfile(session.user.id);
    await fetchAlarms(session.user.id);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const fetchAlarms = async (userId: string) => {
    const { data, error } = await supabase
      .from("alarms")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching alarms:", error);
      return;
    }

    setAlarms(data || []);
  };

  // Calculate analytics data
  const calculateAnalytics = () => {
    const totalAlarms = alarms.length;
    const activeAlarms = alarms.filter(a => a.is_active).length;
    const completedThisWeek = 0; // This would need actual completion tracking
    const currentStreak = 0; // This would need streak calculation logic

    // Difficulty distribution (mock data for now)
    const difficultyStats = {
      easy: Math.floor(totalAlarms * 0.4),
      medium: Math.floor(totalAlarms * 0.4),
      hard: Math.floor(totalAlarms * 0.2)
    };

    // Weekly progress (mock data)
    const weeklyProgress = [
      { day: 'Mon', completed: 2 },
      { day: 'Tue', completed: 1 },
      { day: 'Wed', completed: 3 },
      { day: 'Thu', completed: 2 },
      { day: 'Fri', completed: 1 },
      { day: 'Sat', completed: 0 },
      { day: 'Sun', completed: 0 }
    ];

    return {
      totalAlarms,
      activeAlarms,
      completedThisWeek,
      currentStreak,
      difficultyStats,
      weeklyProgress
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const analytics = calculateAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Progress Analytics</h1>
              <p className="text-muted-foreground">
                Track your DSA learning journey and improvement over time
              </p>
            </div>
            {!profile?.is_premium && (
              <Button onClick={() => navigate("/premium")} variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Unlock Full Analytics
              </Button>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Problems</p>
                  <p className="text-3xl font-bold">{analytics.totalAlarms}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Alarms</p>
                  <p className="text-3xl font-bold">{analytics.activeAlarms}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Week</p>
                  <p className="text-3xl font-bold">{analytics.completedThisWeek}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 relative overflow-hidden">
              {!profile?.is_premium && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-premium text-white">
                    Premium
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold">{analytics.currentStreak} days</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Progress Chart */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Weekly Progress</h3>
              </div>
              <div className="space-y-4">
                {analytics.weeklyProgress.map((day, index) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1">
                      <Progress value={(day.completed / 3) * 100} className="h-2" />
                    </div>
                    <div className="w-8 text-sm text-muted-foreground">{day.completed}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Difficulty Distribution */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Problem Difficulty</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Easy</span>
                  </div>
                  <span className="text-sm font-medium">{analytics.difficultyStats.easy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium</span>
                  </div>
                  <span className="text-sm font-medium">{analytics.difficultyStats.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Hard</span>
                  </div>
                  <span className="text-sm font-medium">{analytics.difficultyStats.hard}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Recent Activity</h3>
            </div>

            {alarms.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No activity yet</p>
                <Button onClick={() => navigate("/alarms/new")}>
                  Create Your First Alarm
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {alarms.slice(0, 10).map((alarm: any) => (
                  <div
                    key={alarm.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{alarm.problem_title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created {new Date(alarm.created_at).toLocaleDateString()}</span>
                        <Badge variant={alarm.is_active ? "default" : "secondary"}>
                          {alarm.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{alarm.scheduled_time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Premium CTA */}
          {!profile?.is_premium && (
            <Card className="mt-8 p-8 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Unlock Advanced Analytics</h3>
              <p className="text-muted-foreground mb-6">
                Get detailed progress tracking, streak analytics, and personalized insights
              </p>
              <Button size="lg" onClick={() => navigate("/premium")}>
                Upgrade to Premium
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
