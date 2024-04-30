import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EditIcon,
  ListFilter,
  MoreHorizontal,
  Phone,
  PlusCircle,
  PlusIcon,
  Trash2Icon,
  ChefHatIcon,
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
import { SkeletonLoading } from "./components/skeleton-loading";
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
import { SkeletonCardLoading } from "./components/skeleton-card-loading";
import { Users } from "../users/interfaces/users";
import useAuthStore from "@/stores/AuthStore";

export function HomePage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [testingPeriodLimitDays, setTestingPeriodLimitDays] =
    useState<number>(0);
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
  const [perPage, setPerPage] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>();

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    const params = new URLSearchParams();

    if (companiesFilter) {
      params.append("filter", companiesFilter);
    }

    params.append("page", page.toString());
    params.append("perPage", perPage.toString());
    params.append("q", searchStore.q);

    try {
      const testingPeriodLimitDays = (
        await axiosService.get("/app-config/testing_period_limit_days")
      ).data;
      setTestingPeriodLimitDays(Number(testingPeriodLimitDays));

      const response = await axiosService.get<CompaniesResponse>("/companies", {
        params,
      });
      setLoadingCompanies(false);
      setCompaniesResponse(response.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      setLoadingCompanies(false);
    }
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
  const [companyToUpdate, setCompanyToUpdate] = useState<Companies | null>();
  const [companyToDelete, setCompanyToDelete] = useState<Companies | null>();

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

  const calculateTestRemainingDays = (startTestPeriodAt: Date) => {
    if (startTestPeriodAt) {
      const today = new Date();
      const startDate = new Date(startTestPeriodAt);
      const totalTestDays = testingPeriodLimitDays;

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

  return (
    <div className="flex sm:min-h-screen w-full flex-col bg-muted/40 overflow-x-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 px-4 pt-4 pb-20 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center lg:py-0 py-4 fixed lg:static bottom-0 right-0 px-4 z-20">
            <div className="lg:ml-auto flex items-center gap-2 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="size-9 lg:h-7 lg:w-auto gap-1 rounded-full lg:rounded"
                  >
                    <ListFilter className="size-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filtro
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
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
                className="size-12 lg:h-7 lg:w-auto gap-1 rounded-full lg:rounded bg-primary hover:bg-primary-dark transition-all duration-200"
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
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">
                      <span className="sr-only">Ícone</span>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-balance">Teste ativo</TableHead>
                    <TableHead className="text-balance">
                      Dias restante
                    </TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Telefone</TableHead>

                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCompanies ? (
                    <SkeletonLoading />
                  ) : (
                    companiesResponse?.data.map((company) => (
                      <TableRow key={company.id}>
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
                        <TableCell>
                          {company.start_test_period_at &&
                          company.test_period_active
                            ? calculateTestRemainingDays(
                                company.start_test_period_at
                              )
                            : null}
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-2">{company.address}</p>
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-2">{company.neighborhood}</p>
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
                                  handleOpenUpdateModal(company);
                                }}
                              >
                                <EditIcon size={14} />
                                <span className="ml-2">Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
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
                  <Card className="rounded" key={company.id}>
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
                              handleOpenUpdateModal(company);
                            }}
                          >
                            <EditIcon size={14} />
                            <span className="ml-2">Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
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
                          <span>Tempo restantes</span>
                          <p className="text-sm text-muted-foreground">
                            {calculateTestRemainingDays(
                              company.start_test_period_at
                            )}{" "}
                            dias
                          </p>
                        </div>
                      ) : null}
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
                    <span className="text-white font-semibold">
                      Itens por página
                    </span>
                    <Select
                      defaultValue="8"
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
                  <span className="text-white font-semibold">
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
    </div>
  );
}
