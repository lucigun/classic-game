"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Users } from "lucide-react"

const gameNames: Record<string, string> = {
  omok: "오목",
  chess: "체스",
  janggi: "장기",
}

const gameDescriptions: Record<string, string> = {
  omok: "5개의 돌을 연속으로 놓아 승리하세요",
  chess: "전략적 사고로 상대의 킹을 잡으세요",
  janggi: "한국 전통 보드게임의 묘미를 느껴보세요",
}

export default function GameModePage() {
  const params = useParams()
  const router = useRouter()
  const game = params.game as string

  const gameName = gameNames[game] || game
  const gameDescription = gameDescriptions[game] || ""

  const handleModeSelect = (mode: "single" | "rooms") => {
    router.push(`/${game}/${mode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{gameName}</h1>
          <p className="text-xl text-gray-600 mb-2">플레이 방식을 선택하세요</p>
          <p className="text-lg text-gray-500">{gameDescription}</p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Play Alone Card */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-purple-300">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                  <User size={40} className="text-purple-600 group-hover:text-purple-700" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                혼자 하기
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                컴퓨터와 대전하며
                <br />
                실력을 향상시켜보세요
              </p>
              <Button
                onClick={() => handleModeSelect("single")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform group-hover:scale-105"
                size="lg"
              >
                싱글 플레이 시작
              </Button>
            </CardContent>
          </Card>

          {/* Play With Others Card */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-blue-300">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                  <Users size={40} className="text-blue-600 group-hover:text-blue-700" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                둘이 하기
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                친구나 다른 플레이어와
                <br />
                실시간으로 대전하세요
              </p>
              <Button
                onClick={() => handleModeSelect("rooms")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform group-hover:scale-105"
                size="lg"
              >
                멀티 플레이 시작
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            게임 선택으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
