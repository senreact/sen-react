interface EmptyStateProps {
  title: string;
  description: string;
}

/**
 * Empty-list placeholder for the Phase 3 content surfaces. Used when
 * `NEXT_PUBLIC_CMS_URL` isn't set (no apps/cms deployment yet) or the
 * collection has zero published items. Honest copy beats fake skeleton
 * cards — readers know to come back.
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-white px-6 py-12 text-center">
      <p className="mb-2 text-base font-semibold">{title}</p>
      <p className="text-sm text-[color:var(--color-muted)]">{description}</p>
    </div>
  );
}
