import { LoginForm } from '@/components/email-login-form'
import { SocialLoginForm } from '@/components/social-login-form'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <SocialLoginForm className="mt-6" />
      </div>
    </div>
  )
}
