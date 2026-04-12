import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-sm space-y-8 leading-relaxed">

      {/* 戻るリンク */}
      <div className="mb-20">
        <Link
          href="/"
          className="text-xl inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
        >
          ← LogicalTaxに戻る
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold">プライバシーポリシー</h1>

      <p>
        合同会社KALQ（以下「当社」）は、税務判断支援サービス
        「LogicalTax」（以下「本サービス」）において取得する
        個人情報を、以下のとおり適切に取り扱います。
      </p>

      {/* 第1条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第1条（取得する情報）</h2>
        <p>当社は、本サービスの提供にあたり、以下の情報を取得することがあります。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>氏名、法人名</li>
          <li>メールアドレス</li>
          <li>決済情報（※クレジットカード情報は当社では保持せず、Stripe等の決済代行会社が管理します）</li>
          <li>アクセスログ、IPアドレス、ブラウザ情報</li>
          <li>サービス利用履歴</li>
        </ul>
      </section>

      {/* 第2条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第2条（利用目的）</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>本サービスの提供・運営のため</li>
          <li>利用料金の請求および決済処理のため</li>
          <li>お問い合わせ対応のため</li>
          <li>サービス改善および品質向上のため</li>
          <li>不正利用の防止およびセキュリティ確保のため</li>
        </ul>
      </section>

      {/* 第3条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第3条（第三者提供）</h2>
        <p>
          当社は、法令に基づく場合を除き、本人の同意なく第三者に個人情報を提供しません。
        </p>
        <p>
          ただし、決済処理、クラウドサーバー運用、メール配信等、
          サービス運営に必要な範囲で業務委託先に情報を提供することがあります。
        </p>
      </section>

      {/* 第4条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第4条（安全管理措置）</h2>
        <p>
          当社は、個人情報への不正アクセス、漏えい、改ざん、滅失を防止するため、
          合理的な安全管理措置を講じます。
        </p>
      </section>

      {/* 第5条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第5条（保存期間）</h2>
        <p>
          個人情報は、利用目的の達成に必要な期間保管し、
          その後適切な方法で削除または廃棄します。
        </p>
      </section>

      {/* 第6条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第6条（開示・訂正・削除）</h2>
        <p>
          本人からの個人情報の開示、訂正、利用停止、削除の請求があった場合、
          法令に従い適切に対応します。
        </p>
      </section>

      {/* 第7条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第7条（クッキー等の利用）</h2>
        <p>
          本サービスでは、利用状況の分析および利便性向上のため、
          クッキーおよび類似技術を利用することがあります。
        </p>
      </section>

      {/* 第8条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第8条（改定）</h2>
        <p>
          当社は、本ポリシーを必要に応じて改定することがあります。
          改定後の内容は本サービス上に掲載した時点で効力を生じます。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">お問い合わせ窓口</h2>
        <p>logicaltax@kalq.info</p>
      </section>

    </main>
  );
}
