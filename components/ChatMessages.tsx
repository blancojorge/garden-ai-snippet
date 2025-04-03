import { ChatMessage } from '@/types/chat'
import { ProductRecommendation } from './ProductRecommendation'

interface ChatMessagesProps {
  messages: ChatMessage[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="space-y-4">
          <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.isUser 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {message.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2">
                  {line.split(/(\[.*?\]\(.*?\))/g).map((part, j) => {
                    const match = part.match(/\[(.*?)\]\((.*?)\)/)
                    if (match) {
                      return (
                        <a
                          key={j}
                          href={match[2]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${message.isUser ? 'text-white underline' : 'text-blue-600 hover:text-blue-800 underline'}`}
                        >
                          {match[1]}
                        </a>
                      )
                    }
                    return part
                  })}
                </p>
              ))}
            </div>
          </div>
          
          {!message.isUser && message.products && message.products.length > 0 && (
            <div className="mt-4">
              <ProductRecommendation products={message.products} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 