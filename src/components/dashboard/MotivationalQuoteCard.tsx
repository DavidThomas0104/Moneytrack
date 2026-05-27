'use client';
import { Quote } from 'lucide-react';

const QUOTES = [
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "Do not save what is left after spending; instead spend what is left after saving.", author: "Warren Buffett" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
  { text: "It's not your salary that makes you rich, it's your spending habits.", author: "Charles A. Jaffe" },
  { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial.", author: "T.T. Munger" },
  { text: "Rich people have small TVs and big libraries. Poor people have small libraries and big TVs.", author: "Zig Ziglar" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
];

export default function MotivationalQuoteCard() {
  // Pick a quote based on the current day so it rotates daily
  const today = new Date().getDay();
  const quote = QUOTES[today % QUOTES.length];

  return (
    <div className="col-span-12 lg:col-span-4 rounded-lg p-8 flex flex-col justify-between relative overflow-hidden border border-white/5" style={{background: 'linear-gradient(225deg, rgba(163,116,255,0.1) 0%, rgba(21,18,27,0.5) 60%, rgba(21,18,27,0) 100%)'}}>
      {/* Background glow accent */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top: icon + label */}
      <div className="flex justify-between items-start relative z-10">
        <span className="p-3 bg-primary/10 text-primary rounded-xl">
          <Quote size={24} />
        </span>
        <span className="text-xs text-on-surface-variant font-bold px-3 py-1 bg-surface-container-high rounded-full tracking-wider uppercase">
          Daily Wisdom
        </span>
      </div>

      {/* Quote */}
      <div className="mt-8 flex-1 flex flex-col justify-center relative z-10">
        <p className="text-[10px] font-bold tracking-[0.18em] text-primary uppercase mb-4">
          Money Mindset
        </p>
        <blockquote className="text-on-surface font-medium text-lg leading-relaxed tracking-tight mb-5">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-on-surface-variant text-sm font-semibold">
          — {quote.author}
        </p>
      </div>

      {/* Bottom decorative dots */}
      <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-2 relative z-10">
        {QUOTES.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${i === today % QUOTES.length ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/15'}`}
          />
        ))}
      </div>
    </div>
  );
}
