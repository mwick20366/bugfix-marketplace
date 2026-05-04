import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getActorType } from "@modules/common/functions/get-actor-type"
import BugixaCTA from "@modules/layout/components/medusa-cta"
import Image from "next/image"

export default async function Footer() {
  const actorType: "client" | "developer" | null = await getActorType()

  return (
    <footer className="border-t border-ui-border-base bg-gray-900 w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-12">
          {/* Brand */}
          <div className="flex flex-col gap-y-3 max-w-xs">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-base hover:text-ui-fg-subtle uppercase"
            >
              <Image
                src="/images/logo-dark-1.png"
                alt="Bugixa"
                width={240}
                height={80}
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Links grid */}
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {/* Marketplace */}
            <div className="flex flex-col gap-y-2">
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    href={actorType ? `/${actorType}/account/bug-marketplace` : "/marketplace"}
                    className="text-white"
                  >
                    Browse Bugs
                  </LocalizedClientLink>
                </li>
                {actorType === "client" && (
                  <li>
                    <LocalizedClientLink
                      href={"/client/account/my-bugs"}
                      className="text-white"
                    >
                      My Posted Bugs
                    </LocalizedClientLink>
                  </li>
                )}
                {actorType === "client" && (
                  <li>
                    <LocalizedClientLink
                      href={`/client/account/my-bugs?create=true`}
                      className="text-white"
                    >
                      Post a Bug
                    </LocalizedClientLink>
                  </li>
                )}
                {actorType === "developer" && (
                  <li>
                    <LocalizedClientLink
                      href={`/${actorType}/account/my-bugs`}
                      className="text-white"
                    >
                      My Claimed Bugs
                    </LocalizedClientLink>
                  </li>
                )}
                {actorType && (
                  <li>
                    <LocalizedClientLink
                      href={`/${actorType}/account/${
                        actorType === "client" ? "developer" : "my"
                      }-submissions`}
                      className="text-white"
                    >
                      {actorType === "client" ? "Developer" : "My"} Submissions
                    </LocalizedClientLink>
                  </li>
                )}
              </ul>
            </div>
            {/* Account */}
            {!actorType && (
              <div className="flex flex-col gap-y-2">
                <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                  <li>
                    <LocalizedClientLink
                      className="text-white"
                      href="/client/account"
                      data-testid="nav-account-link"
                    >
                      For Clients
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink
                      className="text-white"
                      href="/developer/account"
                      data-testid="nav-account-link"
                    >
                      For Developers
                    </LocalizedClientLink>
                  </li>
                </ul>
              </div>
            )}
            {actorType && (
              <div className="flex flex-col gap-y-2">
                <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                  <li>
                    <LocalizedClientLink
                      href={`/${actorType}/account`}
                      className="text-white"
                    >
                      My Account
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink
                      href={`/${actorType}/account/messages`}
                      className="text-white"
                    >
                      Messages
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink
                      href={`/${actorType}/account/notifications`}
                      className="text-white"
                    >
                      Notifications
                    </LocalizedClientLink>
                  </li>
                  {actorType === "developer" && (
                    <li>
                      <LocalizedClientLink
                        href="/developer/account/my-reviews"
                        className="text-white"
                      >
                        My Reviews
                      </LocalizedClientLink>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {/* Company */}
            <div className="flex flex-col gap-y-2">
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a href="/about" className="text-white">
                    About
                  </a>
                </li>
                {/* <li>
                  <a href="/customer-service" className="text-white">
                    Customer Service
                  </a>
                </li> */}
                <li>
                  <a href="/privacy-policy" className="text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex w-full mb-16 justify-between items-center border-t border-ui-border-base pt-6 text-ui-fg-muted">
          <Text className="txt-compact-small text-white">
            © {new Date().getFullYear()} Bugixa Marketplace. All rights
            reserved.
          </Text>
          <BugixaCTA />
        </div>
      </div>
    </footer>
  )
}
