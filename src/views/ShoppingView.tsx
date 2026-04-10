import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../logic/supabase';
import type { AggregatedItem, ShoppingEntry, Ingredient, SupabaseError } from "../logic/types";

export default function ShoppingView() {
  const [items, setItems] = useState<AggregatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShoppingList = useCallback(async () => {
    try {
        const { data, error } = await supabase
        .from('shopping_list')
        .select(`
            id,
            servings_to_buy,
            recipes (servings, ingredients)
        `) as { data: ShoppingEntry[] | null; error: SupabaseError | null };

        if (error) throw error;

        if (data) {
        const aggregated: Record<string, AggregatedItem> = {};

        data.forEach((entry) => {
            const recipe = Array.isArray(entry.recipes) ? entry.recipes[0] : entry.recipes;
            if (!recipe || !recipe.ingredients) return;

            const ratio = entry.servings_to_buy / (recipe.servings || 1);

            recipe.ingredients.forEach((ing: Ingredient) => {
            // 1. La clé reste le nom de l'ingrédient (ex: "farine")
            const key = ing.name.toLowerCase().trim();
            const unit = (ing.unit || "").toUpperCase().trim();
            const quantity = (Number(ing.quantity) || 0) * ratio;

            if (!aggregated[key]) {
                aggregated[key] = { name: ing.name, amounts: [] };
            }

            // 2. On regarde si on a déjà cet ingrédient avec la MÊME unité
            const existing = aggregated[key].amounts.find(
                (a) => a.unit.toUpperCase().trim() === unit
            );

            if (existing) {
                // SOMME MATHÉMATIQUE : on ajoute la quantité au lieu de créer une nouvelle ligne
                if (existing.val !== null) {
                existing.val += quantity;
                }
            } else {
                // Premier passage pour cette unité
                aggregated[key].amounts.push({ val: quantity, unit: unit });
            }
            });
        });
        setItems(Object.values(aggregated));
        }
    } catch (err) {
        const error = err as SupabaseError;
        console.error("Erreur:", error.message);
    } finally {
        setLoading(false);
    }
    }, []);

  useEffect(() => {
    fetchShoppingList();
  }, [fetchShoppingList]);

  const handleClearList = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('shopping_list').delete().eq('user_id', user.id);
      if (!error) setItems([]);
    }
  };

  if (loading) return <div className="p-10 text-center italic text-slate-400 font-bold animate-pulse">Calcul du panier...</div>;

  return (
    <div className="space-y-6 animate-in fade-in pb-24 px-2">
      <h2 className="text-3xl font-black text-slate-800">Ma Liste de <span className="text-orange-500">Courses</span></h2>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center py-20 text-slate-400 font-bold italic">Ton panier est vide.</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <input type="checkbox" className="h-6 w-6 rounded-lg text-orange-500 border-slate-200 focus:ring-orange-500" />
              <div className="flex-1">
                <p className="font-bold text-slate-800 capitalize">{item.name}</p>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                  {item.amounts.map((a, i) => (
                    <span key={i}>
                      {Math.round((a.val || 0) * 10) / 10} {a.unit}
                      {i < item.amounts.length - 1 ? ' + ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <button onClick={handleClearList} className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-[0.2em]">
          🗑️ Vider ma liste
        </button>
      )}
    </div>
  );
}