import { Header } from "./partials/header";
import { Aside } from "./partials/aside";
import { Toaster } from "@/components/ui/toaster";

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Header />
      <Aside />
      {children}
      <Toaster />
    </div>
  );
};
