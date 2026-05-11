import Link from "next/link";
import Btn from "../ui/Button";

export default function Header() {
  return (
    <header className="w-full fixed top-0 border-3 border-sapin gap-4 flex items-center px-8 py-4 rounded-xl">
        <p className="text-sapin text-4xl font-bold">Récoltéo</p>
        <ul className="flex gap-6 items-center">
            <li>
                <Link href="/dashboard" className="text-sapin text-2xl font-bold hover:underline">
                    Dashboard
                </Link>
            </li>
            <li>
                <Link href="/about" className="text-sapin text-2xl font-bold hover:underline">
                    About
                </Link>
            </li>
            <li>
                <Link href="/contact" className="text-sapin text-2xl font-bold hover:underline">
                    Contact
                </Link>
            </li>
            <li>
                <Link href="/blog" className="text-sapin text-2xl font-bold hover:underline">
                    Blog
                </Link>
            </li>
        </ul>
        <div className="flex gap-4 ml-auto">
            <Btn label={"Se connecter"} href="./" variant="sapin" />
            <Btn label={"S'inscrire"} href="./" variant="peach" />
        </div>
    </header>
  );
}