import * as React from "react"

import { cn } from "@/lib/utils"

function Form({ className, ...props }: React.ComponentProps<"form">) {
  return <form data-slot="form" className={cn("space-y-5", className)} {...props} />
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-item" className={cn("space-y-2", className)} {...props} />
}

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="form-label"
      className={cn("text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-control" className={cn("relative", className)} {...props} />
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null

  return (
    <p data-slot="form-message" className={cn("text-xs text-destructive", className)} {...props}>
      {children}
    </p>
  )
}

export { Form, FormControl, FormItem, FormLabel, FormMessage }
