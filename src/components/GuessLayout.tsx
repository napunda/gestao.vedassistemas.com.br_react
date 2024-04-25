import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
export const GuessLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
};
