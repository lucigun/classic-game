"use client"

import type { FormEvent } from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, ArrowLeft } from "lucide-react"

// 실제 Socket.IO 클라이언트를 사용합니다.
import { io, type Socket } from "socket.io-client"

const gameNames: Record<string, string> = {
  omok: "오목",
  chess: "체스",
  janggi: "장기",
}

interface Room {
  id: string
  title: string
  players: number
  maxPlayers: number
  host: string
  createdAt: string
}

export default function GameRoomsPage() {
  const params = useParams()
  const router = useRouter()
  const game = params.game as string

  const [rooms, setRooms] = useState<Room[]>([])
  const [roomTitle, setRoomTitle] = useState("")
  const [nickname, setNickname] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const gameName = gameNames[game] || game

  // Socket.IO 클라이언트 인스턴스를 저장할 ref
  const socketRef = useState<Socket | null>(null)

  // WebSocket 연결 및 이벤트 리스너 설정
  useEffect(() => {
    // 환경 변수에서 Socket.IO 서버 URL을 가져옵니다.
    // Vercel에 배포할 때 이 환경 변수를 설정해야 합니다.
    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3001"

    // Socket.IO 서버에 연결합니다.
    const socket: Socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"], // 웹소켓 연결 실패 시 폴링으로 전환
    })

    socketRef.current = socket // ref에 소켓 인스턴스 저장

    socket.on("connect", () => {
      console.log("WebSocket connected to server:", SOCKET_SERVER_URL)
      socket.emit("getRooms") // 연결 시 초기 룸 목록 요청
    })

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected from server.")
    })

    socket.on("roomsUpdate", (updatedRooms: Room[]) => {
      console.log("Rooms updated from server:", updatedRooms)
      setRooms(updatedRooms)
    })

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message)
      // 연결 실패 시 사용자에게 알림 등을 표시할 수 있습니다.
    })

    // 클린업 함수 (컴포넌트 언마운트 시 연결 해제)
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, []) // 빈 배열: 컴포넌트 마운트/언마운트 시 한 번만 실행

  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roomTitle.trim() || !nickname.trim()) return

    setIsCreating(true)

    if (socketRef.current) {
      // 서버에 룸 생성 요청
      socketRef.current.emit("createRoom", { title: roomTitle.trim(), nickname: nickname.trim() })
    }

    // UI 피드백을 위한 짧은 지연
    setTimeout(() => {
      setRoomTitle("")
      setNickname("")
      setIsCreating(false)
    }, 500)
  }

  const handleJoinRoom = (roomId: string) => {
    if (socketRef.current) {
      // 서버에 룸 참여 요청
      socketRef.current.emit("joinRoom", { roomId })
      console.log(`Joining room ${roomId}`)
      // 실제 게임 플레이 페이지로 이동: router.push(`/${game}/play/${roomId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{gameName} 게임 룸</h1>
            <p className="text-gray-600">새로운 방을 만들거나 기존 방에 참여하세요</p>
          </div>
          <Button onClick={() => router.push(`/${game}/mode`)} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            뒤로가기
          </Button>
        </div>

        {/* Create Room Form */}
        <Card className="mb-8 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Plus size={24} />새 게임 룸 만들기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomTitle">방 제목</Label>
                  <Input
                    id="roomTitle"
                    type="text"
                    placeholder="방 제목을 입력하세요"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isCreating || !roomTitle.trim() || !nickname.trim()}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8"
              >
                {isCreating ? "방 생성 중..." : "방 만들기"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Rooms */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={24} />
              참여 가능한 방 ({rooms.filter((room) => room.players < room.maxPlayers).length}개)
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>실시간 업데이트</span>
            </div>
          </div>

          {rooms.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 text-lg">아직 생성된 방이 없습니다.</p>
                <p className="text-gray-400">첫 번째 방을 만들어보세요!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border hover:border-blue-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                          {room.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          방장: {room.host} • {room.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users size={16} className="text-gray-400" />
                        <span
                          className={`font-medium ${room.players >= room.maxPlayers ? "text-red-500" : "text-green-600"}`}
                        >
                          {room.players}/{room.maxPlayers}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${room.players < room.maxPlayers ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                        />
                        <span
                          className={`text-sm font-medium ${room.players < room.maxPlayers ? "text-green-600" : "text-red-500"}`}
                        >
                          {room.players < room.maxPlayers ? "참여 가능" : "게임 중"}
                        </span>
                      </div>

                      <Button
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={room.players >= room.maxPlayers}
                        className={`${
                          room.players >= room.maxPlayers
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 group-hover:scale-105"
                        } text-white font-medium px-6 py-2 transition-all duration-300`}
                      >
                        {room.players >= room.maxPlayers ? "게임 중" : "참여하기"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>방에 참여하면 실시간으로 다른 플레이어와 게임을 즐길 수 있습니다</p>
        </div>
      </div>
    </div>
  )
}
