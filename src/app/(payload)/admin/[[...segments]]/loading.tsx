export default function AdminSegmentsLoading() {
  return (
    <div className="min-h-screen bg-(--cms-bg-elevated) px-6 py-6">
      <div className="mx-auto max-w-420 space-y-4">
        <div className="h-12 animate-pulse rounded-2xl bg-(--cms-bg-muted)" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-26 animate-pulse rounded-2xl bg-(--cms-bg-muted)" />
          <div className="h-26 animate-pulse rounded-2xl bg-(--cms-bg-muted)" />
          <div className="h-26 animate-pulse rounded-2xl bg-(--cms-bg-muted)" />
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-(--cms-bg-muted)" />
      </div>
    </div>
  )
}
