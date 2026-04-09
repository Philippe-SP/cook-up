// src/components/Layout.tsx

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userInitials: string;
}

export default function Layout({ children, activeTab, setActiveTab, userInitials }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-start sm:py-8">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border-x border-slate-100">
        
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-orange-100 px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-800">
              Cook<span className="text-orange-500">'</span>UP
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-none">L'atelier culinaire</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200">
            {userInitials}
          </div>
        </header>

        {/* CONTENU DYNAMIQUE */}
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
          {children}
        </main>

        {/* NAVIGATION BAR */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-50">
          <nav className="bg-slate-900 rounded-[2rem] p-2 shadow-2xl flex justify-between items-center border border-white/10">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex-1 py-3 rounded-2xl flex flex-col items-center transition-all ${activeTab === 'home' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}
            >
              <span className="text-xl">📖</span>
              <span className="text-[10px] font-bold mt-1 uppercase">Recettes</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('add')}
              className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-all ${activeTab === 'add' ? 'bg-orange-500 text-white translate-y-[-4px]' : 'bg-white text-slate-900'}`}
            >
              ＋
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 rounded-2xl flex flex-col items-center transition-all ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}
            >
              <span className="text-xl">🛒</span>
              <span className="text-[10px] font-bold mt-1 uppercase">Courses</span>
            </button>
          </nav>
        </div>

      </div>
    </div>
  );
}