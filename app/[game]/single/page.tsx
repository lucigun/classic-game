"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, RotateCcw, ArrowLeft, Circle, Crown, Zap, Clock, Trophy, Target } from "lucide-react"
import type { OmokGameState } from "../../../types/omok"
import { createEmptyBoard, checkWin, getRandomAIMove, isBoardFull } from "../../../utils/omok-logic"
import { OmokBoardComponent } from "../../../components/omok-board"

const gameNames: Record<string, string> = {
  omok: "오목",
  chess: "체스",
  janggi: "장기",
}

const gameIcons: Record<string, any> = {
  omok: Circle,
  chess: Crown,
  janggi: Zap,
}

interface GameState {
  currentTurn: "player" | "ai"
  moveHistory: Array<{ player: string; move: string; time: string }>
  gameTime: string
  playerScore: number
  aiScore: number
}

// 더미 게임 상태 데이터
const initialGameState: GameState = {
  currentTurn: "player",
  moveHistory: [
    { player: "플레이어", move: "E4", time: "00:15" },
    { player: "AI", move: "E5", time: "00:18" },
    { player: "플레이어", move: "Nf3", time: "00:32" },
    { player: "AI", move: "Nc6", time: "00:35" },
  ],
  gameTime: "02:45",
  playerScore: 0,
  aiScore: 0,
}

