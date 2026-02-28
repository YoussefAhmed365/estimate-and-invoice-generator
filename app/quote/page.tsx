import RecentQuotesTable from "@/app/home/recent-quotes-table";

export default function QuotePage() {
    return (
        <main className="p-7 md:p-14">
            <h1 className="text-5xl font-bold text-white mb-2">Quotes</h1>
            <span className="text-white/70 mb-8 block">View and manage all your quotes</span>
            <RecentQuotesTable title="All Quotes" />
        </main>
    );
}
