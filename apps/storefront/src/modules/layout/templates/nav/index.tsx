import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { retrieveClient } from "@lib/data/client"
import { retrieveDeveloper } from "@lib/data/developer"
import ProfileDropdownWrapper from "@modules/layout/components/profile-dropdown/logout-wrapper"
import {
  ClientNotificationBell,
  DeveloperNotificationBell,
} from "@modules/layout/components/notification-bell/notification-bell-wrapper"
import GlobalMessageIcon from "@modules/messaging/components/global-message-icon"
import { getActorType } from "@modules/common/functions/get-actor-type"
import Image from "next/image"

export default async function Nav() {
  const actorType: "client" | "developer" | null = await getActorType()

  let displayName = "User"
  let avatarUrl = ""

  if (actorType === "developer") {
    const developerData = await retrieveDeveloper().catch(() => null)
    displayName = developerData?.developer.first_name || "Developer"
    avatarUrl = developerData?.developer.avatar_url || ""
  } else if (actorType === "client") {
    const clientData = await retrieveClient().catch(() => null)
    displayName = clientData?.client.contact_first_name || "Client"
    avatarUrl = clientData?.client.avatar_url || ""
  }

  const isLoggedIn = Boolean(actorType)
  const isDeveloper = actorType === "developer"

  let marketplaceLink = "/marketplace"

  if (isLoggedIn) {
    if (isDeveloper) {
      marketplaceLink = "/developer/account/bug-marketplace?status=open"
    } else {
      marketplaceLink = "/client/account/bug-marketplace"
    }
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-gray-900 border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-white flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex items-center h-full gap-x-6 flex-1 basis-0">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/logo-dark-2.png"
                alt="Bugixa"
                width={120}
                height={40}
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* RIGHT: Nav links and profile */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {!isLoggedIn && (
              <>
                <div className="hidden small:flex items-center gap-x-6 h-full">
                  <LocalizedClientLink
                    className="text-white"
                    href="/client/account"
                    data-testid="nav-account-link"
                  >
                    For Clients
                  </LocalizedClientLink>
                </div>
                <div className="hidden small:flex items-center gap-x-6 h-full">
                  <LocalizedClientLink
                    className="text-white"
                    href="/developer/account"
                    data-testid="nav-account-link"
                  >
                    For Developers
                  </LocalizedClientLink>
                </div>
              </>
            )}
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-white"
                href={marketplaceLink}
                data-testid="nav-account-link"
              >
                Marketplace
              </LocalizedClientLink>
            </div>
            {isLoggedIn && (
              <div className="flex items-center gap-x-4">
                <GlobalMessageIcon
                  currentUserType={isDeveloper ? "developer" : "client"}
                />
                {isDeveloper ? (
                  <DeveloperNotificationBell />
                ) : (
                  <ClientNotificationBell />
                )}
                <ProfileDropdownWrapper
                  name={displayName}
                  avatarUrl={avatarUrl}
                  profileHref={
                    isDeveloper
                      ? "/developer/account/profile"
                      : "/client/account/profile"
                  }
                />
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  )
}
