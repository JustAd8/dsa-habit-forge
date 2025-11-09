import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Clock, TrendingUp, Zap, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Build Your DSA Habit</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Data Structures &{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Algorithms Daily
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Set smart reminders, track your progress, and build a consistent DSA practice routine. Perfect for engineers preparing for technical interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="text-lg h-12 px-8">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/premium")} className="text-lg h-12 px-8">
              View Premium Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border-border group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <Bell className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Smart Reminders</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Get timely notifications via browser and email to stay on track with your DSA practice schedule.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border-border group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <Clock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Custom Scheduling</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Set alarms for specific LeetCode problems and customize your practice routine to fit your schedule.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border-border relative overflow-hidden group cursor-pointer">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-premium text-white group-hover:bg-premium/90 transition-colors duration-300">
                  Premium
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <TrendingUp className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">Progress Analytics</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Track your solving patterns, streaks, and improvement over time with detailed analytics.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border-border group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <Target className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">LeetCode Integration</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Search and select problems directly from LeetCode. Click notifications to jump straight to solving.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border-border group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <Award className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Streak Tracking</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Build momentum with daily streaks and celebrate your consistency in practicing DSA.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border-border relative overflow-hidden group cursor-pointer">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-premium text-white group-hover:bg-premium/90 transition-colors duration-300">
                  Premium
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <Zap className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">Advanced Features</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Unlock difficulty-based recommendations, email reports, and personalized learning paths.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your DSA Habit?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of engineers mastering algorithms through consistent daily practice.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")} className="text-lg h-12 px-8">
              Start Free Today
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
