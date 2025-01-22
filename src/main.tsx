import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Store from "./store/store.js";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={Store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
  // {/* </StrictMode> */}
);
