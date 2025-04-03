import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import ChatInterface from '../ChatInterface'
import { gardenService } from '@/services/garden/service'

// Mock the garden service
jest.mock('@/services/garden/service', () => ({
  gardenService: {
    getSuggestedQuestions: jest.fn(),
    getSpecificationsByCategory: jest.fn(),
    getNextSpecification: jest.fn()
  }
}))

// Mock the chat service
jest.mock('@/services/chat/service', () => ({
  handleChatRequest: jest.fn()
}))

describe('ChatInterface', () => {
  const mockMessages = []
  const mockSetMessages = jest.fn()
  const mockLocation = 'Test Location'
  const mockMonth = 6
  const mockWeather = {
    condition: 'sunny',
    temperature: 25,
    humidity: 60,
    windSpeed: 10
  }
  const mockOnQuestionClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders welcome message when location and weather are provided', () => {
    const { getByText } = render(
      <ChatInterface
        messages={mockMessages}
        setMessages={mockSetMessages}
        location={mockLocation}
        month={mockMonth}
        weather={mockWeather}
        onQuestionClick={mockOnQuestionClick}
      />
    )

    expect(getByText(/¡Buenos días!/i)).toBeInTheDocument()
    expect(getByText(/Test Location/i)).toBeInTheDocument()
    expect(getByText(/sunny/i)).toBeInTheDocument()
  })

  it('handles user input and sends message', async () => {
    const mockResponse = {
      content: 'Test response',
      products: []
    }

    ;(gardenService.getSuggestedQuestions as jest.Mock).mockReturnValue([
      { id: '1', text: 'Test question', relatedProductCategories: ['mowers'] }
    ])

    ;(gardenService.getSpecificationsByCategory as jest.Mock).mockReturnValue([
      { id: 'garden-size', name: 'Tamaño del jardín' }
    ])

    ;(gardenService.getNextSpecification as jest.Mock).mockReturnValue(null)

    const { getByPlaceholderText, getByText } = render(
      <ChatInterface
        messages={mockMessages}
        setMessages={mockSetMessages}
        location={mockLocation}
        month={mockMonth}
        weather={mockWeather}
        onQuestionClick={mockOnQuestionClick}
      />
    )

    const input = getByPlaceholderText(/Escribe tu pregunta/i)
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    await waitFor(() => {
      expect(mockSetMessages).toHaveBeenCalled()
    })
  })

  it('handles suggested question click', async () => {
    const mockQuestion = {
      id: '1',
      text: 'Test question',
      relatedProductCategories: ['mowers']
    }

    ;(gardenService.getSuggestedQuestions as jest.Mock).mockReturnValue([mockQuestion])
    ;(gardenService.getSpecificationsByCategory as jest.Mock).mockReturnValue([
      { id: 'garden-size', name: 'Tamaño del jardín' }
    ])
    ;(gardenService.getNextSpecification as jest.Mock).mockReturnValue(null)

    const { getByText } = render(
      <ChatInterface
        messages={mockMessages}
        setMessages={mockSetMessages}
        location={mockLocation}
        month={mockMonth}
        weather={mockWeather}
        onQuestionClick={mockOnQuestionClick}
      />
    )

    const questionButton = getByText(mockQuestion.text)
    fireEvent.click(questionButton)

    await waitFor(() => {
      expect(mockOnQuestionClick).toHaveBeenCalledWith(mockQuestion.text)
    })
  })

  it('handles specification answer', async () => {
    const mockSpecification = {
      id: 'garden-size',
      name: 'Tamaño del jardín'
    }

    ;(gardenService.getNextSpecification as jest.Mock).mockReturnValue(mockSpecification)

    const { getByPlaceholderText } = render(
      <ChatInterface
        messages={mockMessages}
        setMessages={mockSetMessages}
        location={mockLocation}
        month={mockMonth}
        weather={mockWeather}
        onQuestionClick={mockOnQuestionClick}
      />
    )

    const input = getByPlaceholderText(/Escribe tu pregunta/i)
    fireEvent.change(input, { target: { value: 'medium' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    await waitFor(() => {
      expect(mockSetMessages).toHaveBeenCalled()
    })
  })

  it('displays loading state', () => {
    const { getByTestId } = render(
      <ChatInterface
        messages={mockMessages}
        setMessages={mockSetMessages}
        location={mockLocation}
        month={mockMonth}
        weather={mockWeather}
        onQuestionClick={mockOnQuestionClick}
      />
    )

    const input = getByTestId('chat-input')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    expect(getByTestId('loading-indicator')).toBeInTheDocument()
  })
}) 