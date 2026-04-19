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
          <header className="h-14 flex items-center justify-between border-b border-border/40 px-4 glass-strong sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-pink" />
                <span className="font-display text-sm font-bold gradient-neon-text">
                  InaniVibes Admin
                </span>
              </div>
            </div>
            <span className="text-xs font-ui text-muted-foreground hidden md:inline">
              {user?.email}
            </span>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <div className="mb-6">
              <h1 className="font-display text-2xl md:text-3xl font-bold gradient-neon-text">
                {title}
              </h1>
              {subtitle && (
                <p className="font-body text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
