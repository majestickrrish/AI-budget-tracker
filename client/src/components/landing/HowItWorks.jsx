import { StepCard, SectionContainer } from "./LandingUI";

const steps = [
  {
    number: 1,
    title: "Create Your Account",
    description: "Sign up in under 60 seconds. No credit card, no commitment. Just your email.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    number: 2,
    title: "Set Your Budget",
    description: "Tell us your income and spending limits. The AI handles the math and sets realistic targets.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M9 9h6M9 12h4M9 15h2"/>
      </svg>
    ),
  },
  {
    number: 3,
    title: "Track Every Expense",
    description: "Connect your bank or add expenses manually. Everything auto-categorizes in seconds.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 20V10M6 20V4M18 20v-4"/>
      </svg>
    ),
  },
  {
    number: 4,
    title: "Get Smart Insights",
    description: "Receive weekly AI reports, spending alerts, and personalized advice to grow your savings.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l2.5 2.5"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="w-full bg-slate-50 dark:bg-slate-900/50 py-20 border-y border-slate-100 dark:border-slate-800">
      <SectionContainer>
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            Simple process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Up and running in minutes
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Four steps to transform how you think about money.
          </p>
        </div>

        {/* Desktop: horizontal steps with connectors */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-7 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 dark:from-blue-800 dark:via-cyan-800 dark:to-blue-800" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
