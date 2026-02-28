"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/UI/Button";
import logo from "@/public/logo.avif";
import { usePathname } from "next/navigation";
import '@/styles/navbar.css';

const Tabs = [
    {
        name: "Dashboard",
        href: "/"
    },
    {
        name: "Quotes",
        href: "/quote"
    },
    {
        name: "Estimates",
        href: "/quote/create-estimate"
    },
]

export default function Navbar() {
    // set "active-navlink" className for  li based on current path (URL)
    const currentPath = usePathname();

    return (
        <nav className="bg-secondary-background w-full flex flex-col md:flex-row justify-center md:justify-between items-start md:items-center gap-4 md:gap-0 py-4 px-8 border-b-2 border-white/15">
            <div className="flex justify-center items-center gap-x-2">
                <Image height={40} width={40} alt="Logo" src={logo} className="rounded-lg" />
                <h1 className="text-xl font-bold">QuickQuote</h1>
            </div>
            <div className="flex flex-col md:flex-row w-full md:w-fit justify-center items-center gap-6 md:gap-4">
                <ul className="flex justify-center items-center gap-x-4">
                    {Tabs.map((tab) => (
                        <li key={tab.name} className={`navlink hover:text-blue-600 ${currentPath == tab.href ? "active-navlink text-blue-600 hover:text-blue-700" : ""}`}>
                            <Link href={tab.href}>{tab.name}</Link>
                        </li>
                    ))}
                </ul>
                {currentPath != '/quote/create-estimate' &&
                    <Link href="/quote/create-estimate">
                        <Button type="button" styleType="primary">Create Quote</Button>
                    </Link>
                }
            </div>
        </nav>
    );
}