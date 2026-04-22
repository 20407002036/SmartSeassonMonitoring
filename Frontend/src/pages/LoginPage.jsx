import { useState } from 'react'

function LoginPage({ onLogin, loginError, isSubmitting }) {
  const [username, setUsername] = useState('grace.admin')
  const [password, setPassword] = useState('Harvest@2026')

  return (
    <main className="min-h-screen bg-gradient-to-br from-surface via-surface-container-low to-surface-container-high p-6 md:p-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_20px_70px_rgba(25,28,29,0.12)] lg:grid-cols-2">
        <section className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary-container p-10 text-on-primary lg:flex">
          <div className="absolute -left-14 top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-sm font-semibold uppercase tracking-[0.25em]">SmartSeason</p>
          <div className="relative space-y-5">
            <h1 className="max-w-md text-5xl font-extrabold leading-tight tracking-tight font-headline">
              Field Operations, Designed for Fast Decisions
            </h1>
            <p className="max-w-md text-on-primary/90">
              Monitor crop progress across every plot, coordinate agents in real-time, and keep updates flowing even on slower field networks.
            </p>
          </div>
          <p className="relative text-xs uppercase tracking-[0.25em] text-on-primary/80">Admin + Agent Experience</p>
        </section>

        <section className="p-8 sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Welcome Back</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Use one of the demo accounts below to explore role-based screens.</p>

          <div className="mt-4 rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
            <p>grace.admin / Harvest@2026</p>
            <p>daniel.admin / Fields#2026</p>
            <p>faith.agent / SeasonTrack!7</p>
            <p>mercy.agent / GreenFarm@9</p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              if (isSubmitting) {
                return
              }
              onLogin({ username, password })
            }}
          >
            <label className="block text-sm font-semibold text-on-surface-variant">
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-on-surface-variant">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>

            {loginError ? <p className="text-sm font-semibold text-error">{loginError}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold uppercase tracking-wide text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
