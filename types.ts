export enum BlockType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  PUZZLE = 'PUZZLE',
}

export interface BaseBlock {
  id: string;
  timestamp: number;
}

export interface TextBlock extends BaseBlock {
  type: BlockType.TEXT;
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: BlockType.IMAGE;
  url: string;
  caption?: string;
}

export interface CrosswordCell {
  letter: string | null; // null if black square
  number?: number; // clue number if start of word
  userInput?: string;
}

export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  answer: string;
  row: number;
  col: number;
}

export interface PuzzleData {
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
  title: string;
}

export interface PuzzleBlock extends BaseBlock {
  type: BlockType.PUZZLE;
  data: PuzzleData | null; // null while generating
  isGenerating: boolean;
}

export type Block = TextBlock | ImageBlock | PuzzleBlock;

export enum AppPhase {
  AUTH = 'AUTH',       // Login Screen
  SHOEBOX = 'SHOEBOX', // The Week
  EDITOR = 'EDITOR',   // The Sunday Ritual
  PUBLISHED = 'PUBLISHED', // The "Sent" animation
  ARCHIVE = 'ARCHIVE', // Past issues
  NEWSLETTER = 'NEWSLETTER' // Reading a specific issue
}

export interface User {
  name: string;
  email: string;
  groupCode: string;
}

export interface Issue {
  id: string;
  circleCode: string;
  weekNumber: number;
  publishDate: number;
  sections: {
    userName: string;
    blocks: Block[];
  }[];
}
