import { HomeNavigation } from '@/components/home/Navigation'
import { AnonymousLogin } from '@/components/supabase/anonymousLogin'
import { LoginForm } from '@/components/supabase/email-login-form'

export default function Page() {
  return (
    <div>
      <div className="p-4 max-w-screen-xl m-auto">
        <HomeNavigation />
      </div>
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AnonymousLogin />
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
