"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    icon?: string;
}

interface FaqCategory {
    id: string;
    label: string;
    icon: string;
}

const CATEGORIES: FaqCategory[] = [
    { id: "general", label: "General", icon: "fa-circle-info" },
    { id: "registration", label: "Registration", icon: "fa-user-plus" },
    { id: "internship", label: "Internships", icon: "fa-briefcase" },
    { id: "payment", label: "Payment", icon: "fa-credit-card" },
    { id: "technical", label: "Technical", icon: "fa-gear" },
];

const FAQ_DATA: FaqItem[] = [
    // General
    {
        id: 1,
        category: "general",
        question: "What is IQintern?",
        answer: "IQintern is India's leading internship platform connecting students with top companies. We provide curated internship opportunities, skill development workshops, and career guidance to help students launch their professional careers. Our platform partners with 500+ companies across various industries including tech, finance, marketing, and more.",
        icon: "fa-star"
    },
    {
        id: 2,
        category: "general",
        question: "Who can register on IQintern?",
        answer: "Any student currently enrolled in a college or university can register. We accept students from all branches including B.Tech, BCA, B.Sc, BBA, MBA, MCA, and more. Whether you're a fresher looking for your first internship or an experienced student seeking specialized opportunities, IQintern has something for everyone.",
        icon: "fa-users"
    },
    {
        id: 3,
        category: "general",
        question: "Is IQintern free to use?",
        answer: "Basic registration and profile creation are completely free! You can browse internships, attend free workshops, and access career resources at no cost. Premium features like priority application review, exclusive internships, and personalized mentorship require a nominal fee. We believe quality opportunities should be accessible to all students.",
        icon: "fa-gift"
    },
    {
        id: 4,
        category: "general",
        question: "How is IQintern different from other platforms?",
        answer: "Unlike generic job portals, IQintern focuses exclusively on internships and early-career opportunities. We offer verified company partnerships, structured internship programs with learning outcomes, dedicated mentors, skill assessments, and a guarantee of real work experience. Our success rate of 85% interns receiving PPOs (Pre-Placement Offers) speaks for itself!",
        icon: "fa-trophy"
    },

    // Registration
    {
        id: 5,
        category: "registration",
        question: "What documents do I need to register?",
        answer: "You'll need a valid college ID proof, your latest marksheet, and a government-issued ID (Aadhar/PAN/Passport). During registration, you'll also need to provide your college details, current semester, branch of study, and emergency contact information. All documents are securely encrypted and never shared without consent.",
        icon: "fa-file-lines"
    },
    {
        id: 6,
        category: "registration",
        question: "How do I create a strong profile?",
        answer: "Complete every section of your profile! Upload a professional photo, write a compelling bio highlighting your skills and aspirations, add relevant projects (even academic ones), list technical and soft skills, mention any certifications, and include links to your GitHub/LinkedIn/Portfolio. Profiles with complete information get 3x more views from recruiters.",
        icon: "fa-user-check"
    },
    {
        id: 7,
        category: "registration",
        question: "Can I update my profile after registration?",
        answer: "Absolutely! Your profile is dynamic and can be updated anytime. We recommend updating it regularly with new skills, projects, certifications, and achievements. Students who keep their profiles fresh see 40% better engagement. You can also track how many times your profile has been viewed by recruiters.",
        icon: "fa-pen-to-square"
    },
    {
        id: 8,
        category: "registration",
        question: "I'm having trouble registering. What should I do?",
        answer: "If you face any issues during registration, first check your internet connection and ensure you're using a supported browser (Chrome, Firefox, Safari, Edge). Clear cache and cookies if needed. If problems persist, contact our support team via WhatsApp or email support@iqintern.in. We typically respond within 2 hours during business days.",
        icon: "fa-life-ring"
    },

    // Internships
    {
        id: 9,
        category: "internship",
        question: "What types of internships are available?",
        answer: "We offer diverse internship categories: Technical (Web Dev, App Dev, AI/ML, Data Science), Non-Tech (Digital Marketing, Content Writing, HR, Business Development), Remote Work-from-Home options, Part-time (for ongoing students), and Full-time (for semester break). Durations range from 1-6 months with flexible timing options.",
        icon: "fa-laptop-code"
    },
    {
        id: 10,
        category: "internship",
        question: "Are these paid internships?",
        answer: "Yes! 90%+ of internships on our platform are paid. Stipends range from ₹5,000 to ₹50,000 per month depending on the role, company, and your skill level. Some premium internships offer up to ₹80,000/month. Unpaid internships are clearly labeled and typically offer exceptional learning value, certificates, or PPO opportunities.",
        icon: "fa-indian-rupee-sign"
    },
    {
        id: 11,
        category: "internship",
        question: "How do I apply for internships?",
        answer: "Browse available internships using filters (category, location, stipend, duration). Click on any listing to view details, requirements, and company info. Hit 'Apply Now' and submit your tailored resume and cover letter. Track your application status in real-time. Top tip: Customize your application for each role – it increases success rate by 60%!",
        icon: "fa-paper-plane"
    },
    {
        id: 12,
        category: "internship",
        question: "What happens after I'm selected?",
        answer: "Congratulations! 🎉 You'll receive an official offer letter via email with details about start date, stipend, reporting manager, and onboarding process. You'll join our intern community group, get access to orientation materials, and be assigned a buddy/mentor. Complete your internship successfully to receive a certificate and potentially a PPO!",
        icon: "fa-handshake"
    },

    // Payment
    {
        id: 13,
        category: "payment",
        question: "What payment methods are accepted?",
        answer: "We accept all major payment methods: Credit Cards (Visa, Mastercard, Rupay), Debit Cards, UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking (all major banks), Wallets (Paytm, Amazon Pay), and EMI options for premium plans. All transactions are secured with 256-bit SSL encryption and PCI DSS compliance.",
        icon: "fa-wallet"
    },
    {
        id: 14,
        category: "payment",
        question: "Is there a refund policy?",
        answer: "Yes, we have a transparent refund policy. For premium plans: 100% refund within 7 days of purchase if unsatisfied, 50% refund within 15 days, no refunds after 15 days unless service guarantees weren't met. For internship program fees: Refund available if no suitable internship is offered within 90 days. Contact support@iqintern.in for refund requests.",
        icon: "fa-rotate-left"
    },
    {
        id: 15,
        category: "payment",
        question: "Are there any hidden charges?",
        answer: "Never! We believe in complete transparency. The price you see is what you pay – no hidden fees, no surprise charges, no auto-renewal traps. GST is included in displayed prices where applicable. You'll always see a clear breakdown before payment. If you ever encounter unexpected charges, report it immediately for instant resolution.",
        icon: "fa-shield-halved"
    },
    {
        id: 16,
        category: "payment",
        question: "Do you offer EMI options?",
        answer: "Yes! We've partnered with leading fintech providers to offer easy EMI options. Choose from 3, 6, or 9-month EMIs with 0% interest on select plans. EMI is available for orders above ₹3,000. Select 'Pay via EMI' at checkout, complete quick KYC (takes 2 minutes), and get instant approval. No credit card required for UPI-based EMIs.",
        icon: "fa-calendar-days"
    },

    // Technical
    {
        id: 17,
        category: "technical",
        question: "What browsers are supported?",
        answer: "IQintern works best on modern browsers: Google Chrome (v90+), Mozilla Firefox (v88+), Safari (v14+), Microsoft Edge (v90+), and Opera (v76+). We recommend Chrome for the best experience. Mobile browsers supported: Chrome Android, Safari iOS, Samsung Internet. JavaScript must be enabled. Update your browser for optimal performance.",
        icon: "fa-globe"
    },
    {
        id: 18,
        category: "technical",
        question: "Is there a mobile app available?",
        answer: "Yes! Download the IQintern app from Google Play Store and Apple App Store. The app offers push notifications for new internships, in-app chat with recruiters, offline mode for saved listings, and biometric login for security. The app syncs seamlessly with your web account. Coming soon: Internship tracker widget and AI-powered job recommendations!",
        icon: "fa-mobile-screen-button"
    },
    {
        id: 19,
        category: "technical",
        question: "How is my data protected?",
        answer: "Your data security is our top priority. We implement: AES-256 encryption for sensitive data, SSL/TLS for all communications, regular security audits by third-party experts, GDPR-compliant data handling, two-factor authentication option, automatic session timeout, and strict access controls. We never sell your data to third parties. Read our Privacy Policy for details.",
        icon: "fa-lock"
    },
    {
        id: 20,
        category: "technical",
        question: "I forgot my password. How do I reset it?",
        answer: "No worries! Click 'Forgot Password' on the login page, enter your registered email or phone number, and we'll send a reset link/OTP instantly. The link is valid for 15 minutes. If you don't receive it, check spam folder or request a new one. For phone reset, enter the OTP sent to your number. Contact support if you need further help.",
        icon: "fa-key"
    }
];

