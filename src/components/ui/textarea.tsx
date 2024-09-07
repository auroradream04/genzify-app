import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.key === "Enter" || event.key === "NumpadEnter") && !event.shiftKey) {
        event.preventDefault()
        // Trigger the submit event here
        const form = event.currentTarget.form
        if (form) {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
        }
      }
    }

    return (
      <textarea
        className={cn(
          "flex outline-none w-full rounded-md border border-zinc-600 focus-visible:border-zinc-300 transition ease-linear duration-150 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
          className
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
