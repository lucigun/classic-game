"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Circle, Crown, Zap } from "lucide-react"

const games = [
  {
    id: "omok",
    name: "오목",
    description: "5개의 돌을 연속으로 놓아 승리하는 전략 게임입니다. 간단한 규칙이지만 깊이 있는 전략이 필요합니다.",
    icon: Circle,
    color: "text-slate-600",
    hoverColor: "hover:text-slate-800",
  },
  {
    id: "chess",
    name: "체스",
    description: "세계에서 가장 인기 있는 보드게임 중 하나입니다. 각 말의 고유한 움직임을 활용해 상대의 킹을 잡으세요.",
    icon: Crown,
    color: "text-amber-600",
    hoverColor: "hover:text-amber-800",
  },
  {
    id: "janggi",
    name: "장기",
    description: "한국 전통 보드게임으로, 궁궐을 배경으로 한 전략 게임입니다. 상대의 궁을 점령하여 승리하세요.",
    icon: Zap,
    color: "text-red-600",
    hoverColor: "hover:text-red-800",
  },
]

export default function GameSelection() {
  const router = useRouter()

  const handleGameSelect = (gameId: string) => {
    router.push(`/${gameId}/mode`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">게임을 선택하세요</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            원하는 게임을 선택하여 게임 모드를 설정하고 플레이를 시작하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => {
            const IconComponent = game.icon
            return (
              <Card
                key={game.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-300"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-6 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300`}
                    >
                      <IconComponent
                        size={64}
                        className={`${game.color} ${game.hoverColor} transition-colors duration-300`}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                    {game.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed min-h-[4rem]">
                    {game.description}
                  </CardDescription>
                  <Button
                    onClick={() => handleGameSelect(game.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform group-hover:scale-105"
                    size="lg"
                  >
                    게임 선택
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">각 게임을 선택하면 게임 모드 설정 페이지로 이동합니다</p>
        </div>
      </div>
    </div>
  )
}
