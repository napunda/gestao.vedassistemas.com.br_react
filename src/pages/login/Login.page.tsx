import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/schemes/LoginSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/AuthStore";
import { axiosGuestService } from "@/services/axiosGuest.service";
import { useEffect } from "react";
import { User2Icon, LockIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export const LoginPage = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "fiscalvedas@gmail.com",
      password: "suporte2024web",
    },
  });

  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = authStore.isAuthenticated;
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authStore.isAuthenticated, navigate]);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    axiosGuestService
      .post("/login", {
        ...values,
        platform: "web",
      })
      .then((response) => {
        if (response.status !== 200) {
          toast({
            title: "Erro ao efetuar login",
            description:
              "Suas credenciais estão incorretas, por favor tente novamente.",
            action: <ToastAction altText="ok">Ok</ToastAction>,
            variant: "destructive",
          });
          return;
        }
        authStore.login(response.data.access_token);
      })
      .finally(() => {
        if (authStore.isAuthenticated && authStore.user) {
          navigate("/");
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao efetuar login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="w-full max-w-[25rem] border shadow-sm p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      icon={<User2Icon size={16} />}
                      iconPosition="left"
                      placeholder="E-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      icon={<LockIcon size={16} />}
                      iconPosition="left"
                      type="password"
                      placeholder="Senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="mt-4 flex justify-end gap-5 items-center">
              {/* <Link
                className="text-sm hover:underline transition-all duration-200"
                to="/"
              >
                Esqueci minha senha
              </Link> */}
              <Button type="submit">Entrar</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
