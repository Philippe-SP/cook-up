export interface Ingredient {
  name: string;
  quantity: number; // Quantité pour la recette de base
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'Entrée' | 'Plat' | 'Dessert' | 'Autre';
  servings: number; // Nombre de personnes pour la recette de base
  prepTime: number; // Temps de préparation en minutes
  ingredients: Ingredient[];
  steps: string[];
  isFavorite: boolean;
  imageUrl?: string;
}