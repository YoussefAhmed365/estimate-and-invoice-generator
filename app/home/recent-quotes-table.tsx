"use client";

import { getQuotes, deleteQuote } from "@/actions/actions";
import { IQuote } from "@/components/interfaces/IQuotes"
import { useState, useEffect } from "react";
import Badge from "@/components/UI/Badge";
import Button from "@/components/UI/Button";
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

function QuotesTableRows({ quotes, onDelete }: { quotes: IQuote[], onDelete: (id: string) => void }) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const router = useRouter();

    // Check for any quotes
    if (!quotes || quotes.length === 0) {
        return (
            <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-text-secondary italic">
                    No quotes found.
                </td>
            </tr>
        );
    }

    // Navigate to update on click on quote
    function NavigateToQuoteUpdate(id: string) {
        router.push(`quote/update-estimate?id=${id}`);
    }

    // Quotes' Initial Colors
    const initialTextColor = ["text-blue-400", "text-purple-400", "text-orange-400", "text-teal-400", "text-pink-400"];
    const initialBGColor = ["bg-blue-500/20", "bg-purple-500/20", "bg-orange-500/20", "bg-teal-500/20", "bg-pink-500/20"];
    const initialRingColor = ["ring-blue-500/30", "ring-purple-500/30", "ring-orange-500/30", "ring-teal-500/30", "ring-pink-500/30"];

    return (
        <>
            {quotes.map((quote: IQuote, index: number) => {
                const initials = quote.clientName
                    ? quote.clientName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'N/A';

                const dateCreated = quote.createdAt
                    ? new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                const formattedTotal = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(quote.grandTotal || 0);

                const quoteId = quote._id?.toString();

                return (
                    <tr key={quoteId ?? index} onClick={() => NavigateToQuoteUpdate(quoteId)} className="group hover:bg-white/3 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`size-9 rounded-lg ${initialBGColor[index % initialBGColor.length]} flex items-center justify-center ${initialTextColor[index % initialTextColor.length]} font-bold text-xs ${initialRingColor[index % initialRingColor.length]}`}>
                                    {initials}
                                </div>
                                <span className={`font-semibold ${quote.clientName != "" ? "text-white" : "text-text-secondary"}`}>{quote.clientName != "" ? quote.clientName : "Not Specified"}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-text-secondary font-medium">{quote.projectName != "" ? quote.projectName : "Not Specified"}</td>
                        <td className="px-6 py-4 text-text-secondary text-sm">{dateCreated}</td>
                        <td className="px-6 py-4">
                            <Badge state={quote.status} />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-white tracking-wide">{formattedTotal}</td>
                        <td className="px-6 py-4 text-right relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenDropdownId(openDropdownId === quoteId ? null : quoteId ?? null);
                                }}
                                className="text-text-secondary hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5 relative z-10"
                            >
                                <EllipsisVerticalIcon className="size-5" />
                            </button>

                            {openDropdownId === quoteId && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setOpenDropdownId(null);
                                        }}
                                    />
                                    <div className="absolute right-12 top-10 w-36 bg-[#252525] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (window.confirm("Are you sure you want to delete this quote?")) {
                                                    onDelete(quoteId!);
                                                }
                                                setOpenDropdownId(null);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium border-b border-transparent relative z-50 cursor-pointer"
                                        >
                                            Delete Quote
                                        </button>
                                    </div>
                                </>
                            )}
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default function RecentQuotesTable({ title = "Recent Quotes" }: { title?: string }) {
    const [quotes, setQuotes] = useState<IQuote[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    async function handleDelete(id: string) {
        try {
            const result = await deleteQuote(id);
            if (result.success) {
                setQuotes(prevQuotes => {
                    const newQuotes = prevQuotes.filter(q => q._id?.toString() !== id);
                    const newTotalPages = Math.ceil(newQuotes.length / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                    return newQuotes;
                });
            } else {
                alert("Failed to delete quote");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the quote");
        }
    }

    useEffect(() => {
        async function fetchQuotes() {
            try {
                const allQuotes = await getQuotes();
                setQuotes(allQuotes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuotes();
    }, []);

    const totalQuotes = quotes.length;
    const totalPages = Math.ceil(totalQuotes / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentQuotes = quotes.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startItem = totalQuotes > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(endIndex, totalQuotes);

    return (
        <div className="flex flex-col bg-secondary-background rounded-xl border border-white/10 shadow-xl overflow-hidden mt-12">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold leading-tight text-white">{title}</h2>
                <label className="flex items-center w-full md:w-80 h-10 rounded-lg bg-[#252525] border border-white/10 focus-within:ring-2 focus-within:ring-electric-blue focus-within:border-transparent transition-all overflow-hidden group">
                    <div className="flex items-center justify-center pl-3 text-text-secondary group-focus-within:text-electric-blue transition-colors">
                        <MagnifyingGlassIcon className="size-5" />
                    </div>
                    <input className="w-full h-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-text-secondary px-3" placeholder="Search client or project..." />
                </label>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#1a1a1a] border-b border-white/10 text-xs uppercase text-text-secondary font-bold tracking-wider">
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Project Name</th>
                            <th className="px-6 py-4">Date Created</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Grand Total</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-8 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-1/2 w-8 h-8 border-4 border-white/90 border-t-transparent rounded-full animate-spin"></div>
                                </td>
                            </tr>
                        ) : (
                            <QuotesTableRows quotes={currentQuotes} onDelete={handleDelete} />
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#1a1a1a]">
                <p className="text-sm text-text-secondary">Showing <span className="font-bold text-white">{startItem}-{endItem}</span> of <span className="font-bold text-white">{totalQuotes}</span> results</p>
                <div className="flex gap-2">
                    <Button type="button" styleType="secondarySmall" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                    <Button type="button" styleType="secondarySmall" onClick={handleNextPage} disabled={currentPage === totalPages || totalQuotes === 0}>Next</Button>
                </div>
            </div>
        </div>
    );
}