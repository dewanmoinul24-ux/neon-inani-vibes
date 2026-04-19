import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 md:h-14 flex items-center justify-between border-b border-border/40 px-3 md:px-4 glass-strong sticky top-0 z-30">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <SidebarTrigger />
              <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-neon-pink shrink-0" />
                <span className="font-display text-xs md:text-sm font-bold gradient-neon-text truncate">
                  InaniVibes Admin
                </span>
              </div>
            </div>
            <span className="text-xs font-ui text-muted-foreground hidden md:inline truncate ml-2">
              {user?.email}
            </span>
          </header>
          <main className="flex-1 p-3 md:p-8">
            <div className="mb-4 md:mb-6">
              <h1 className="font-display text-xl md:text-3xl font-bold gradient-neon-text leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="font-body text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
