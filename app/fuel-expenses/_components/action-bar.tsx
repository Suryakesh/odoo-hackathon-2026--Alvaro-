import { AddExpenseDialog } from "./add-expense-dialog"
import { LogFuelDialog } from "./log-fuel-dialog"

export function ActionBar() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <LogFuelDialog />
      <AddExpenseDialog />
    </div>
  )
}
