import "@/App.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Calculator from "@/components/Calculator";

function App() {
  return (
    <div className="gap-8 md:gap-20 bg-background text-foreground flex flex-col items-center justify-center font-sans selection:bg-[#29ff00] selection:text-black">
      <img src="./logo.svg" alt="Logo" />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Calculator />
      </ThemeProvider>
    </div>
  );
}

export default App;
