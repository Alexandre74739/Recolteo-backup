import Link from "next/link";
import { ArrowRight } from "@deemlol/next-icons";

type Variant =
  | "sapin"
  | "lime"
  | "peach"
  | "sapin-outline"
  | "lime-outline"
  | "peach-outline";

type Size = "sm" | "md";

interface ButtonProps {
  label: string;
  href: string;
  variant?: Variant;
  showArrow?: boolean;
  size?: Size;
}

export default function Button({
  label,
  href,
  variant,
  showArrow = true,
  size = "md",
}: ButtonProps) {
  const variantStyles =
    variant === "sapin"
      ? "bg-sapin text-cream hover:bg-sapin/90"
      : variant === "lime"
        ? "bg-lime text-sapin hover:bg-lime/80"
        : variant === "peach"
          ? "bg-peach text-cream hover:bg-peach/90"
          : variant === "sapin-outline"
            ? "border border-sapin text-sapin hover:bg-sapin hover:text-cream"
            : variant === "lime-outline"
              ? "border border-lime text-sapin hover:bg-lime"
              : "border border-peach text-peach hover:bg-peach hover:text-cream";

  const sizeStyles =
    size === "sm"
      ? "px-4 py-2 text-sm rounded-lg gap-2"
      : "px-7 py-3.5 rounded-xl gap-3";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center font-semibold transition-all active:scale-95 ${sizeStyles} ${variantStyles}`}
    >
      {label}
      {showArrow && (
        <ArrowRight
          size={size === "sm" ? 15 : 20}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}