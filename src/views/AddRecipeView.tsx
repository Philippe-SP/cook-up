// src/views/AddRecipeView.tsx
import { useState } from 'react';
import { supabase } from '../logic/supabase';

export default function AddRecipeView({ onSaveSuccess }: { onSaveSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plat');
  const [prepTime, setPrepTime] = useState(30);
  const [steps, setSteps] = useState<string[]>(['']); // Un tableau avec une étape vide par défaut

  // Ajouter une nouvelle ligne d'étape
  const addStep = () => setSteps([...steps, '']);

  // Modifier une étape précise
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    // On garde au moins une étape si on veut, ou on laisse vide
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.length > 0 ? newSteps : ['']); 
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Récupérer l'ID de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return alert("Tu dois être connecté !");

    const { error } = await supabase.from('recipes').insert([
      {
        title,
        category,
        prep_time: prepTime,
        steps: steps.filter(s => s.trim() !== ''), // On enlève les étapes vides
        user_id: user.id
      }
    ]);

    if (error) alert(error.message);
    else {
      alert("Recette enregistrée ! 🥘");
      // Ici on pourra rediriger vers l'accueil
    }

    if (error) alert(error.message);
    else {
        onSaveSuccess(); // On change d'onglet proprement
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">
        Nouvelle <span className="text-orange-500">Pépite</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        {/* INFOS DE BASE */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom de la recette..."
            className="w-full text-2xl font-bold border-none bg-transparent placeholder:text-slate-300 focus:ring-0 p-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['Entrée', 'Plat', 'Dessert', 'Apéro'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  category === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* TEMPS & PERSONNES */}
        <div className="bg-slate-50 p-4 rounded-[2rem] flex items-center justify-between">
          <span className="font-bold text-slate-700">⏱️ Temps (min)</span>
          <input 
            type="number" 
            className="w-20 bg-white border-none rounded-xl text-center font-bold text-orange-600 shadow-sm"
            value={prepTime}
            onChange={(e) => setPrepTime(parseInt(e.target.value))}
          />
        </div>

        {/* ÉTAPES DYNAMIQUES */}
        <div className="space-y-4">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Étapes de préparation</h3>
          {steps.map((step, index) => (
            <div key={index} className="relative group animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex gap-3">
                    <span className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black flex-shrink-0 text-xs mt-1">
                        {index + 1}
                    </span>
                
                    <div className="relative flex-1">
                        <textarea
                        placeholder="Décris l'étape..."
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-10 text-sm focus:ring-2 focus:ring-orange-500 transition-all resize-none shadow-inner"
                        rows={2}
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        />
                        
                        {/* BOUTON SUPPRIMER (La petite croix) */}
                        {steps.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors text-xs"
                        >
                            ✕
                        </button>
                        )}
                    </div>
                </div>
            </div>
            ))}
          <button
            type="button"
            onClick={addStep}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all"
          >
            ＋ Ajouter une étape
          </button>
        </div>

        {/* BOUTON VALIDATION */}
        <button
          type="submit"
          className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl active:scale-95 transition-all"
        >
          Enregistrer la recette
        </button>
      </form>
    </div>
  );
}