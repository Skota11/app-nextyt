"use client"

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function AnonymousLogin() {
    const [captchaToken, setCaptchaToken] = useState("")

    const handleLogin = async () => {
        const supabase = createClient()
        const { error } = await supabase.auth.signInAnonymously({options: { captchaToken }})
        if (error) {
            console.error("Anonymous login failed:", error.message)
        } else {
            window.location.href = "/"
        }
    }
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>とりあえず始める</CardTitle>
                <CardDescription>再生履歴やプレイリストなどは引き継げません。</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className=" w-full" onClick={handleLogin}>匿名アカウントで始める</Button>
                <div className='flex place-content-center mt-4'>
                    <Turnstile  siteKey="0x4AAAAAAB59JAA_z_BD7i2O"  onSuccess={(token:string) => {  console.log("cf");  setCaptchaToken(token)  }}/>
                </div>
            </CardContent>
        </Card>
    )
}