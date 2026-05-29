"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Ecureuil from "@/src/asset/ecureuil.webp";
import Button from "@/src/components/ui/primitives/Button";

interface LeoStep {
  message: string;
}

interface UseLeoOptions {
  storageKey?: string;
  steps: LeoStep[];
}

export function useLeo({ storageKey, steps }: UseLeoOptions) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const key = storageKey ?? "recolteo_leo_seen_v1";
    try {
      const seen = localStorage.getItem(key);
      setShow(!seen);
    } catch (err) {
      setShow(true);
    }
  }, [storageKey]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  const dismiss = () => {
    const key = storageKey ?? "recolteo_leo_seen_v1";
    try {
      localStorage.setItem(key, "1");
    } catch (err) {}
    setShow(false);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setVisible(true);
      }, 250);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (step > 0) {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => s - 1);
        setVisible(true);
      }, 250);
    }
  };

  return {
    step,
    show,
    visible,
    isLastStep: step === steps.length - 1,
    currentMessage: steps[step]?.message ?? "",
    dismiss,
    next,
    prev,
  };
}

export default function Leo({ storageKey, steps }: UseLeoOptions) {
  const {
    show,
    visible,
    currentMessage,
    step,
    isLastStep,
    next,
    prev,
  } = useLeo({ storageKey, steps });

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="fixed inset-0 bg-black/30"
            onClick={next}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="fixed bottom-3 inset-x-3 z-50 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-20 w-full bg-cream border-2 border-sapin rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 bg-sapin rounded-full px-4 py-1">
                    <span className="text-cream font-semibold text-sm tracking-wide">Léo</span>
                  </div>
                  <div className="flex gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === step ? "w-6 bg-sapin" : "w-1.5 bg-sapin/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  layout
                  className="relative flex flex-col items-start justify-between gap-4 h-auto min-h-[7rem] sm:min-h-[5rem] mt-4"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <AnimatePresence mode="wait">
                    {visible && (
                      <motion.p
                        key={step}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-sapin italic text-md leading-relaxed max-w-full px-4 py-3 sm:px-6 my-3"
                      >
                        {currentMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="flex justify-between">
                  <h2 className="text-sapin font-bold text-xl">Récoltéo</h2>
                  <div className="flex gap-2">
                    <AnimatePresence>
                      {step > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            label="Précédent"
                            onClick={() => prev()}
                            variant="peach-outline"
                            size="sm"
                            showArrow={false}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button
                      label={isLastStep ? "Terminer" : "Suivant"}
                      onClick={() => next()}
                      variant="sapin"
                      size="sm"
                      showArrow={!isLastStep}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="z-10 absolute right-4 sm:right-32"
              style={{ bottom: "100%", marginBottom: "-60px" }}
            >
              <Image
                src={Ecureuil}
                alt="écureuil Récoltéo"
                width={270}
                height={270}
                className="object-contain w-[180px] sm:w-[290px]"
              />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
