import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  getInvestmentApplicationStatus,
  applyForInvestment,
  type InvestmentApplicationAnswers,
} from '@/api/profiles';
import investmentImg from '@/assets/investment.jpeg';

const STEPS = [
  'Create and complete your profile',
  'Showcase your startup and vision',
  'Apply for investment opportunities',
];

const EMPTY_ANSWERS: InvestmentApplicationAnswers = {
  funding_stage: '',
  amount_seeking: '',
  investment_purpose: '',
  has_raised_previously: false,
  previous_funding_stage: '',
  previous_amount_raised: '',
  previous_investors: '',
  previous_investment_purpose: '',
};

// Wizard pages. "previous-details" only appears if the user answers "Yes"
// on the has-raised-before gate question.
type Page = 'current' | 'previous-gate' | 'previous-details' | 'review';

export function InvestmentCTACard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<Page>('current');
  const [answers, setAnswers] = useState<InvestmentApplicationAnswers>(EMPTY_ANSWERS);

  const { data } = useQuery({
    queryKey: ['investment-application-status', user?.id],
    queryFn: getInvestmentApplicationStatus,
    enabled: !!user,
    staleTime: 60_000,
  });

  const applyMutation = useMutation({
    mutationFn: (payload: InvestmentApplicationAnswers) => applyForInvestment(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(['investment-application-status', user?.id], res);
      toast({ title: 'Application submitted', description: "We'll be in touch once it's reviewed." });
      setOpen(false);
    },
    onError: () => {
      toast({ title: 'Something went wrong', description: 'Please try again in a moment.', variant: 'destructive' });
    },
  });

  if (!user) return null;
  const hasApplied = data?.has_applied;

  function set<K extends keyof InvestmentApplicationAnswers>(key: K, value: InvestmentApplicationAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function openWizard() {
    setAnswers(EMPTY_ANSWERS);
    setPage('current');
    setOpen(true);
  }

  function goNextFromCurrent() {
    setPage('previous-gate');
  }

  function goNextFromGate() {
    setPage(answers.has_raised_previously ? 'previous-details' : 'review');
  }

  function goBack() {
    if (page === 'previous-gate') setPage('current');
    else if (page === 'previous-details') setPage('previous-gate');
    else if (page === 'review') setPage(answers.has_raised_previously ? 'previous-details' : 'previous-gate');
  }

  const currentValid =
    answers.funding_stage.trim() !== '' &&
    answers.amount_seeking.trim() !== '' &&
    answers.investment_purpose.trim() !== '';

  const previousDetailsValid =
    (answers.previous_funding_stage ?? '').trim() !== '' &&
    (answers.previous_amount_raised ?? '').trim() !== '' &&
    (answers.previous_investors ?? '').trim() !== '' &&
    (answers.previous_investment_purpose ?? '').trim() !== '';

  function handleSubmit() {
    applyMutation.mutate(answers);
  }

  return (
    <>
      <Card className="relative overflow-hidden bg-card border-border/40 rounded-2xl shadow-sm p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              Are you looking for investment?
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Connect with investors and grow your startup.
            </p>
          </div>
          <img src={investmentImg} alt="" className="h-14 w-14 object-contain shrink-0 -mt-1" />
        </div>

        <div className="mt-3 rounded-xl border border-border/50 bg-muted/30 p-3">
          <p className="text-xs font-semibold text-foreground mb-2.5">3 Steps to Get Started</p>
          <ol className="space-y-2.5">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-xs text-foreground leading-snug pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          <button
            onClick={openWizard}
            disabled={hasApplied}
            className="mt-3 w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {hasApplied ? (
              <>
                <Check className="h-4 w-4" /> Applied
              </>
            ) : (
              <>
                Apply Now <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {page === 'current' && 'Tell us about the raise'}
              {page === 'previous-gate' && 'Fundraising history'}
              {page === 'previous-details' && 'Your previous round'}
              {page === 'review' && 'Ready to submit'}
            </DialogTitle>
          </DialogHeader>

          {/* Page 1 — always shown: current raise questions */}
          {page === 'current' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>What stage of funding are you currently raising?</Label>
                <Input
                  placeholder="e.g. Pre-seed, Seed, Series A"
                  value={answers.funding_stage}
                  onChange={(e) => set('funding_stage', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>How much investment are you looking to raise?</Label>
                <Input
                  placeholder="e.g. $250,000"
                  value={answers.amount_seeking}
                  onChange={(e) => set('amount_seeking', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>What is the primary purpose of this investment?</Label>
                <Textarea
                  placeholder="e.g. Product development, hiring, market expansion"
                  value={answers.investment_purpose}
                  onChange={(e) => set('investment_purpose', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Page 2 — gate question */}
          {page === 'previous-gate' && (
            <div className="space-y-3">
              <Label>Have you raised investment previously?</Label>
              <RadioGroup
                value={answers.has_raised_previously ? 'yes' : 'no'}
                onValueChange={(v) => set('has_raised_previously', v === 'yes')}
                className="gap-3"
              >
                <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5 cursor-pointer hover:bg-muted/40">
                  <RadioGroupItem value="yes" id="raised-yes" />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5 cursor-pointer hover:bg-muted/40">
                  <RadioGroupItem value="no" id="raised-no" />
                  <span className="text-sm">No</span>
                </label>
              </RadioGroup>
            </div>
          )}

          {/* Page 3 — only shown if the gate question above was answered "Yes" */}
          {page === 'previous-details' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>What was your previous funding stage?</Label>
                <Input
                  placeholder="e.g. Pre-seed"
                  value={answers.previous_funding_stage}
                  onChange={(e) => set('previous_funding_stage', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>How much did you raise?</Label>
                <Input
                  placeholder="e.g. $50,000"
                  value={answers.previous_amount_raised}
                  onChange={(e) => set('previous_amount_raised', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Who invested in your startup?</Label>
                <Input
                  placeholder="e.g. Angel investors, Y Combinator"
                  value={answers.previous_investors}
                  onChange={(e) => set('previous_investors', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>What was the primary purpose of the previous investment?</Label>
                <Textarea
                  placeholder="e.g. Building the MVP"
                  value={answers.previous_investment_purpose}
                  onChange={(e) => set('previous_investment_purpose', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Page 4 — final review before submit; only reached after all required answers are in */}
          {page === 'review' && (
            <p className="text-sm text-muted-foreground">
              You're all set. Submit your application and we'll match you with relevant investors.
            </p>
          )}

          <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
            {page !== 'current' ? (
              <Button type="button" variant="ghost" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
            ) : (
              <span />
            )}

            {page === 'current' && (
              <Button type="button" onClick={goNextFromCurrent} disabled={!currentValid}>
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}

            {page === 'previous-gate' && (
              <Button type="button" onClick={goNextFromGate}>
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}

            {page === 'previous-details' && (
              <Button type="button" onClick={() => setPage('review')} disabled={!previousDetailsValid}>
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}

            {page === 'review' && (
              <Button type="button" onClick={handleSubmit} disabled={applyMutation.isPending}>
                {applyMutation.isPending ? 'Submitting...' : 'Apply Now'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}