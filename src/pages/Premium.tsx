import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaymentService } from "@/services/paymentService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Premium = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const features = [
    "Unlimited alarms",
    "Advanced progress analytics",
    "Email notifications",
    "Difficulty-based recommendations",
    "Streak tracking & goals",
    "Custom recurring schedules",
    "Priority support",
    "Export your data",
  ];

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to upgrade to premium");
        navigate("/login");
        return;
      }

      // For now, use a placeholder price ID - this would be configured in Stripe
      const priceId = "price_placeholder"; // Replace with actual Stripe price ID
      await PaymentService.handleSubscription(priceId, user.id);
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium/10 border border-premium/20 mb-6">
              <Zap className="w-4 h-4 text-premium" />
              <span className="text-sm font-medium text-premium">Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unlock Your Full Potential
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get access to advanced features that help you master DSA faster and track your progress more effectively.
            </p>
          </div>

          <Card className="p-8 md:p-12 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">Cancel anytime, no commitment</p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground group-hover:text-primary transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="w-full mb-4" onClick={handleUpgrade} disabled={loading}>
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Upgrade to Premium"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy
            </p>
          </Card>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Active users</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <p className="text-muted-foreground">Problems solved</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
              <p className="text-muted-foreground">User rating</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
