"use client";

import {
	CalendarDays,
	Check,
	FileBarChart,
	LoaderCircle,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Sale = {
	id: string;
	customer: string;
	saleDate: string;
	salesPerson: string;
	totalAmount: string;
};

const branches = [
	"Dhaka Main Branch",
	"Chittagong Hub",
	"Sylhet Outlet",
	"Rajshahi Center",
];

const pendingSales: Sale[] = [
	{
		id: "SALE-000242",
		customer: "Acme Corporation",
		saleDate: "2024-10-24",
		salesPerson: "John Smith",
		totalAmount: "$ 14,250.00",
	},
	{
		id: "SALE-000245",
		customer: "Global Industries Ltd",
		saleDate: "2024-10-24",
		salesPerson: "Alice Johnson",
		totalAmount: "$ 3,800.50",
	},
	{
		id: "SALE-000248",
		customer: "Tech Group Inc",
		saleDate: "2024-10-25",
		salesPerson: "Michael Davis",
		totalAmount: "$ 22,100.00",
	},
	{
		id: "SALE-000251",
		customer: "Omega Logistics",
		saleDate: "2024-10-25",
		salesPerson: "Sarah Wilson",
		totalAmount: "$ 1,450.75",
	},
];

export default function SalesApproval() {
	const [selectedSaleId, setSelectedSaleId] = useState(pendingSales[0].id);
	const [selectedBranch, setSelectedBranch] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const selectedSale = useMemo(
		() => pendingSales.find((sale) => sale.id === selectedSaleId),
		[selectedSaleId]
	);

	const handleLoad = () => {
		setIsLoading(true);
		setMessage("");
		window.setTimeout(() => setIsLoading(false), 500);
	};

	const handleClear = () => {
		setSelectedBranch("");
		setFromDate("");
		setToDate("");
		setSelectedSaleId("");
		setMessage("");
	};

	const handleApproval = () => {
		if (!selectedSale) {
			setMessage("Select one sale to continue.");
			return;
		}

		setMessage(`${selectedSale.id} approved successfully.`);
	};

	return (
		<section className="min-h-[calc(100vh-72px)] bg-[#f8fafc] px-4 py-10 text-[#1f2937] sm:px-8 lg:px-12">
			<div className="mx-auto flex min-h-170 max-w-5xl flex-col">
				<header className="mb-6">
					  <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#20262d]">
						SALES APPROVAL
					</h1>
					  <p className="mt-1 text-[14px] text-[#5d6672]">
						Load pending sales and select one sale for approval.
					</p>
				</header>

				<div className="rounded-xl border border-[#d6dbe3] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.1fr_1fr_1fr_auto] sm:items-end">
						<label className="block text-[12px] font-bold text-[#515b68]">
							Branch Name <span className="text-[#d33b46]">*</span>
							<div className="relative mt-1">
								<select
									value={selectedBranch}
									onChange={(event) => setSelectedBranch(event.target.value)}
									  className="h-10 w-full appearance-none rounded-sm border border-[#d5d9e1] bg-white px-8 text-[13px] font-normal text-[#545d69] outline-none focus:border-[#173b9c]"
								>
									<option value="">Select Branch</option>
									{branches.map((branch) => (
										<option key={branch} value={branch}>
											{branch}
										</option>
									))}
								</select>
								<CalendarDays className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8d96a3]" />
								<span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8d96a3]">⌄</span>
							</div>
						</label>

						<label className="block text-[12px] font-bold text-[#515b68]">
							Date From <span className="text-[#d33b46]">*</span>
							<div className="relative mt-1">
								<input
									type="date"
									value={fromDate}
									onChange={(event) => setFromDate(event.target.value)}
									  className="h-10 w-full rounded-sm border border-[#d5d9e1] bg-white px-8 text-[13px] font-normal text-[#545d69] outline-none focus:border-[#173b9c]"
								/>
								<CalendarDays className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8d96a3]" />
							</div>
						</label>

						<label className="block text-[12px] font-bold text-[#515b68]">
							Date To <span className="text-[#d33b46]">*</span>
							<div className="relative mt-1">
								<input
									type="date"
									value={toDate}
									onChange={(event) => setToDate(event.target.value)}
									  className="h-10 w-full rounded-sm border border-[#d5d9e1] bg-white px-8 text-[13px] font-normal text-[#545d69] outline-none focus:border-[#173b9c]"
								/>
								<CalendarDays className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8d96a3]" />
							</div>
						</label>

						<button
							type="button"
							onClick={handleLoad}
							disabled={isLoading}
							  className="h-10 min-w-32 rounded-sm bg-[#07339b] px-6 text-[13px] font-semibold text-white transition hover:bg-[#052875] disabled:cursor-wait disabled:opacity-70"
						>
							<span className="inline-flex items-center gap-1.5">
								{isLoading ? <LoaderCircle className="h-3 w-3 animate-spin" /> : "↻"}
								{isLoading ? "Loading" : "Load"}
							</span>
						</button>
					</div>
				</div>

				<div className="mt-5">
					  <h2 className="text-[20px] font-bold text-[#252b33]">PENDING SALES FOR APPROVAL</h2>
					  <p className="mt-1 text-[14px] text-[#5d6672]">Select one sale to continue.</p>
				</div>

				<div className="mt-3 overflow-hidden rounded-xl border border-[#cbd2dd] bg-white">
					  <div className="grid grid-cols-[55px_1.1fr_1.8fr_1.2fr_1.35fr_1.15fr_90px] items-center bg-[#f1f3f7] px-4 py-4 text-[12px] font-bold text-[#5d6672]">
						<span>Select</span><span>Sale ID</span><span>Customer</span><span>Sale Date</span><span>Sales Person</span><span>Total Amount</span><span>Status</span>
					</div>
					{pendingSales.map((sale) => {
						const isSelected = sale.id === selectedSaleId;
						return (
							<button
								key={sale.id}
								type="button"
								onClick={() => setSelectedSaleId(sale.id)}
								className={`grid w-full grid-cols-[55px_1.1fr_1.8fr_1.2fr_1.35fr_1.15fr_90px] items-center border-t border-[#dce1e8] px-4 py-4 text-left text-[12px] transition ${isSelected ? "bg-[#dce2ff]" : "bg-white hover:bg-[#f7f9fc]"}`}
							>
								<span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${isSelected ? "border-[#092c86] bg-[#092c86]" : "border-[#aeb6c2]"}`}>
									{isSelected && <Check className="h-2.5 w-2.5 text-white" />}
								</span>
								<span className="font-mono text-[11px] font-bold text-[#18356c]">{sale.id}</span>
								<span>{sale.customer}</span>
								<span className="text-[#657080]">{sale.saleDate}</span>
								<span>{sale.salesPerson}</span>
								<span className="font-mono text-[11px] text-[#56606d]">{sale.totalAmount}</span>
								<span><span className="rounded-full bg-[#dbe8ff] px-2.5 py-1.5 text-[10px] font-bold text-[#294a7e]">PENDING</span></span>
							</button>
						);
					})}
					  <div className="flex justify-between border-t border-[#cbd2dd] bg-[#f1f3f7] px-4 py-3 text-[12px] font-semibold text-[#606a77]">
						<span>Showing {pendingSales.length} pending sales</span>
						<span className="text-[#18356c]">Selected: {selectedSaleId || "None"}</span>
					</div>
				</div>

				{message && <p className="mt-3 text-center text-[11px] font-semibold text-[#173b9c]">{message}</p>}

				<div className="mt-auto flex flex-wrap gap-3 pt-16">
					  <button type="button" onClick={() => setMessage("Report is ready to download.")} className="flex h-11 flex-1 items-center justify-center gap-2 bg-[#e5e7eb] text-[13px] font-semibold text-[#46505d] hover:bg-[#d9dce1]"><FileBarChart className="h-4 w-4" />Report</button>
					  <button type="button" onClick={handleApproval} className="flex h-11 flex-1 items-center justify-center gap-2 bg-[#00175c] text-[13px] font-semibold text-white hover:bg-[#001044]"><Check className="h-4 w-4" />Save (Approve)</button>
					  <button type="button" onClick={handleClear} className="flex h-11 flex-1 items-center justify-center gap-2 border border-[#d4d9e1] bg-white text-[13px] font-semibold text-[#46505d] hover:bg-[#f7f8fa]"><X className="h-4 w-4" />Clear</button>
					  <button type="button" onClick={() => setMessage("Approval cancelled.")} className="flex h-11 flex-1 items-center justify-center gap-2 border border-[#d4d9e1] bg-white text-[13px] font-semibold text-[#46505d] hover:bg-[#f7f8fa]"><X className="h-4 w-4" />Cancel</button>
				</div>
			</div>
		</section>
	);
}
