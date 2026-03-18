import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load auth state from localStorage on mount
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser) {
            try {
                setToken(savedToken)
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = useCallback((userData, authToken) => {
        setUser(userData)
        setToken(authToken)
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }, [])

    const isAuthenticated = !!token && !!user

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
