import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Companies } from "../interfaces/companies";
import { axiosService } from "@/services/axios.service";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

interface ModalDeleteCompanyProps {
  open: boolean;
  company: Companies;
  onCompanyDelete: () => void;
  onClose: () => void;
}

export const ModalDeleteCompany = ({
  open,
  company,
  onCompanyDelete,
  onClose,
}: ModalDeleteCompanyProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleDelete = () => {
    axiosService
      .delete(`/companies/${company.id}`)
      .then((response) => {
        setLoading(false);
        if (!response.data.success) {
          toast({
            title: "Erro ao deletar empresa",
            description:
              "Houve um erro ao deletar a empresa, por favor tente novamente mais tarde.",
            action: <ToastAction altText="ok">Ok</ToastAction>,
            variant: "destructive",
          });
          return;
        }
        onClose();
        onCompanyDelete();
      })
      .catch((error) => {
        setLoading(false);
        toast({
          title: "Erro no servidor",
          description:
            "Desculpe, houve um erro no servidor, por favor tente novamente mais tarde.",
          action: <ToastAction altText="ok">Ok</ToastAction>,
          variant: "destructive",
        });
        console.error(error);
      });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza disso ?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente a
            empresa selecionada e removerá todos os dados associados a ela.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/80"
          >
            {loading && (
              <Loader2Icon className="size-4 md:size-5 animate-spin inline-block mr-2" />
            )}
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
