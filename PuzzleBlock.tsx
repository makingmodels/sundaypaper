import React, { useState } from 'react';
import { PuzzleData } from '../../types';
import { motion } from 'framer-motion';

interface PuzzleBlockProps {
  data: PuzzleData;
}

export const PuzzleBlock: React.FC<PuzzleBlockProps> = ({ data }) => {
  // Local state for user inputs to make it playable
  const [gridState, setGridState] = useState(data.grid);
  
  const handleInputChange = (r: number, c: number, val: string) => {
    const newGrid = [...gridState];
    newGrid[r][c] = { ...newGrid[r][c], userInput: val.toUpperCase().slice(-1) }; // Only last char
    setGridState(newGrid);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-stone-50 border border-stone-200 rounded-lg">
      <div className="text-center mb-6">
        <h3 className="sans text-xl font-bold tracking-tight text-stone-900">{data.title}</h3>
        <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Generated from your week</p>
      </div>

      <div 
        className="grid gap-1 mb-8 mx-auto bg-stone-900 p-2 rounded"
        style={{ 
          gridTemplateColumns: `repeat(${data.grid[0].length}, minmax(0, 1fr))`,
          aspectRatio: `${data.grid[0].length}/${data.grid.length}`
        }}
      >
        {gridState.map((row, rIdx) => (
          row.map((cell, cIdx) => {
            if (cell.letter === null) {
              return <div key={`${rIdx}-${cIdx}`} className="bg-stone-900 w-full h-full" />;
            }
            const isCorrect = cell.userInput === cell.letter;
            return (
              <div key={`${rIdx}-${cIdx}`} className="relative bg-white w-full h-full aspect-square">
                 {cell.number && (
                   <span className="absolute top-0.5 left-0.5 text-[0.5rem] font-bold text-stone-400 leading-none">
                     {cell.number}
                   </span>
                 )}
                 <input 
                   type="text"
                   className={`w-full h-full text-center sans font-bold text-lg uppercase focus:outline-none focus:bg-blue-50 ${isCorrect && cell.userInput ? 'text-green-600' : 'text-stone-900'}`}
                   maxLength={1}
                   value={cell.userInput || ''}
                   onChange={(e) => handleInputChange(rIdx, cIdx, e.target.value)}
                 />
              </div>
            );
          })
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm">
        <div>
          <h4 className="sans font-bold text-xs uppercase text-stone-400 mb-2">Across</h4>
          <ul className="space-y-2">
            {data.clues.filter(c => c.direction === 'across').map(clue => (
              <li key={`a-${clue.number}`} className="flex gap-2">
                <span className="font-bold text-stone-900">{clue.number}.</span>
                <span className="text-stone-600 leading-tight">{clue.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="sans font-bold text-xs uppercase text-stone-400 mb-2">Down</h4>
          <ul className="space-y-2">
            {data.clues.filter(c => c.direction === 'down').map(clue => (
              <li key={`d-${clue.number}`} className="flex gap-2">
                <span className="font-bold text-stone-900">{clue.number}.</span>
                <span className="text-stone-600 leading-tight">{clue.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
