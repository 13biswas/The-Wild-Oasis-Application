import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upDateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: upDateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success("User Account successfully updated");
      queryClient.setQueryData(["user"], user);
      // queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return { updateUser, isUpdating };
}
