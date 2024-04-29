import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EditIcon,
  MoreHorizontal,
  PlusCircle,
  PlusIcon,
  Trash2Icon,
  User2Icon,
} from "lucide-react";
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
  DropdownMenuTrigger,
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
import { Users, UsersResponse } from "./interfaces/users";
import { ModalAddUser } from "./components/ModalAddUser";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSearchStore from "@/stores/SerchStore";
import { ModalUpdateUser } from "./components/ModalUpdateUser";
import { ModalDeleteUser } from "./components/ModalDeleteUser";
import { Input } from "@/components/ui/input";
import { SkeletonCardLoading } from "./components/skeleton-card-loading";
import dayjs from "dayjs";

export function UsersPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const searchStore = useSearchStore();
  const [usersResponse, setUsersResponse] = useState<UsersResponse>();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );
  const [perPage, setPerPage] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>();

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("perPage", perPage.toString());
    params.append("q", searchStore.q);

    try {
      const response = await axiosService.get<UsersResponse>("/users", {
        params,
      });
      setLoadingUsers(false);
      setUsersResponse(response.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (page > 0) {
      fetchUsers();
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [perPage]);

  useEffect(() => {
    fetchUsers();
  }, [searchStore.q]);

  useEffect(() => {
    if (searchStore.q === "") {
      return;
    }
    setSearchParams({ q: searchStore.q });
  }, [searchStore.q]);

  useEffect(() => {
    searchStore.setQ(searchParams.get("q") ?? "");
  }, []);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    setPage(newPage);
  };

  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const [openModalUpdateUser, setOpenModalUpdateUser] = useState(false);
  const [openModalDeleteUser, setOpenModalDeleteUser] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<Users | null>();
  const [userToDelete, setUserToDelete] = useState<Users | null>();

  const onCloseModalAddUser = () => {
    setOpenModalAddUser(false);
  };

  const onCloseModalUpdateUser = () => {
    setUserToUpdate(null);
    setOpenModalUpdateUser(false);
  };

  const onCloseModalDeleteUser = () => {
    setUserToDelete(null);
    setOpenModalDeleteUser(false);
  };

  const handleOpenUpdateModal = (user: Users) => {
    setUserToUpdate(user);
    setOpenModalUpdateUser(true);
  };

  const handleDeleteCompany = (user: Users) => {
    setUserToDelete(user);
    setOpenModalDeleteUser(true);
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

  return (
    <div className="flex sm:min-h-screen w-full flex-col bg-muted/40 overflow-x-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 py-16 md:gap-8">
          <div className="flex items-center lg:py-0 lg:px-0 py-4 px-4 fixed lg:static bottom-0 right-0 z-20">
            <div className="lg:ml-auto flex items-center">
              <Button
                onClick={() => {
                  setOpenModalAddUser(true);
                }}
                size="sm"
                className="size-12 lg:h-7 lg:w-auto gap-1 rounded-full lg:rounded bg-primary hover:bg-primary-dark transition-all duration-200"
              >
                <PlusCircle className="size-3.5 hidden lg:block" />
                <PlusIcon className="lg:hidden block" />
                <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">
                  Novo usuário
                </span>
              </Button>
            </div>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="text-lg">Usuários</CardTitle>
              <CardDescription>Cadastre ou remova um usuário</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto relative hidden lg:block">
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">
                      <span className="sr-only">Ícone</span>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Criado</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingUsers ? (
                    <SkeletonLoading />
                  ) : (
                    usersResponse?.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="hidden sm:table-cell">
                          <User2Icon className="size-6" />
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {dayjs(user.created_at).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {dayjs(user.updated_at).format("DD/MM/YYYY")}
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
                                  handleOpenUpdateModal(user);
                                }}
                              >
                                <EditIcon size={14} />
                                <span className="ml-2">Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeleteCompany(user);
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
            <CardContent className="overflow-hidden relative lg:hidden space-y-5 px-2 sm:px:6">
              {loadingUsers ? (
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
                usersResponse?.data.map((user) => (
                  <Card className="rounded" key={user.id}>
                    <CardHeader className="flex justify-between flex-row items-start border-b py-3">
                      <CardTitle className="text-sm font-bold">
                        #{user.id}
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
                              handleOpenUpdateModal(user);
                            }}
                          >
                            <EditIcon size={14} />
                            <span className="ml-2">Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleDeleteCompany(user);
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
                          <User2Icon className="size-10 p-2 border rounded-full" />
                          <div className="grid gap-1">
                            <span className="font-bold">{user.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 grid">
                        <div className="flex justify-between">
                          <span>Email</span>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span>Criado</span>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {dayjs(user.created_at).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span>Atualizado</span>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {dayjs(user.updated_at).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
            <CardFooter>
              <div className="md:flex hidden justify-between items-center w-full text-muted-foreground">
                <div className="text-sm">
                  Mostrando {usersResponse?.data.length} de{" "}
                  {usersResponse?.total} itens
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
      <ModalAddUser
        open={openModalAddUser}
        onAddUser={fetchUsers}
        onClose={onCloseModalAddUser}
      />

      {userToUpdate && (
        <ModalUpdateUser
          open={openModalUpdateUser}
          onUpdateUser={() => {
            fetchUsers();
            setUserToUpdate(null);
          }}
          onClose={onCloseModalUpdateUser}
          user={userToUpdate}
        />
      )}

      {userToDelete && (
        <ModalDeleteUser
          user={userToDelete}
          open={openModalDeleteUser}
          onClose={onCloseModalDeleteUser}
          onUserDelete={() => {
            fetchUsers();
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
}
