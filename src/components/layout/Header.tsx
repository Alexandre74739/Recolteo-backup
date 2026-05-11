import Link from "next/link";
import Btn from "../ui/Button";

export default function Header() {
  return (
    <header className="border-2 border-sapin gap-4 flex items-center px-8 py-4">
        <p>Récoltéo</p>
        <ul>
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
        <div className="flex gap-4">
            <Btn label={"Se connecter"} href="./" variant="sapin" />
            <Btn label={"S'inscrire"} href="./" variant="sapin" />
        </div>
    </header>
  );
}