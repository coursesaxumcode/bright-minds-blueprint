import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface GameShellProps {
  title: string;
  instruction?: string;
  onBack?: string;
  children: ReactNode;
}

/** Consistent layout used by every screen: minimal top bar + one focus area. */
export function GameShell({ title, instruction, onBack = "/map", children }: GameShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background no-select">
      <header className="flex items-center gap-3 px-4 py-4">
        <Link
          to={onBack}
          aria-label="Go back"
          className="flex size-14 items-center justify-center rounded-2xl bg-card text-foreground shadow-pop transition-transform active:scale-90"
        >
          <ArrowLeft className="size-7" />
        </Link>
        <h1 className="text-2xl text-foreground">{title}</h1>
      </header>

      {instruction && (
        <p className="px-6 pb-2 text-center text-xl font-bold text-muted-foreground">
          {instruction}
        </p>
      )}

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-6">
        {children}
      </main>
    </div>
  );
}
