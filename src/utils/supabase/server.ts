import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const url = "https://jwefzgvvgzjesamosqdn.supabase.co"
const key: string | undefined = process.env.NEXT_PUBLIC_KEY

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        url,
        key as string,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}