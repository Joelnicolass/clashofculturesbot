import { Dices } from "lucide-react";
import { GlassCard } from "./glass_card";
import { Separator } from "@radix-ui/react-separator";

export const HeaderSection = ({
  title,
  turnCount,
}: {
  title: string;
  turnCount: number;
}) => {
  return (
    <GlassCard>
      <div className="flex items-center justify-center gap-3">
        <Dices className="w-8 h-8 text-blue-400" />
        <Separator className="mx-2 bg-white/20 w-px h-6" />
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-white/60 text-sm">Turno #{turnCount}</p>
        </div>
      </div>
    </GlassCard>
  );
};
