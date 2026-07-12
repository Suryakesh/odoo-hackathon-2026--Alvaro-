import { AddExpenseDialog } from "./add-expense-dialog"
import { LogFuelDialog } from "./log-fuel-dialog"

interface ActionBarProps {
  onExpenseCreated?: () => void
}

export function ActionBar({ onExpenseCreated }: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <LogFuelDialog />
      <AddExpenseDialog onCreated={onExpenseCreated} />
    </div>
  )
}
