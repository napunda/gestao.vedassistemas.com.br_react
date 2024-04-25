import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  UserIcon,
  Users2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import useAuthStore from "@/stores/AuthStore";
import useSearchStore from "@/stores/SerchStore";
import React from "react";

export const Header = () => {
  const { t, i18n } = useTranslation();

  const searchStore = useSearchStore();

  useEffect(() => {
    const lang = navigator.language;
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n]);

  const location = useLocation();
  const authStore = useAuthStore();

  const handleLogoutClick = () => {
    authStore.logout();
  };

  const renderBreadcrumbDynamically = () => {
    const path = location.pathname.split("/").filter((item) => item !== "");
    return path.map((item, index) => {
      return (
        <React.Fragment key={item}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to={
                  index === 0
                    ? `/${item}`
                    : `/${path.slice(0, index + 1).join("/")}`
                }
                className="transform capitalize"
              >
                {item}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index !== path.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      );
    });
  };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-2.5 text-foreground"
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Customers
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>{renderBreadcrumbDynamically()}</BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Input
          icon={<Search size={16} className="text-muted-foreground" />}
          iconPosition="left"
          type="search"
          onChange={(e) => searchStore.setQ(e.target.value)}
          placeholder="Buscar..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <UserIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/dashboard/settings">
              Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="cursor-pointer"
          >
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle
        lightLabel={t("home.themeButton.light")}
        darkLabel={t("home.themeButton.dark")}
        systemLabel={t("home.themeButton.system")}
      />
    </header>
  );
};
