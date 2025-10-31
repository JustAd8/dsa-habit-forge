import { useEffect, useState } from "react";

interface PasswordStrengthCheckerProps {
  password: string;
}

export const PasswordStrengthChecker = ({ password }: PasswordStrengthCheckerProps) => {
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">("weak");
  const [label, setLabel] = useState("Weak");

  useEffect(() => {
    if (!password) {
      setStrength("weak");
      setLabel("Weak");
      return;
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
      setStrength("weak");
      setLabel("Weak");
    } else if (score <= 4) {
      setStrength("medium");
      setLabel("Medium");
    } else {
      setStrength("strong");
      setLabel("Strong");
    }
  }, [password]);

  const getColor = () => {
    switch (strength) {
      case "weak":
        return "bg-destructive";
      case "medium":
        return "bg-[hsl(var(--premium))]";
      case "strong":
        return "bg-[hsl(142,76%,36%)]";
    }
  };

  const getWidth = () => {
    switch (strength) {
      case "weak":
        return "w-1/3";
      case "medium":
        return "w-2/3";
      case "strong":
        return "w-full";
    }
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Password Strength:</span>
        <span className={`font-medium ${
          strength === "weak" ? "text-destructive" : 
          strength === "medium" ? "text-[hsl(var(--premium))]" : 
          "text-[hsl(142,76%,36%)]"
        }`}>
          {label}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${getColor()} ${getWidth()}`} />
      </div>
    </div>
  );
};
