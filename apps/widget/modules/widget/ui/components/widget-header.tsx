import { cn } from "@workspace/ui/lib/utils";
import { WidgetThemeToggle } from "@/modules/widget/ui/components/widget-theme-toggle";

export const WidgetHeader = ({
  actions,
  children,
  className,
}: {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-3 bg-primary p-4 text-primary-foreground",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <WidgetThemeToggle />
      </div>
    </header>
  );
};
