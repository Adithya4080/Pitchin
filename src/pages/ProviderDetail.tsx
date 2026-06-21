import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, MapPin, ExternalLink, Mail } from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlaceholder } from '@/components/network/ImagePlaceholder';
import { useServiceProvider, useSendServiceInquiry } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ProviderDetail() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug && rawSlug !== 'undefined' ? rawSlug : undefined;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: provider, isLoading, isError } = useServiceProvider(slug);
  const sendInquiry = useSendServiceInquiry();

  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendInquiry = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!provider || !message.trim()) return;

    sendInquiry.mutate(
      { providerId: provider.id, message: message.trim() },
      {
        onSuccess: () => {
          setSent(true);
          setMessage('');
          toast({ title: 'Message sent', description: `Your inquiry was sent to ${provider.name}.` });
        },
        onError: () => {
          toast({
            title: 'Something went wrong',
            description: 'Could not send your inquiry. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (!slug) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div className="max-w-[860px] mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-foreground/60 text-sm mb-4">
            We couldn't find that provider — it may have been removed.
          </p>
          <Button asChild variant="outline" className="bg-white border-foreground/30">
            <Link to="/network/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div className="max-w-[860px] mx-auto px-4 md:px-6 py-8 space-y-4">
          <div className="h-8 w-40 bg-foreground/[0.05] rounded animate-pulse" />
          <div className="h-48 rounded-2xl bg-foreground/[0.04] animate-pulse" />
        </div>
      </AppLayout>
    );
  }

  if (isError || !provider) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div className="max-w-[860px] mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-foreground/60 text-sm mb-4">
            We couldn't find that provider — it may have been removed.
          </p>
          <Button asChild variant="outline" className="bg-white border-foreground/30">
            <Link to="/network/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showMobileHeader title={provider.name} showBottomNav>
      <div className="max-w-[860px] mx-auto px-4 md:px-6 py-5 md:py-8">
        <Link
          to={`/network/services?category=${provider.category_slug}`}
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </Link>

        {/* Header card */}
        <Card className="bg-white border-foreground/10 p-5 md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <ImagePlaceholder aspect="aspect-square" className="!w-16 !h-16 rounded-xl shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  {provider.name}
                </h1>
                {provider.is_verified && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[11px] font-medium gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-foreground/50 mt-0.5">{provider.category_name}</p>

              {provider.tagline && (
                <p className="text-sm text-foreground/70 mt-2">{provider.tagline}</p>
              )}

              <div className="flex items-center gap-4 flex-wrap mt-3 text-xs text-foreground/60">
                {Number(provider.rating) > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {provider.rating} <span className="text-foreground/40">({provider.review_count} reviews)</span>
                  </span>
                )}
                {provider.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {provider.location}
                  </span>
                )}
                {provider.starting_price && (
                  <span>
                    From <span className="font-medium text-foreground">${provider.starting_price}</span>
                    {provider.pricing_type === 'hourly' ? '/hr' : ''}
                  </span>
                )}
              </div>

              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground mt-3 hover:underline"
                >
                  Visit website <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* About */}
        {provider.description && (
          <Card className="bg-white border-foreground/10 p-5 md:p-7 mt-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
            <p className="text-sm text-foreground/70 whitespace-pre-line">{provider.description}</p>
          </Card>
        )}

        {/* Contact / Inquiry */}
        <Card className="bg-white border-foreground/10 p-5 md:p-7 mt-4">
          <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Mail className="h-4 w-4" /> Contact {provider.name}
          </h2>

          {sent ? (
            <p className="text-sm text-foreground/60 mt-3">
              Your message has been sent — they'll get back to you soon.
            </p>
          ) : (
            <>
              <p className="text-xs text-foreground/60 mb-3">
                Send a quick message describing what you need. They'll receive your inquiry directly.
              </p>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${provider.name}, I'm looking for help with...`}
                rows={4}
              />
              <Button
                className="mt-3"
                onClick={handleSendInquiry}
                disabled={!message.trim() || sendInquiry.isPending}
              >
                {sendInquiry.isPending ? 'Sending...' : user ? 'Send Inquiry' : 'Sign in to Contact'}
              </Button>
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}