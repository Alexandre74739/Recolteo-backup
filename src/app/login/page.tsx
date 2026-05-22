"use client";

import LoginForm from "./_components/LoginForm";
import Image from "next/image";
import Ecureuil from "@/src/asset/ecureuil.webp";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [showMascot, setShowMascot] = useState(false);
  const [hasSeenMascot, setHasSeenMascot] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenMascot");

    if (!seen) {
      setShowMascot(true);
      setHasSeenMascot(false);
    }
  }, []);

  useEffect(() => {
    if (showMascot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMascot]);

  useEffect(() => {
    if (!showMascot) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, [showMascot]);

  const handleDismiss = () => {
    setShowMascot(false);
    localStorage.setItem("hasSeenMascot", "true");
  };

  return (
    <main className="relative w-full flex flex-col sm:flex-row items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-10 gap-1 overflow-hidden">

      <LoginForm />

      {!hasSeenMascot && showMascot && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={handleDismiss}
        />
      )}

      {!hasSeenMascot && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out
            ${showMascot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}
        >
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ease: "easeOut" }}
            className="absolute right-16 sm:right-32"
            style={{ bottom: "100%" , marginBottom: "-60px" }}
          >
            <Image
              src={Ecureuil}
              alt="écureuil Récoltéo"
              width={220}
              height={220}
              className="object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: "easeOut" }}
            className="w-full bg-amber-50 border-t-4 border-sapin px-6 py-5 shadow-2xl"
          >

            <div className="inline-block bg-lime/20 border-2 border-sapin rounded px-4 py-1 mb-1">
              <span className="text-sapin font-semibold text-sm tracking-wide">Léo</span>
            </div>

            <div className="relative">
              <p className="text-sapin text-base leading-relaxed font-medium max-w-2xl">
                Bienvenue sur Récoltéo, accédez à votre espace.
              </p>

              <div className="absolute bottom-0 right-4 w-0 h-0
                border-l-[6px] border-l-transparent
                border-r-[6px] border-r-transparent
                border-t-[8px] border-t-sapin animate-bounce">
              </div>
            </div>

            <p className="text-lime text-xs mt-3">Cliquez pour continuer...</p>
          </motion.div>
        </div>
      )}
    </main>
  );
}
