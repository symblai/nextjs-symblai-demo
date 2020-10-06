import { useState, createContext, useContext } from 'react'
export const ConnectionContext = createContext<any>(null)
export const ConversationContext = createContext<any>(null)
export const AuthContext = createContext<any>(null)

export const ConnectionProvider: React.FC = ({ children }) => {
  const [id, setId] = useState(null)
  const [token, setToken] = useState(null)
  const [conversationData, setConversationData] = useState(null)
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <ConnectionContext.Provider value={[id, setId]}>
        <ConversationContext.Provider
          value={{ conversationData, setConversationData }}
        >
          {children}
        </ConversationContext.Provider>
      </ConnectionContext.Provider>
    </AuthContext.Provider>
  )
}

export const useConnection = () => useContext(ConnectionContext)
export const useConversation = () => useContext(ConversationContext)
export const useAuth = () => useContext(AuthContext)
