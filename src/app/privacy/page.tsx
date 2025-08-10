export default function Page() {
    return (
        <div className="p-4">
            <h1 className="text-2xl my-8">プライバシーポリシー(Privacy Policy)</h1>
            <p><strong>最終更新日：</strong>2025年8月10日</p>
            <p>当サービスは、個人情報の保護を重視し、以下の通りプライバシーポリシーを定めます。</p>

            <hr className="my-4" />

            <h2 className="text-xl mt-4">第1条（収集する情報）</h2>
            <ul>
                <li>・DiscordおよびTwitterのOAuth認証を通じて取得するユーザー識別情報（ID、名前、アイコンURLなど）</li>
                <li>・利用履歴（アクセス時刻、操作ログ、IPアドレス、ブラウザ情報等）</li>
                <li>・YouTube API Servicesから取得した動画メタデータ（公開情報に限る）</li>
            </ul>

            <h2 className="text-xl mt-4">第2条（利用目的）</h2>
            <ul>
                <li>・サービス提供、機能改善のため</li>
                <li>・不正アクセスや違反行為の防止のため</li>
                <li>・OAuth認証によるログイン管理のため</li>
            </ul>

            <h2 className="text-xl mt-4">第3条（第三者提供）</h2>
            <p>取得した情報は、以下の場合を除き第三者に提供しません：</p>
            <ul>
                <li>・法令に基づく場合</li>
                <li>・ご本人の同意がある場合</li>
            </ul>

            <h2 className="text-xl mt-4">第4条（情報管理）</h2>
            <ul>
                <li>・取得した情報はSupabase社が提供するクラウドインフラ上で安全に保管されます。</li>
                <li>・情報漏洩・滅失を防ぐため、適切なセキュリティ対策を実施します。</li>
            </ul>

            <h2 className="text-xl mt-4">第5条（APIに関する開示）</h2>
            <p>当サービスは、YouTube API Servicesを利用しています。YouTubeのプライバシーポリシーは<a href="https://policies.google.com/privacy" target="_blank" className="text-blue-600 underline">こちら</a>をご確認ください。</p>

            <h2 className="text-xl mt-4">第6条（利用者の権利）</h2>
            <p>ユーザーは、自身の情報に関して開示・修正・削除を求めることができます。対応をご希望の場合は、下記の連絡先までご連絡ください。</p>

            <h2 className="text-xl mt-4">第7条（広告および収益化）</h2>
            <p>当サービスは、<strong>収益化を目的としておらず、広告表示・課金等を一切行っておりません。</strong></p>

            <h2 className="text-xl mt-4">第8条（お問い合わせ）</h2>
            <p>ご質問がある場合は、以下のメールアドレスまでお問い合わせください。<br />
            📧 contact@skota11.com</p>
        </div>
    )
}
