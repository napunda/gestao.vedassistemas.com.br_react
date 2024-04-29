import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users } from "../interfaces/users";
import { axiosService } from "@/services/axios.service";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";

interface ModalDeleteUserProps {
  open: boolean;
  user: Users;
  onUserDelete: () => void;
  onClose: () => void;
}

export const ModalDeleteUser = ({
  open,
  user,
  onUserDelete,
  onClose,
}: ModalDeleteUserProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleDelete = () => {
    axiosService
      .delete(`/users/${user.id}`)
      .then((response) => {
        setLoading(false);
        if (!response.data.success) {
          toast({
            title: "Erro ao deletar usuário",
            description:
              "Houve um erro ao deletar o usuário, por favor tente novamente mais tarde.",
            action: <ToastAction altText="ok">Ok</ToastAction>,
            variant: "destructive",
          });
          return;
        }
        onClose();
        onUserDelete();
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
            <Trash2Icon size={90} />
          </div>
          <AlertDialogTitle className="text-balance text-center">
            Tem certeza que deseja deletar o usuário{" "}
            <span className="font-black">{user.name}</span>?
          </AlertDialogTitle>
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
