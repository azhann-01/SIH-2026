import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { mockAIResponses } from '../data/mockData'

const suggestedQuestions = [
  'Why do I need a Factory License?',
  'What documents are needed for FSSAI?',
  'Explain Pollution Control NOC requirements',
  'What are the FSSAI renewal requirements?',
  'Documents needed for Factory License?',
]

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I\'m your Regulatory AI Assistant. I can help you understand approval requirements, compliance deadlines, documentation needs, and government schemes. How can I assist you today?', sources: [] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSources, setShowSources] = useState({})
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getAIResponse = (query) => {
    const lower = query.toLowerCase()
    if (lower.includes('factory') || lower.includes('factory license')) return mockAIResponses['factory license']
    if (lower.includes('fssai')) return mockAIResponses['fssai']
    if (lower.includes('pollution') || lower.includes('noc') || lower.includes('hspcb')) return mockAIResponses['pollution noc']
    return mockAIResponses['default']
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 1500))

    const aiResponse = getAIResponse(input)
    const assistantMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: aiResponse.answer,
      sources: aiResponse.sources,
    }
    setMessages(prev => [...prev, assistantMsg])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Regulatory Assistant</h1>
            <p className="text-sm text-slate-500">Ask questions about approvals, compliance, and documentation</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-600' : 'bg-primary-50'}`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-600" />
                )}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-100'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowSources(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      {showSources[msg.id] ? 'Hide' : 'Show'} sources ({msg.sources.length})
                    </button>
                    {showSources[msg.id] && (
                      <div className="mt-2 p-3 rounded-lg bg-primary-50 border border-primary-100">
                        {msg.sources.map((source, i) => (
                          <p key={i} className="text-xs text-primary-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {source}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
              <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                  <span className="text-sm text-slate-500">Searching knowledge base...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-400 font-medium mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about approvals, compliance, documents..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">AI provides information for reference. Always verify with official sources.</p>
        </div>
      </div>
    </div>
  )
}