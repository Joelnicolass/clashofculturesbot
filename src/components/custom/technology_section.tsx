import { Tech } from "@/hooks/use_advance_tech";
import { TechnologicalRootType } from "@/utils/enums";
import { GlassCard } from "./glass_card";
import { BookOpen } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "../ui/badge";
import { isEmpty } from "@/utils/functions";

export const TechnologySection = ({
  techCompleteGraph,
}: {
  techCompleteGraph: Record<TechnologicalRootType, Tech[]>;
}) => {
  return (
    <GlassCard>
      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2 pb-2">
        <BookOpen className="w-4 h-4 text-cyan-300" />
        Tecnologías Desbloqueadas
      </h3>
      <Separator className="bg-white/20 mb-4 border-none h-px" />

      {isEmpty(techCompleteGraph) ? (
        <p className="text-white/60 text-sm">
          No hay tecnologías desbloqueadas.
        </p>
      ) : null}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(techCompleteGraph)
          .filter(([, techs]) => techs.length > 0)
          .map(([category, techs]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-bold text-white/80 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-300 rounded-full" />
                {category}
              </h4>
              <div className="flex flex-wrap gap-1 ml-4">
                {techs.map((tech) => (
                  <Badge
                    key={tech.name}
                    className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
      </div>
    </GlassCard>
  );
};
