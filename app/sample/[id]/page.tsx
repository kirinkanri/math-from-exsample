import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import remarkBreaks from "remark-breaks"

export const dynamic = 'force-dynamic';

export default async function SampleQADetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: qa } = await supabaseAdmin
        .from('qa')
        .select('*, categories(name)')
        .eq('id', id)
        .eq('is_published', true)
        .single();

    if (!qa) {
        notFound();
    }

    

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/sample"
                    className="inline-flex items-center text-foreground-muted hover:text-primary mb-6 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    無料体験版の質問一覧に戻る
                </Link>

                <article className="bg-surface backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-border">
                        <div className="mb-5">
                            <div className="mb-3">
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-primary">
                                    {qa.categories?.name || '一般'}
                                </span>
                            </div>

                            <h1 className="text-base md:text-lg font-semibold text-foreground-muted leading-snug">
                                {qa.question_title}
                            </h1>
                        </div>

                        <div className="bg-surface-muted rounded-xl p-6 border border-border">
                            <h3 className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">
                                質問内容
                            </h3>
                            <p className="text-base md:text-lg text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                                {qa.question_content}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-gradient-to-b from-surface-muted to-surface">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-foreground">税務判断ナビ</h2>
                        </div>

                        <div className="prose max-w-none prose-lg">

  <div className="relative h-[300px] overflow-hidden">

    
    
    
       <div className="prose max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm,remarkBreaks]}
    rehypePlugins={[rehypeRaw]}
  >
    {qa.answer_content}
  </ReactMarkdown>
</div>
      
    

    {/* フェード＋CTA */}
    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-3">
      <div className="pointer-events-auto text-center">

        

        <Link
          href="/login"
          className="inline-block px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover !text-white text-xs font-bold"
        >
          ※ログイン後、全文を閲覧できます
        </Link>

      
    </div>

  </div>
</div>
</div>

                        <div className="mt-12 pt-8 border-t border-border text-center">
                            <p className="text-sm md:text-base text-foreground font-medium mb-2">
                                無料体験版では回答の一部のみ表示しています。
                            </p>

                            
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}