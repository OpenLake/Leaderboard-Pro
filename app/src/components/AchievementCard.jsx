import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function AchievementCard({
  title,
  description,
  icon: Icon,
  color,
  bg,
  tiers,
  currentValue,
  unlockedTiers
}) {
  // Determine highest earned tier
  let achievedTierIndex = -1;
  let nextRequirement = tiers[0].requirement;
  let nextLabel = tiers[0].label;
  
  for (let i = 0; i < tiers.length; i++) {
    const tierUnlocked = unlockedTiers?.find(u => u.tier === tiers[i].name);
    // Note: We check actual value or unlocked table. We assume the parent component passes `currentValue`
    if (tierUnlocked || currentValue >= tiers[i].requirement) {
      achievedTierIndex = i;
      if (i + 1 < tiers.length) {
          nextRequirement = tiers[i+1].requirement;
          nextLabel = tiers[i+1].label;
      } else {
          nextRequirement = tiers[i].requirement; // Maxed out
          nextLabel = "Max Tier Earned";
      }
    } else {
      break;
    }
  }

  const isUnlocked = achievedTierIndex >= 0;
  const currentTier = isUnlocked ? tiers[achievedTierIndex] : null;
  const progressPercent = Math.min(100, Math.max(0, (currentValue / nextRequirement) * 100));

  // Determine badge colors based on highest tier
  const tierColors = {
    Bronze: "text-orange-600 bg-orange-600/10 border-orange-600/20",
    Silver: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    Gold: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.3)]",
    Platinum: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
  };

  const badgeStyle = isUnlocked ? tierColors[currentTier.name] : "text-gray-400 bg-gray-400/10 grayscale border-transparent";
  
  // Try to find the timestamp of the highest unlocked
  const currentUnlockedLog = isUnlocked ? unlockedTiers?.find(u => u.tier === currentTier.name) : null;
  const formattedDate = currentUnlockedLog?.earned_at ? new Date(currentUnlockedLog.earned_at).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
  }) : null;

  return (
    <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md border-muted",
        isUnlocked && "border-opacity-50"
    )}>
      {isUnlocked && (
        <div className={cn("absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl", bg)} />
      )}
      
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className={cn("p-3 rounded-xl border flex-shrink-0 transition-colors duration-500", badgeStyle)}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className={cn(isUnlocked ? color : "text-muted-foreground")}>
              {Math.floor(currentValue)} / {nextRequirement}
            </span>
            <span className="text-muted-foreground">{nextLabel}</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2 w-full bg-secondary" 
            indicatorClassName={cn(isUnlocked ? color.replace('text-', 'bg-') : "bg-muted-foreground")}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          {isUnlocked ? (
            <>
               <span className={cn("font-semibold px-2 py-0.5 rounded-full border", badgeStyle)}>
                  {currentTier.name}
               </span>
               <span className="text-muted-foreground text-opacity-75">
                  {formattedDate ? `Earned ${formattedDate}` : "Earned recently"}
               </span>
            </>
          ) : (
            <span className="text-muted-foreground italic">Locked</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
