import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingsApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: (newSettingsData) => updateSettingsApi(newSettingsData),
    onSuccess: () => {
      toast.success("Settings edited successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return { updateSetting, isUpdating };
}
