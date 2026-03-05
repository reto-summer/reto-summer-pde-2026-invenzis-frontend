/** Componente raíz. Envuelve la aplicación en `AppProvider` para proveer el contexto global. */
import { AppProvider } from "./shared/context/AppContext";
import MainPage from "./pages/MainPage";

export default function App() {
  return (
    <AppProvider>
      <MainPage />
    </AppProvider>
  );
}
