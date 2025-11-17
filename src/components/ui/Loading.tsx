import { Icon } from "@iconify/react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Icon icon="line-md:loading-alt-loop" className=" size-16 animate-spin mb-4" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  )
}
