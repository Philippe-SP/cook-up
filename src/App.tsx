// src/App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './logic/supabase';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import AddRecipeView from './views/AddRecipeView'; // <-- Nouvel import
import type { User } from '@supabase/supabase-js';
import RecipeDetailView from './views/RecipeDetailView';


export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

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
      setActiveTab={setActiveTab} 
      userInitials={getUserInitials()}
    >
      {/* ROUTING SIMPLE */}
      {activeTab === 'home' && !selectedRecipeId && (
        <HomeView onSelectRecipe={(id) => setSelectedRecipeId(id)} />
      )}

      {selectedRecipeId && (
        <RecipeDetailView 
          recipeId={selectedRecipeId} 
          onBack={() => setSelectedRecipeId(null)} 
        />
      )}
      
      {activeTab === 'add' && (
        <AddRecipeView onSaveSuccess={() => setActiveTab('home')} />
      )}

      {activeTab === 'settings' && (
        <div className="p-4 bg-slate-50 rounded-[2rem] text-center py-20 text-slate-400 font-bold italic">
          Bientôt : Liste de courses intelligente 🛒
        </div>
      )}
    </Layout>
  );
}