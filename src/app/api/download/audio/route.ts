import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const searchParams = request.nextUrl.searchParams
            const query = searchParams.get('id')
            const res = await (await fetch(`${process.env.YOUTUBE_HOST_URL}?v=${query}`)).json();
            return NextResponse.json(res, { status: 200 })
        } else {
            return new Response('Not logged in', { status: 404 })
        }
    
}