import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Bell, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name || "Developer"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Keep building your DSA habit with consistent practice
              </p>
            </div>
            <Button onClick={() => navigate("/alarms/new")} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Alarm
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Alarms</p>
                  <p className="text-3xl font-bold">{alarms.filter(a => a.is_active).length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Week</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
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
                  <p className="text-3xl font-bold">0 days</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Alarms List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Alarms</h2>
              <Button variant="outline" onClick={() => navigate("/alarms")}>
                View All
              </Button>
            </div>

            {alarms.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground mb-4">No alarms yet</p>
                <Button onClick={() => navigate("/alarms/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Alarm
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {alarms.slice(0, 5).map((alarm) => (
                  <div
                    key={alarm.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{alarm.problem_title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {alarm.scheduled_time} • {alarm.recurrence?.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        alarm.is_active
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {alarm.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Premium Prompt */}
          {!profile?.is_premium && (
            <Card className="mt-8 p-8 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Unlock Premium Features</h3>
              <p className="text-muted-foreground mb-6">
                Get progress analytics, advanced scheduling, and email reports
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

export default Dashboard;
