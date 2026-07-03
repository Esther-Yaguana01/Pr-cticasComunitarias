import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, entity, role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error al cargar perfil:', error.message)
      setProfile(null)
    } else {
      setProfile(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return

      setSession(currentSession)

      if (currentSession?.user) {
        loadProfile(currentSession.user.id)
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)

      if (nextSession?.user) {
        setLoading(true)
        loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    profile,
    loading,
    signOut,
    isSuperAdmin: profile?.role === 'SUPER_ADMIN',
    isCaregiver: profile?.role === 'CAREGIVER',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
