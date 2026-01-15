import "@/App.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Calculator from "@/components/Calculator";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Calculator />
    </ThemeProvider>
  );
}

export default App;
