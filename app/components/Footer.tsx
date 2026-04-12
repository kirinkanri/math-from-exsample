import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t text-sm text-gray-600">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-2">
        <div>
           合同会社KALQ<br />
        </div>

        <div className="flex gap-4">
          <Link href="/terms" className="underline">利用規約</Link>
          <Link href="/privacy" className="underline">プライバシーポリシー</Link>
          <Link href="/tokusho" className="underline">特定商取引法表記</Link>
        </div>
      </div>
    </footer>
  )
}
