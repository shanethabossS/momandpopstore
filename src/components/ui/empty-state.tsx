import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LucideIcon, Package2 } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Package2,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8", className)}>
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface EmptyTableProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyTable({
  title,
  description = "No results found. Add your first item to get started.",
  actionLabel,
  onAction,
  className,
}: EmptyTableProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Package2 className="mb-4 size-12 text-muted-foreground/50" />
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface EmptyCardProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actionLabel?: string
  onAction?: () => void
  variant?: "default" | "success" | "warning"
  className?: string
}

export function EmptyCard({
  title,
  description,
  icon: Icon = Package2,
  actionLabel,
  onAction,
  variant = "default",
  className,
}: EmptyCardProps) {
  const borderColors = {
    default: "border-border",
    success: "border-emerald-200 bg-emerald-50/30",
    warning: "border-amber-200 bg-amber-50/30",
  }

  return (
    <div className={cn("rounded-lg border p-6 text-center", borderColors[variant], className)}>
      <Icon className="mx-auto mb-3 size-8 opacity-50" />
      <h4 className="mb-1 font-semibold">{title}</h4>
      {description && (
        <p className="mb-3 text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}