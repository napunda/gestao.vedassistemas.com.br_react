import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Companies } from "../interfaces/companies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChefHatIcon } from "lucide-react";
import dayjs from "dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IDrawerViewCompanyProps {
  open: boolean;
  onClose: () => void;
  company: Companies;
}

const ItemRender = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-start space-x-4 p-2 sm:p-4">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
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

const calculateNotActivityDays = (lastActivityAt: Date | null) => {
  if (lastActivityAt) {
    const today = new Date();
    const lastActivityDate = new Date(lastActivityAt);

    const diffTime = Math.abs(today.getTime() - lastActivityDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
  return 0;
};

export const DrawerViewCompany = ({
  open,
  onClose,
  company,
}: IDrawerViewCompanyProps) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2 sm:gap-4">
            <ChefHatIcon size={80} />
            {company.name}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[60vh] sm:h-auto">
          <Card className="w-full border-none">
            <CardContent className="grid gap-2 sm:gap-4 py-6 px-4">
              <h3 className="font-bold text-md sm:text-lg">
                Informações gerais
              </h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                <ItemRender
                  label="ID MACHINE"
                  value={company.id_machine ?? "N/A"}
                />
                <ItemRender label="Nome" value={company.name ?? "N/A"} />
                <ItemRender
                  label="Documento"
                  value={formatDocument(company.document) ?? "N/A"}
                />
              </div>
              <h3 className="font-bold text-md sm:text-lg">
                Endereço e contato
              </h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                <ItemRender label="Estado" value={company.state ?? "N/A"} />
                <ItemRender label="Cidade" value={company.city ?? "N/A"} />
                <ItemRender label="Endereço" value={company.address ?? "N/A"} />
                <ItemRender
                  label="Complemento"
                  value={company.complement ?? "N/A"}
                />
                <ItemRender label="Telefone" value={company.phone ?? "N/A"} />
                <ItemRender
                  label="Bairro"
                  value={company.neighborhood ?? "N/A"}
                />
              </div>
              <h3 className="font-bold text-md sm:text-lg">
                Informações de serviço
              </h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <ItemRender
                  label="Dias inativos"
                  value={
                    company.last_activity_at
                      ? calculateNotActivityDays(
                          company.last_activity_at
                        ).toString()
                      : "N/A"
                  }
                />
                <ItemRender
                  label="Status"
                  value={company.access_allowed ? "Ativo" : "Inativo"}
                />
                <ItemRender
                  label="Período de Teste"
                  value={company.test_period_active ? "Ativo" : "Inativo"}
                />
                <ItemRender
                  label="Dias restantes"
                  value={company.remaining_days?.toString() ?? "N/A"}
                />
                <ItemRender
                  label="Data de Cadastro"
                  value={
                    dayjs(company.created_at).format("YYYY-MM-DD HH:mm:ss") ??
                    "N/A"
                  }
                />
                <ItemRender
                  label="Início do Período de Teste"
                  value={
                    company.start_test_period_at
                      ? dayjs(company.start_test_period_at).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : "N/A"
                  }
                />
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
        <DrawerFooter className="py-4">
          <DrawerClose asChild>
            <Button onClick={onClose} variant="default">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
