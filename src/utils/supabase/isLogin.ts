import { cookies } from "next/headers";

export async function isLoggedIn() {
    const projectRef = "jwefzgvvgzjesamosqdn";
    const baseName = `sb-${projectRef}-auth-token`;

    const cookieStore = await cookies();
    const all = cookieStore.getAll();

    const targetCookies = all.filter(c =>
        c.name === baseName || c.name.startsWith(baseName + ".")
    );

    if (targetCookies.length === 0) {
        return { loggedIn: false, reason: "no-cookie" };
    }

    const normalized = targetCookies
        .map(c => {
            const m = c.name.match(/\.(\d+)$/);
            return {
                index: m ? parseInt(m[1], 10) : 0,
                value: c.value
            };
        })
        .sort((a, b) => a.index - b.index);

    // 結合
    let combined = normalized.map(x => x.value).join("");

    combined = combined.replace(/^"+|"+$/g, "").trim();

    // 最小限この関数で利用する構造だけ型定義
    interface ParsedSupabaseAuthCookie {
        currentSession?: { expires_at: number } | null;
        expires_at?: number;
        expiresAt?: number; // 念のため互換
        [k: string]: unknown;
    }

    // シンプルなパース: 順番に試すだけ (JSON -> decodeURIComponent -> base64 推測)
    const parseCookie = (raw: string): ParsedSupabaseAuthCookie | null => {
        const tryJson = (s: string) => {
            try { return JSON.parse(s); } catch { return null; }
        };

        // 1. そのまま
        let obj = tryJson(raw);
        if (obj && typeof obj === "object") return obj;

        // 2. decodeURIComponent (失敗しても握りつぶして次へ)
        try {
            obj = tryJson(decodeURIComponent(raw));
            if (obj && typeof obj === "object") return obj;
        } catch {/* noop */ }

        // 3. base64 として読めるか (padding 調整 + web safe -> base64)
        const tryBase64 = (s: string) => {
            try {
                const withoutPrefix = s.startsWith("base64-") ? s.slice(7) : s;
                let b = withoutPrefix.replace(/-/g, "+").replace(/_/g, "/");
                const pad = b.length % 4;
                if (pad === 2) b += "==";
                else if (pad === 3) b += "=";
                else if (pad !== 0) return null;
                const decoded = Buffer.from(b, "base64").toString("utf8");
                return tryJson(decoded);
            } catch { return null; }
        };
        obj = tryBase64(raw);
        if (obj && typeof obj === "object") return obj;

        return null;
    };

    const parsed = parseCookie(combined);
    if (!parsed) {
        return { loggedIn: false, reason: "parse-failed" };
    }

    // 利用可能な expires の優先順位: currentSession.expires_at > top-level expires_at > top-level expiresAt
    const expiresAt: number | undefined = parsed.currentSession?.expires_at ?? parsed.expires_at ?? parsed.expiresAt ?? undefined;

    if (!expiresAt) {
        return {
            loggedIn: false,
            reason: "no-expires",
            rawParsed: parsed
        };
    }
    const nowSec = Math.floor(Date.now() / 1000);
    if (expiresAt <= nowSec) {
        return {
            loggedIn: false,
            expiresAt,
            reason: "expired"
        };
    }
    return {
        loggedIn: true,
        expiresAt
    };
}