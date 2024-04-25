import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { settingsSchema } from "@/schemes/SettingsSchema";
import { Loader2Icon, LockIcon, User2Icon } from "lucide-react";
import useAuthStore from "@/stores/AuthStore";
import { axiosService } from "@/services/axios.service";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const Settings = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loadingForm, setLoadingForm] = useState(false);
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      password_confirmation: "",
      testing_period_limit_days: 1,
    },
  });

  const getTestingPeriodLimitDays = () => {
    axiosService
      .get("/app-config/testing_period_limit_days")
      .then((response) => {
        form.setValue("testing_period_limit_days", Number(response.data));
      });
  };

  useEffect(() => {
    getTestingPeriodLimitDays();
  }, []);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    setLoadingForm(true);
    axiosService
      .post("/app-config", {
        ...values,
        key: "testing_period_limit_days",
      })
      .then((response: any) => {
        setLoadingForm(false);

        if (!response.data.success) {
          const { message } = response.data;

          let errorMessage = "";

          for (const field in message) {
            errorMessage += `${field.toLocaleUpperCase()}: ${message[
              field
            ].join(", ")}\n`;
          }
          toast({
            title: "Problemas nos campos enviados ",
            description: errorMessage,
            variant: "destructive",
          });
        }

        if (response.data.success) {
          form.reset();
          getTestingPeriodLimitDays();
        }
      })
      .catch((error) => {
        setLoadingForm(false);
        toast({
          title: "Erro ao salvar configurações",
          description: `Ocorreu um erro ao salvar as configurações, por favor tente novamente.`,
          variant: "destructive",
        });
        console.error(error);
      });
  }

  return (
    <div className="flex sm:min-h-screen w-full flex-col bg-muted/40 overflow-x-auto">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
              <CardDescription>
                Gerencie as configurações da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto relative">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
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

                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <Input
                            icon={<LockIcon size={16} />}
                            iconPosition="left"
                            type="password"
                            placeholder="Confirmar senha"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="testing_period_limit_days"
                    render={({
                      field: { name, onBlur, ref, value, disabled },
                    }) => (
                      <FormItem>
                        <FormLabel>Período de teste (dias)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Período de teste"
                            onChange={(e) => {
                              form.setValue(
                                "testing_period_limit_days",
                                Number(e.target.value)
                              );
                            }}
                            value={value}
                            onBlur={onBlur}
                            ref={ref}
                            name={name}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <div className="mt-4 flex justify-end gap-5 items-center">
                    <Button type="submit">
                      {loadingForm && (
                        <Loader2Icon className="size-4 md:size-5 animate-spin inline-block mr-2" />
                      )}
                      Salvar alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
