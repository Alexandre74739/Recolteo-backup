"use client";

import { useState } from "react";
import Hero from "../../components/sections/Hero";
import Reveal from "../../components/animations/Reveal";

export default function Contact() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div>
            <Hero
                title="Nous restons"
                subtitle="à votre"
                labelTitle="disposition"
                spanTitle="pour"
                endTitle="toute question"
                description="Contactez-nous via le formulaire ci-dessous, nous vous répondrons rapidement."
                primaryButton="Explorer la plateforme"
                primaryButtonHref="./decouvrir-recolteo"
                secondaryButton="Profiter des offres"
                secondaryButtonHref="./dashboard"
             />
        </div>
    )
}