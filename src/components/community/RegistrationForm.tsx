"use client";

import { useState } from "react";
import { Send, User, Mail, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FormData {
    name: string;
    email: string;
    purpose: string;
    referral: string;
}

export default function RegistrationForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        purpose: "",
        referral: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: supabaseError } = await supabase
                .from('waitlist')
                .insert([
                    {
                        email: formData.email,
                        name: formData.name,
                        purpose: formData.purpose,
                        referral: formData.referral
                    }
                ]);

            if (supabaseError) {
                if (supabaseError.code === '23505') {
                    setError('This email is already registered on our waitlist.');
                } else {
                    setError('Something went wrong. Please try again.');
                }
                setIsLoading(false);
                return;
            }

            setIsSubmitted(true);
        } catch {
            setError('Network error. Please check your connection and try again.');
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="py-24 bg-transparent flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 rounded-3xl bg-bg-elevated shadow-neu-raised flex items-center justify-center mb-8 animate-fadeInScale">
                    <CheckCircle2 size={40} className="text-theme-primary" />
                </div>
                <h2 className="text-3xl font-black text-content-primary tracking-tight mb-4">You&apos;re on the list!</h2>
                <p className="text-content-secondary max-w-sm font-medium">We&apos;ll reach out shortly to discuss your integration with Offer Hub.</p>
            </div>
        );
    }

    return (
        <section id="waitlist-form" className="py-32 bg-transparent relative">
            <div className="mx-auto max-w-2xl px-6">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-theme-primary mb-4">Join the ecosystem</p>
                    <h2 className="text-4xl font-black text-content-primary tracking-tighter sm:text-5xl leading-none">
                        Scale your <span className="text-theme-primary">Vision</span>
                    </h2>
                    <p className="mt-6 text-lg text-content-secondary font-medium leading-relaxed">
                        Ready to integrate? Leave your details and join the next wave of payments.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-10 rounded-[2.5rem] bg-bg-elevated shadow-neu-raised flex flex-col gap-8"
                >
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-fadeIn">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-content-secondary ml-2">Full Name</label>
                        <div className="relative group">
                            <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-theme-primary transition-colors" />
                            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" disabled={isLoading} className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-bg-sunken shadow-neu-sunken-subtle text-sm text-content-primary placeholder:text-content-muted border-none outline-none focus:ring-2 focus:ring-theme-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-content-secondary ml-2">Email Address</label>
                        <div className="relative group">
                            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-theme-primary transition-colors" />
                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" disabled={isLoading} className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-bg-sunken shadow-neu-sunken-subtle text-sm text-content-primary placeholder:text-content-muted border-none outline-none focus:ring-2 focus:ring-theme-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-content-secondary ml-2">For what would you use Offer Hub?</label>
                        <div className="relative group">
                            <MessageSquare size={16} className="absolute left-5 top-6 text-content-muted group-focus-within:text-theme-primary transition-colors" />
                            <textarea required rows={3} name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="Tell us about your marketplace or project..." disabled={isLoading} className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-bg-sunken shadow-neu-sunken-subtle text-sm text-content-primary placeholder:text-content-muted border-none outline-none focus:ring-2 focus:ring-theme-primary transition-all font-medium resize-none disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-content-secondary ml-2">How did you hear about us?</label>
                        <div className="relative group">
                            <Send size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-theme-primary transition-colors" />
                            <input required type="text" name="referral" value={formData.referral} onChange={handleInputChange} placeholder="X, Telegram, Friend, etc." disabled={isLoading} className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-bg-sunken shadow-neu-sunken-subtle text-sm text-content-primary placeholder:text-content-muted border-none outline-none focus:ring-2 focus:ring-theme-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-neumorphic-primary mt-4 w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </form>
            </div>
        </section>
    );
}
