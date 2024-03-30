import { ScrollArea } from "../../components/ui/scroll-area";
import { cn, fr } from "../../lib/utils";

export const StickySidebar = fr(function StickySidebar(
  { className, children, ...props },
  ref,
) {
  return (
    <aside ref={ref} className={cn("sticky", className)} {...props}>
      <ScrollArea className="h-full">{children}</ScrollArea>
    </aside>
  );
});
