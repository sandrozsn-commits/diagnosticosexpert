import type { ImgHTMLAttributes } from "react";

export function BrandLogo({
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/academia-eletricista-logo.svg"
      alt="Academia do Eletricista"
      className={className}
      {...props}
    />
  );
}

export function InstitutionalFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`border-t border-border px-5 py-7 text-center text-xs leading-relaxed text-muted-foreground ${className}`}>
      <p>Copyright © 2026</p>
      <p className="font-semibold text-foreground">Academia do Eletricista</p>
      <p>Instituto Brasileiro de Qualificação Profissional Ltda - ME</p>
      <p>CNPJ: 10.984.548/0001-77</p>
    </footer>
  );
}
