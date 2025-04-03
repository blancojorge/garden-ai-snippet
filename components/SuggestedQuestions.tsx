import React from 'react'
import type { SeasonalInfo } from '@/lib/seasonal'

interface SuggestedQuestionsProps {
  seasonalInfo: SeasonalInfo
  onQuestionClick: (question: string) => void
}

export default function SuggestedQuestions({ 
  seasonalInfo, 
  onQuestionClick 
}: SuggestedQuestionsProps) {
  const defaultQuestions = [
    '¿Necesitas un cortacésped?',
    '¿Ayuda para elegir una desbrozadora?',
    '¿Alguna otra duda?'
  ]

  const questions = seasonalInfo.suggestedQuestions.productQuestions.length > 0 
    ? seasonalInfo.suggestedQuestions.productQuestions 
    : defaultQuestions

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 mb-2">Preguntas sugeridas:</div>
      <div className="grid grid-cols-1 gap-2">
        {questions.map((question: string, index: number) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
} 