export default function SinglePlayerPage() {
  const params = useParams()
  const router = useRouter()
  const game = params.game as string

  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [gameTime, setGameTime] = useState("02:45")
  const [isThinking, setIsThinking] = useState(false)
  const [omokState, setOmokState] = useState<OmokGameState>({
    board: createEmptyBoard(),
    currentPlayer: 1,
    lastMove: null,
    winner: 0,
  })

  const gameName = gameNames[game] || game
  const GameIcon = gameIcons[game] || Circle

  // 게임 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => {
        const [minutes, seconds] = prev.split(":").map(Number)
        const totalSeconds = minutes * 60 + seconds + 1
        const newMinutes = Math.floor(totalSeconds / 60)
        const newSeconds = totalSeconds % 60
        return `${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // AI 턴 시뮬레이션 (오목용)
  useEffect(() => {
    if (game === "omok" && omokState.currentPlayer === 2 && omokState.winner === 0) {
      setIsThinking(true)
      const thinkingTime = Math.random() * 2000 + 1000 // 1-3초

      setTimeout(() => {
        setIsThinking(false)

        const aiMove = getRandomAIMove(omokState.board)
        if (aiMove) {
          const newBoard = omokState.board.map((r) => [...r])
          newBoard[aiMove.row][aiMove.col] = 2

          const hasWon = checkWin(newBoard, aiMove.row, aiMove.col)

          setOmokState({
            board: newBoard,
            currentPlayer: hasWon ? 2 : 1,
            lastMove: aiMove,
            winner: hasWon ? 2 : 0,
          })
        }
      }, thinkingTime)
    }
  }, [omokState.currentPlayer, omokState.winner, game])

  const handleOmokMove = (row: number, col: number) => {
    if (omokState.board[row][col] !== 0 || omokState.currentPlayer !== 1 || omokState.winner !== 0) {
      return
    }

    const newBoard = omokState.board.map((r) => [...r])
    newBoard[row][col] = 1

    const hasWon = checkWin(newBoard, row, col)

    setOmokState({
      board: newBoard,
      currentPlayer: hasWon ? 1 : 2,
      lastMove: { row, col },
      winner: hasWon ? 1 : 0,
    })

    // 게임이 끝나지 않았다면 AI 턴
    if (!hasWon && !isBoardFull(newBoard)) {
      // AI 턴은 useEffect에서 처리
    }
  }

  const handleOmokRestart = () => {
    if (confirm("게임을 다시 시작하시겠습니까?")) {
      setOmokState({
        board: createEmptyBoard(),
        currentPlayer: 1,
        lastMove: null,
        winner: 0,
      })
      setGameTime("00:00")
    }
  }

  const handleRestartGame = () => {
    if (game === "omok") {
      handleOmokRestart()
    } else {
      if (confirm("게임을 다시 시작하시겠습니까?")) {
        setGameState({
          ...initialGameState,
          moveHistory: [],
          currentTurn: "player",
        })
        setGameTime("00:00")
      }
    }
  }

  const handleMakeMove = () => {
    // 플레이어 수 시뮬레이션
    const playerMoves = ["E4", "Nf3", "Bc4", "d3", "Bg5", "Qd2"]
    const randomMove = playerMoves[Math.floor(Math.random() * playerMoves.length)]

    setGameState((prev) => ({
      ...prev,
      currentTurn: "ai",
      moveHistory: [...prev.moveHistory, { player: "플레이어", move: randomMove, time: gameTime }],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push(`/${game}/mode`)} variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              뒤로가기
            </Button>
            <div className="flex items-center gap-3">
              <GameIcon className="text-indigo-600" size={28} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{gameName} - AI 대전</h1>
                <p className="text-gray-600">인공지능과 실력을 겨뤄보세요</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span className="font-mono text-lg">{gameTime}</span>
            </div>
            <Button onClick={handleRestartGame} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RotateCcw size={16} />
              다시 시작
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    오목 게임 보드
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {omokState.winner !== 0 ? (
                      <Badge className="bg-green-600">{omokState.winner === 1 ? "플레이어 승리!" : "AI 승리!"}</Badge>
                    ) : omokState.currentPlayer === 1 ? (
                      <Badge className="bg-blue-600 flex items-center gap-1">
                        <User size={14} />
                        당신의 턴 (검은돌)
                      </Badge>
                    ) : (
                      <Badge className="bg-purple-600 flex items-center gap-1">
                        <Bot size={14} />
                        {isThinking ? "AI 생각 중..." : "AI의 턴 (흰돌)"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                {game === "omok" ? (
                  <OmokBoardComponent
                    board={omokState.board}
                    onCellClick={handleOmokMove}
                    lastMove={omokState.lastMove}
                    disabled={omokState.currentPlayer !== 1 || omokState.winner !== 0 || isThinking}
                  />
                ) : (
                  <div className="aspect-square max-w-2xl mx-auto">
                    <div className="w-full h-full border-4 border-gray-300 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner">
                      <div className="text-center z-10">
                        <GameIcon size={72} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-2xl font-semibold text-gray-600 mb-2">{gameName} 게임 보드</p>
                        <p className="text-gray-500 mb-4">게임 로직이 구현될 영역입니다</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">You vs AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Player */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    gameState.currentTurn === "player" ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="text-blue-600" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">플레이어</p>
                        <p className="text-sm text-gray-600">당신</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{gameState.playerScore}</p>
                      <p className="text-xs text-gray-500">승수</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* AI */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    gameState.currentTurn === "ai" ? "border-purple-400 bg-purple-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="text-purple-600" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800">AI</p>
                        <p className="text-sm text-gray-600">인공지능</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">{gameState.aiScore}</p>
                      <p className="text-xs text-gray-500">승수</p>
                    </div>
                  </div>
                  {isThinking && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                      <div className="animate-pulse w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>분석 중...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Move History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={18} />수 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {gameState.moveHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">아직 수가 없습니다</p>
                  ) : (
                    <div className="space-y-2">
                      {gameState.moveHistory.map((move, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            move.player === "AI" ? "bg-purple-50" : "bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {move.player === "AI" ? (
                              <Bot size={14} className="text-purple-600" />
                            ) : (
                              <User size={14} className="text-blue-600" />
                            )}
                            <span className="text-sm font-medium">{move.player}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-semibold">{move.move}</p>
                            <p className="text-xs text-gray-500">{move.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">게임 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">총 수</span>
                  <span className="font-semibold">{gameState.moveHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">게임 시간</span>
                  <span className="font-mono font-semibold">{gameTime}</span>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">난이도</p>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    중급
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
