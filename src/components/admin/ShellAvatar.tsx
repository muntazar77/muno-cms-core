/**
 * ShellAvatar — Server Component registered as admin.avatar.Component.
 *
 * Returns null intentionally. Payload's RenderCustomComponent only falls back
 * to the native <Account /> avatar when CustomComponent === undefined. When
 * CustomComponent is null, it renders null — the account link becomes empty.
 *
 * Combined with the unconditional CSS rule `.app-header__account { display: none }`,
 * the native Payload account link is structurally and visually removed for all
 * users. The custom UserActions component (registered in admin.components.actions)
 * provides the full account avatar and dropdown for everyone.
 */
export default function ShellAvatar() {
  return null
}