/* ------------------------------------------------------------------ */
/*  Sub Components                                                     */
/* ------------------------------------------------------------------ */

function SearchIcon() {
    return (
        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <motion.svg
            className="w-5 h-5 text-slate-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function FaqSection() {
    const [activeCategory, setActiveCategory] = useState("general");
    const [openItemId, setOpenItemId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    /* ---- filtered data - ONLY shows selected category ---- */
    const filteredFaqs = useMemo(() => {
        return FAQ_DATA.filter((faq) => {
            const matchesCategory = faq.category === activeCategory;
            const matchesSearch =
                !searchQuery ||
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    /* ---- handlers ---- */
    const toggleItem = (id: number) => {
        setOpenItemId((prev) => (prev === id ? null : id));
    };

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId);
        setOpenItemId(null); // Close open item when switching category
    };

    return (
        <div
            id="faqs"
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 scroll-mt-24"
            style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
            }}
        >
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.08, 0.12, 0.08],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.06, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Google Fonts & FontAwesome */}
            <style dangerouslySetInnerHTML={{
                __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          @keyframes shimmer-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.1); }
            50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.25); }
          }
          
          .faq-item-active {
            animation: shimmer-glow 2s ease-in-out infinite;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `
            }} />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)"
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <i className="fa-solid fa-circle-question text-amber-500 text-sm"></i>
                        <span className="text-sm font-semibold text-amber-700">Help Center</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-4xl sm:text-5xl font-extrabold text-[#152746] mb-4 tracking-tight"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        Frequently Asked{" "}
                        <span className="relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                                Questions
                            </span>
                            <motion.span
                                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            />
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-lg text-slate-500 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Everything you need to know about IQintern. Can&apos;t find what you&apos;re looking for?{" "}
                        <Link href="/contact" className="text-blue-500 hover:text-blue-600 font-semibold underline decoration-blue-300 hover:decoration-blue-500 transition-colors">
                            Contact our team
                        </Link>
                    </motion.p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="relative max-w-2xl mx-auto">
                        <motion.div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            animate={searchQuery ? { rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <SearchIcon />
                        </motion.div>
                        <input
                            type="text"
                            placeholder={`Search in ${CATEGORIES.find(c => c.id === activeCategory)?.label || ''} questions...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-base outline-none transition-all duration-300 shadow-sm hover:border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:shadow-lg"
                        />
                        {searchQuery && (
                            <motion.button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    className="mb-8 overflow-x-auto custom-scrollbar pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="flex gap-2 min-w-max justify-center flex-wrap">
                        {CATEGORIES.map((cat) => {
                            const count = FAQ_DATA.filter(f => f.category === cat.id).length;
                            const isActive = activeCategory === cat.id;

                            return (
                                <motion.button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${isActive
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-600 hover:shadow-md"
                                        }`}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -2,
                                        boxShadow: isActive
                                            ? "0 8px 25px rgba(245, 158, 11, 0.4)"
                                            : "0 4px 15px rgba(0,0,0,0.1)"
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    animate={isActive ? {
                                        boxShadow: [
                                            "0 4px 15px rgba(245, 158, 11, 0.3)",
                                            "0 8px 25px rgba(245, 158, 11, 0.45)",
                                            "0 4px 15px rgba(245, 158, 11, 0.3)"
                                        ]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <i className={`fa-solid ${cat.icon} text-xs`}></i>
                                    {cat.label}
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-white/20" : "bg-slate-100"
                                        }`}>
                                        {count}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Active Category Title */}
                <motion.div
                    className="mb-6 flex items-center gap-3"
                    key={`title-${activeCategory}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                    >
                        <i className={`fa-solid ${CATEGORIES.find(c => c.id === activeCategory)?.icon} text-white text-sm`}></i>
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {CATEGORIES.find(c => c.id === activeCategory)?.label} Questions
                        </h2>
                        <p className="text-sm text-slate-500">
                            {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} in this section
                        </p>
                    </div>
                </motion.div>

                {/* FAQ Items Container - Category Based */}
                <div className="space-y-4 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => {
                                const isOpen = openItemId === faq.id;

                                return (
                                    <motion.div
                                        key={`${activeCategory}-${faq.id}`}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20, height: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: index * 0.05,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{
                                            y: -3,
                                            boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
                                        }}
                                        className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isOpen
                                            ? "border-amber-400 faq-item-active"
                                            : "border-slate-100 hover:border-amber-200"
                                            }`}
                                    >
                                        {/* Question Button */}
                                        <button
                                            onClick={() => toggleItem(faq.id)}
                                            className="w-full px-6 py-5 flex items-start gap-4 text-left cursor-pointer group"
                                        >
                                            {/* Icon */}
                                            <motion.div
                                                className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 mt-0.5 transition-all duration-300 ${isOpen
                                                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                                                    : "bg-slate-100 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500"
                                                    }`}
                                                whileHover={{ rotate: 15, scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <i className={`fa-solid ${faq.icon || 'fa-circle-question'} text-sm`}></i>
                                            </motion.div>

                                            {/* Question Text */}
                                            <div className="flex-grow min-w-0">
                                                <h3 className={`font-semibold text-base leading-snug transition-colors duration-300 ${isOpen ? "text-amber-700" : "text-slate-800 group-hover:text-amber-600"
                                                    }`}>
                                                    {faq.question}
                                                </h3>
                                            </div>

                                            {/* Chevron */}
                                            <ChevronIcon isOpen={isOpen} />
                                        </button>

                                        {/* Answer Content */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-5 pl-20">
                                                        <div className="pt-4 border-t border-slate-100">
                                                            <p className="text-slate-600 leading-relaxed text-[15px]">
                                                                {faq.answer}
                                                            </p>

                                                            {/* Helpful buttons */}
                                                            <div className="mt-4 flex items-center gap-3 pt-3">
                                                                <span className="text-xs text-slate-400 font-medium">Was this helpful?</span>
                                                                <motion.button
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <i className="fa-solid fa-thumbs-up"></i>
                                                                    Yes
                                                                </motion.button>
                                                                <motion.button
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <i className="fa-solid fa-thumbs-down"></i>
                                                                    No
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        ) : (
                            /* Empty State */
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-16 px-6"
                            >
                                <motion.div
                                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <i className="fa-solid fa-magnifying-glass text-3xl text-slate-400"></i>
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No results found</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    We couldn&apos;t find any FAQs matching your search in this category.
                                </p>
                                <motion.button
                                    onClick={() => setSearchQuery("")}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25"
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Clear Search
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-[#152746] to-[#223a60] rounded-3xl shadow-2xl">
                        <div className="text-left">
                            <h3 className="text-white font-bold text-lg mb-1">Still have questions?</h3>
                            <p className="text-slate-300 text-sm">Our support team is here to help you 24/7</p>
                        </div>
                        <div className="flex gap-3">
                            <motion.a
                                href="https://wa.me/9939503289"
                                target="blank"
                                className="px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 text-sm"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 8px 25px rgba(245, 158, 11, 0.5)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <i className="fa-brands fa-whatsapp text-lg"></i>
                                WhatsApp Us
                            </motion.a>
                            <motion.a
                                href="mailto:[EMAIL_ADDRESS]"
                                target="blank"
                                className="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <i className="fa-solid fa-envelope"></i>
                                Email Support
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                    className="mt-8 text-center text-xs text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Last updated: July 2026 • Can&apos;t find what you&apos;re looking for?{" "}
                    <a href="#" className="text-blue-500 hover:text-blue-600 font-medium underline">
                        Submit a request
                    </a>
                </motion.p>

            </div>

            {/* FontAwesome CDN */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
