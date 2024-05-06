import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { AddUserSchema } from "@/schemes/AddUserSchema";
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

interface ModalAddUserProps {
  open: boolean;
  onClose: () => void;
  onAddUser: () => void;
}
export const ModalAddUser = ({
  open,
  onClose,
  onAddUser,
}: ModalAddUserProps) => {
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      web_password: "",
    },
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof AddUserSchema>) {
    setLoadingSubmit(true);
    axiosService
      .post("/users", data)
      .then((response) => {
        setLoadingSubmit(false);

        if (response.status === 201) {
          toast({
            title: "Usuário cadastrado com sucesso",
            description: "O usuário foi cadastrado com sucesso.",
            action: <ToastAction altText="ok">Ok</ToastAction>,
            variant: "default",
          });
        }
        onAddUser();
        form.reset();
        onClose();
      })
      .catch((error) => {
        setLoadingSubmit(false);
        if (error.response?.status === 403) {
          const errorsArray = Object.keys(error.response.data.errors);

          errorsArray.forEach((err) => {
            return form.setError(
              err as "email" | "name" | "password" | "web_password",
              {
                type: "manual",
                message: error.response.data.errors[err][0],
              }
            );
          });
        }
        toast({
          title: "Ocorreu um erro ao cadastrar o usuário",
          description:
            "Ocorreu um erro ao cadastrar o usuário, por favor tente novamente.",
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
            <DialogHeader>
              <DialogTitle>Adicionar Usuário</DialogTitle>
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
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
