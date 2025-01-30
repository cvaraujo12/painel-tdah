import { Metadata } from "next"
import Link from "next/link"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta no Painel TDAH",
}

export default function SignUpPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crie sua conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Preencha os campos abaixo para criar sua conta
          </p>
        </div>
        <AuthForm mode="signup" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href="/auth"
            className="underline underline-offset-4 hover:text-primary"
          >
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  )
} 