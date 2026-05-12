"use client";

import { useState } from "react";
import Btn from "../ui/Button";
import href from "../ui/Button";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) return (
    <div className="text-center py-10">
      <p className="text-sapin font-semibold">Message envoyé !</p>
      <p className="text-sapin/50 text-sm mt-1">On revient vers vous rapidement.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto px-4 py-16">
      <input name="nom"        type="text"  required placeholder="Nom"               className="border border-sapin/20 rounded-lg px-4 py-3 text-sapin placeholder:text-sapin/30 text-sm focus:outline-none focus:border-sapin/60 transition-colors bg-transparent" />
      <input name="entreprise" type="text"           placeholder="Nom de l'entreprise" className="border border-sapin/20 rounded-lg px-4 py-3 text-sapin placeholder:text-sapin/30 text-sm focus:outline-none focus:border-sapin/60 transition-colors bg-transparent" />
      <input name="email"      type="email" required placeholder="Email"              className="border border-sapin/20 rounded-lg px-4 py-3 text-sapin placeholder:text-sapin/30 text-sm focus:outline-none focus:border-sapin/60 transition-colors bg-transparent" />
      <textarea name="message" required rows={5}     placeholder="Votre message..."   className="border border-sapin/20 rounded-lg px-4 py-3 text-sapin placeholder:text-sapin/30 text-sm focus:outline-none focus:border-sapin/60 transition-colors bg-transparent resize-none" />
      <Btn label="Envoyer le message" variant="sapin" size="md" href="#" showArrow={true} />
    </form>
  );
}