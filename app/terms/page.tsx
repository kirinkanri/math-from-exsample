import Link from 'next/link';

export default function TermsPage() {
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
      
      <h1 className="text-2xl font-bold">利用規約</h1>

      <p>
        本利用規約（以下「本規約」）は、合同会社KALQ（以下「当社」）が提供する
        税務判断支援サービス「LogicalTax」（以下「本サービス」）の利用条件を定めるものです。
        本サービスは、税務・会計に関する判断の構造整理および情報整理を支援するツールであり、
        利用者自身の判断を補助することを目的とします。
      </p>

      <p>
        利用者は、本規約に同意のうえ、本サービスを利用するものとします。
      </p>

      {/* 第1条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第1条（定義）</h2>
        <p>
          1. 「利用者」とは、本規約に同意し、本サービスを契約した法人または事業主体をいいます。
        </p>
        <p>
          2. 「アカウント」とは、本サービスを利用するために発行される認証情報をいいます。
        </p>
      </section>

      {/* 第2条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第2条（契約単位および利用範囲）</h2>
        <p>
          1. 本サービスは、1契約につき1法人（または1事業主体）による利用を想定します。
        </p>
        <p>
          2. 同一法人内の役員および従業員による利用は可能とします。
        </p>
        <p>
          3. ログイン情報の第三者（外部委託先・他法人・個人を含む）への共有は禁止します。
        </p>
        <p>
          4. 本サービスの内容の再配布、転載、共有、販売、公開は禁止します。
        </p>
      </section>

      {/* 第3条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第3条（サービス内容）</h2>
        <p>
          1. 本サービスは、税務・会計に関する論点の構造整理および情報提供を行うSaaS型サービスです。
        </p>
        <p>
          2. 本サービスは、特定の税務判断の正確性、適法性、妥当性を保証するものではありません。
        </p>
        <p>
          3. 最終的な判断および意思決定は、利用者自身の責任において行うものとします。
        </p>
      </section>

      {/* 第4条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第4条（利用料金および支払方法）</h2>
        <p>
          1. 本サービスの利用料金は、月額6,000円（税込）とします。
        </p>
        <p>
          2. 支払方法は、当社が指定するクレジットカード決済（Stripeを含む決済代行サービス）とします。
        </p>
        <p>
          3. 利用契約は毎月自動更新されます。
        </p>
      </section>

      {/* 第5条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第5条（解約）</h2>
        <p>
          1. 利用者は、当社指定の方法により、いつでも解約申請を行うことができます。
        </p>
        <p>
          2. 解約は、次回更新日前日までに手続きが完了した場合、次回請求分より停止されます。
        </p>
        <p>
          3. 途中解約による日割り返金は行いません。
        </p>
      </section>

      {/* 第6条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第6条（禁止事項）</h2>
        <p>利用者は、以下の行為を行ってはなりません。</p>
        <p>1. 本サービスの再販売、再配布、公開</p>
        <p>2. 本サービスを競合サービス開発の目的で利用する行為</p>
        <p>3. データの大量抽出、スクレイピング</p>
        <p>4. 不正アクセス、システム妨害行為</p>
        <p>5. 法令に違反する行為</p>
      </section>

      {/* 第7条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第7条（知的財産権）</h2>
        <p>
          本サービスに関する著作権、データ構造、コンテンツ、設計思想その他一切の知的財産権は当社に帰属します。
        </p>
      </section>

      {/* 第8条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第8条（サービス停止・変更）</h2>
        <p>
          当社は、メンテナンス、システム障害、不可抗力その他の理由により、
          事前通知なく本サービスを停止または変更することがあります。
        </p>
      </section>

      {/* 第9条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第9条（免責および責任制限）</h2>
        <p>
          1. 本サービスは情報提供および構造整理支援を目的とするものであり、
          特定の結果を保証するものではありません。
        </p>
        <p>
          2. 本サービスの利用に関連して生じた損害について、
          当社の責任は、当該損害が発生した月の利用料金相当額を上限とします。
          ただし、当社の故意または重過失による場合を除きます。
        </p>
      </section>

      {/* 第10条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第10条（規約変更）</h2>
        <p>
          当社は、本規約を変更することがあります。
          変更後の規約は、本サービス上に掲載した時点で効力を生じます。
        </p>
      </section>

      {/* 第11条 */}
      <section className="space-y-2">
        <h2 className="font-semibold">第11条（準拠法・管轄）</h2>
        <p>
          本規約は日本法に準拠します。
          本サービスに関して生じた紛争については、
          当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>

    </main>
  );
}
