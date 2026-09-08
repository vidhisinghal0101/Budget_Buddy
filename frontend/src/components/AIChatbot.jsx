import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import API_URL from '../config/api'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Budget Buddy AI 💰 I can analyze your spending, suggest budgets, and help you save more. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchFinancialContext = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [statsRes, categoryRes, budgetRes, transRes] = await Promise.all([
        fetch(`${API_URL}/api/transaction/stats/summary`, { headers }),
        fetch(`${API_URL}/api/transaction/stats/category`, { headers }),
        fetch(`${API_URL}/api/budget`, { headers }),
        fetch(`${API_URL}/api/transaction?limit=10&sortBy=date&order=desc`, { headers }),
      ])

      const stats = await statsRes.json()
      const categories = await categoryRes.json()
      const budgets = await budgetRes.json()
      const transactions = await transRes.json()

      return { stats, categories, budgets, recentTransactions: transactions.transactions }
    } catch {
      return null
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const financialData = await fetchFinancialContext()
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const systemContext = `You are Budget Buddy AI, a professional personal finance assistant embedded in a budget tracking app.
The user's name is ${user.name || 'User'}.

Here is their current financial data:
- Total Income: ₹${financialData?.stats?.totalIncome?.toFixed(2) || 0}
- Total Expenses: ₹${financialData?.stats?.totalExpenses?.toFixed(2) || 0}
- Current Balance: ₹${financialData?.stats?.balance?.toFixed(2) || 0}
- Estimated In-Hand: ₹${financialData?.stats?.estimatedInHand?.toFixed(2) || 0}

Expense by Category:
${financialData?.categories?.map((c) => `  - ${c.name}: ₹${c.value}`).join('\n') || 'No data'}

Budget Goals:
${financialData?.budgets?.map((b) => `  - ${b.category}: spent ₹${b.spent} of ₹${b.limit} limit (${((b.spent / b.limit) * 100).toFixed(0)}%)`).join('\n') || 'No budgets set'}

Recent Transactions:
${financialData?.recentTransactions?.map((t) => `  - ${t.name} (${t.category}): ${t.type === 'income' ? '+' : '-'}₹${t.amount} on ${new Date(t.date).toLocaleDateString()}`).join('\n') || 'No transactions'}

Instructions:
- Be concise, friendly, and professional
- Use ₹ for currency
- Give specific, actionable advice based on their actual data
- Keep responses under 150 words unless a detailed breakdown is requested
- Use emojis sparingly for a clean look`

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
      const chat = model.startChat({
        history: messages
          .filter((m) => m.role !== 'assistant' || messages.indexOf(m) !== 0)
          .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
      })

      const result = await chat.sendMessage(`${systemContext}\n\nUser: ${userMessage}`)
      const response = result.response.text()

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Gemini error:', error)
      let errMsg = 'Sorry, I ran into an issue. Please try again.'
      if (error?.message?.includes('429')) errMsg = '⏳ Rate limit hit. Please wait 30 seconds and try again.'
      else if (error?.message?.includes('404')) errMsg = '❌ Model not found. Check API key or model name.'
      else if (error?.message?.includes('API_KEY')) errMsg = '🔑 Invalid API key. Check VITE_GEMINI_API_KEY in .env'
      else if (error?.message) errMsg = `Error: ${error.message}`
      setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickPrompts = [
    'Analyze my spending',
    'How can I save more?',
    'Am I over budget?',
    'Give me financial tips',
  ]

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 flex items-center space-x-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Budget Buddy AI</p>
              <p className="text-emerald-100 text-xs">Powered by Gemini</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 flex-wrap">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); }}
                  className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent max-h-24"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
