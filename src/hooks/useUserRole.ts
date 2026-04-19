import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "super_admin" | "vendor" | "customer";

export const useUserRoles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-roles", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<AppRole[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
};

export const useIsSuperAdmin = () => {
  const { data, isLoading } = useUserRoles();
  return {
    isSuperAdmin: !!data?.includes("super_admin"),
    isLoading,
  };
};
