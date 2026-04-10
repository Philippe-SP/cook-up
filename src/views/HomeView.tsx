import { useEffect, useState } from 'react';
import { supabase } from '../logic/supabase';

interface Recipe {
  id: string;
  title: string;
  category: string;
  prep_time: number;
  emoji: string;
  bg_color: string;
  is_favorite: boolean;
}

// 1. On définit que HomeView attend une fonction "onSelectRecipe"
interface HomeViewProps {
  onSelectRecipe: (id: string) => void;
}

export default function HomeView({ onSelectRecipe }: HomeViewProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('id, title, category, prep_time, emoji, bg_color, is_favorite')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRecipes(data);
    } catch (error) {
      console.error("Erreur chargement recettes:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-10 text-slate-400 font-bold italic">Préparation de la liste...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Tes <span className="text-orange-500">Recettes</span></h2>
          <p className="text-slate-500 text-sm font-medium">{recipes.length} pépites enregistrées</p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center space-y-4">
          <span className="text-4xl">🍳</span>
          <p className="text-slate-400 font-bold">Aucune recette pour le moment. <br/>Appuie sur le ＋ pour commencer !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              // 2. AU CLIC : On appelle la fonction passée par le parent avec l'ID
              onClick={() => onSelectRecipe(recipe.id)}
              className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm flex items-center gap-4 active:scale-95 transition-all cursor-pointer hover:border-orange-200"
            >
              <div 
                className={`h-16 w-16 ${recipe.bg_color || 'bg-slate-50'} rounded-2xl flex items-center justify-center text-3xl shadow-inner`}
              >
                {recipe.emoji || '🥘'}
              </div>
              <div className="flex-1">
                <div className="flex flex-col items-end gap-2 pr-2">
                    <div className="text-slate-200 text-xl">›</div>
                    {recipe.is_favorite && (
                        <span className="text-sm animate-in zoom-in duration-300">🧡</span>
                    )}
                </div>
                <h3 className="font-bold text-slate-800">{recipe.title}</h3>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider mt-1">
                  <span className="text-orange-500">{recipe.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">⏱️ {recipe.prep_time} min</span>
                </div>
              </div>
              {/* Petit indicateur visuel pour dire que c'est cliquable */}
              <div className="text-slate-200 text-xl pr-2">›</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}