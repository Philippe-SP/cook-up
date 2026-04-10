import { useEffect, useState } from 'react';
import { supabase } from '../logic/supabase';

// 1. On définit la structure exacte d'une recette
interface Recipe {
  id: string;
  title: string;
  category: string;
  prep_time: number;
  emoji: string;
  bg_color: string;
  is_favorite: boolean;
  steps: string[]; // C'est un tableau de textes
  user_id: string;
}

interface RecipeDetailViewProps {
  recipeId: string;
  onBack: () => void;
}

export default function RecipeDetailView({ recipeId, onBack }: RecipeDetailViewProps) {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fonction de suppression de la recette
  const deleteRecipe = async () => {
    if (!window.confirm("Supprimer cette pépite ? Cette action est irréversible.")) return;
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);

    if (error) alert(error.message);
    else onBack(); // On revient à la liste après suppression
  };

  // Fonction d'ajout aux favoris
  const toggleFavorite = async () => {
    const { error } = await supabase
      .from('recipes')
      .update({ is_favorite: !recipe.is_favorite })
      .eq('id', recipeId);

    if (error) alert(error.message);
    else setRecipe({ ...recipe, is_favorite: !recipe.is_favorite }); // Update local pour l'UI
  };

  useEffect(() => {
    async function getRecipe() {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();
      
      setRecipe(data);
      setLoading(false);
    }
    getRecipe();
  }, [recipeId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="h-12 w-12 bg-slate-100 rounded-full mb-4" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lecture de la pépite...</p>
    </div>
  );

  if (!recipe) return <div className="p-10 text-center">Oups, recette introuvable.</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-24">
      
      {/* HEADER : Retour + Titre */}
      <div className="flex items-start gap-4">
        <button 
          onClick={onBack} 
          className="h-12 w-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-xl active:scale-90 transition-all"
        >
          ←
        </button>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-1">
             <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${recipe.bg_color || 'bg-slate-100'} text-slate-600`}>
                {recipe.category}
             </span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 leading-tight">
            {recipe.title}
          </h2>
        </div>
      </div>

      <div className={`${recipe.bg_color || 'bg-slate-50'} p-6 rounded-[2.5rem] flex items-center justify-between shadow-inner relative`}>
        <div className="flex items-center gap-4">
            <span className="text-5xl">{recipe.emoji || '🥘'}</span>
            <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temps total</p>
            <p className="text-xl font-black text-slate-800">{recipe.prep_time} min</p>
            </div>
        </div>

        <div className="flex gap-2">
            {/* Bouton Favori */}
            <button 
            onClick={toggleFavorite}
            className="h-12 w-12 bg-white/50 rounded-2xl flex items-center justify-center text-xl active:scale-90 transition-all"
            >
            {recipe.is_favorite ? '🧡' : '🤍'}
            </button>
            
            {/* Bouton Supprimer */}
            <button 
            onClick={deleteRecipe}
            className="h-12 w-12 bg-white/30 rounded-2xl flex items-center justify-center text-lg hover:bg-red-100 hover:text-red-500 transition-colors active:scale-90"
            >
            🗑️
            </button>
        </div>
      </div>

      {/* SECTION ÉTAPES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">La Méthode</h3>
          <span className="text-[10px] font-bold text-slate-300">{recipe.steps?.length || 0} étapes</span>
        </div>
        
        <div className="space-y-8 relative">
          {/* Ligne verticale de liaison */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />
          
          {recipe.steps && recipe.steps.map((step: string, index: number) => (
            <div key={index} className="flex gap-5 group">
              <div className="h-10 w-10 rounded-2xl bg-white border-2 border-slate-50 shadow-sm text-slate-800 flex items-center justify-center text-sm font-black flex-shrink-0 group-hover:border-orange-200 transition-colors">
                {index + 1}
              </div>
              <div className="pt-1.5 flex-1">
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOUTON D'ACTION (Optionnel) */}
      <button className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl active:scale-95 transition-all">
        👨‍🍳 Lancer le chrono
      </button>
    </div>
  );
}