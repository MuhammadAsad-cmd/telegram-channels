"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, User, MessageSquare, Send, Loader2, Headphones, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createContact } from "@/lib/api/contactService";

const CONTACT_EMAIL = "abraham.uk.org@gmail.com";

const inputBase =
  "w-full px-4 py-3 rounded-lg bg-secondary-dark/60 border border-white/10 text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all duration-200";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, username, subject, message } = formData;

    if (!email?.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!username?.trim()) {
      toast.error("Please enter your username");
      return;
    }
    if (!subject?.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message?.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setSubmitting(true);
    try {
      await createContact({
        email: email.trim(),
        username: username.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setFormData({ email: "", username: "", subject: "", message: "" });
      toast.success("Message sent successfully. We'll get back to you soon.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to send message. Please try again or email us directly.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Hero header */}
      <section className="hero-grid-bg relative border-b border-white/6">
        <div className="hero-gradient-overlay absolute inset-0 pointer-events-none" />
        <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-16 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-text-muted text-lg">
              Have questions? Need help adding your channel? We&apos;re here to help and typically
              respond within 1–2 business days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Form card - takes 2 cols on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-secondary-dark/40 border border-white/6 p-6 md:p-8 backdrop-blur-sm">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-secondary/20 flex items-center justify-center">
                    <Send className="w-8 h-8 text-accent-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Message sent successfully
                  </h3>
                  <p className="text-text-muted mb-6 max-w-md mx-auto">
                    We&apos;ve received your message and will respond within a few business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="cursor-pointer text-accent-primary hover:text-accent-primary/80 font-medium text-sm transition-colors"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`${inputBase} pl-10`}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="your_username"
                          className={`${inputBase} pl-10`}
                          autoComplete="username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-text-primary">
                      Subject
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. How do I add my channel?"
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-text-primary">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your question or request..."
                      className={`${inputBase} resize-y min-h-[140px]`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium transition-all duration-200"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="rounded-xl bg-secondary-dark/30 border border-white/6 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-text-primary">Direct email</h3>
              </div>
              <p className="text-text-muted text-sm mb-3">
                Prefer to email directly?
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent-primary hover:underline text-sm font-medium break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="rounded-xl bg-secondary-dark/30 border border-white/6 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-secondary" />
                </div>
                <h3 className="font-semibold text-text-primary">Report an issue</h3>
              </div>
              <p className="text-text-muted text-sm mb-4">
                Found a channel that violates our guidelines? Describe the issue and include the
                relevant link when you contact us.
              </p>
              <Link
                href="/terms-of-service"
                className="text-accent-primary hover:underline text-sm font-medium"
              >
                View Terms of Service →
              </Link>
            </div>

            <div className="rounded-xl bg-secondary-dark/30 border border-white/6 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-yellow/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-yellow" />
                </div>
                <h3 className="font-semibold text-text-primary">Legal & privacy</h3>
              </div>
              <p className="text-text-muted text-sm mb-4">
                For privacy or legal inquiries, see our policies.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link href="/privacy-policy" className="text-accent-primary hover:underline text-sm font-medium">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-accent-primary hover:underline text-sm font-medium">
                  Terms of Service
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
