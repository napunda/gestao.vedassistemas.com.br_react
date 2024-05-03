import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Companies, CompaniesResponse } from "../interfaces/companies";
import { SkeletonCardLoading } from "./SkeletonCardLoading";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  EditIcon,
  Trash2Icon,
  ChefHatIcon,
  Phone,
} from "lucide-react";
import { calculateTestRemainingDays } from "../utils/calculateTestRemainingDays";
import { formatDocument } from "../utils/formatDocument";

interface ICompaniesCardProps {
  companiesResponse: CompaniesResponse;
  loadingCompanies: boolean;
  testingPeriodLimitDays: number;
  handleDeleteCompany: (company: Companies) => void;
  handleOpenUpdateModal: (company: Companies) => void;
}
export const CompaniesCard = ({
  companiesResponse,
  loadingCompanies,
  testingPeriodLimitDays,
  handleDeleteCompany,
  handleOpenUpdateModal,
}: ICompaniesCardProps) => {
  <>
    {loadingCompanies
      ? Array.from({ length: 10 }, (_, index) => (
          <SkeletonCardLoading key={index} />
        ))
      : companiesResponse?.data.map((company) => (
          <Card className="rounded" key={company.id}>
            <CardHeader className="flex justify-between flex-row items-start border-b py-3">
              <CardTitle className="text-sm font-bold">
                {formatDocument(company.document)}
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
            </CardHeader>

            <CardContent className="py-3">
              <div className="flex items-start flex-row justify-between">
                <div className="flex items-center gap-4">
                  <ChefHatIcon className="size-10 p-2 border rounded-full" />
                  <div className="grid gap-1">
                    <span className="font-bold">{company.name}</span>
                    <a
                      href={`tel:${company.phone}`}
                      className="flex items-center gap-2"
                    >
                      <Phone className="size-3" />
                      <span className="text-xs text-muted-foreground">
                        {company.phone}
                      </span>
                    </a>
                  </div>
                </div>
                <Badge
                  variant={company.access_allowed ? "outline" : "secondary"}
                >
                  {company.access_allowed ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div className="mt-8 grid">
                <div className="flex justify-between">
                  <span>Estado</span>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {company.state}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span>Cidade</span>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {company.city}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-5 grid gap-3">
              <div className="flex justify-between">
                <span>Período de teste</span>
                <Badge
                  variant={company.test_period_active ? "default" : "secondary"}
                >
                  {company.test_period_active ? "Sim" : "Não"}
                </Badge>
              </div>
              {company.start_test_period_at && company.test_period_active ? (
                <div className="flex justify-between">
                  <span>Dias restantes</span>
                  <p className="text-sm text-muted-foreground">
                    {calculateTestRemainingDays(
                      company.start_test_period_at,
                      testingPeriodLimitDays
                    )}{" "}
                    dias
                  </p>
                </div>
              ) : null}
            </CardFooter>
          </Card>
        ))}
  </>;
};
