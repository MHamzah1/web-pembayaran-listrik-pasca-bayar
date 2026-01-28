"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { store } from "@/store";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials, setLoading } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        console.error("Error parsing user from cookie:", error);
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }

    dispatch(setLoading(false));
    setIsInitialized(true);
  }, [dispatch]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#333",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                padding: "16px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
