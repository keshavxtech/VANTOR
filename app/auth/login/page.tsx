"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.assign(next);
  }

  return <AuthShell>
    <div className="space-y-2 mb-6"><h1 className="text-xl font-semibold">Sign in to VANTOR</h1><p className="text-sm text-[#8B95A5]">Access your AI engineering workspace.</p></div>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      {error && <p className="text-xs text-red-400 rounded-lg bg-red-500/10 border border-red-500/20 p-3">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 py-2.5 text-sm font-medium">{loading ? "Signing in…" : "Sign In"}</button>
    </form>
    <p className="text-xs text-[#8B95A5] mt-6 text-center">New to VANTOR? <Link className="text-white hover:text-[#7C3AED]" href="/auth/signup">Create an account</Link></p>
  </AuthShell>;
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return <label className="block space-y-1.5"><span className="text-xs text-[#8B95A5]">{label}</span><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg bg-[#1E2430] border border-white/[0.07] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7C3AED]" /></label>;
}
