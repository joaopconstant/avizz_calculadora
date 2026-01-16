import "@/App.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Calculator from "@/components/Calculator";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center  font-sans selection:bg-[#29ff00] selection:text-black">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Calculator />
      </ThemeProvider>
    </div>
  );
}

export default App;
