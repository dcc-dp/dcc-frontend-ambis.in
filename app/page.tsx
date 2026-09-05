import HermesAgentPlayground from './components/HermesAgentPlayground';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start">
      {/* Mobile-First Header Bar */}
      <header className="w-full max-w-2xl px-4 py-3.5 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight leading-none">
              Ambis.in
            </h1>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
              Tutor AI SMP Kelas VII
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Kak Ambis Siap</span>
        </div>
      </header>

      {/* Main Interactive Playground */}
      <main className="w-full max-w-2xl flex-1 flex flex-col pt-3">
        <HermesAgentPlayground />
      </main>
    </div>
  );
}
