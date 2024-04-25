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

interface ModalAddCompanyProps {
  open: boolean;
  onClose: () => void;
  onUpdateCompany: () => void;
  company: Companies;
}
export const ModalUpdateCompany = ({
  open,
  onClose,
  onUpdateCompany,
  company,
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
    },
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { toast } = useToast();

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
        <DialogHeader>
          <DialogTitle>Atualizar Empresa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "120px 1fr" }}
            >
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

            <div className="flex gap-5">
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

            <div className="flex gap-5">
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

            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "1fr 120px" }}
            >
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
            <div className="grid grid-cols-2">
              <FormField
                control={form.control}
                name="access_allowed"
                render={({ field }) => (
                  <FormItem
                    className={`flex flex-row-reverse items-center justify-end gap-3 ${
                      form.getValues().test_period_active ? "opacity-50" : ""
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
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="default" type="submit" disabled={loadingSubmit}>
                {loadingSubmit && (
                  <Loader2Icon className="size-4 md:size-5 animate-spin inline-block mr-2" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
