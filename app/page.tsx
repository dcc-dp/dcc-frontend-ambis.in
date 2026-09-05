import HermesAgentPlayground from './components/HermesAgentPlayground';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <header className="w-full max-w-4xl flex items-center justify-between pb-6 mb-6 border-b border-zinc-850">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight">Ambis.in</h1>
            <p className="text-xs text-zinc-400">AI Learning & Personal Productivity Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Core Agent Active</span>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col">
        <HermesAgentPlayground />
      </main>

      <footer className="w-full max-w-4xl text-center py-6 mt-8 border-t border-zinc-800 text-xs text-zinc-500">
        Ambis.in &copy; 2026 AI Hackfest (Productivity & Personal AI). Built with Next.js & FastAPI.
      </footer>
    </div>
  );
}
