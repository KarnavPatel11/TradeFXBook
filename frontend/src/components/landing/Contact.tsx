"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Send } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Get in <span className="text-accent">Touch</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Have questions, feedback, or need premium support? We're here to help you succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 flex flex-col gap-6"
          >
            <a 
              href="mailto:support@tradefxbook.com"
              className="glass-card p-6 flex items-center gap-6 rounded-2xl hover:border-accent/40 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="text-sm text-text-secondary font-medium mb-1">Email Us</h4>
                <p className="text-lg font-bold">support@tradefxbook.com</p>
              </div>
            </a>

            <a 
              href="https://wa.me/1234567890" target="_blank" rel="noreferrer"
              className="glass-card p-6 flex items-center gap-6 rounded-2xl hover:border-success/40 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <h4 className="text-sm text-text-secondary font-medium mb-1">WhatsApp Support</h4>
                <p className="text-lg font-bold">+1 (234) 567-890</p>
              </div>
            </a>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20">
              <h4 className="font-bold mb-2">Priority Support Included</h4>
              <p className="text-sm text-text-secondary">Expected response time within 24 hours.</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 glass-card p-8 rounded-3xl border-white/5"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary" htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  required
                  rows={5}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white resize-y"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-accent hover:bg-primary-hover text-white font-bold transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
