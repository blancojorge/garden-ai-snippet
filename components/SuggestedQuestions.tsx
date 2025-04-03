import type { SeasonalInfo } from '@/lib/seasonal'

interface SuggestedQuestionsProps {
  seasonalInfo: SeasonalInfo
  onQuestionClick: (question: string) => void
}

export default function SuggestedQuestions({ seasonalInfo, onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Preguntas sugeridas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seasonalInfo.suggestedQuestions.productQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
          >
            <p className="text-green-800">{question}</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => onQuestionClick(seasonalInfo.suggestedQuestions.openQuestion)}
        className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
      >
        <p className="text-green-800">{seasonalInfo.suggestedQuestions.openQuestion}</p>
      </button>
    </div>
  )
} 