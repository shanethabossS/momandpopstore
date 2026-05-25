"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"

type ConfirmVariant = "danger" | "warning" | "info"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  variant?: ConfirmVariant
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconClass: "text-red-500",
    confirmClass: "bg-red-600 hover:bg-red-700",
    titleSuffix: "",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    confirmClass: "bg-amber-600 hover:bg-amber-700",
    titleSuffix: "",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    confirmClass: "bg-blue-600 hover:bg-blue-700",
    titleSuffix: "",
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`rounded-full bg-muted p-2 ${config.iconClass}`}>
              <Icon className="size-5" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            className={config.confirmClass}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {actionLabel && onAction && (
          <DialogFooter className="sm:justify-end">
            <Button onClick={() => {
              onOpenChange(false)
              onAction()
            }}>
              {actionLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}