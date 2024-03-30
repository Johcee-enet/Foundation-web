import NextLink, { LinkProps } from "next/link";

import { cn, fr } from "../../lib/utils";

export const Link = fr<
  HTMLAnchorElement,
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
    } & React.RefAttributes<HTMLAnchorElement>
>(function Link({ className, children, ...props }, ref) {
  return (
    <NextLink
      ref={ref}
      className={cn(
        "cursor-pointer font-medium text-primary underline underline-offset-4 hover:no-underline",
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
});
