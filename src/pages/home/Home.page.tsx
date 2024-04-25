import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EditIcon,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Trash2Icon,
  User2Icon,
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
import dayjs from "dayjs";
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
  const [perPage, setPerPage] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>();

  const fetchCompanies = async () => {
    const params = new URLSearchParams();

    if (companiesFilter) {
      params.append("filter", companiesFilter);
    }

    params.append("page", page.toString());
    params.append("perPage", perPage.toString());
    params.append("q", searchStore.q);

    try {
      setLoadingCompanies(true);
      const response = await axiosService.get<CompaniesResponse>("/companies", {
        params,
      });
      setCompaniesResponse(response.data);
      setTotalPages(response.data.last_page);
      setLoadingCompanies(false);
    } catch (error) {
      console.error(error);
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [companiesFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  useEffect(() => {
    fetchCompanies();
  }, [perPage]);

  useEffect(() => {
    fetchCompanies();
  }, [searchStore.q]);

  useEffect(() => {
    companiesFilter
      ? setSearchParams({
          filter: companiesFilter,
          page: "1",
          q: searchStore.q,
        })
      : setSearchParams({ page: "1", q: searchStore.q });
  }, [searchStore.q]);

  useEffect(() => {
    searchStore.setQ(searchParams.get("q") ?? "");
  }, []);

  const formatDate = (date: Date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

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

  return (
    <div className="flex sm:min-h-screen w-full flex-col bg-muted/40 overflow-x-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center relative md:py-0 py-4">
            <div className="md:ml-auto flex items-center gap-2 fixed md:static z-20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
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
                className="h-7 gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
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
            <CardContent className="overflow-auto relative">
              <Table className="table-auto xl:table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">
                      <span className="sr-only">Ícone</span>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Liberado</TableHead>
                    <TableHead className="text-balance">
                      Período de Teste
                    </TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Criado em</TableHead>
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
                          <User2Icon className="size-6" />
                        </TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.document}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              company.access_allowed ? "outline" : "secondary"
                            }
                          >
                            {company.access_allowed ? "Sim" : "Não"}
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
                            {company.test_period_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{company.address}</TableCell>
                        <TableCell>{company.neighborhood}</TableCell>
                        <TableCell>{company.city}</TableCell>
                        <TableCell>{company.state}</TableCell>
                        <TableCell>{company.phone}</TableCell>
                        <TableCell>{formatDate(company.created_at)}</TableCell>
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
            <CardFooter>
              <div className="flex justify-between items-center w-full text-muted-foreground">
                <div className="text-sm">
                  Mostrando {companiesResponse?.data.length} de{" "}
                  {companiesResponse?.total} itens
                </div>

                <div className="inline-flex items-center gap-8 text-sm font-bold">
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
            </CardFooter>
          </Card>
        </main>
      </div>
      <ModalAddCompany
        open={openModalAddCompany}
        onAddCompany={fetchCompanies}
        onClose={onCloseModalAddCompany}
      />

      {companyToUpdate && (
        <ModalUpdateCompany
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
