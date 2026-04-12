import Link from 'next/link';

export default function TokushoPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-sm space-y-6 leading-relaxed">

      {/* 戻るリンク */}
      <div className="mb-20">
        <Link
          href="/"
          className="text-xl inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
        >
          ← LogicalTaxに戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold">特定商取引法に基づく表記</h1>

      <table className="w-full border border-border text-left">
        <tbody>
          <tr className="border-b border-border">
            <th scope="row" className="p-3 w-1/3">販売事業者名</th>
            <td className="p-3">合同会社KALQ</td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">運営責任者</th>
            <td className="p-3">代表社員 瀬賀拓也</td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">所在地</th>
            <td className="p-3">
              〒225-0023 神奈川県横浜市青葉区大場町231-85
            </td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">電話番号</th>
            <td className="p-3">
              090-8935-7377（受付時間：平日10:00〜18:00）
            </td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">メールアドレス</th>
            <td className="p-3">logicaltax@kalq.info</td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">販売価格</th>
            <td className="p-3">月額6,000円（税込）</td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">商品代金以外の必要料金</th>
            <td className="p-3">
              インターネット接続料金、通信料金等は利用者の負担となります。
            </td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">支払方法</th>
            <td className="p-3">クレジットカード決済（Stripeを含む決済代行サービス）</td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">支払時期</th>
            <td className="p-3">
              申込時に初回決済が発生し、以後は毎月自動更新・自動課金されます。
            </td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">サービス提供時期</th>
            <td className="p-3">決済完了後、直ちに利用可能</td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">動作環境</th>
            <td className="p-3">
              最新版の主要ブラウザ（Chrome / Safari / Edge / Firefox）を推奨します。
              推奨環境外での動作は保証しません。
            </td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">解約（サブスクリプションの停止）</th>
            <td className="p-3">
              管理画面または当社指定の方法により解約できます。
              次回更新日前日までに解約手続きが完了した場合、次回請求分より課金が停止されます。
            </td>
          </tr>

          <tr className="border-b border-border">
            <th scope="row" className="p-3">返金・キャンセル</th>
            <td className="p-3">
              本サービスはデジタルサービスの性質上、提供開始後の返品・返金には原則として応じません。
              また、途中解約による日割り返金は行いません。
              ただし、当社の責に帰すべき事由により本サービスを提供できない場合は、個別に協議のうえ対応します。
            </td>
          </tr>

          <tr>
            <th scope="row" className="p-3">表現およびサービスに関する注意書き</th>
            <td className="p-3">
              本サービスは税務・会計に関する判断の構造整理および情報提供を目的とするものであり、
              特定の税務判断の正確性、適法性、妥当性を保証するものではありません。
              最終的な判断は利用者自身の責任において行うものとします。
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
