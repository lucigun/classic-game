"use client"

import type { OmokBoard, OmokCell } from "../types/omok"

interface OmokBoardProps {
  board: OmokBoard
  onCellClick: (row: number, col: number) => void
  lastMove: { row: number; col: number } | null
  disabled: boolean
}

export function OmokBoardComponent({ board, onCellClick, lastMove, disabled }: OmokBoardProps) {
  const renderCell = (cell: OmokCell, row: number, col: number) => {
    const isLastMove = lastMove && lastMove.row === row && lastMove.col === col

    return (
      <button
        key={`${row}-${col}`}
        className={`
          w-8 h-8 border border-gray-400 bg-amber-100 hover:bg-amber-200 
          transition-colors duration-200 relative flex items-center justify-center
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${isLastMove ? "ring-2 ring-red-400 ring-offset-1" : ""}
        `}
        onClick={() => !disabled && cell === 0 && onCellClick(row, col)}
        disabled={disabled || cell !== 0}
      >
        {cell === 1 && <div className="w-6 h-6 bg-black rounded-full shadow-md border border-gray-600" />}
        {cell === 2 && <div className="w-6 h-6 bg-white rounded-full shadow-md border border-gray-400" />}
        {isLastMove && <div className="absolute inset-0 bg-red-200 opacity-30 rounded-sm" />}
      </button>
    )
  }

  return (
    <div className="inline-block p-4 bg-amber-200 rounded-lg shadow-lg">
      <div className="grid grid-cols-15 gap-0 border-2 border-gray-600 bg-amber-50">
        {board.map((row, rowIndex) => row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex)))}
      </div>
    </div>
  )
}
