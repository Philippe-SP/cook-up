import { useEffect, useState } from 'react';
import { supabase } from '../logic/supabase';
import type { Recipe, RecipeDetailViewProps, Ingredient } from '../logic/types';

export default function RecipeDetailView({ recipeId, onBack }: RecipeDetailViewProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [displayServings, setDisplayServings] = useState(2);

  useEffect(() => {
    async function getRecipe() {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();
      
      if (data) {
        setRecipe(data);
        setDisplayServings(data.servings || 2);
      }
      setLoading(false);
    }
    getRecipe();
  }, [recipeId]);

  // Nouvelle fonction de calcul simplifiée car on a des nombres
  const getAdjustedQuantity = (ing: Ingredient) => {
    if (!recipe) return 0;
    const ratio = displayServings / (recipe.servings || 1);
    const adjusted = ing.quantity * ratio;
    // Arrondi à 1 décimale max (ex: 2.3)
    return Math.round(adjusted * 10) / 10;
  };

  const toggleFavorite = async () => {
    if (!recipe) return;
    const { error } = await supabase
      .from('recipes')
      .update({ is_favorite: !recipe.is_favorite })
      .eq('id', recipeId);

    if (error) alert(error.message);
    else setRecipe({ ...recipe, is_favorite: !recipe.is_favorite });
  };

  const addToShoppingList = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('shopping_list')
      .upsert({
        user_id: user.id,
        recipe_id: recipeId,
        servings_to_buy: displayServings
      }, { onConflict: 'user_id,recipe_id' });

    if (error) {
      console.error("Erreur panier:", error.message);
    } else {
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
    }
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);

    if (error) alert(error.message);
    else {
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="h-12 w-12 bg-slate-100 rounded-full mb-4" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lecture de la pépite...</p>
    </div>
  );

  if (!recipe) return <div className="p-10 text-center text-slate-500">Oups, pépite introuvable.</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-24 relative">
      
      {/* HEADER */}
      <div className="flex items-start gap-4 px-2">
        <button onClick={onBack} className="h-12 w-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-xl active:scale-90 transition-all text-slate-400">
          ←
        </button>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-1">
             <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${recipe.bg_color || 'bg-slate-100'} text-slate-600`}>
                {recipe.category}
             </span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 leading-tight">{recipe.title}</h2>
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
            <button onClick={toggleFavorite} className="h-12 w-12 bg-white/50 rounded-2xl flex items-center justify-center text-xl active:scale-90 transition-all">
              {recipe.is_favorite ? '🧡' : '🤍'}
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="h-12 w-12 bg-white/30 rounded-2xl flex items-center justify-center text-lg hover:bg-red-100 hover:text-red-500 transition-colors active:scale-90">
              🗑️
            </button>
        </div>
      </div>

      {/* INGRÉDIENTS (Mis à jour avec quantity et unit) */}
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between px-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100/50">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Ingrédients</h3>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
            <button onClick={() => setDisplayServings(Math.max(1, displayServings - 1))} className="text-orange-500 font-black px-1">-</button>
            <span className="text-xs font-black text-slate-800 min-w-[50px] text-center">{displayServings} pers.</span>
            <button onClick={() => setDisplayServings(displayServings + 1)} className="text-orange-500 font-black px-1">+</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {recipe.ingredients?.map((ing, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-white border border-slate-50 rounded-2xl shadow-sm mx-1">
              <span className="text-sm font-medium text-slate-600">{ing.name}</span>
              <span className="text-sm font-black text-orange-500">
                {getAdjustedQuantity(ing)} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MÉTHODE */}
      <div className="space-y-6 px-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2 text-left">La Méthode</h3>
        <div className="space-y-8 relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />
          {recipe.steps?.map((step: string, index: number) => (
            <div key={index} className="flex gap-5 group">
              <div className="h-10 w-10 rounded-2xl bg-white border-2 border-slate-50 shadow-sm text-slate-800 flex items-center justify-center text-sm font-black flex-shrink-0">
                {index + 1}
              </div>
              <div className="pt-1.5 flex-1">
                <p className="text-slate-600 text-sm leading-relaxed font-medium text-left">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOUTONS ACTIONS */}
      <div className="px-2 space-y-3">
        <button 
            onClick={addToShoppingList}
            className="w-full py-5 bg-orange-100 text-orange-600 font-black rounded-[2rem] border-2 border-orange-200 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
            <span className="text-xl">🛒</span> Ajouter aux courses
        </button>

        <button 
            className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
            <span className="text-xl">👨‍🍳</span> Lancer le chrono
        </button>
      </div>

      {/* MODALE DE SUCCÈS PANIER */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
            <div className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl text-center space-y-4 border border-slate-50">
            <div className="h-20 w-20 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center text-4xl mx-auto animate-bounce">🛒</div>
            <div>
                <h3 className="text-xl font-black text-slate-800">C'est dans le panier !</h3>
                <p className="text-slate-500 text-sm font-medium">Tes ingrédients ont été ajoutés.</p>
            </div>
            </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2">🗑️</div>
              <h3 className="text-xl font-black text-slate-800">Supprimer la pépite ?</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Cette action est irréversible.</p>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-sm">Annuler</button>
                <button onClick={confirmDelete} className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 text-sm">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}