export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-gray-950/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
        </div>
        <h1 className="text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">
          LISA
        </h1>
      </div>
      <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
        System Online
      </div>
    </header>
  );
}