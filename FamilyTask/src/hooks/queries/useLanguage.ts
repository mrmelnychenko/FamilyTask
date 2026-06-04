import { updateLanguage } from "@/src/services/language-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateLanguage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLanguage, // supabase update

        onSuccess: (code) => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });

            return code;
        },
    });
}