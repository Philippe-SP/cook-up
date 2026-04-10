// src/logic/types.ts
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  prep_time: number;
  emoji: string;
  bg_color: string;
  is_favorite: boolean;
  steps: string[];
  servings: number;
  ingredients: Ingredient[];
}

export interface SupabaseError {
  message: string;
  code: string;
}

export interface RecipeDetailViewProps {
  recipeId: string;
  onBack: () => void;
}

export interface HomeViewProps {
  onSelectRecipe: (id: string) => void;
}

export interface IngredientAmount {
  val: number | null;
  unit: string;
}

export interface AggregatedItem {
  name: string;
  amounts: IngredientAmount[];
}

export interface ShoppingEntry {
  id: string;
  servings_to_buy: number;
  recipes: Recipe | Recipe[] | null; 
}