import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false, //auth check, false means send 1 request only 
    });

    return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
    //authData?.user; user means backend returning user as response
}

export default useAuthUser;