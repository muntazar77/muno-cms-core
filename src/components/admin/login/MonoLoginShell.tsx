import { ShieldCheck, Sparkles, Workflow } from 'lucide-react'

const pillars = [
  {
    icon: Workflow,
    title: 'Pipeline Clarity',
    description: 'Track pages, submissions, and student cases from one operational command center.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Safe Access',
    description: 'Strict platform and site-scoped permissions keep every tenant workspace isolated.',
  },
  {
    icon: Sparkles,
    title: 'Operator Speed',
    description: 'Premium admin workflows designed for fast daily execution by delivery teams.',
  },
]

export default function MonoLoginShell() {
  return (
    <aside className="mono-login-shell hidden xl:flex">
      <div className="mono-login-shell__inner">
        <p className="mono-login-shell__eyebrow">MonoCMS Platform</p>
        <h2 className="mono-login-shell__title">Operate every tenant site with confidence.</h2>
        <p className="mono-login-shell__subtitle">
          A single command interface for platform operators, client workspaces, content delivery, and
          student-case execution workflows.
        </p>

        <div className="mono-login-shell__list">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div key={title} className="mono-login-shell__item">
              <div className="mono-login-shell__icon-wrap">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="mono-login-shell__item-title">{title}</p>
                <p className="mono-login-shell__item-description">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
