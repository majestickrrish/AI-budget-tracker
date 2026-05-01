import { SectionContainer } from "./LandingUI";

const problems = [
  {
    emoji: "💸",
    title: "You lose track of where money goes",
    body: "Small purchases add up silently. By month-end you're wondering where your paycheck disappeared.",
    stat: "73% of people",
    statLabel: "don't know their monthly spend",
  },
  {
    emoji: "📉",
    title: "Overspending sneaks up on you",
    body: "Without real-time alerts, it's impossible to course-correct before it's too late.",
    stat: "68% overspend",
    statLabel: "their budget every month",
  },
  {
    emoji: "🌫️",
    title: "No clarity on your financial health",
    body: "Guessing whether you're on track for savings goals, retirement, or even next month's rent.",
    stat: "Only 28%",
    statLabel: "feel financially confident",
  },
];

export default function ProblemSection() {
  return (
    <div className="w-full bg-background py-16">
      <SectionContainer>
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4 opacity-60">
            Sound familiar?
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-text-default tracking-tight">
            Managing money is <span className="text-danger">harder than it should be</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto leading-relaxed opacity-80">
            Most people are flying blind with their finances. That ends today.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-card border border-border-default rounded-2xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl filter drop-shadow-sm">{p.emoji}</div>
              <h3 className="text-lg font-black text-text-default leading-tight">{p.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed opacity-80">{p.body}</p>
              <div className="pt-4 border-t border-border-default flex items-center gap-2">
                <span className="text-sm font-black text-danger">{p.stat}</span>{" "}
                <span className="text-[11px] font-bold text-text-secondary opacity-60 uppercase tracking-tighter">{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
