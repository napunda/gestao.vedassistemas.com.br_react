import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Companies } from "../interfaces/companies";
import { axiosService } from "@/services/axios.service";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { Loader2Icon, Trash2Icon, HelpCircleIcon } from "lucide-react";

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
    setLoading(true);
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
          <div className="flex justify-center py-5">
            <HelpCircleIcon size={90} />
          </div>
          <AlertDialogTitle className="text-balance text-center">
            Tem certeza que deseja deletar a empresa empresa{" "}
            <span className="font-black">{company.name}</span>?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-600/70 transition-all duration-70000 ease-in-out"
          >
            {loading ? (
              <Loader2Icon className="size-4 md:size-5 animate-spin inline-block mr-2" />
            ) : (
              <Trash2Icon className="size-4 md:size-5 inline-block mr-2" />
            )}
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
