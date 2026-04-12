import Link from "next/link";

type Props = {
  showAuthLinks?: boolean;
};

export default function Header({ showAuthLinks = false }: Props) {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* ロゴ（常にトップへ） */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          LogicalTax 

          {/*
          <span className="text-foreground-muted font-normal">Q&amp;A</span>
          */}
        
          
        </Link>

        {/* トップだけ出す */}
        {showAuthLinks && (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              ログイン
            </Link>

            {process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== "false" && (
              <Link
                href="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-primary hover:bg-primary-hover !text-white transition-colors"
              >
                新規登録
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
