import React, { useEffect, useMemo, useState } from "react";
import { Wallet, Calendar, Receipt, IndianRupee, CreditCard, Filter, Clock } from "lucide-react";
import { getStudentData } from "../util/user";
import { getFeesByRollNumber } from "../util/server";
import toast from "react-hot-toast";

const currency = (n) =>
	new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
		Number(n || 0)
	);

const formatDate = (dateString) =>
	new Date(dateString).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

const StatusPill = ({ status }) => {
	const map = {
		PAID: "bg-green-100 text-green-700 border-green-200",
		PARTIAL: "bg-yellow-50 text-yellow-700 border-yellow-200",
		PENDING: "bg-red-50 text-red-600 border-red-200",
	};
	return (
		<span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${map[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
			{status}
		</span>
	);
};

const FeeSection = () => {
	const student = getStudentData();
	const [loading, setLoading] = useState(false);
	const [fees, setFees] = useState([]);
	const [showFilter, setShowFilter] = useState(false);
	const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

	useEffect(() => {
		const fetchFees = async () => {
			if (!student?.rollNo) return;
			setLoading(true);
			try {
				const { fees: feeRecords } = await getFeesByRollNumber(student.rollNo.toString());
				setFees(feeRecords || []);
			} catch (e) {
				console.error(e);
				toast.error("Failed to load fees data");
			} finally {
				setLoading(false);
			}
		};
		fetchFees();
	}, [student?.rollNo]);

	const fee = useMemo(() => (fees && fees.length > 0 ? fees[0] : undefined), [fees]);

	const allSubmissions = useMemo(() => {
		const list = fee?.submissions || [];
		let filtered = list;
		if (dateRange.startDate || dateRange.endDate) {
			const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date("1900-01-01");
			const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date("2100-12-31");
			filtered = list.filter((s) => {
				const sDate = new Date(s.dateOfReceipt || s.date);
				return sDate >= start && sDate <= end;
			});
		}
		return [...filtered].sort(
			(a, b) => new Date(b.dateOfReceipt || b.date) - new Date(a.dateOfReceipt || a.date)
		);
	}, [fee, dateRange]);

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
				<div className="flex items-center gap-2 mb-2">
					<Wallet className="w-5 h-5 text-gray-600" />
					<h3 className="text-lg font-semibold text-gray-900">Fees</h3>
				</div>
				<div className="text-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
					<p className="text-gray-600 mt-2">Loading fees...</p>
				</div>
			</div>
		);
	}

	if (!fee) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
				<div className="flex items-center gap-2 mb-2">
					<Wallet className="w-5 h-5 text-gray-600" />
					<h3 className="text-lg font-semibold text-gray-900">Fees</h3>
				</div>
				<div className="text-center py-8">
					<Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
					<p className="text-gray-600">No fee record available.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Wallet className="w-5 h-5 text-gray-600" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900">Fees</h3>
						<p className="text-sm text-gray-600">Roll No. {student?.rollNo}</p>
					</div>
				</div>
				<button
					onClick={() => setShowFilter((v) => !v)}
					className={`p-2 rounded-lg transition-colors ${
						showFilter ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
					}`}
				>
					<Filter className="w-4 h-4" />
				</button>
			</div>

			{showFilter && (
				<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
					<div className="grid grid-cols-1 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
							<input
								type="date"
								value={dateRange.startDate}
								onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
							<input
								type="date"
								value={dateRange.endDate}
								onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
							/>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setDateRange({ startDate: "", endDate: "" })}
								className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
							>
								Clear Filters
							</button>
							<button
								onClick={() => setShowFilter(false)}
								className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Summary */}
			<div className="grid grid-cols-3 gap-4 mb-4">
				<div className="text-center p-3 bg-gray-50 rounded-lg">
					<IndianRupee className="w-4 h-4 text-gray-600 mx-auto mb-1" />
					<div className="text-xs text-gray-600">Total Fees</div>
					<div className="text-lg font-semibold text-gray-900">{currency(fee.finalFees || fee.totalFees)}</div>
				</div>
				<div className="text-center p-3 bg-gray-50 rounded-lg">
					<IndianRupee className="w-4 h-4 text-green-700 mx-auto mb-1" />
					<div className="text-xs text-gray-600">Paid</div>
					<div className="text-lg font-semibold text-green-700">{currency(fee.paidAmount)}</div>
				</div>
				<div className="text-center p-3 bg-gray-50 rounded-lg">
					<IndianRupee className="w-4 h-4 text-red-500 mx-auto mb-1" />
					<div className="text-xs text-gray-600">Pending</div>
					<div className="text-lg font-semibold text-red-600">{currency(fee.pendingAmount)}</div>
				</div>
			</div>

			{/* Meta */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2 text-sm text-gray-700">
					<StatusPill status={fee.status} />
					{fee.dueDate && (
						<div className="flex items-center gap-1">
							<Calendar className="w-4 h-4 text-gray-500" />
							<span>Due: {formatDate(fee.dueDate)}</span>
						</div>
					)}
				</div>
				{fee.discount ? (
					<div className="text-sm text-gray-600">Discount: {currency(fee.discount)}</div>
				) : (
					<span />
				)}
			</div>

			{/* Transactions */}
			<div className="border border-gray-200 rounded-lg overflow-hidden">
				<div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
					<Receipt className="w-4 h-4" /> Transactions
				</div>
				{allSubmissions.length === 0 ? (
					<div className="p-4 text-center text-gray-600">No transactions found.</div>
				) : (
					<ul className="divide-y divide-gray-200">
						{allSubmissions.map((s, idx) => (
							<li key={(s._id || idx) + String(s.receiptNumber)} className="p-4 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
										<CreditCard className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<div className="text-sm font-medium text-gray-900">{currency(s.amount)}</div>
										<div className="text-xs text-gray-600 flex items-center gap-2">
											<span>{s.mode}</span>
											<span>•</span>
											<span>Receipt #{s.receiptNumber}</span>
											{s.UTR && (
												<>
													<span>•</span>
													<span>UTR: {s.UTR}</span>
												</>
											)}
										</div>
									</div>
								</div>
								<div className="text-xs text-gray-600">{formatDate(s.dateOfReceipt || s.date)}</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default FeeSection;

