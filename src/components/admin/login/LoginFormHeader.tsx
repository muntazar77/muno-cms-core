export default function LoginFormHeader() {
  return (
    <div className="mono-login-header">
      <div className="mono-login-header__lockup">
        <div className="mono-login-header__mark">M</div>
        <div>
          <p className="mono-login-header__brand">MonoCMS</p>
          <p className="mono-login-header__platform">Platform Console</p>
        </div>
      </div>
      <p className="mono-login-header__title">Welcome back</p>
      <p className="mono-login-header__sub">Sign in to continue to your workspace.</p>
    </div>
  )
}
