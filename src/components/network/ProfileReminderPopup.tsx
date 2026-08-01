import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { useMyProfile } from '@/hooks/useRoleProfile';

const MESSAGE = 'Improve your profile to get discovered faster.';
const TYPE_SPEED_MS = 35;      // ms per character
const AUTO_CLOSE_MS = 10000;   // auto-dismiss after 10s
const SESSION_KEY = 'profile-reminder-shown';

export function ProfileReminderPopup() {
  const { data: profile, isLoading } = useMyProfile();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Decide whether to show the popup once profile data has loaded
  useEffect(() => {
    if (isLoading || !profile) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const p = profile as any;
    const incomplete = !p.bio || !p.avatar_url;
    if (!incomplete) return;

    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(true);
  }, [profile, isLoading]);

  // Typewriter effect
  useEffect(() => {
    if (!visible) return;

    let i = 0;
    typeTimerRef.current = setInterval(() => {
      i += 1;
      setTypedText(MESSAGE.slice(0, i));
      if (i >= MESSAGE.length && typeTimerRef.current) {
        clearInterval(typeTimerRef.current);
      }
    }, TYPE_SPEED_MS);

    closeTimerRef.current = setTimeout(() => setVisible(false), AUTO_CLOSE_MS);

    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-16 right-8 md:right-16 z-[60] w-[92%] max-w-[340px] animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Pointer tail — aims up at the profile avatar */}
      <div className="absolute -top-[7px] right-6 h-3 w-3 rotate-45 bg-white border-l border-t border-gray-200" />

      <div className="relative flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)]">

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-[13px] font-semibold text-gray-900 leading-snug min-h-[18px]">
            {typedText}
            <span className="inline-block w-[2px] h-[13px] bg-gray-900 ml-0.5 align-middle animate-pulse" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}