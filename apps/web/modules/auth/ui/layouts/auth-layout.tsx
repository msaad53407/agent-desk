export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <div className="relative flex min-h-screen min-w-screen items-center justify-center overflow-hidden bg-muted/40 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_26%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.9),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="relative w-full max-w-md">
        {children}
      </div>
    </div>
  );
};
