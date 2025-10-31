import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize notification service
import { notificationService } from "./services/notificationService";
notificationService.initialize().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
