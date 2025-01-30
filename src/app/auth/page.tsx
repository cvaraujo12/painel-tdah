import { Metadata } from "next"
import Link from "next/link"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Autenticação",
  description: "Faça login ou cadastre-se no Painel TDAH",
}

export default function AuthPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem-vindo ao Painel TDAH
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu email e senha para acessar o painel
          </p>
        </div>
        <AuthForm mode="signin" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/auth/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
} 