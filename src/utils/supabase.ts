import { createBrowserClient } from '@supabase/ssr'

const url = "https://jwefzgvvgzjesamosqdn.supabase.co"
const key: string | undefined = process.env.NEXT_PUBLIC_KEY
export const supabase = createBrowserClient(
    url,
    key as string,
)