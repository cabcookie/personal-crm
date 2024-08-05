import { Circle } from "lucide-react";
import { Badge } from "../ui/badge";

const HygieneIssueBadge = () => (
  <>
    <Circle className="mt-[0.2rem] w-4 min-w-4 h-4 md:hidden bg-orange-400 rounded-full text-destructive-foreground" />
    <Badge className="hidden md:block bg-orange-400">Hygiene</Badge>
  </>
);

export default HygieneIssueBadge;
