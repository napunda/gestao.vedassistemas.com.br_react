import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { UpdateUserSchema } from "@/schemes/UpdateUserSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Users } from "../interfaces/users";

interface ModalUpdateUserProps {
  open: boolean;
  onClose: () => void;
  onUpdateUser: () => void;
  user: Users;
}
export const ModalUpdateUser = ({
  open,
  onClose,
  onUpdateUser,
  user,
}: ModalUpdateUserProps) => {
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      username: user.username ?? "",
      password: "",
      web_password: "",
    },
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof UpdateUserSchema>) {
    setLoadingSubmit(true);
    axiosService
      .put(`/users/${user.id}`, data)
      .then((response) => {
        setLoadingSubmit(false);

        if (response.status === 201) {
          toast({
            title: "Usuário atualizado com sucesso",
            description: "O usuário foi atualizado com sucesso.",
            action: <ToastAction altText="ok">Ok</ToastAction>,
            variant: "default",
          });
        }
        onUpdateUser();
        form.reset();
        onClose();
      })
      .catch((error) => {
        setLoadingSubmit(false);
        if (error.response?.status === 403) {
          const errorsArray = Object.keys(error.response.data.errors);

          errorsArray.forEach((err) => {
            return form.setError(
              err as keyof z.infer<typeof UpdateUserSchema>,
              {
                type: "manual",
                message: error.response.data.errors[err][0],
              }
            );
          });

          return;
        }
        toast({
          title: "Ocorreu um erro ao salvar o usuário",
          description:
            "Ocorreu um erro ao salvar o usuário, por favor tente novamente.",
          action: <ToastAction altText="ok">Ok</ToastAction>,
          variant: "destructive",
        });

        setLoadingSubmit(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
            <DialogHeader className="mb-5">
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>

            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

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
            </div>

            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="web_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha web</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
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
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
