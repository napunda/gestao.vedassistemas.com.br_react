import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Companies, CompaniesResponse } from "../interfaces/companies";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ChefHatIcon,
  MoreHorizontal,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import { SkeletonLoading } from "./SkeletonLoading";

interface ICompaniesTableProps {
  companiesResponse: CompaniesResponse | undefined;
  loadingCompanies: boolean;
  testingPeriodLimitDays: number;
  handleDeleteCompany: (company: Companies) => void;
  handleOpenUpdateModal: (company: Companies) => void;
}
import { formatDocument } from "../utils/formatDocument";
import { calculateTestRemainingDays } from "../utils/calculateTestRemainingDays";

const headers = [
  {
    key: "icon",
    label: "Ícone",
    hidden: true,
  },
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "document",
    label: "Documento",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "test_active",
    label: "Teste ativo",
  },
  {
    key: "remaining_days",
    label: "Dias restantes",
  },
  {
    key: "address",
    label: "Endereço",
  },
  {
    key: "neighborhood",
    label: "Bairro",
  },
  {
    key: "city",
    label: "Cidade",
  },
  {
    key: "state",
    label: "Estado",
  },
  {
    key: "phone",
    label: "Telefone",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

const renderHeader = (header: {
  key: string;
  label: string;
  hidden: boolean;
}) => {
  if (header.hidden) {
    return (
      <TableHead className="hidden sm:table-cell">
        <span className="sr-only">{header.label}</span>
      </TableHead>
    );
  }

  return <TableHead>{header.label}</TableHead>;
};

export const CompaniesTable = ({
  companiesResponse,
  loadingCompanies,
  testingPeriodLimitDays,
  handleDeleteCompany,
  handleOpenUpdateModal,
}: ICompaniesTableProps) => {
  return (
    <Table className="table-auto">
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header.key}>
              {renderHeader(
                header as {
                  key: string;
                  label: string;
                  hidden: boolean;
                }
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingCompanies ? (
          <SkeletonLoading />
        ) : (
          companiesResponse?.data.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="hidden sm:table-cell">
                <ChefHatIcon className="size-6" />
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{formatDocument(company.document)}</TableCell>
              <TableCell>
                <Badge
                  variant={company.access_allowed ? "outline" : "secondary"}
                >
                  {company.access_allowed ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={company.test_period_active ? "outline" : "secondary"}
                >
                  {company.test_period_active ? "Sim" : "Não"}
                </Badge>
              </TableCell>
              <TableCell>
                {company.start_test_period_at && company.test_period_active
                  ? calculateTestRemainingDays(
                      company.start_test_period_at,
                      testingPeriodLimitDays
                    )
                  : null}
              </TableCell>
              <TableCell>
                <p className="line-clamp-2">{company.address}</p>
              </TableCell>
              <TableCell>
                <p className="line-clamp-2">{company.neighborhood}</p>
              </TableCell>
              <TableCell>
                <p className="whitespace-nowrap">{company.city}</p>
              </TableCell>
              <TableCell>
                <p className="whitespace-nowrap">{company.state}</p>
              </TableCell>
              <TableCell>
                <p className="whitespace-nowrap">{company.phone}</p>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
