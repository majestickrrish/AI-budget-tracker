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
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 py-20 border-y border-slate-100 dark:border-slate-800">
      <SectionContainer>
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Sound familiar?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Managing money is <span className="text-red-400">harder than it should be</span>
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Most people are flying blind with their finances. That ends today.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-xl p-6 space-y-3 shadow-sm"
            >
              <div className="text-3xl">{p.emoji}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white leading-snug">{p.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.body}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm font-bold text-red-400">{p.stat}</span>{" "}
                <span className="text-xs text-slate-400 dark:text-slate-500">{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
