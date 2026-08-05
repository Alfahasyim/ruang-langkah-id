import type { ReactNode } from "react";
import { Container } from "./Container";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-950 text-sand-50">
      <div className="topo-pattern absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <p className="text-xs font-semibold tracking-[0.18em] text-moss-300 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-pretty text-forest-100">
          {description}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
