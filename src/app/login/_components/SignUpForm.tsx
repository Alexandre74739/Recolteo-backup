"use client";

import {
  Fragment,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { signUp, type ActionState } from "../actions";
import Input from "@/src/components/ui/primitives/Input";
import Button from "@/src/components/ui/primitives/Button";
import TabToggle from "@/src/components/ui/primitives/TabToggle";
import Checkbox from "@/src/components/ui/primitives/Checkbox";
import {
  writeCookieConsent,
  readCookieConsent,
} from "@/src/lib/cookie-consent";

type Role = "commercant" | "association";

const ROLE_TABS = [
  { value: "commercant", label: "Commerçant" },
  { value: "association", label: "Association" },
];

type Step1Data = {
  role: Role;
  nom: string;
  email: string;
  tel: string;
  password: string;
  confirmPassword: string;
};

type Step2Data = {
  name_entreprise: string;
  adresse: string;
  rna: string;
  type_asso: string;
  accept_geolocation: boolean;
  siret: string;
  type_activity: string;
  forme_juridique: string;
};

const TEL_RE = /^(?:\+33|0033|0)[1-9]\d{8}$/;
const SIRET_RE = /^\d{14}$/;
const RNA_RE = /^W\d{9}$/i;

function captureStep2(form: HTMLFormElement): Step2Data {
  const fd = new FormData(form);
  return {
    name_entreprise: (fd.get("name_entreprise") as string) ?? "",
    adresse: (fd.get("adresse") as string) ?? "",
    rna: (fd.get("rna") as string) ?? "",
    type_asso: (fd.get("type_asso") as string) ?? "",
    accept_geolocation: fd.get("accept_geolocation") === "on",
    siret: (fd.get("siret") as string) ?? "",
    type_activity: (fd.get("type_activity") as string) ?? "",
    forme_juridique: (fd.get("forme_juridique") as string) ?? "",
  };
}

export default function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, {} as ActionState);
  const [step, setStep] = useState<1 | 2>(1);
  const [s1, setS1] = useState<Step1Data>({
    role: "commercant",
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
  });
  const [s2, setS2] = useState<Step2Data>({
    name_entreprise: "",
    adresse: "",
    rna: "",
    type_asso: "",
    accept_geolocation: false,
    siret: "",
    type_activity: "",
    forme_juridique: "",
  });
  const [acceptsCgu, setAcceptsCgu] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const step2FormRef = useRef<HTMLFormElement>(null);

  const isTelError = !!state.error?.includes("téléphone");

  useEffect(() => {
    if (!isTelError || !step2FormRef.current) return;
    setS2(captureStep2(step2FormRef.current));
    setLocalError(state.error);
    setStep(1);
  }, [state.error, isTelError]);

  function handleStep1(e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Step1Data = {
      role: s1.role,
      nom: fd.get("nom") as string,
      email: fd.get("email") as string,
      tel: fd.get("tel") as string,
      password: fd.get("password") as string,
      confirmPassword: fd.get("confirmPassword") as string,
    };

    const telNorm = data.tel.replace(/[\s.\-()]/g, "");
    if (!TEL_RE.test(telNorm)) {
      setLocalError("Numéro de téléphone invalide (ex : 06 12 34 56 78).");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (data.password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLocalError(undefined);
    setS1({ ...data, tel: telNorm });
    setStep(2);
  }

  function handleBack() {
    if (step2FormRef.current) setS2(captureStep2(step2FormRef.current));
    setLocalError(undefined);
    setStep(1);
  }

  function handleStep2(e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (s1.role === "association") {
      const rna = (fd.get("rna") as string).trim().toUpperCase();
      if (!RNA_RE.test(rna)) {
        setLocalError(
          "Le numéro RNA doit commencer par W suivi de 9 chiffres (ex : W751000000).",
        );
        return;
      }
      fd.set("rna", rna);
    } else {
      const siret = (fd.get("siret") as string).replace(/\s/g, "");
      if (!SIRET_RE.test(siret)) {
        setLocalError("Le SIRET doit contenir exactement 14 chiffres.");
        return;
      }
      fd.set("siret", siret);
    }

    if (!acceptsCgu) {
      setLocalError("Veuillez accepter les CGU et la politique de confidentialité pour continuer.");
      return;
    }

    setLocalError(undefined);

    if (s1.role === "association") {
      const current = readCookieConsent();
      writeCookieConsent({
        ...current,
        geolocalisation: s2.accept_geolocation,
        consented: true,
      });
    }

    fd.append("password", s1.password);
    fd.append("confirmPassword", s1.confirmPassword);
    startTransition(() => action(fd));
  }

  const isAsso = s1.role === "association";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        {([1, 2] as const).map((n, i) => (
          <Fragment key={n}>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${step === n
                  ? "text-sapin"
                  : step > n
                    ? "text-sapin/60"
                    : "text-sapin/25"
                }`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${step > n
                    ? "bg-sapin border-sapin text-cream"
                    : step === n
                      ? "border-sapin bg-sapin/10 text-sapin"
                      : "border-sapin/20 text-sapin/30"
                  }`}
              >
                {step > n ? "✓" : n}
              </span>
              {n === 1 ? "Votre compte" : "Votre structure"}
            </div>
            {i === 0 && (
              <div
                key="sep"
                className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${step > 1 ? "bg-sapin/40" : "bg-sapin/10"
                  }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-sapin">
              Type de compte <span className="text-peach">*</span>
            </p>
            <TabToggle
              tabs={ROLE_TABS}
              active={s1.role}
              onChange={(v) => setS1((p) => ({ ...p, role: v as Role }))}
              fullWidth
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                id="nom"
                name="nom"
                label="Nom complet"
                required
                placeholder="Jean Dupont"
                defaultValue={s1.nom}
              />
            </div>
            <Input
              id="email-up"
              name="email"
              label="Email"
              type="email"
              required
              placeholder="E-mail"
              defaultValue={s1.email}
            />
            <Input
              id="tel"
              name="tel"
              label="Téléphone"
              type="tel"
              required
              placeholder="06 00 00 00 00"
              defaultValue={s1.tel}
            />
            <Input
              id="pwd"
              name="password"
              label="Mot de passe"
              type="password"
              required
              placeholder="Min. 8 caractères"
              defaultValue={s1.password}
            />
            <Input
              id="cpwd"
              name="confirmPassword"
              label="Confirmer"
              type="password"
              required
              placeholder="••••••••"
              defaultValue={s1.confirmPassword}
            />
          </div>

          {localError && <ErrorMsg text={localError} />}

          <Button
            label="Continuer"
            type="submit"
            variant="sapin"
            className="mt-1 w-full justify-center"
          />
        </form>
      )}

      {step === 2 && (
        <form
          ref={step2FormRef}
          onSubmit={handleStep2}
          className="flex flex-col gap-4"
        >
          {(Object.keys(s1) as (keyof Step1Data)[])
            .filter((k) => k !== "password" && k !== "confirmPassword")
            .map((k) => (
              <input key={k} type="hidden" name={k} value={s1[k]} />
            ))}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                id="name_entreprise"
                name="name_entreprise"
                label={isAsso ? "Nom de l'association" : "Nom de l'entreprise"}
                required
                placeholder={
                  isAsso ? "Les Restos du Cœur" : "Ma Boulangerie SAS"
                }
                defaultValue={s2.name_entreprise}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                id="adresse"
                name="adresse"
                label="Adresse"
                required
                placeholder="12 rue de la Paix, 75001 Paris"
                defaultValue={s2.adresse}
              />
            </div>

            {isAsso ? (
              <>
                <Input
                  id="rna"
                  name="rna"
                  label="Numéro RNA"
                  required
                  placeholder="W751000000"
                  defaultValue={s2.rna}
                />
                <Input
                  id="type_asso"
                  name="type_asso"
                  label="Type d'association"
                  required
                  placeholder="Aide alimentaire…"
                  defaultValue={s2.type_asso}
                />
                <div className="sm:col-span-2">
                  <Checkbox
                    id="accept_geolocation"
                    name="accept_geolocation"
                    label="Autoriser la géolocalisation de mon adresse"
                    description="Votre adresse sera géocodée via l'API officielle de la Base Adresse Nationale pour vous permettre de filtrer les lots par proximité. Modifiable à tout moment dans vos préférences cookies."
                    checked={s2.accept_geolocation}
                    onChange={(v) =>
                      setS2((p) => ({ ...p, accept_geolocation: v }))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <Input
                  id="siret"
                  name="siret"
                  label="SIRET"
                  required
                  placeholder="123 456 789 00012"
                  defaultValue={s2.siret}
                />
                <Input
                  id="type_activity"
                  name="type_activity"
                  label="Type d'activité"
                  required
                  placeholder="Boulangerie…"
                  defaultValue={s2.type_activity}
                />
                <div className="sm:col-span-2">
                  <Input
                    id="forme_juridique"
                    name="forme_juridique"
                    label="Forme juridique"
                    required
                    placeholder="SAS, SARL, EI…"
                    defaultValue={s2.forme_juridique}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-start gap-3 p-4 bg-sapin/5 border border-sapin/10 rounded-xl">
            <input
              type="checkbox"
              id="accept_cgu"
              checked={acceptsCgu}
              onChange={(e) => setAcceptsCgu(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-sapin shrink-0 cursor-pointer"
            />
            <label htmlFor="accept_cgu" className="text-sm text-sapin/80 leading-relaxed cursor-pointer">
              J'ai lu et j'accepte les{" "}
              <Link href="/mentions-legales" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-sapin transition-colors">
                Conditions Générales d'Utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-sapin transition-colors">
                politique de confidentialité
              </Link>{" "}
              de Récoltéo. <span className="text-peach font-semibold">*</span>
            </label>
          </div>

          {(localError || (state.error && !isTelError)) && (
            <ErrorMsg text={localError ?? state.error!} />
          )}

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3.5 rounded-xl border-2 border-sapin/20 text-sapin text-sm font-semibold hover:border-sapin/50 transition-colors"
            >
              ← Retour
            </button>
            <Button
              label={pending ? "Création…" : "Créer mon compte"}
              type="submit"
              disabled={pending}
              variant="sapin"
              className="flex-1 justify-center"
            />
          </div>
        </form>
      )}
    </div>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
      {text}
    </p>
  );
}
