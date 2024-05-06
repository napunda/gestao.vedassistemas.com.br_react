import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EditIcon,
  MoreHorizontal,
  Phone,
  PlusCircle,
  PlusIcon,
  Trash2Icon,
  ChefHatIcon,
  ChevronUpIcon,
  ArrowDownUpIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  ArrowDownNarrowWideIcon,
  EyeIcon,
  FileIcon,
  Loader2Icon,
  FilterIcon,
  FilterXIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosService } from "@/services/axios.service";
import { useEffect, useState } from "react";
import { SkeletonLoading } from "./components/SkeletonLoading";
import { IconButton } from "./components/IconButton";
import { useSearchParams } from "react-router-dom";
import { Companies, CompaniesResponse } from "./interfaces/companies";
import { ModalAddCompany } from "./components/ModalAddCompany";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSearchStore from "@/stores/SerchStore";
import { ModalUpdateCompany } from "./components/ModalUpdateCompany";
import { ModalDeleteCompany } from "./components/ModalDeleteCompany";
import { Input } from "@/components/ui/input";
import { SkeletonCardLoading } from "./components/SkeletonCardLoading";
import { Users } from "../users/interfaces/users";
import useAuthStore from "@/stores/AuthStore";
import { DrawerViewCompany } from "./components/DrawerViewCompany";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CompaniesPDF } from "./components/CompaniesPDF";

