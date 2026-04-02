import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { loginAdmin } from '@/features/auth/admin-auth'
import { ROUTES } from '@/constants/routes'

const loginSchema = z.object({
  email: z.string().email('Email format is invalid'),
  password: z.string().min(1, 'Password is required'),
})

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')

  const fromPath = (location.state as { from?: string } | null)?.from || ROUTES.admin

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    }

    const parsed = loginSchema.safeParse(payload)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input')
      return
    }

    const ok = loginAdmin(parsed.data.email, parsed.data.password)
    if (!ok) {
      setError('Invalid credentials')
      return
    }

    navigate(fromPath, { replace: true })
  }

  return (
    <section className="mx-auto max-w-md py-10">
      <Card className="space-y-4 p-6">
        <h1 className="font-display text-3xl font-extrabold text-ink">Admin Login</h1>
        <p className="text-sm text-ink/70">Use your admin credentials to manage products and categories.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="email" type="email" placeholder="admin@gmail.com" />
          <Input name="password" type="password" placeholder="Password" />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
    </section>
  )
}
