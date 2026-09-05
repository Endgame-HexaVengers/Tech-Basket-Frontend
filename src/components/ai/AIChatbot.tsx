"use client";

import { useState, useEffect, useRef } from "react";
import {
    BarChart3,
    Bot,
    PackageSearch,
    Send,
    ShoppingCart,
    Sparkles,
    X,
    Minimize2,
} from "lucide-react";

import { analyzeInventory } from "@/lib/ai/inventoryAnalysis";
import { getReorderRecommendations } from "@/lib/ai/reorderRecommendation";
import { analyzeRMA } from "@/lib/ai/rmaAnalysis";
import { InventoryProduct } from "@/types/ai";
import { AI_PRODUCTS } from "@/lib/ai/aiData";

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
    timestamp?: string;
}

const quickPrompts = [
    {
        label: "Low Stock",
        icon: PackageSearch,
        question: "Which products are low in stock?",
    },
    {
        label: "Reorder",
        icon: ShoppingCart,
        question: "Which products should I reorder?",
    },
    {
        label: "RMA Analysis",
        icon: BarChart3,
        question: "Show me RMA problems",
    },
];

const AIChatbot = () => {
  
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

   
    useEffect(() => {
        const savedState = localStorage.getItem("techbasket_ai_chat_open");
        if (savedState !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOpen(JSON.parse(savedState));
        } else {
        
            setIsOpen(true);
            localStorage.setItem("techbasket_ai_chat_open", JSON.stringify(true));
        }
    }, []);

    // Toggle handler function
    const toggleChat = (state: boolean) => {
        setIsOpen(state);
        localStorage.setItem("techbasket_ai_chat_open", JSON.stringify(state));
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "ai",
            text: "Hello! 👋 I'm your TechBasket AI Assistant. Ask me anything about inventory, stock, reorder recommendations, or RMA.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
    ]);

    // Auto-scroll to bottom on new messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const inventoryRisks = analyzeInventory(AI_PRODUCTS);
    const reorderRecommendations = getReorderRecommendations(AI_PRODUCTS);
    const rmaInsights = analyzeRMA(AI_PRODUCTS);

    const generateAIResponse = (question: string): string => {
        const text = question.toLowerCase().trim();

        if (
            text.includes("low stock") ||
            text.includes("low-stock") ||
            text.includes("low inventory") ||
            text.includes("stock low") ||
            text.includes("কম stock") ||
            text.includes("কম স্টক")
        ) {
            const lowStock = inventoryRisks.filter(
                (item) => item.status === "critical" || item.status === "warning"
            );

            if (lowStock.length === 0) {
                return "Good news! 🎉 There are currently no products with critical or warning-level stock.";
            }

            const products = lowStock
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.productName}\n   • Status: ${item.status}\n   • Estimated stockout: ${item.stockoutDays} day(s)\n   • ${item.message}`
                )
                .join("\n\n");

            return `I found ${lowStock.length} product(s) that need attention:\n\n${products}`;
        }

        if (
            text.includes("critical") ||
            text.includes("urgent stock") ||
            text.includes("immediate stock")
        ) {
            const criticalProducts = inventoryRisks.filter(
                (item) => item.status === "critical"
            );

            if (criticalProducts.length === 0) {
                return "There are currently no critically low-stock products.";
            }

            return `⚠️ ${criticalProducts.length} product(s) are critically low:\n\n${criticalProducts
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.productName}\n   • Current stock is at or below the minimum level\n   • Stockout estimate: ${item.stockoutDays} day(s)`
                )
                .join("\n\n")}`;
        }

        if (
            text.includes("reorder") ||
            text.includes("re-order") ||
            text.includes("purchase") ||
            text.includes("buy") ||
            text.includes("order products")
        ) {
            if (reorderRecommendations.length === 0) {
                return "No products currently require a reorder based on the current inventory data. ✅";
            }

            return `🛒 I recommend reordering ${reorderRecommendations.length} product(s):\n\n${reorderRecommendations
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.productName}\n   • Current stock: ${item.currentStock}\n   • Recommended quantity: ${item.recommendedQuantity}\n   • Reason: ${item.reason}`
                )
                .join("\n\n")}`;
        }

        if (
            text.includes("rma") ||
            text.includes("return") ||
            text.includes("returned") ||
            text.includes("returns")
        ) {
            const highRMA = rmaInsights.filter((item) => item.severity === "high");
            const mediumRMA = rmaInsights.filter((item) => item.severity === "medium");

            if (highRMA.length === 0 && mediumRMA.length === 0) {
                return "RMA analysis looks healthy. No products currently have a medium or high RMA rate. ✅";
            }

            let response = "📊 RMA Analysis:\n\n";

            if (highRMA.length > 0) {
                response += "🔴 High RMA:\n\n";
                response +=
                    highRMA
                        .map(
                            (item) =>
                                `• ${item.productName}\n  RMA Rate: ${item.rmaRate}%\n  ${item.message}`
                        )
                        .join("\n\n") + "\n\n";
            }

            if (mediumRMA.length > 0) {
                response += "🟡 Medium RMA:\n\n";
                response += mediumRMA
                    .map(
                        (item) =>
                            `• ${item.productName}\n  RMA Rate: ${item.rmaRate}%\n  ${item.message}`
                    )
                    .join("\n\n");
            }

            return response;
        }

        if (
            text.includes("inventory summary") ||
            text.includes("inventory status") ||
            text.includes("stock summary") ||
            text.includes("inventory overview") ||
            text === "inventory"
        ) {
            const totalProducts = AI_PRODUCTS.length;
            const totalStock = AI_PRODUCTS.reduce(
                (sum: number, product: InventoryProduct) => sum + product.currentStock,
                0
            );
            const critical = inventoryRisks.filter((item) => item.status === "critical").length;
            const warning = inventoryRisks.filter((item) => item.status === "warning").length;
            const healthy = inventoryRisks.filter((item) => item.status === "healthy").length;
            const overstock = inventoryRisks.filter((item) => item.status === "overstock").length;

            return `📦 Inventory Summary\n\n• Total products: ${totalProducts}\n• Total units in stock: ${totalStock}\n• Critical stock: ${critical}\n• Warning stock: ${warning}\n• Healthy stock: ${healthy}\n• Overstock: ${overstock}\n• Reorder recommendations: ${reorderRecommendations.length}`;
        }

        if (
            text.includes("how many products") ||
            text.includes("total products") ||
            text.includes("number of products")
        ) {
            return `You currently have ${AI_PRODUCTS.length} products in the inventory data. 📦`;
        }

        if (
            text.includes("total stock") ||
            text.includes("how much stock") ||
            text.includes("units in stock")
        ) {
            const totalStock = AI_PRODUCTS.reduce(
                (sum: number, product: InventoryProduct) => sum + product.currentStock,
                0
            );
            return `There are currently ${totalStock} total units in stock across ${AI_PRODUCTS.length} products. 📦`;
        }

        const matchedProduct = AI_PRODUCTS.find((product) =>
            text.includes(product.name.toLowerCase())
        );

        if (matchedProduct) {
            const risk = inventoryRisks.find((item) => item.productId === matchedProduct.id);
            const reorder = reorderRecommendations.find((item) => item.productId === matchedProduct.id);
            const rma = rmaInsights.find((item) => item.productId === matchedProduct.id);

            return `📦 ${matchedProduct.name}\n\n• Current stock: ${matchedProduct.currentStock}\n• Minimum stock: ${matchedProduct.minimumStock}\n• Maximum stock: ${matchedProduct.maximumStock}\n• Daily sales: ${matchedProduct.dailySales}\n• Purchase price: ৳${matchedProduct.purchasePrice.toLocaleString()}\n• Total sold: ${matchedProduct.totalSold}\n• RMA count: ${matchedProduct.rmaCount}\n\n📊 Inventory status: ${risk?.status ?? "unknown"}\n• ${risk?.message ?? "No inventory analysis available."}\n\n${
                reorder
                    ? `🛒 Reorder recommended: ${reorder.recommendedQuantity} units`
                    : "🛒 No reorder currently recommended."
            }\n\n${
                rma
                    ? `📊 RMA rate: ${rma.rmaRate}% (${rma.severity})`
                    : "📊 RMA data unavailable."
            }`;
        }

        if (
            text.includes("help") ||
            text.includes("what can you do") ||
            text.includes("how can you help")
        ) {
            return `I can help you with:\n\n📦 Inventory status\n🔴 Low / critical stock\n🛒 Reorder recommendations\n📊 RMA analysis\n🔎 Product information\n📈 Inventory summary\n\nTry asking:\n"Which products are low in stock?"\n"Which products should I reorder?"\n"Show me RMA problems."`;
        }

        if (
            text === "hi" ||
            text === "hello" ||
            text === "hey" ||
            text.includes("good morning") ||
            text.includes("good evening")
        ) {
            return "Hello! 👋 I'm ready to analyze your TechBasket inventory. Ask me about stock, reorder recommendations, RMA, or a specific product.";
        }

        return `I can help you analyze your current TechBasket data. 🤖\n\nTry asking:\n\n• Which products are low in stock?\n• Which products should I reorder?\n• Show me RMA problems.\n• Give me an inventory summary.\n• Tell me about Logitech MX Master 3S.\n• How many products do we have?`;
    };

    const handleSend = (messageText?: string) => {
        const text = messageText ?? input;
        if (!text.trim()) return;

        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMessage: Message = {
            // eslint-disable-next-line react-hooks/purity
            id: Date.now(),
            text: text.trim(),
            sender: "user",
            timestamp: timeString,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const response = generateAIResponse(text);
            const aiMessage: Message = {
                id: Date.now() + 1,
                text: response,
                sender: "ai",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 500);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => toggleChat(true)}
                className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_30px_-5px_rgba(79,70,229,0.7)] active:scale-95 border border-white/20"
                aria-label="Open AI Assistant"
            >
                <div className="relative">
                    <Bot size={28} />
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                    </span>
                </div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex h-[620px] w-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] transition-all duration-300 sm:w-[420px]">
            {/* PREMIUM HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white shadow-md">
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl"></div>
                <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl"></div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-inner">
                            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-900/60 backdrop-blur-sm">
                                <Sparkles size={20} className="text-indigo-300 animate-pulse" />
                            </div>
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base tracking-wide text-white">
                                    TechBasket AI
                                </h3>
                                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-300 border border-indigo-400/30 uppercase">
                                    PRO
                                </span>
                            </div>

                            <p className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Smart Inventory Assistant
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
                        <button
                            onClick={() => toggleChat(false)}
                            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            title="Minimize"
                        >
                            <Minimize2 size={16} />
                        </button>
                        <button
                            onClick={() => toggleChat(false)}
                            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            title="Close"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex flex-col ${
                            message.sender === "user" ? "items-end" : "items-start"
                        }`}
                    >
                        <div
                            className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                                message.sender === "user"
                                    ? "rounded-tr-xs bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-indigo-200"
                                    : "rounded-tl-xs border border-slate-200/80 bg-white text-slate-800 shadow-slate-100"
                            }`}
                        >
                            <p className="whitespace-pre-line font-normal">{message.text}</p>
                            {message.timestamp && (
                                <span
                                    className={`mt-1 block text-[10px] font-medium ${
                                        message.sender === "user"
                                            ? "text-indigo-200 text-right"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {message.timestamp}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* TYPING INDICATOR */}
                {isTyping && (
                    <div className="flex items-start gap-2">
                        <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce"></span>
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* QUICK ACTIONS CONTAINER */}
            <div className="border-t border-slate-100 bg-white px-4 py-2.5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Quick Prompts
                </p>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {quickPrompts.map((prompt) => {
                        const Icon = prompt.icon;
                        return (
                            <button
                                key={prompt.label}
                                onClick={() => handleSend(prompt.question)}
                                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 active:scale-95 shadow-2xs"
                            >
                                <Icon size={14} className="text-indigo-500" />
                                {prompt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* INPUT FIELD CONTAINER */}
            <div className="border-t border-slate-200/80 bg-white p-3">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                    <input
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about inventory, stock, RMA..."
                        className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:scale-95"
                    >
                        <Send size={15} />
                    </button>
                </div>

                <div className="mt-2 flex items-center justify-between px-1">
                    <p className="text-[10px] font-medium text-slate-400">
                        ⚡ Powered by TechBasket AI Engine
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">v2.4</span>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;