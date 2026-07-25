export default function Header() {
  return (
    <header className="flex items-center justify-center py-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></div>
        <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
          LISA
        </h1>
      </div>
    </header>
  );
}