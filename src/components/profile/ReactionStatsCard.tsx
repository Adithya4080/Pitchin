import { Flame, Heart, Rocket, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReactionStatsCardProps {
  stats: {
    fire: number;
    love: number;
    rocket: number;
    lightbulb: number;
    total: number;
  } | null | undefined;
}

export function ReactionStatsCard({ stats }: ReactionStatsCardProps) {
  if (!stats || stats.total === 0) return null;

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">
          Reactions Received
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center p-4 rounded-lg bg-orange-500/10">
            <Flame className="h-6 w-6 text-orange-500 mb-1.5" />
            <span className="font-bold text-lg text-foreground">{stats.fire}</span>
            <span className="text-sm text-muted-foreground">Fire</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-pink-500/10">
            <Heart className="h-6 w-6 text-pink-500 mb-1.5" />
            <span className="font-bold text-lg text-foreground">{stats.love}</span>
            <span className="text-sm text-muted-foreground">Love</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-blue-500/10">
            <Rocket className="h-6 w-6 text-blue-500 mb-1.5" />
            <span className="font-bold text-lg text-foreground">{stats.rocket}</span>
            <span className="text-sm text-muted-foreground">Rocket</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-yellow-500/10">
            <Lightbulb className="h-6 w-6 text-yellow-500 mb-1.5" />
            <span className="font-bold text-lg text-foreground">{stats.lightbulb}</span>
            <span className="text-sm text-muted-foreground">Ideas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
