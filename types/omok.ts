export type OmokCell = 0 | 1 | 2 // 0: 빈칸, 1: 플레이어1, 2: 플레이어2
export type OmokBoard = OmokCell[][]

export interface OmokGameState {
  board: OmokBoard
  currentPlayer: 1 | 2
  lastMove: { row: number; col: number } | null
  winner: 0 | 1 | 2
}
