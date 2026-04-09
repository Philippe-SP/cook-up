import { useState } from 'react';
import { supabase } from '../logic/supabase';

export default function LoginView() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Inscription avec stockage du pseudo dans les métadonnées
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: username
          }
        }
      });
      
      if (error) alert(error.message);
      else alert('Inscription réussie !');
    } else {
      // Connexion classique
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-8">
        
        {/* TITRE & SOUS-TITRE */}
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">
            Cook<span className="text-orange-500">'</span>UP
          </h2>
          <p className="mt-3 text-slate-500 font-medium">
            {isSignUp ? 'Crée ton carnet de recettes' : 'Contente de vous revoir !'}
          </p>
        </div>

        {/* FORMULAIRE */}
        <form className="mt-8 space-y-4" onSubmit={handleAuth}>
          <div className="space-y-3">
            
            {/* CHAMP PSEUDO (Affiché uniquement en Inscription) */}
            {isSignUp && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  required={isSignUp}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mot de passe"
              required
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Chargement...
              </span>
            ) : isSignUp ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        {/* BOUTON DE BASCULE */}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          {isSignUp 
            ? 'Déjà un compte ? Se connecter' 
            : 'Pas encore de compte ? Créer un profil'
          }
        </button>
      </div>
    </div>
  );
}