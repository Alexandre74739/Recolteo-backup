import Btn from "../components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <h1 className="text-5xl text-center font-bold text-sapin">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-sapin text-center tracking-tight mt-1">Page Not Found</h2>
            <p className="text-sapin text-center text-sm max-w-[280px] leading-relaxed">The page you are looking for does not exist.</p>
            <div className="flex justify-center mt-4">
                <Btn label="Retour à l'accueil" href="/" variant="sapin" size="sm" showArrow={false} />
            </div>
        </div>
    );
}
