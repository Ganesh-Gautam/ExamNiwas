import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store.js";
import { fetchCurrentUser } from "./features/auth/authSlice.js";

export default function AppBootstrap({ router }) {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            padding: "12px 16px",
          },
        }}
      />
    </>
  );
}
