// src/views/HomeView.tsx
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../logic/types';

const MOCK_RECIPES: Recipe[] = [
  { id: '1', title: 'Gratin Dauphinois', category: 'Plat', prepTime: 45, servings: 4, isFavorite: true, ingredients: [], steps: [] },
  { id: '2', title: 'Tarte aux Pommes', category: 'Dessert', prepTime: 60, servings: 6, isFavorite: false, ingredients: [], steps: [] },
];

export default function HomeView() {
  return (
    <div className="space-y-6">
      <section className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800 leading-tight">
          Bonjour,<br/> 
          <span className="text-orange-500">Qu'est-ce qu'on mijote ?</span>
        </h2>
      </section>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-xl">🔍</span>
        </div>
        <input 
          type="text" 
          placeholder="Rechercher une recette..." 
          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400 shadow-inner outline-none"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-700">Mes Recettes</h3>
          <button className="text-xs font-bold text-orange-600 px-2 py-1 bg-orange-50 rounded-lg italic tracking-wide">Voir tout</button>
        </div>
        
        {MOCK_RECIPES.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}