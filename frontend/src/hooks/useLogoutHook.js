import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../lib/api";
  
const useLogoutHook = () => {
    const queryClient = useQueryClient();

    const {mutate, isPending, error} = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({query: ["authUser"]}),
    });

    return { isPending, error, logoutMutation: mutate };
}

export default useLogoutHook;