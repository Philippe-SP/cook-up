// src/components/RecipeCard.tsx
import type { Recipe } from '../logic/types';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Logique pour l'emoji par défaut si non spécifié (à peaufiner plus tard)
  const defaultEmoji = recipe.category === 'Dessert' ? '🍰' : recipe.category === 'Plat' ? '🥘' : '🥗';

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-slate-100 border border-slate-50 flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
      <div className="h-20 w-20 rounded-2xl bg-orange-50 flex-shrink-0 flex items-center justify-center text-3xl shadow-inner">
        {defaultEmoji}
      </div>
      
      <div className="flex-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
          {recipe.category}
        </span>
        <h4 className="font-bold text-slate-800 text-lg leading-tight mb-2">
          {recipe.title}
        </h4>
        <div className="flex gap-4">
          <span className="text-xs font-bold text-slate-400">⏱️ {recipe.prep_time}m</span>
          <span className="text-xs font-bold text-slate-400">👥 {recipe.servings}p</span>
        </div>
      </div>
      
      <button className="text-2xl pr-2" onClick={(e) => {
        e.stopPropagation(); // Évite d'ouvrir la recette quand on clique juste sur le coeur
        // Logique favorite ici plus tard
      }}>
        {recipe.is_favorite ? '🧡' : '🤍'}
      </button>
    </div>
  );
}