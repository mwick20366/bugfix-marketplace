"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

export type MemberType = "client" | "developer";

interface LoginTemplateProps {
  memberType: MemberType;
}

const LoginTemplate = ({ memberType }: LoginTemplateProps) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} memberType={memberType} />
      ) : (
        <Register setCurrentView={setCurrentView} memberType={memberType} />
      )}
    </div>
  )
}

export default LoginTemplate
