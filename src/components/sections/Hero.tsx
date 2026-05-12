import Btn from "../ui/Button";
import Reveal from "../animations/Reveal";

interface HeroProps {
  title: string;
  subtitle: string;
  labelTitle: string;
  spanTitle: string;
  endTitle: string;
  description: string;
  primaryButton: string;
  primaryButtonHref: string;
  secondaryButton: string;
  secondaryButtonHref: string;
}

export default function Hero({
  title,
  subtitle,
  labelTitle,
  spanTitle,
  endTitle,
  description,
  primaryButton,
  primaryButtonHref,
  secondaryButton,
  secondaryButtonHref
}: HeroProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal delay={0}>
          <h1 className="text-sapin font-black mb-6">
            {title}
            <br />
            {subtitle}{" "}
            <span className="relative italic whitespace-nowrap">
              <span
                className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                aria-hidden="true"
              />
              <span className="relative">{labelTitle}</span>
            </span>
            <br />
            <span className="italic text-peach">{spanTitle}</span> {endTitle}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-sapin max-w-xl mx-auto mb-10">{description}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Btn label={primaryButton} href={primaryButtonHref} variant="sapin" />
            <Btn label={secondaryButton} href={secondaryButtonHref} variant="peach" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
