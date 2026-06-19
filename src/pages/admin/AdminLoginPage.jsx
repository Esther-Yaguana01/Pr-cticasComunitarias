import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { session, loading, isSuperAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session && isSuperAdmin) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || profile?.role !== 'SUPER_ADMIN') {
      await supabase.auth.signOut()
      setError('No tienes permisos de administrador.')
      setSubmitting(false)
      return
    }

    navigate('/admin')
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-charcoal/8 bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Admin</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Acceso exclusivo para el superadministrador del proyecto.
        </p>

        <label className="mt-6 block text-sm font-medium text-charcoal">
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-charcoal/15 px-3 py-2 outline-none focus:border-terracotta"
            required
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-charcoal">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-charcoal/15 px-3 py-2 outline-none focus:border-terracotta"
            required
          />
        </label>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-terracotta px-4 py-2.5 text-sm font-medium text-white hover:bg-terracotta-dark disabled:opacity-60"
        >
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>

        <Link
          to="/"
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm font-medium text-charcoal no-underline hover:bg-rose-light/30"
        >
          Ir a la página principal
        </Link>
      </form>
    </div>
  )
}
