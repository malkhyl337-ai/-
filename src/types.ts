export interface Concept {
  title: string;
  description: string;
  icon: string;
}

export interface Quote {
  text: string;
  context: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  type: "core" | "main" | "sub";
  // Coordinates for rendering relative layout
  x: number;
  y: number;
}

export interface MindMapEdge {
  from: string;
  to: string;
}

export interface BookSummary {
  id: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  year: number;
  categoryAr: string;
  categoryEn: string;
  overviewAr: string;
  overviewEn: string;
  keyConcepts: Concept[];
  quotes: Quote[];
  mindMapNodes: MindMapNode[];
  mindMapEdges: MindMapEdge[];
}

export interface CustomSummary {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
}
