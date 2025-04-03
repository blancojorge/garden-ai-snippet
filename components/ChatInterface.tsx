import { useState, useRef, useEffect } from 'react'
import { Message } from '@/types'
import { getSeasonalInfo } from '@/lib/seasonal'

interface ChatInterfaceProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  location: string
  month: number
}

export default function ChatInterface({ messages, setMessages, location, month }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const seasonalInfo = getSeasonalInfo(location, month)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { text: input, isUser: true }
    setMessages([...messages, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) throw new Error('Error en la respuesta del servidor')
      
      const data = await response.json()
      const botMessage: Message = { text: data.response, isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { 
        text: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.', 
        isUser: false 
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.isUser 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        
        {messages.length === 1 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-600 mb-2">Preguntas sugeridas:</div>
            <div className="grid grid-cols-1 gap-2">
              {seasonalInfo.suggestedQuestions.productQuestions.map((question: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
} 