import { SectionContainer } from "./LandingUI";

export default function CTASection() {
  return (
    <div className="w-full py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-t border-slate-100 dark:border-slate-800">
      <SectionContainer>
        <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl px-8 py-16 text-center overflow-hidden shadow-xl shadow-blue-200 dark:shadow-blue-900/40">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-4">
              Ready to start?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-snug">
              Start Managing Your Money<br className="hidden sm:block"/> Smarter Today
            </h2>
            <p className="text-blue-100 max-w-md mx-auto leading-relaxed mb-8">
              Join thousands of people who've already taken control of their finances with AI-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100 font-semibold px-8 py-3.5 rounded-xl transition-colors duration-150 shadow-md text-sm"
              >
                Create Free Account
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12H19M13 6l6 6-6 6"/>
                </svg>
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-blue-600/40 hover:bg-blue-600/60 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-150 border border-blue-400/30 text-sm"
              >
                See Features
              </a>
            </div>

            <p className="mt-6 text-blue-200 text-xs">
              Free forever plan available · No credit card required
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
