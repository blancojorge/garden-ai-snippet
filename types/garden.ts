// Core Entities
export interface Region {
  id: string;
  name: string;
  description: string;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  months: number[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  seasonId: string;
  regionId: string;
  relatedSeasons: string[];
  relatedRegions: string[];
  requiredTools: string[];
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  categoryId?: string;
  relatedProductCategories: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  specifications: Specification[];
}

export interface Specification {
  id: string;
  name: string;
  type: 'single' | 'multiple' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

// Relationships
export interface GardenRelationships {
  // Task -> Season
  taskSeasons: {
    [taskId: string]: string[]; // season IDs
  };
  
  // Task -> Product Category
  taskProducts: {
    [taskId: string]: string[]; // product category IDs
  };
  
  // Question -> Product Category
  questionProducts: {
    [questionId: string]: string[]; // product category IDs
  };
  
  // Product Category -> Specifications
  categorySpecifications: {
    [categoryId: string]: string[]; // specification IDs
  };
}

// Interactive Flow
export interface ConversationState {
  currentCategory: string | null;
  currentSpecification: string | null;
  answeredSpecifications: {
    [specId: string]: string; // specification ID -> selected value
  };
}

// Data Collections
export interface GardenData {
  regions: Region[];
  seasons: Season[];
  tasks: Task[];
  suggestedQuestions: SuggestedQuestion[];
  productCategories: ProductCategory[];
  specifications: Specification[];
  relationships: GardenRelationships;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  specifications: Record<string, string>;
} 