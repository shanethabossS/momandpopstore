'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/* Lightweight custom select (no Radix dependency) */

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (v: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ open: false, setOpen: () => {} });

function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<'button'>) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 opacity-50" />
    </button>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return <span className={cn(!value && 'text-muted-foreground')}>{value || placeholder}</span>;
}

function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(SelectContext);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
        className,
      )}
    >
      {children}
    </div>
  );
}

function SelectItem({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  return (
    <div
      role="option"
      aria-selected={ctx.value === value}
      onClick={() => {
        ctx.onValueChange?.(value);
        ctx.setOpen(false);
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
        ctx.value === value && 'bg-accent',
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
