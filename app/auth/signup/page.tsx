"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setMessage("");
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.session) window.location.assign("/"); else setMessage("Account created. Check your email to confirm your account, then sign in.");
    setLoading(false);
  }
  return <AuthShell>
    <div className="space-y-2 mb-6"><h1 className="text-xl font-semibold">Create your VANTOR account</h1><p className="text-sm text-[#8B95A5]">Start with a secure workspace identity.</p></div>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 6 characters" minLength={6} />
      {error && <p className="text-xs text-red-400 rounded-lg bg-red-500/10 border border-red-500/20 p-3">{error}</p>}
      {message && <p className="text-xs text-[#10B981] rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">{message}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 py-2.5 text-sm font-medium">{loading ? "Creating…" : "Create Account"}</button>
    </form>
    <p className="text-xs text-[#8B95A5] mt-6 text-center">Already have an account? <Link className="text-white hover:text-[#7C3AED]" href="/auth/login">Sign in</Link></p>
  </AuthShell>;
}
function Field({ label, type = "text", value, onChange, placeholder, minLength }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string; minLength?: number }) {
  return <label className="block space-y-1.5"><span className="text-xs text-[#8B95A5]">{label}</span><input required minLength={minLength} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg bg-[#1E2430] border border-white/[0.07] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7C3AED]" /></label>;
}
