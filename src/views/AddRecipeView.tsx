import { useState } from 'react';
import { supabase } from '../logic/supabase';

export default function AddRecipeView({ onSaveSuccess }: { onSaveSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plat');
  const [prepTime, setPrepTime] = useState(30);
  const [steps, setSteps] = useState<string[]>(['']);
  const [emoji, setEmoji] = useState('🥘');
  const [bgColor, setBgColor] = useState('bg-orange-50');

  const COLORS = [
    { name: 'Orange', class: 'bg-orange-50' },
    { name: 'Vert', class: 'bg-emerald-50' },
    { name: 'Bleu', class: 'bg-sky-50' },
    { name: 'Rose', class: 'bg-rose-50' },
    { name: 'Violet', class: 'bg-violet-50' },
  ];

  const addStep = () => setSteps([...steps, '']);

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.length > 0 ? newSteps : ['']); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Tu dois être connecté !");

    const { error } = await supabase.from('recipes').insert([
      {
        title,
        category,
        prep_time: prepTime,
        steps: steps.filter(s => s.trim() !== ''),
        emoji, 
        bg_color: bgColor, 
        user_id: user.id
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      onSaveSuccess();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">
        Nouvelle <span className="text-orange-500">Pépite</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* SECTION EMOJI & COULEUR */}
        <div className="flex gap-6 items-center py-4 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
          <div className="relative group">
            <div className={`h-24 w-24 ${bgColor} rounded-[2rem] flex items-center justify-center shadow-inner border-4 border-white transition-all duration-500 active:scale-95`}>
              <input
                type="text"
                value={emoji}
                onChange={(e) => {
                  const val = e.target.value;
                  const emojiMatch = val.match(/\p{Emoji_Presentation}|\p{Emoji}\uFE0F/u);
                  if (emojiMatch) setEmoji(emojiMatch[0]);
                  else if (val === "") setEmoji("");
                }}
                className="w-full bg-transparent border-none text-center text-5xl focus:ring-0 cursor-pointer p-0 select-none"
              />
              <div className="absolute -top-2 -right-2 bg-white shadow-md rounded-full h-8 w-8 flex items-center justify-center border border-slate-100 pointer-events-none">
                <span className="text-xs">✏️</span>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg whitespace-nowrap">
              Modifier l'icône
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Couleur d'ambiance</p>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map(color => (
                <button
                  key={color.class}
                  type="button"
                  onClick={() => setBgColor(color.class)}
                  className={`h-8 w-8 rounded-full ${color.class} border-2 ${bgColor === color.class ? 'border-slate-800 scale-110' : 'border-white'} shadow-sm transition-all active:scale-90`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* INFOS DE BASE */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Nom de la recette..."
            className="w-full text-3xl font-black border-none bg-transparent placeholder:text-slate-200 focus:ring-0 p-0"
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
                className={`px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                  category === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* TEMPS */}
        <div className="bg-slate-50 p-5 rounded-[2rem] flex items-center justify-between border border-slate-100 shadow-inner">
          <span className="font-bold text-slate-600 flex items-center gap-2">⏱️ Temps global (min)</span>
          <input 
            type="number" 
            className="w-20 bg-white border-none rounded-xl text-center font-black text-orange-600 shadow-sm py-2"
            value={prepTime}
            onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* ÉTAPES DYNAMIQUES */}
        <div className="space-y-4">
          <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] ml-2">Méthode de préparation</h3>
          {steps.map((step, index) => (
            <div key={index} className="relative group animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex gap-4">
                <span className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black flex-shrink-0 text-sm mt-1">
                  {index + 1}
                </span>
                
                <div className="relative flex-1">
                  <textarea
                    placeholder="Décris cette étape..."
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 pr-12 text-sm focus:ring-2 focus:ring-orange-500 transition-all resize-none shadow-inner text-slate-600 leading-relaxed"
                    rows={3}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                  />
                  
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-xl bg-white/80 text-slate-400 hover:text-red-500 shadow-sm transition-all"
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
            className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold hover:bg-slate-50 transition-all text-sm"
          >
            ＋ Ajouter une étape
          </button>
        </div>

        {/* VALIDATION */}
        <button
          type="submit"
          className="w-full py-6 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all text-lg tracking-tight"
        >
          Sauvegarder la pépite
        </button>
      </form>
    </div>
  );
}