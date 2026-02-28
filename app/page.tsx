import OverviewCards from "@/app/home/overview-cards";
import RecentQuotesTable from "@/app/home/recent-quotes-table";

export default function Home() {
    return (
        <main className="p-7 md:p-14">
            <h1 className="text-5xl font-bold">Dashboard</h1>
            <span className="text-white/70">Overview of your projects estimates & invoices</span>
            <OverviewCards />
            <RecentQuotesTable />
        </main>
    );
}
