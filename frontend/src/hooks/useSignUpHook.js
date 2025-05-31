import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signup } from "../lib/api";

const useSignup = () => {
    const queryClient = useQueryClient();
  
    const { mutate, isPending, error } = useMutation({
      mutationFn: signup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }), //Refetch from app.jsx
    });

    return {isPending, error, signupMutation: mutate};
}

export default useSignup