"use client";

import { useState } from "react";
import { MessageCircle, Phone, ChevronRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModernSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[310px] overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-3 shadow-[0_20px_50px_rgba(107,17,208,0.2)] backdrop-blur-xl sm:w-[325px]"
          >
            {/* HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6B11D0] to-[#4C1D95] p-4 text-white shadow-inner">
              {/* Glow Accent */}
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold tracking-tight text-white">
                     TechBasket
                    </h3>
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-purple-200">
                    We usually reply in a few minutes
                  </p>
                </div>

                {/* Active Indicator */}
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* ACTION OPTIONS */}
            <div className="mt-2.5 space-y-1.5">
              {/* Messenger */}
              <motion.a
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                href="https://m.me/your-facebook-page"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-100/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#006AFF] to-[#00B2FF] text-white shadow-sm shadow-blue-500/30">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.377 2 1.8 6.276 1.8 11.551c0 3.003 1.459 5.673 3.738 7.426V22l2.91-1.597c1.104.306 2.282.473 3.552.473 5.623 0 10.2-4.276 10.2-9.551S17.623 2 12 2zm1.012 12.871l-2.6-2.77-5.074 2.77 5.58-5.922 2.663 2.77 5.011-2.77-5.58 5.922z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Facebook Messenger
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400">
                      Instant message
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/8801793948085"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-100/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-sm shadow-emerald-500/30">
                    <MessageCircle className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      WhatsApp
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400">
                      Fast support chat
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
              </motion.a>

              {/* Call Support */}
              <motion.a
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                href="tel:+880324554459"
                className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-100/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6B11D0] to-[#A855F7] text-white shadow-sm shadow-purple-500/30">
                    <Phone className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Direct Call
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400">
                      +880 3245-54459
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#6B11D0] to-[#9333EA] text-white shadow-[0_10px_25px_rgba(107,17,208,0.4)] border border-white/20"
        aria-label="Toggle Support"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageCircle size={22} className="fill-current" />
              {/* Online Notification Pulse on Floating Icon */}
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#6B11D0]" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ModernSupportWidget;