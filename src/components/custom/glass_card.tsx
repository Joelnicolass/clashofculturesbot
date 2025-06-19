export const GlassCard = ({
  children,
  className = "",
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`
          relative overflow-hidden rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/10
          shadow-2xl shadow-black/10
          ${className}
        `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};
