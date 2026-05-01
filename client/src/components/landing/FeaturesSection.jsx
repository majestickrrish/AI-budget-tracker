import { FeatureCard, SectionContainer } from "./LandingUI";

const features = [
  {
    accent: "blue",
    title: "Smart Expense Tracking",
    description:
      "Automatically categorize every transaction in real time. Connect your accounts and watch your spending map itself — no manual entry needed.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
        <path d="M6 15h4"/>
      </svg>
    ),
  },
  {
    accent: "violet",
    title: "AI-Driven Insights",
    description:
      "Get plain-English explanations of your spending patterns. Our AI spots habits you can't see and tells you exactly where to cut back.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 2a5 5 0 0 1 5 5c0 2.4-1.5 4.4-3.7 5.3L12 22l-1.3-9.7A5 5 0 0 1 12 2z"/>
        <path d="M9 12.5a3 3 0 0 0 6 0"/>
      </svg>
    ),
  },
  {
    accent: "cyan",
    title: "Spending Predictions",
    description:
      "Know your likely spend before the month ends. Our model learns your patterns and predicts upcoming costs so you can adjust proactively.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    accent: "green",
    title: "Financial Health Score",
    description:
      "A live score from 0–100 that reflects your savings rate, debt ratio, emergency fund, and spending consistency. Track your progress weekly.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    accent: "amber",
    title: "Savings Goals",
    description:
      "Set goals for travel, emergency funds, or a new gadget. The AI allocates your budget and visualizes how fast you're moving toward each goal.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    accent: "rose",
    title: "Bill Reminders",
    description:
      "Never miss a payment again. Get smart reminders before every bill is due, and see your upcoming cash flow at a glance for the next 30 days.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="w-full py-16 bg-background scroll-mt-6">
      <SectionContainer>
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
            Everything you need
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-text-default tracking-tight">
            Built for people who take money seriously
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto leading-relaxed opacity-80">
            Six powerful features working together to give you total financial clarity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
