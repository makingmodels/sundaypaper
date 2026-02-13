import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PuzzleData } from '../types';

export const generateCrosswordFromContext = async (contextText: string): Promise<PuzzleData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a mini crossword puzzle (maximum 5x5 grid) based strictly on the following text context from a personal newsletter. 
    The words in the puzzle should be keywords or themes found in the text.
    Keep it simple and fun.
    
    Context: "${contextText}"
  `;

  // Define the schema for strict JSON output
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A witty title for the crossword" },
      rows: { type: Type.INTEGER, description: "Number of rows (max 5)" },
      cols: { type: Type.INTEGER, description: "Number of columns (max 5)" },
      clues: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.INTEGER },
            direction: { type: Type.STRING, enum: ["across", "down"] },
            text: { type: Type.STRING, description: "The clue text" },
            answer: { type: Type.STRING, description: "The answer word" },
            row: { type: Type.INTEGER, description: "0-indexed start row" },
            col: { type: Type.INTEGER, description: "0-indexed start col" }
          },
          required: ["number", "direction", "text", "answer", "row", "col"]
        }
      }
    },
    required: ["title", "rows", "cols", "clues"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a puzzle master creating personalized crosswords for a newsletter.",
      },
    });

    const data = JSON.parse(response.text || "{}");
    return convertToGrid(data);

  } catch (error) {
    console.error("Gemini Crossword Error:", error);
    // Fallback static puzzle if AI fails or key is missing
    return {
      title: "Weekly Mini",
      grid: [
        [{ letter: 'C', number: 1 }, { letter: 'A' }, { letter: 'T' }],
        [{ letter: null }, { letter: null }, { letter: 'E' }],
        [{ letter: null }, { letter: null }, { letter: 'A' }]
      ],
      clues: [
        { number: 1, direction: 'across', text: 'Common pet', answer: 'CAT', row: 0, col: 0 },
        { number: 1, direction: 'down', text: 'Hot drink', answer: 'TEA', row: 0, col: 2 }
      ]
    };
  }
};

// Helper to convert AI output to Grid format for UI
const convertToGrid = (data: any): PuzzleData => {
  const rows = data.rows || 5;
  const cols = data.cols || 5;
  
  // Initialize empty grid
  const grid: any[][] = Array(rows).fill(null).map(() => Array(cols).fill({ letter: null }));

  // Fill grid based on answers
  data.clues.forEach((clue: any) => {
    const { answer, row, col, direction, number } = clue;
    const chars = answer.toUpperCase().split('');
    
    chars.forEach((char: string, index: number) => {
      let r = row;
      let c = col;
      if (direction === 'across') c += index;
      else r += index;

      if (r < rows && c < cols) {
        grid[r][c] = {
          letter: char,
          // Only add number if it's the first letter of this specific clue
          // Note: A cell might be the start of both an across and down word.
          number: (index === 0) ? number : grid[r][c].number
        };
      }
    });
  });

  return {
    title: data.title,
    grid,
    clues: data.clues
  };
};
