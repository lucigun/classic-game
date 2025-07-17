import type { OmokBoard } from "../types/omok"

// 빈 15x15 보드 생성
export function createEmptyBoard(): OmokBoard {
  return Array(15)
    .fill(null)
    .map(() => Array(15).fill(0))
}

// 승리 체크 함수
export function checkWin(board: OmokBoard, row: number, col: number): boolean {
  const player = board[row][col]
  if (player === 0) return false

  // 4방향 체크: 가로, 세로, 대각선(↘), 대각선(↙)
  const directions = [
    [0, 1], // 가로
    [1, 0], // 세로
    [1, 1], // 대각선 ↘
    [1, -1], // 대각선 ↙
  ]

  for (const [dx, dy] of directions) {
    let count = 1 // 현재 돌 포함

    // 한 방향으로 체크
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i
      const newCol = col + dy * i
      if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break
      if (board[newRow][newCol] !== player) break
      count++
    }

    // 반대 방향으로 체크
    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i
      const newCol = col - dy * i
      if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) break
      if (board[newRow][newCol] !== player) break
      count++
    }

    if (count >= 5) return true
  }

  return false
}

// AI 무작위 이동
export function getRandomAIMove(board: OmokBoard): { row: number; col: number } {
  const emptyCells: { row: number; col: number }[] = []

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ row: i, col: j })
      }
    }
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)]
}

// 보드가 가득 찼는지 체크
export function isBoardFull(board: OmokBoard): boolean {
  return board.every((row) => row.every((cell) => cell !== 0))
}
