import { Sprout } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = "Memuat data...", fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent) transparent var(--accent) var(--accent)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-5 h-5" style={{ color: "var(--primary)" }} />
        </div>
      </div>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
}
