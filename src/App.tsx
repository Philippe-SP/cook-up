import { useState } from 'react';
import type { Recipe } from './logic/types';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Gratin Dauphinois Fondant',
    category: 'Plat',
    prepTime: 45,
    servings: 4,
    isFavorite: true,
    ingredients: [],
    steps: []
  },
  {
    id: '2',
    title: 'Tarte aux Pommes Grand-Mère',
    category: 'Dessert',
    prepTime: 60,
    servings: 6,
    isFavorite: false,
    ingredients: [],
    steps: []
  },
  {
    id: '3',
    title: 'Salade César Croustillante',
    category: 'Entrée',
    prepTime: 15,
    servings: 2,
    isFavorite: false,
    ingredients: [],
    steps: []
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-start sm:py-8">
      
      {/* Container "Téléphone" */}
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
            CM
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
          
          <section className="mb-6">
            <h2 className="text-3xl font-extrabold text-slate-800 leading-tight">
              Bonjour,<br/> 
              <span className="text-orange-500">Qu'est-ce qu'on mijote ?</span>
            </h2>
          </section>

          {/* BARRE DE RECHERCHE */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-xl">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Rechercher une recette..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400 shadow-inner"
            />
          </div>

          {/* LISTE DES RECETTES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-bold text-slate-700">Mes Recettes</h3>
              <button className="text-xs font-bold text-orange-600 px-2 py-1 bg-orange-50 rounded-lg italic">Voir tout</button>
            </div>
            
            {MOCK_RECIPES.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-[2rem] p-4 shadow-xl shadow-slate-100 border border-slate-50 flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
                <div className="h-20 w-20 rounded-2xl bg-orange-50 flex-shrink-0 flex items-center justify-center text-3xl shadow-inner">
                  {recipe.category === 'Dessert' ? '🍰' : recipe.category === 'Plat' ? '🥘' : '🥗'}
                </div>
                
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                    {recipe.category}
                  </span>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight mb-2">
                    {recipe.title}
                  </h4>
                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-slate-400">⏱️ {recipe.prepTime}m</span>
                    <span className="text-xs font-bold text-slate-400">👥 {recipe.servings}p</span>
                  </div>
                </div>
                
                <button className="text-2xl pr-2">
                  {recipe.isFavorite ? '🧡' : '🤍'}
                </button>
              </div>
            ))}
          </div>
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
            
            <button className="bg-white text-slate-900 h-14 w-14 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform">
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