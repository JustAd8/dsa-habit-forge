import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Bell, Clock, Trash2, Edit, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Alarms = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    await fetchAlarms(session.user.id);
    setLoading(false);
  };

  const fetchAlarms = async (userId: string) => {
    const { data, error } = await supabase
      .from("alarms")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching alarms:", error);
      toast.error("Failed to load alarms");
      return;
    }

    setAlarms(data || []);
  };

  const toggleAlarm = async (alarmId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("alarms")
      .update({ is_active: !currentStatus })
      .eq("id", alarmId);

    if (error) {
      toast.error("Failed to update alarm");
      return;
    }

    toast.success(currentStatus ? "Alarm disabled" : "Alarm enabled");
    
    // Refresh alarms
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetchAlarms(session.user.id);
    }
  };

  const deleteAlarm = async (alarmId: string) => {
    const { error } = await supabase
      .from("alarms")
      .delete()
      .eq("id", alarmId);

    if (error) {
      toast.error("Failed to delete alarm");
      return;
    }

    toast.success("Alarm deleted");
    
    // Refresh alarms
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetchAlarms(session.user.id);
    }
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
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Alarms</h1>
              <p className="text-muted-foreground">Manage your DSA practice reminders</p>
            </div>
            <Button onClick={() => navigate("/alarms/new")} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Alarm
            </Button>
          </div>

          {alarms.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No alarms yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first alarm to start building your DSA habit
              </p>
              <Button onClick={() => navigate("/alarms/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Alarm
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {alarms.map((alarm: any) => (
                <Card key={alarm.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{alarm.problem_title}</h3>
                          {alarm.problem_difficulty && (
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                              alarm.problem_difficulty === "Easy" ? "bg-[hsl(142,76%,36%)]/10 text-[hsl(142,76%,36%)]" :
                              alarm.problem_difficulty === "Medium" ? "bg-[hsl(var(--premium))]/10 text-[hsl(var(--premium))]" :
                              "bg-destructive/10 text-destructive"
                            }`}>
                              {alarm.problem_difficulty}
                            </span>
                          )}
                          <p className="text-muted-foreground">
                            🕐 {alarm.scheduled_time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📅 {alarm.recurrence?.join(", ") || "Daily"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(alarm.problem_url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open Problem
                        </Button>
                        <Button
                          size="sm"
                          variant={alarm.is_active ? "outline" : "default"}
                          onClick={() => toggleAlarm(alarm.id, alarm.is_active)}
                        >
                          {alarm.is_active ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteAlarm(alarm.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alarms;
