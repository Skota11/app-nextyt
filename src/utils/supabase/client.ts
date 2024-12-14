import { createBrowserClient } from '@supabase/ssr'

const url = "https://jwefzgvvgzjesamosqdn.supabase.co"
const key: any = process.env.NEXT_PUBLIC_KEY
export const supabase = createBrowserClient(
    url,
    key,
)