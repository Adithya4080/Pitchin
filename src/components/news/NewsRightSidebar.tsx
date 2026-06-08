import { useState } from 'react';
import { X, Sun, CloudSun, Bitcoin, TrendingDown, TrendingUp } from 'lucide-react';
import { INTEREST_TOPICS } from '@/data/newsItems';
import { cn } from '@/lib/utils';

export function NewsRightSidebar() {
  const [selected, setSelected] = useState<string[]>([]);
  const [showInterests, setShowInterests] = useState(true);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label],
    );
  };

  return (
    <aside className="w-[300px] shrink-0 space-y-4">
      {/* Make it yours */}
      {showInterests && (
        <div className="bg-card rounded-2xl border border-border/60 p-5 relative">
          <button
            onClick={() => setShowInterests(false)}
            className="absolute top-4 right-4 text-foreground/40 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <h3 className="text-base font-semibold mb-1">Make it yours</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Select topics and interests to customize your news feed.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {INTEREST_TOPICS.map((t) => {
              const active = selected.includes(t.label);
              return (
                <button
                  key={t.label}
                  onClick={() => toggle(t.label)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 h-9 rounded-full border text-xs font-medium transition-colors',
                    active
                      ? 'bg-sky-50 border-sky-300 text-sky-600'
                      : 'bg-background border-border hover:border-foreground/30',
                  )}
                >
                  <span className="text-sm">{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
          <button className="w-full h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors">
            Save Interests
          </button>
        </div>
      )}

      {/* Weather */}
      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-400" />
            <span className="text-2xl font-semibold">26°C</span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Sunny</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Colombo, LK</span>
          <span>H: 29° L: 21°</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center">
          {[
            { d: 'Wed', t: '26°', icon: Sun },
            { d: 'Thu', t: '27°', icon: Sun },
            { d: 'Fri', t: '28°', icon: Sun },
            { d: 'Sat', t: '26°', icon: Sun },
            { d: 'Sun', t: '25°', icon: CloudSun },
          ].map((day) => (
            <div key={day.d} className="flex flex-col items-center gap-1">
              <day.icon className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium">{day.t}</span>
              <span className="text-[10px] text-muted-foreground">{day.d}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-xs font-medium text-sky-500 hover:text-sky-600 text-left">
          View full forecast ›
        </button>
      </div>

      {/* Market Overview */}
      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Market Overview</h3>
          <button className="text-xs font-medium text-sky-500 hover:text-sky-600">See all</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MarketCard name="S&P 500" symbol="^SPX" change={-0.62} delta="-48.71" value="4,604.63" />
          <MarketCard
            name="NASDAQ"
            symbol="^IXIC"
            change={-1.16}
            delta="-266.39"
            value="13,887.35"
          />
        </div>
      </div>

      {/* Crypto Overview */}
      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Crypto Overview</h3>
          <button className="text-xs font-medium text-sky-500 hover:text-sky-600">See all</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
              <Bitcoin className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Bitcoin</p>
              <p className="text-xs text-muted-foreground">BTC</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">$67,342.18</p>
            <p className="text-xs text-emerald-500 inline-flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +1.35%
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MarketCard({
  name,
  symbol,
  change,
  delta,
  value,
}: {
  name: string;
  symbol: string;
  change: number;
  delta: string;
  value: string;
}) {
  const negative = change < 0;
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold">{name}</span>
        <span
          className={cn(
            'text-[10px] font-medium inline-flex items-center gap-0.5',
            negative ? 'text-rose-500' : 'text-emerald-500',
          )}
        >
          {negative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
          {change}%
        </span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
        <span>{symbol}</span>
        <span className={negative ? 'text-rose-500' : 'text-emerald-500'}>{delta}</span>
      </div>
      <svg viewBox="0 0 100 30" className="w-full h-8">
        <polyline
          fill="none"
          stroke={negative ? 'hsl(346 77% 60%)' : 'hsl(142 71% 45%)'}
          strokeWidth="1.5"
          points="0,5 15,10 30,8 45,15 60,12 75,20 100,25"
        />
      </svg>
      <p className="text-sm font-semibold mt-1">{value}</p>
    </div>
  );
}
