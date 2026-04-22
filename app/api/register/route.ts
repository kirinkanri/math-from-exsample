import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("✅ register API called");

    try {
        const { email, password, fullName } = await req.json();

        // 入力チェック
        if (!email || !password) {
            return NextResponse.json(
                { error: "メールアドレスとパスワードは必須です" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "パスワードは6文字以上である必要があります" },
                { status: 400 }
            );
        }

        // ① Authユーザー作成
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: { full_name: fullName || "" },
            email_confirm: true,
        });

        console.log("CREATE USER RESULT:", { data, error });

        if (error) {
            if (error.message.includes("already registered")) {
                return NextResponse.json(
                    { error: "このメールアドレスは既に登録されています" },
                    { status: 400 }
                );
            }
            throw error;
        }

        // ② public.users に同期
        if (data?.user) {
            const { error: insertError } = await supabaseAdmin
                .from("users")
                .upsert(
                    {
                        id: data.user.id,
                        email: email,
                        full_name: fullName || "",
                        created_at: new Date().toISOString()
                    },
                    {
                        onConflict: "id"
                    }
                );

            if (insertError) {
                console.error("INSERT ERROR:", insertError);
                // 今は止めない（運用優先）
            }
        }

        // ③ レスポンス
        return NextResponse.json({
            success: true,
            message: "登録が完了しました。ログインしてください。",
            user: data.user,
        });

    } catch (error: any) {
        console.error("Registration error:", error);

        return NextResponse.json(
            { error: error.message || "登録中にエラーが発生しました" },
            { status: 400 }
        );
    }
}