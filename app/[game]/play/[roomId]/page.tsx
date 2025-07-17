"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Clock, LogOut, Circle, ArrowLeft, Crown, Zap } from "lucide-react"

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
  roomTitle: string
  players: {
    player1: { name: string; color: string }
    player2: { name: string; color: string }
  }
  currentTurn: "player1" | "player2"
  lastMove: string
  gameTime: string
}

// 더미 게임 상태 데이터
const mockGameState: GameState = {
  roomTitle: "친선 경기",
  players: {
    player1: { name: "플레이어1", color: "검은색" },
    player2: { name: "플레이어2", color: "흰색" },
  },
  currentTurn: "player1",
  lastMove: "E7 → E5",
  gameTime: "05:23",
}

export default function GamePlayPage() {
  const params = useParams()
  const router = useRouter()
  const game = params.game as string
  const roomId = params.roomId as string

  const [gameState, setGameState] = useState<GameState>(mockGameState)
  const [gameTime, setGameTime] = useState("05:23")

  const gameName = gameNames[game] || game
  const GameIcon = gameIcons[game] || Circle

  // 게임 시간 업데이트 시뮬레이션
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

  const handleLeaveGame = () => {
    if (confirm("정말로 게임을 나가시겠습니까?")) {
      router.push(`/${game}/rooms`)
    }
  }

  const currentPlayer = gameState.players[gameState.currentTurn]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push(`/${game}/rooms`)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />룸 목록
              </Button>
              <div className="flex items-center gap-3">
                <GameIcon className="text-blue-600" size={24} />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{gameState.roomTitle}</h1>
                  <p className="text-sm text-gray-500">
                    {gameName} • 룸 ID: {roomId}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span className="font-mono">{gameTime}</span>
              </div>
              <Button
                onClick={handleLeaveGame}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2 bg-transparent"
              >
                <LogOut size={16} />
                나가기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>게임 보드</span>
                  <Badge variant="outline" className="text-sm">
                    {currentPlayer.name}의 턴 ({currentPlayer.color})
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Game Board Placeholder */}
                <div className="aspect-square max-w-2xl mx-auto">
                  <div className="w-full h-full border-4 border-gray-300 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative overflow-hidden">
                    {/* Grid Pattern for Visual Effect */}
                    <div className="absolute inset-4 opacity-20">
                      <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-1">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-gray-400 rounded-sm" />
                        ))}
                      </div>
                    </div>

                    {/* Placeholder Content */}
                    <div className="text-center z-10">
                      <GameIcon size={64} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-2xl font-semibold text-gray-600 mb-2">{gameName} 게임 보드</p>
                      <p className="text-gray-500">게임 로직이 구현될 영역입니다</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  플레이어
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Player 1 */}
                <div
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    gameState.currentTurn === "player1" ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{gameState.players.player1.name}</p>
                      <p className="text-sm text-gray-600">{gameState.players.player1.color}</p>
                    </div>
                    {gameState.currentTurn === "player1" && <Badge className="bg-blue-600">현재 턴</Badge>}
                  </div>
                </div>

                <Separator />

                {/* Player 2 */}
                <div
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    gameState.currentTurn === "player2" ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{gameState.players.player2.name}</p>
                      <p className="text-sm text-gray-600">{gameState.players.player2.color}</p>
                    </div>
                    {gameState.currentTurn === "player2" && <Badge className="bg-blue-600">현재 턴</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Move */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">마지막 수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Last Move Highlighted</p>
                  <p className="font-mono text-lg font-semibold text-yellow-800">{gameState.lastMove}</p>
                </div>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">게임 컨트롤</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  무르기 요청
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  항복하기
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  무승부 제안
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
