// src/App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './logic/supabase';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import AddRecipeView from './views/AddRecipeView';
import type { User } from '@supabase/supabase-js';
import RecipeDetailView from './views/RecipeDetailView';
import ShoppingView from './views/ShoppingView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutConfirm(false);
    window.location.reload();
  };

  const getUserInitials = () => {
    const displayName = user?.user_metadata?.display_name;
    if (displayName) {
      const parts = displayName.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return displayName.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || '??';
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-orange-500 rounded-2xl rotate-12"></div>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-200 flex justify-center items-start sm:py-8">
        <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[3rem] shadow-2xl flex flex-col border-x border-slate-100">
           <LoginView />
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab !== 'home') setSelectedRecipeId(null); 
      }} 
      userInitials={getUserInitials()}
      onLogout={handleLogout}
    >
      {/* AFFICHAGE CONDITIONNEL : Détail OU Onglets */}
      {selectedRecipeId ? (
        <RecipeDetailView 
          recipeId={selectedRecipeId} 
          onBack={() => setSelectedRecipeId(null)} 
        />
      ) : (
        <>
          {activeTab === 'home' && (
            <HomeView onSelectRecipe={(id) => setSelectedRecipeId(id)} />
          )}
          
          {activeTab === 'add' && (
            <AddRecipeView onSaveSuccess={() => setActiveTab('home')} />
          )}

          {activeTab === 'settings' && (
            // eslint-disable-next-line react-hooks/purity
            <ShoppingView key={Date.now()} />
          )}
        </>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2">👋</div>
              <h3 className="text-xl font-black text-slate-800">Déjà faim ?</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Es-tu sûr de vouloir te déconnecter ?</p>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={() => setShowLogoutConfirm(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-sm">Annuler</button>
                <button onClick={confirmLogout} className="py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg text-sm">Quitter</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}