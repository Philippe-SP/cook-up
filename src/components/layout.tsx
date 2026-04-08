// src/components/Layout.tsx
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20"> {/* pb-20 pour ne pas cacher le contenu derrière la barre du bas */}
      
      {/* Header fixe en haut */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            C
          </div>
        </div>
      </header>

      {/* Contenu de la page */}
      <main className="flex-1 max-w-md mx-auto w-full p-4">
        {children}
      </main>

      {/* Tab Bar fixe en bas (style iOS/Android) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex justify-around items-center h-16 z-20">
        <button className="flex flex-col items-center text-orange-600">
          <span className="text-xl">📚</span>
          <span className="text-[10px] font-medium">Recettes</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-xl">➕</span>
          <span className="text-[10px] font-medium">Ajouter</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-medium">Réglages</span>
        </button>
      </nav>
    </div>
  );
}