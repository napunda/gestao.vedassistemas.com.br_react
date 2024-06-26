import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Companies } from "../interfaces/companies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthStore from "@/stores/AuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "@/pages/users/interfaces/users";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalAddCompanyProps {
  open: boolean;
  onClose: () => void;
  onUpdateCompany: () => void;
  company: Companies;
  users?: Users[];
}
export const ModalUpdateCompany = ({
  open,
  onClose,
  onUpdateCompany,
  company,
  users,
}: ModalAddCompanyProps) => {
  const form = useForm<z.infer<typeof AddCompanySchema>>({
    resolver: zodResolver(AddCompanySchema),
    defaultValues: {
      id_machine: company.id_machine,
      document: company.document,
      name: company.name,
      address: company.address ?? "",
      neighborhood: company.neighborhood ?? "",
      city: company.city ?? "",
      state: company.state ?? "",
      phone: company.phone ?? "",
      complement: company.complement ?? "",
      access_allowed: !!company.access_allowed,
      test_period_active: !!company.test_period_active,
      user_id: company.id_user.toString() ?? "1",
    },
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  function onSubmit(data: z.infer<typeof AddCompanySchema>) {
    setLoadingSubmit(true);
    axiosService
      .put(`/companies/${company.id}`, data)
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

        onUpdateCompany();
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

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <ScrollArea className="h-[80vh] sm:h-full w-full px-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-2">
              <Tabs defaultValue="Geral" className="w-full">
                <div className="flex justify-center">
                  <TabsList className="mb-10">
                    <TabsTrigger value="Geral">Geral</TabsTrigger>
                    <TabsTrigger value="Informaçõoes">Informaçõoes</TabsTrigger>
                  </TabsList>
                </div>
                <DialogHeader className="mb-5">
                  <DialogTitle>Atualizar Empresa</DialogTitle>
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
                              defaultValue={field.value?.toString()}
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
                            <Input {...field} />
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
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit && (
                    <Loader2Icon className="size-4 md:size-5 animate-spin inline-block mr-2" />
                  )}
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
