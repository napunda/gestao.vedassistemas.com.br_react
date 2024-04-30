import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AddCompanySchema } from "@/schemes/AddCompanySchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { axiosService } from "@/services/axios.service";
import { cpf } from "cpf-cnpj-validator";
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "@/pages/users/interfaces/users";
import useAuthStore from "@/stores/AuthStore";

interface ModalAddCompanyProps {
  open: boolean;
  onClose: () => void;
  onAddCompany: () => void;
}
export const ModalAddCompany = ({
  open,
  onClose,
  onAddCompany,
}: ModalAddCompanyProps) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<Users[]>();

  const form = useForm<z.infer<typeof AddCompanySchema>>({
    resolver: zodResolver(AddCompanySchema),
    defaultValues: {
      id_machine: "",
      document: "",
      name: "",
      address: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      phone: "",
      access_allowed: false,
      test_period_active: true,
      user_id: "1",
    },
  });

  function onSubmit(data: z.infer<typeof AddCompanySchema>) {
    setLoadingSubmit(true);
    axiosService
      .post("/companies", data)
      .then((response) => {
        setLoadingSubmit(false);
        if (!response.data.success) {
          toast({
            title: "Erro ao fazer o cadastro da empresa",
            description:
              "Já existe uma empresa cadastrada com o mesmo documento.",
            action: <ToastAction altText="ok">Ok</ToastAction>,
            variant: "destructive",
          });

          return;
        }

        onAddCompany();
        form.reset();
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Ocorreu um erro ao cadastrar a empresa",
          description:
            "Ocorreu um erro ao cadastrar a empresa, por favor tente novamente.",
          action: <ToastAction altText="ok">Ok</ToastAction>,
          variant: "destructive",
        });

        console.error(error);
        setLoadingSubmit(false);
      });
  }

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
  }, []);

  const [documentMask, setDocumentMask] =
    useState<string>("__.___.___/____-__");
  const handleDocumentInput = (event: React.FormEvent<HTMLInputElement>) => {
    const document = event.currentTarget.value.replace(/\D/g, "");

    if (document.length === 11) {
      if (!cpf.isValid(document)) {
        return;
      }
      setDocumentMask("___.___.___-__");
    } else {
      setDocumentMask("__.___.___/____-__");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
            <Tabs defaultValue="Geral" className="w-full">
              <div className="flex justify-center">
                <TabsList className="mb-5">
                  <TabsTrigger value="Geral">Geral</TabsTrigger>
                  <TabsTrigger value="Informaçõoes">Informaçõoes</TabsTrigger>
                </TabsList>
              </div>
              <DialogHeader className="mb-5">
                <DialogTitle>Adicionar Empresa</DialogTitle>
              </DialogHeader>
              <TabsContent className="grid gap-5 mt-0" value="Geral">
                <div className="grid grid-cols-2">
                  <FormField
                    control={form.control}
                    name="access_allowed"
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-row-reverse items-center justify-end gap-3 ${
                          form.getValues().test_period_active
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <FormLabel>Acesso Permitido</FormLabel>
                        <FormControl>
                          <Checkbox
                            disabled={form.getValues().test_period_active}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="test_period_active"
                    render={({ field }) => (
                      <FormItem
                        className={`flex flex-row-reverse items-center justify-end gap-3 ${
                          form.getValues().access_allowed ? "opacity-50" : ""
                        }`}
                      >
                        <FormLabel>Período de Teste Ativo</FormLabel>
                        <FormControl>
                          <Checkbox
                            disabled={form.getValues().access_allowed}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                {user?.is_admin ? (
                  <div className="grid grid-cols-1">
                    <FormField
                      control={form.control}
                      name="user_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um usuário a essa empresa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users?.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}
                                >
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                ) : null}

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="id_machine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Machine</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento</FormLabel>
                        <FormControl>
                          <Input
                            mask={documentMask}
                            onInput={handleDocumentInput}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input mask="(___) _ ____-____" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </TabsContent>
              <TabsContent className="grid gap-5 mt-0" value="Informaçõoes">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="flex gap-5">
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-5">
              <Button
                className="mt-2 sm:mt-0"
                variant="secondary"
                type="button"
                onClick={() => {
                  onClose();
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button variant="default" type="submit" disabled={loadingSubmit}>
                {loadingSubmit && (
                  <Loader2Icon className="size-4 md:size-5 animate-spin inline-block mr-2" />
                )}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