export function HomePage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const searchStore = useSearchStore();

  const [companiesResponse, setCompaniesResponse] =
    useState<CompaniesResponse>();
  const [companiesFilter, setCompaniesFilter] = useState<string>(
    searchParams.get("filter") ? String(searchParams.get("filter")) : ""
  );
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );
  const [perPage, setPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>();

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    const params = new URLSearchParams();

    if (companiesFilter) {
      params.append("filter", companiesFilter);
    }

    if (orderBy.field) {
      params.append("orderBy", orderBy.field);
      params.append("direction", orderBy.direction);
    }

    params.append("page", page.toString());
    params.append("perPage", perPage.toString());
    params.append("q", searchStore.q);

    try {
      const response = await axiosService.get<CompaniesResponse>("/companies", {
        params,
      });

      setCompaniesResponse(response.data);
      setLoadingCompanies(false);

      setTotalPages(response.data.last_page);
    } catch (error) {
      setLoadingCompanies(false);
    }
  };

  const getTestingPeriodLimitDays = async (userId: number) => {
    const testingPeriodLimitDays = (
      await axiosService.get(`/app-config/testing_period_limit_days/${userId}`)
    ).data;
    return Number(testingPeriodLimitDays);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companiesFilter != "") {
      fetchCompanies();
    }
  }, [companiesFilter]);

  useEffect(() => {
    if (page > 0) {
      fetchCompanies();
    }
  }, [page]);

  useEffect(() => {
    fetchCompanies();
  }, [perPage]);

  useEffect(() => {
    fetchCompanies();
  }, [searchStore.q]);

  useEffect(() => {
    if (searchStore.q === "") {
      return;
    }
    companiesFilter
      ? setSearchParams({
          filter: companiesFilter,
          q: searchStore.q,
        })
      : setSearchParams({ q: searchStore.q });
  }, [searchStore.q]);

  useEffect(() => {
    searchStore.setQ(searchParams.get("q") ?? "");
  }, []);

  const handleCompaniesFilterChange = (value: string) => {
    setCompaniesFilter(value);
    setSearchParams({ filter: value, page: "1" });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    companiesFilter
      ? setSearchParams({ filter: companiesFilter, page: newPage.toString() })
      : setSearchParams({ page: newPage.toString() });
    setPage(newPage);
  };

  const [openModalAddCompany, setOpenModalAddCompany] = useState(false);
  const [openModalUpdateCompany, setOpenModalUpdateCompany] = useState(false);
  const [openModalDeleteCompany, setOpenModalDeleteCompany] = useState(false);
  const [openDrawerViewCompany, setOpenDrawerViewCompany] = useState(false);
  const [companyToUpdate, setCompanyToUpdate] = useState<Companies | null>();
  const [companyToDelete, setCompanyToDelete] = useState<Companies | null>();
  const [companyToView, setCompanyToView] = useState<Companies | null>();

  const handleOpenViewDrawer = (company: Companies) => {
    setCompanyToView(company);
    setOpenDrawerViewCompany(true);
  };

  const onCloseModalAddCompany = () => {
    setOpenModalAddCompany(false);
  };

  const onCloseModalUpdateCompany = () => {
    setCompanyToUpdate(null);
    setOpenModalUpdateCompany(false);
  };

  const onCloseModalDeleteCompany = () => {
    setCompanyToDelete(null);
    setOpenModalDeleteCompany(false);
  };

  const handleOpenUpdateModal = (company: Companies) => {
    setCompanyToUpdate(company);
    setOpenModalUpdateCompany(true);
  };

  const handleDeleteCompany = (company: Companies) => {
    setCompanyToDelete(company);
    setOpenModalDeleteCompany(true);
  };

  const handleSetPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Number(e.target.value);

    if (!totalPages) {
      return;
    }
    if (newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const calculateTestRemainingDays = async (
    startTestPeriodAt: Date,
    userId: number
  ) => {
    if (startTestPeriodAt) {
      const today = new Date();
      const startDate = new Date(startTestPeriodAt);
      const totalTestDays = await getTestingPeriodLimitDays(userId);

      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const remainingDays = totalTestDays - diffDays;

      if (remainingDays < 0) {
        return 0;
      }

      return remainingDays;
    }
    return null;
  };

  const calculateNotActivityDays = (lastActivityAt: Date | null) => {
    if (lastActivityAt) {
      const today = new Date();
      const lastActivityDate = new Date(lastActivityAt);

      const diffTime = Math.abs(today.getTime() - lastActivityDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    }
    return 0;
  };

  const formatDocument = (document: string) => {
    if (document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return document.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
  };

  const [users, setUsers] = useState<Users[]>();
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const { user } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      params.append("returnAll", "true");

      const response = await axiosService.get<Users[]>("/users", {
        params,
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > document.documentElement.scrollHeight * 0.35) {
        // 35% da altura da página
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  type OrderBy = {
    field: string;
    direction: "asc" | "desc";
  };

  const [orderBy, setOrderBy] = useState<OrderBy>({
    field: "created_at",
    direction: "desc",
  });

  useEffect(() => {
    fetchCompanies();
  }, [orderBy]);

  const renderTableHeader = () => {
    const headers = [
      {
        field: "name",
        label: "Nome",
      },
      {
        field: "document",
        label: "Documento",
      },
      {
        field: "access_allowed",
        label: "Status",
      },
      {
        field: "test_period_active",
        label: "Teste ativo",
      },
      {
        field: "start_test_period_at",
        label: "Dias restantes",
      },
      {
        field: "last_activity_at",
        label: "Dias inativos",
      },
      {
        field: "city",
        label: "Cidade",
      },
      {
        field: "state",
        label: "Estado",
      },
      {
        field: "phone",
        label: "Telefone",
      },
    ];

    return (
      <TableHeader>
        <TableRow>
          <TableHead className="hidden sm:table-cell w-[40px]">
            <span className="sr-only">Ícone</span>
          </TableHead>
          {headers.map((header) => (
            <TableHead
              key={header.field}
              onClick={() =>
                setOrderBy({
                  field: header.field,
                  direction: orderBy.direction === "asc" ? "desc" : "asc",
                })
              }
            >
              <p
                className={`${
                  orderBy.field == header.field
                    ? "dark:text-white text-black"
                    : ""
                } flex gap-2 items-center cursor-pointer`}
              >
                <span className="select-none">{header.label}</span>
                {orderBy.field == header.field &&
                orderBy.direction == "desc" ? (
                  <ArrowDownUpIcon size={15} />
                ) : (
                  <ArrowUpDownIcon size={15} />
                )}
              </p>
            </TableHead>
          ))}
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
    );
  };

  return (
    <div className="flex sm:min-h-screen w-full flex-col bg-muted/40 overflow-x-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 px-4 pt-4 pb-20 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center">
            <div className="lg:ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-7 gap-1 lg:hidden"
                    variant="default"
                    size="sm"
                  >
                    {orderBy.direction === "asc" ? (
                      <ArrowUpNarrowWideIcon className="size-3.5" />
                    ) : (
                      <ArrowDownNarrowWideIcon className="size-3.5" />
                    )}

                    <span className="sm:whitespace-nowrap">Ordenar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuRadioGroup
                    value={orderBy.field}
                    onValueChange={(value) =>
                      setOrderBy({
                        field: value,
                        direction: orderBy.direction == "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <DropdownMenuRadioItem value="name">
                      Nome
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="document">
                      Documento
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="access_allowed">
                      Status
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="test_period_active">
                      Teste ativo
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="start_test_period_at">
                      Dias restantes
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="last_activity_at">
                      Dias inativos
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="city">
                      Cidade
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="state">
                      Estado
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="phone">
                      Telefone
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-auto gap-1 lg:rounded"
              >
                {loadingCompanies ? (
                  <div className="flex gap-2">
                    <Loader2Icon className="size-3.5 animate-spin inline-block" />
                    <span>Exportar</span>
                  </div>
                ) : (
                  companiesResponse && (
                    <PDFDownloadLink
                      fileName="Lista de empresas"
                      document={
                        <CompaniesPDF companies={companiesResponse.data} />
                      }
                    >
                      <div className="flex gap-2 items-center">
                        <FileIcon className="size-3.5" />
                        <span>Exportar</span>
                      </div>
                    </PDFDownloadLink>
                  )
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-auto gap-1 lg:rounded"
                  >
                    {!companiesFilter || companiesFilter == "all" ? (
                      <FilterIcon className="size-3.5" />
                    ) : (
                      <FilterXIcon className="size-3.5" />
                    )}
                    <span className="sm:whitespace-nowrap">Filtro</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mostrar</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuRadioGroup
                    value={companiesFilter}
                    onValueChange={handleCompaniesFilterChange}
                  >
                    <DropdownMenuRadioItem value="all">
                      Todos
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="allowed">
                      Liberado
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="testPeriod">
                      Período de teste
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="notAllowed">
                      Não liberado
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => {
                  setOpenModalAddCompany(true);
                }}
                size="sm"
                className="size-12 lg:h-7 lg:w-auto gap-1 rounded-full lg:rounded bg-primary hover:bg-primary-dark transition-all duration-200 fixed lg:static bottom-2 left-5 z-20"
              >
                <PlusCircle className="size-3.5 hidden lg:block" />
                <PlusIcon className="lg:hidden block" />
                <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">
                  Nova empresa
                </span>
              </Button>
            </div>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="text-lg">Empresas</CardTitle>
              <CardDescription>
                Gerencie suas empresas associadas ou adicone mais.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto relative hidden lg:block">
              <Table className="table-auto xl:table-fixed">
                {renderTableHeader()}
                <TableBody>
                  {loadingCompanies ? (
                    <SkeletonLoading />
                  ) : (
                    companiesResponse?.data.map((company) => (
                      <TableRow
                        key={company.id}
                        className={
                          company.last_activity_at &&
                          calculateNotActivityDays(company.last_activity_at) >=
                            5
                            ? "opacity-35"
                            : ""
                        }
                      >
                        <TableCell className="hidden sm:table-cell">
                          <ChefHatIcon className="size-6" />
                        </TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>
                          {formatDocument(company.document)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              company.access_allowed ? "outline" : "secondary"
                            }
                          >
                            {company.access_allowed ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              company.test_period_active
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {company.test_period_active ? "Sim" : "Não"}
                          </Badge>
                        </TableCell>
                        <TableCell>{company.remaining_days}</TableCell>
                        <TableCell>
                          <p className="whitespace-nowrap">
                            {company.last_activity_at
                              ? calculateNotActivityDays(
                                  company.last_activity_at
                                )
                              : 0}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="whitespace-nowrap">{company.city}</p>
                        </TableCell>
                        <TableCell>
                          <p className="whitespace-nowrap">{company.state}</p>
                        </TableCell>
                        <TableCell>
                          <p className="whitespace-nowrap">{company.phone}</p>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel className="font-bold">
                                Ações
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleOpenViewDrawer(company);
                                }}
                              >
                                <EyeIcon size={14} />
                                <span className="ml-2">Detalhes</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleOpenUpdateModal(company);
                                }}
                              >
                                <EditIcon size={14} />
                                <span className="ml-2">Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => {
                                  handleDeleteCompany(company);
                                }}
                              >
                                <Trash2Icon size={14} />
                                <span className="ml-2">Deletar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardContent className="overflow-hidden relative lg:hidden space-y-5 p-2 sm:p-6">
              {loadingCompanies ? (
                <>
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                  <SkeletonCardLoading />
                </>
              ) : (
                companiesResponse?.data.map((company) => (
                  <Card
                    key={company.id}
                    className={
                      company.last_activity_at &&
                      calculateNotActivityDays(company.last_activity_at) >= 5
                        ? "opacity-35 rounded"
                        : "rounded"
                    }
                  >
                    <CardHeader className="flex justify-between flex-row items-start border-b py-3">
                      <CardTitle className="text-sm font-bold">
                        {formatDocument(company.document)}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MoreHorizontal className="size-4 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="font-bold">
                            Ações
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              handleOpenViewDrawer(company);
                            }}
                          >
                            <EyeIcon size={14} />
                            <span className="ml-2">Detalhes</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleOpenUpdateModal(company);
                            }}
                          >
                            <EditIcon size={14} />
                            <span className="ml-2">Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => {
                              handleDeleteCompany(company);
                            }}
                          >
                            <Trash2Icon size={14} />
                            <span className="ml-2">Deletar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>

                    <CardContent className="py-3">
                      <div className="flex items-start flex-row justify-between">
                        <div className="flex items-center gap-4">
                          <ChefHatIcon className="size-10 p-2 border rounded-full" />
                          <div className="grid gap-1">
                            <span className="font-bold">{company.name}</span>
                            <a
                              href={`tel:${company.phone}`}
                              className="flex items-center gap-2"
                            >
                              <Phone className="size-3" />
                              <span className="text-xs text-muted-foreground">
                                {company.phone}
                              </span>
                            </a>
                          </div>
                        </div>
                        <Badge
                          variant={
                            company.access_allowed ? "outline" : "secondary"
                          }
                        >
                          {company.access_allowed ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="mt-8 grid">
                        <div className="flex justify-between">
                          <span>Estado</span>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {company.state}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span>Cidade</span>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {company.city}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-5 grid gap-3">
                      <div className="flex justify-between">
                        <span>Período de teste</span>
                        <Badge
                          variant={
                            company.test_period_active ? "default" : "secondary"
                          }
                        >
                          {company.test_period_active ? "Sim" : "Não"}
                        </Badge>
                      </div>
                      {company.start_test_period_at &&
                      company.test_period_active ? (
                        <div className="flex justify-between">
                          <span>Dias restantes</span>
                          <p className="text-sm text-muted-foreground">
                            {company.remaining_days} dias
                          </p>
                        </div>
                      ) : null}
                      <div className="flex justify-between">
                        <span>Dias inativos</span>
                        <p className="text-sm text-muted-foreground">
                          {company.last_activity_at
                            ? calculateNotActivityDays(company.last_activity_at)
                            : 0}{" "}
                          dias
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </CardContent>
            <CardFooter>
              <div className="md:flex hidden justify-between items-center w-full text-muted-foreground">
                <div className="text-sm">
                  Mostrando {companiesResponse?.data.length} de{" "}
                  {companiesResponse?.total} itens
                </div>

                <div className="inline-flex items-center gap-6 text-xs lg:gap-8 lg:text-sm font-bold">
                  <div className="mr-8 flex items-center gap-2">
                    <span className="dark:text-white text-black font-semibold">
                      Itens por página
                    </span>
                    <Select
                      defaultValue="20"
                      onValueChange={(value) => {
                        setPerPage(Number(value));
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="16">16</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="dark:text-white text-black font-semibold">
                    Página {page} de {totalPages}
                  </span>

                  <div className="flex gap-1.5">
                    <IconButton
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1}
                    >
                      <ChevronsLeft className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => handlePageChange(totalPages ?? 1)}
                      disabled={page === totalPages}
                    >
                      <ChevronsRight className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 sm:gap-5 mx-auto text-xs sm:text-sm md:hidden ">
                <IconButton
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="size-4 sm:size-6" />
                </IconButton>
                <span>Página</span>
                <Input
                  className="w-10 sm:w-12 text-center text-xs sm:text-sm"
                  onChange={handleSetPage}
                  value={page}
                />
                <span>de</span>
                <span>{totalPages}</span>
                <IconButton
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="size-4 sm:size-6" />
                </IconButton>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
      <ModalAddCompany
        users={users}
        open={openModalAddCompany}
        onAddCompany={fetchCompanies}
        onClose={onCloseModalAddCompany}
      />
      {companyToUpdate && (
        <ModalUpdateCompany
          users={users}
          open={openModalUpdateCompany}
          onUpdateCompany={() => {
            fetchCompanies();
            setCompanyToUpdate(null);
          }}
          onClose={onCloseModalUpdateCompany}
          company={companyToUpdate}
        />
      )}
      {companyToDelete && (
        <ModalDeleteCompany
          company={companyToDelete}
          open={openModalDeleteCompany}
          onClose={onCloseModalDeleteCompany}
          onCompanyDelete={() => {
            fetchCompanies();
            setCompanyToDelete(null);
          }}
        />
      )}
      {companyToView && (
        <DrawerViewCompany
          company={companyToView}
          onClose={() => setOpenDrawerViewCompany(false)}
          open={openDrawerViewCompany}
        />
      )}
      <Button
        className={`fixed rounded-full lg:hidden w-8 right-2 p-0 bottom-2 transition-all duration-150 ${
          !showScrollToTopButton
            ? "opacity-0 pointer-events-none transform translate-y-10"
            : ""
        }`}
        variant="outline"
        size="sm"
        onClick={scrollToTop}
      >
        <ChevronUpIcon size={15} />
      </Button>
    </div>
  );
}
