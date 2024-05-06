import { Link, useLocation, useSearchParams } from "react-router-dom";
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
  ChefHatIcon,
  Home,
  LogOutIcon,
  PanelLeft,
  Search,
  SettingsIcon,
  UserIcon,
  Users2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import useAuthStore from "@/stores/AuthStore";
import useSearchStore from "@/stores/SerchStore";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [openSheet, setOpenSheet] = useState(false);
  const searchStore = useSearchStore();
  const location = useLocation();
  const authStore = useAuthStore();

  useEffect(() => {
    const lang = navigator.language;
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n]);

  useEffect(() => {
    setOpenSheet(false);
  }, [location]);

  const handleLogoutClick = () => {
    authStore.logout();
  };
  //@ts-ignore
  let [searchParams, setSearchParams] = useSearchParams();
  const handleInputSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchStore.setQ(e.target.value);
    if (e.target.value.length === 0) {
      setSearchParams({ q: "" });
    }
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
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button
            onClick={() => {
              setOpenSheet(true);
            }}
            size="icon"
            variant="outline"
            className="sm:hidden"
          >
            <PanelLeft className="size-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="flex flex-col h-full justify-between text-lg font-medium">
            <div>
              <h2 className="text-lg font-semibold text-white md:text-base">
                Navegação
              </h2>
              <div className="grid gap-6 mt-10">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="size-5" />
                  Dashboard
                </Link>
                {authStore.user?.is_admin ? (
                  <Link
                    to="/dashboard/users"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Users2 className="size-5" />
                    Usuários
                  </Link>
                ) : null}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ChefHatIcon className="size-5" />
                  Empresas
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <SettingsIcon className="size-5" />
                  Configurações
                </Link>
              </div>
            </div>
            <div>
              <Button
                className="flex gap-2"
                variant="outline"
                onClick={handleLogoutClick}
              >
                <LogOutIcon className="size-5" />
                Sair
              </Button>
            </div>
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
          onChange={handleInputSearchChange}
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
