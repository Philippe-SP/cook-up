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
  steps: string[];
  servings: number;
  ingredients: { name: string; amount: string }[];
}

interface RecipeDetailViewProps {
  recipeId: string;
  onBack: () => void;
}

export default function RecipeDetailView({ recipeId, onBack }: RecipeDetailViewProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // --- ACTIONS ---

  const toggleFavorite = async () => {
    if (!recipe) return;
    const { error } = await supabase
      .from('recipes')
      .update({ is_favorite: !recipe.is_favorite })
      .eq('id', recipeId);

    if (error) alert(error.message);
    else setRecipe({ ...recipe, is_favorite: !recipe.is_favorite });
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);

    if (error) {
      alert(error.message);
    } else {
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  // --- RENDU ---

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="h-12 w-12 bg-slate-100 rounded-full mb-4" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lecture de la pépite...</p>
    </div>
  );

  if (!recipe) return <div className="p-10 text-center text-slate-500">Oups, pépite introuvable.</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-24">
      
      {/* HEADER : Retour + Titre */}
      <div className="flex items-start gap-4 px-2">
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

      {/* CARTE RÉSUMÉ */}
      <div className={`${recipe.bg_color || 'bg-slate-50'} p-6 rounded-[2.5rem] flex items-center justify-between shadow-inner relative mx-2`}>
        <div className="flex items-center gap-4">
            <span className="text-5xl">{recipe.emoji || '🥘'}</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prêt en</p>
              <p className="text-xl font-black text-slate-800">{recipe.prep_time} min</p>
            </div>
        </div>

        <div className="flex gap-2">
            <button 
              onClick={toggleFavorite}
              className="h-12 w-12 bg-white/50 rounded-2xl flex items-center justify-center text-xl active:scale-90 transition-all"
            >
              {recipe.is_favorite ? '🧡' : '🤍'}
            </button>
            
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="h-12 w-12 bg-white/30 rounded-2xl flex items-center justify-center text-lg hover:bg-red-100 hover:text-red-500 transition-colors active:scale-90"
            >
              🗑️
            </button>
        </div>
      </div>

      {/* SECTION MÉTHODE */}
      <div className="space-y-6 px-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">La Méthode</h3>
          <span className="text-[10px] font-bold text-slate-300">{recipe.steps?.length || 0} étapes</span>
        </div>
        
        <div className="space-y-8 relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />
          
          {recipe.steps?.map((step: string, index: number) => (
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

      {/* BOUTON CHRONO */}
      <div className="px-2">
        <button className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl active:scale-95 transition-all">
          👨‍🍳 Lancer le chrono
        </button>
      </div>

      {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2">
                🗑️
              </div>
              <h3 className="text-xl font-black text-slate-800">Supprimer la pépite ?</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Cette action est irréversible. Ta recette de <strong>{recipe.title}</strong> sera perdue à jamais.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl active:scale-95 transition-all text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}