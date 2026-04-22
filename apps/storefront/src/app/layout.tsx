import { Providers } from "./providers"
import { TooltipProvider, Toaster } from "@medusajs/ui"
import { Metadata } from "next"
// @ts-ignore
import "../styles/globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | Bugixa", // %s is replaced by the page's title
    default: "Bugixa Home",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <TooltipProvider>
          <Providers>
            <main className="relative">{props.children}</main>
          </Providers>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
