import { ReactNode, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface NewTransactionProps {
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: Date
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createNewTransaction: (data: NewTransactionProps) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function createNewTransaction(data: NewTransactionProps) {
    const { category, description, price, type, createdAt } = data

    const response = await api.post('/transactions', {
      // ...data
      category,
      description,
      price,
      type,
      createdAt
    })

    setTransactions((state) => [response.data, ...state])
  }

  async function fetchTransactions(query?: string) {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query
      }
    })

    setTransactions(response.data)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createNewTransaction
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
