"use client";

import ApprovalActionsButton from "@/components/ApprovalActionsButton";
import ApprovalFilters from "@/components/ApprovalFilters";
import PurchaseOrderTable from "@/components/PurchaseOrderTable";
import { Branch } from "@/types/branch";
import { PurchaseOrder } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function PurchaseApprovalPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingReport, setLoadingReport] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [loadingApproval, setLoadingApproval] = useState(false);

    // Fetch branches
    useEffect(() => {
        async function fetchBranches() {
            try {
                const res = await fetch("http://localhost:5000/api/branches");

                if (!res.ok) {
                    throw new Error("Failed to fetch branches");
                }

                const data = await res.json();
                setBranches(data);
            } catch {
                setBranches([
                    {
                        id: "1",
                        name: "Dhaka Main Branch",
                        code: "DHK-001",
                        location: "Dhaka",
                        type: "MAIN",
                        manager: "Admin",
                        users: 25,
                        status: "ACTIVE",
                    },
                    {
                        id: "2",
                        name: "Tangail Branch",
                        code: "TNG-001",
                        location: "Tangail",
                        type: "BRANCH",
                        manager: "Admin",
                        users: 15,
                        status: "ACTIVE",
                    },
                    {
                        id: "3",
                        name: "Chittagong Branch",
                        code: "CTG-001",
                        location: "Chittagong",
                        type: "BRANCH",
                        manager: "Admin",
                        users: 20,
                        status: "ACTIVE",
                    },
                    {
                        id: "4",
                        name: "Gazipur Branch",
                        code: "GAZ-001",
                        location: "Gazipur",
                        type: "BRANCH",
                        manager: "Admin",
                        users: 18,
                        status: "ACTIVE",
                    },
                    {
                        id: "5",
                        name: "Sylhet Branch",
                        code: "SYL-001",
                        location: "Sylhet",
                        type: "BRANCH",
                        manager: "Admin",
                        users: 12,
                        status: "ACTIVE",
                    },
                    {
                        id: "6",
                        name: "Rajshahi Branch",
                        code: "RAJ-001",
                        location: "Rajshahi",
                        type: "BRANCH",
                        manager: "Admin",
                        users: 14,
                        status: "ACTIVE",
                    },
                    {
                        id: "7",
                        name: "Cumilla Branch",
                        code: "COM-001",
                        location: "Cumilla",
                        type: "BRANCH",
                        manager: "Admin",
                        users: 16,
                        status: "ACTIVE",
                    },
                ]);
            }
        }

        fetchBranches();
    }, []);

    // Initial orders
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrders([
            { id: "1", invoiceNumber: "INV-2026-000121" },
            { id: "2", invoiceNumber: "INV-2026-000122" },
            { id: "3", invoiceNumber: "INV-2026-000123" },
            { id: "4", invoiceNumber: "INV-2026-000124" },
            { id: "5", invoiceNumber: "INV-2026-000125" },
        ]);
    }, []);

    // Load orders
    const handleLoadOrders = async () => {
        setLoadingOrders(true);

        try {
            const res = await fetch(
                `http://localhost:5000/api/purchase-orders?branch=${selectedBranch}&fromDate=${fromDate}&toDate=${toDate}`
            );

            if (!res.ok) {
                throw new Error("Failed to load orders");
            }

            const data = await res.json();
            setOrders(data);
            setSelectedOrderIds([]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Select all
    const handleSelectAll = (checked: boolean) => {
        setSelectedOrderIds(checked ? orders.map((order) => order.id) : []);
    };

    // Toggle order
    const handleToggleOrder = (id: string) => {
        setSelectedOrderIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // Report
    const handleReport = async () => {
        setLoadingReport(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("Report successfully!");
        } finally {
            setLoadingReport(false);
        }
    };

    // Reject
    const handleReject = async () => {
        if (!selectedOrderIds.length) {
            toast.error("Please select at least one purchase order.");
            return;
        }

        setLoadingReject(true);

        try {
            await fetch("http://localhost:5000/api/purchase-orders/reject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: selectedOrderIds,
                }),
            });

            toast.success("Rejected successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Rejection failed!");
        } finally {
            setLoadingReject(false);
        }
    };

    // Approval
    const handleApproval = async () => {
        if (!selectedOrderIds.length) {
            toast.error("Please select at least one purchase order.");
            return;
        }

        setLoadingApproval(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 3500));

            await fetch("http://localhost:5000/api/purchase-orders/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: selectedOrderIds,
                }),
            });

            toast.success("Approved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Approval failed!");
        } finally {
            setLoadingApproval(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <ApprovalFilters
                branches={branches}
                selectedBranch={selectedBranch}
                fromDate={fromDate}
                toDate={toDate}
                loading={loadingOrders}
                onBranchChange={setSelectedBranch}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onLoad={handleLoadOrders}/>

            <PurchaseOrderTable
                orders={orders}
                selectedOrderIds={selectedOrderIds}
                onSelectAll={handleSelectAll}
                onToggleOrder={handleToggleOrder}/>

            <ApprovalActionsButton
                loadingReport={loadingReport}
                loadingReject={loadingReject}
                loadingApproval={loadingApproval}
                onReport={handleReport}
                onReject={handleReject}
                onApproval={handleApproval}/>
        </div>
    );
}