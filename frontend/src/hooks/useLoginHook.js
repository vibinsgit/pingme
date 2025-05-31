import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error} = useMutation({
    mutationFn: login, //login is an api call function in api.js
    onSuccess: () => queryClient.invalidateQueries( {queryKey: ["authUser"]}),
  });

  return {error, isPending, loginMutation: mutate};
}
