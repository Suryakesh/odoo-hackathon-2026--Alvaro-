import { AddDriverDialog } from "./add-driver-dialog"

interface ActionBarProps {
  onDriverCreated?: () => void
}

export function ActionBar({ onDriverCreated }: ActionBarProps) {
  return (
    <div className="flex items-center justify-end">
      <AddDriverDialog onCreated={onDriverCreated} />
    </div>
  )
}
