import { useState, useEffect } from 'react';
import { supabase } from './logic/supabase';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 1. Vérifier la session actuelle au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    // 2. Écouter les changements d'état (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour extraire les initiales de l'utilisateur 
  const getUserInitials = () => {
  // On cherche d'abord le pseudo dans les user_metadata
  const displayName = user?.user_metadata?.display_name;
  
  if (displayName) {
    const parts = displayName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  }
  
  // Fallback sur l'email si pas de pseudo
  return user?.email?.substring(0, 2).toUpperCase() || '??';
};

  // Affichage d'un loader pendant que Supabase vérifie la session
  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Auth Guard : Si pas d'utilisateur, on force la page de Login
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-200 flex justify-center items-start sm:py-8">
        <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-x border-slate-100">
           <LoginView />
        </div>
      </div>
    );
  }

  // Si connecté, on affiche le Layout avec les initiales dynamiques
  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userInitials={getUserInitials()}
    >
      {activeTab === 'home' && <HomeView />}
      
      {activeTab === 'add' && (
        <div className="p-4 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200 text-center py-20 text-orange-400 font-bold">
          Formulaire de création à venir...
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-4 bg-slate-50 rounded-2xl text-center py-20 text-slate-400 font-bold italic">
          Liste de courses bientôt disponible
        </div>
      )}
    </Layout>
  );
}