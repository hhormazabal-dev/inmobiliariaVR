import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variants = "primary" | "secondary" | "quiet";

type BaseProps = {
  variant?: Variants;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type ButtonAsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
    href: string;
  };

type Props = ButtonAsButton | ButtonAsAnchor;

const variantStyles: Record<Variants, string> = {
  primary: "bg-brand-navy text-white hover:shadow-lg",
  secondary: "bg-white text-brand-navy border border-brand-navy/15 hover:border-brand-navy/30 hover:bg-white/90",
  quiet: "text-brand-navy hover:opacity-80",
};

export default function Button(props: Props) {
  if (props.as === "a") {
    const { variant = "primary", className, children, href, ...rest } = props;
    const base =
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition";
    return (
      <a href={href} className={clsx(base, variantStyles[variant], className)} {...rest}>
        {children}
      </a>
    );
  }

  const { variant = "primary", className, children, ...rest } = props;
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition";
  return (
    <button className={clsx(base, variantStyles[variant], className)} {...rest}>
      {children}
    </button>
  );
}
