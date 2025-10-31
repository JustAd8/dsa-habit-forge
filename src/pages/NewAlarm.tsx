import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewAlarm = () => {
  const navigate = useNavigate();
  const [problemTitle, setProblemTitle] = useState("");
  const [problemUrl, setProblemUrl] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [recurrence, setRecurrence] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const days = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];

  const handleDayToggle = (day: string) => {
    setRecurrence((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const leetcodeSearchUrl = `https://leetcode.com/problemset/?search=${encodeURIComponent(searchQuery)}`;
      window.open(leetcodeSearchUrl, "_blank");
      toast.info("Opening LeetCode search...");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recurrence.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("alarms").insert({
        user_id: session.user.id,
        problem_title: problemTitle,
        problem_url: problemUrl,
        problem_difficulty: difficulty,
        scheduled_time: scheduledTime,
        recurrence: recurrence,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Alarm created successfully!");
      navigate("/alarms");
    } catch (error: any) {
      toast.error(error.message || "Failed to create alarm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Alarm</h1>
            <p className="text-muted-foreground">Set up a reminder for your DSA practice</p>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search LeetCode Problems
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search for problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problemTitle">Problem Title *</Label>
                <Input
                  id="problemTitle"
                  placeholder="e.g., Two Sum"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemUrl">Problem URL *</Label>
                <Input
                  id="problemUrl"
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={problemUrl}
                  onChange={(e) => setProblemUrl(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Alarm Time *
                </Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Repeat On *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {days.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={recurrence.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <label
                        htmlFor={day.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/alarms")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating..." : "Create Alarm"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewAlarm;
