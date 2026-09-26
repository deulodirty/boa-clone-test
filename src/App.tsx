import { CurrencyCircleDollarIcon } from "@phosphor-icons/react";
import {
  ChevronLeft,
  LogOut,
  Mail,
  Menu,
  Send,
  SettingsIcon,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

import { createContext, useContext } from "react";

const AccountNumberVisibilityContext = createContext<{
  showNumbers: boolean;
  toggleNumbers: () => void;
}>({ showNumbers: false, toggleNumbers: () => {} });

function useAccountNumberVisibility() {
  return useContext(AccountNumberVisibilityContext);
}

// Helper: renders account number as "••••1234" or "1234"
function maskNumber(num: string, show: boolean) {
  return show ? num : "••••" + num.slice(-4);
}

// Section divider bar (navy + red stripes like real BOA)
function SectionBar() {
  return (
    <div className="flex h-[10px] w-full">
      <div className="flex-1 bg-[#E31837]" />
      <div className="w-36 bg-[#012169]" />
    </div>
  );
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const USER = { name: "Budro", tier: "Preferred Rewards Platinum Member" };

const bankingAccounts = [
  {
    id: "chk",
    label: "My Checking",
    number: "381077449708",
    balance: 246.13,
    available: 246.13,
  },
];

const creditAccounts = [
  {
    id: "cc1",
    label: "Cash Rewards",
    number: "5830",
    balance: 3402.33,
    limit: 15000,
  },
  {
    id: "cc2",
    label: "Travel Rewards",
    number: "7412",
    balance: 1287.64,
    limit: 10000,
  },
];

const loansAccounts = [
  {
    id: "ln1",
    label: "Home Mortgage",
    number: "4471",
    balance: 187432.55,
    originalAmount: 285000.0,
    interestRate: 5.375,
    monthlyPayment: 1594.28,
    nextDueDate: "10/01/24",
  },
  {
    id: "ln2",
    label: "Auto Loan",
    number: "9038",
    balance: 12487.19,
    originalAmount: 24500.0,
    interestRate: 6.49,
    monthlyPayment: 468.32,
    nextDueDate: "10/15/24",
  },
];

const transactions: Record<
  string,
  { date: string; desc: string; amount: number; balance: number }[]
> = {
  chk: [
    {
      date: "09/25/26",
      desc: "ATM WITHDRAWAL",
      amount: 246.13,
      balance: -500,
    },
    {
      date: "09/25/26",
      desc: "TRANSFER KELLY ALLEN",
      amount: 746.13,
      balance: -1400,
    },
    {
      date: "09/24/26",
      desc: "BKOFAMERICA MOBILE DEPOSIT",
      amount: 2146.13,
      balance: 2850.0,
    },
    {
      date: "09/23/26",
      desc: "WHOLE FOODS MARKET",
      amount: -87.43,
      balance: -703.87,
    },
    {
      date: "09/21/26",
      desc: "SHELL OIL GAS STATION",
      amount: -62.1,
      balance: -616.44,
    },
    {
      date: "09/21/26",
      desc: "ATM WITHDRAWAL",
      amount: -200.0,
      balance: -554.34,
    },
    {
      date: "08/26/26",
      desc: "AT&T WIRELESS PAYMENT",
      amount: -89.0,
      balance: -354.34,
    },
    {
      date: "08/18/26",
      desc: "ZELLE TRANSFER RECEIVED",
      amount: 200.0,
      balance: -265.34,
    },
    { date: "08/17/26", desc: "AMAZON.COM", amount: -132.99, balance: -465.34 },
    {
      date: "08/10/26",
      desc: "BKOFAMERICA MOBILE DEPOSIT",
      amount: 500.0,
      balance: -332.35,
    },
  ],
  sav: [
    {
      date: "07/31/26",
      desc: "TRANSFER BUDRO BG LLC:Budro BG LLC",
      amount: -69.48,
      balance: 2463.67,
    },
    {
      date: "07/29/24",
      desc: "ATM WITHDRAWAL",
      amount: -200.0,
      balance: 2533.15,
    },
    {
      date: "07/26/24",
      desc: "Online Banking payment to CRD",
      amount: 75.0,
      balance: 2733.13,
    },
    {
      date: "07/24/24",
      desc: "Online Banking payment to CRD",
      amount: -55.0,
      balance: 2808.15,
    },
    {
      date: "07/23/24",
      desc: "BKOFAMERICA MOBILE DEPOSIT",
      amount: 100.0,
      balance: 2863.15,
    },
    {
      date: "07/22/24",
      desc: "BKOFAMERICA MOBILE DEPOSIT",
      amount: 250.0,
      balance: 2613.15,
    },
  ],
  cc1: [
    { date: "09/24/24", desc: "NETFLIX.COM", amount: -15.99, balance: 3402.33 },
    {
      date: "09/22/24",
      desc: "CHIPOTLE MEXICAN GRILL",
      amount: -14.75,
      balance: 3386.34,
    },
    {
      date: "09/21/24",
      desc: "AMAZON MARKETPLACE",
      amount: -132.99,
      balance: 3371.59,
    },
    {
      date: "09/18/24",
      desc: "STARBUCKS STORE",
      amount: -6.85,
      balance: 3238.6,
    },
    { date: "09/17/24", desc: "CVS PHARMACY", amount: -22.4, balance: 3231.75 },
    {
      date: "09/14/24",
      desc: "PAYMENT THANK YOU",
      amount: 250.0,
      balance: 3209.35,
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDollar(n: number, showSign = false) {
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (showSign) return n >= 0 ? `$${abs}` : `-$${abs}`;
  return `$${abs}`;
}

// ── Shared Top Bar ────────────────────────────────────────────────────────────
import { useLocation } from "react-router-dom";

function TopBar({
  onMenu,
  onBack,
  showBack = false,
  mailCount = 5,
}: {
  onMenu: () => void;
  onBack?: () => void;
  showBack?: boolean;
  mailCount?: number;
}) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-3 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        {/* Menu (always visible) */}
        {!showBack && (
          <button
            onClick={onMenu}
            className="flex flex-col items-center gap-[3px] min-w-[44px]"
          >
            <span className="block w-5 h-[2px] bg-gray-700" />
            <span className="block w-5 h-[2px] bg-gray-700" />
            <span className="block w-5 h-[2px] bg-gray-700" />
            <span className="text-[9px] text-gray-700 font-medium mt-0.5">
              Menu
            </span>
          </button>
        )}

        {/* Back button — only when showBack is true */}
        {showBack && (
          <button
            onClick={onBack}
            className="min-w-11 min-h-11 h-11"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Mail */}
        <button className="flex flex-col items-center relative">
          <div className="relative">
            <Mail className="w-6 h-6 text-[#555]" />
            {mailCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-3 h-3 bg-[#3158b3] text-white text-[9px] font-bold rounded-sm flex items-center justify-center">
                {mailCount}
              </span>
            )}
          </div>
          <span className="text-[9px] text-gray-600 mt-0.5">Mail</span>
        </button>

        {/* Products */}
        <button className="flex flex-col items-center">
          <ShoppingCart className="w-6 h-6 text-[#555]" />
          <span className="text-[9px] text-gray-600 mt-0.5">Products</span>
        </button>

        {/* Log Out */}
        <button className="flex flex-col items-center">
          <LogOut className="w-6 h-6 text-[#555]" />
          <span className="text-[9px] text-gray-600 mt-0.5">Log Out</span>
        </button>
      </div>
    </div>
  );
}

// Accounts / Dashboard tab switcher
function AccountsDashboardTabs({
  active,
  onChange,
}: {
  active: "accounts" | "dashboard";
  onChange: (t: "accounts" | "dashboard") => void;
}) {
  return (
    <div className="sticky top-[60px] z-30 flex bg-white border-b border-gray-200">
      {(["accounts", "dashboard"] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="flex-1 py-3 text-sm font-semibold relative"
          style={{ color: active === t ? "#E31837" : "#555" }}
        >
          {t === "accounts" ? "Accounts" : "Dashboard"}
          {active === t && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E31837]" />
          )}
        </button>
      ))}
    </div>
  );
}

// Search bar — standalone rounded section
function SearchBar({ notifCount = 4 }: { notifCount?: number }) {
  return (
    <div className="flex items-center gap-2.5 px-3 pt-3 pb-1">
      <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth={2}
          className="w-4 h-4 shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-gray-400">How can we help?</span>
      </div>
      <button className="relative shrink-0">
        <div className="w-7 h-7 bg-[#E31837] rounded-full flex items-center justify-center">
          <img src="/boa-logo-t.png" alt="Notifications" className="w-5 h-5" />
        </div>
        {notifCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#3158b3] text-white text-[9px] font-medium rounded-sm flex items-center justify-center">
            {notifCount}
          </span>
        )}
      </button>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [faceId, setFaceId] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-12 pb-6">
        {/* BOA Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div>
            <p className="text-sm font-black tracking-widest text-[#012169] leading-none">
              BANK OF AMERICA
            </p>
            <div className="flex gap-[2px] mt-1">
              <div className="h-1.5 flex-1 bg-[#E31837]" />
              <div className="h-1.5 flex-1 bg-[#012169]" />
              <div className="h-1.5 w-5 bg-[#E31837]" />
            </div>
          </div>
          {/* Flag stripe mark */}
          <div className="ml-1 flex flex-col gap-[2px]">
            <div className="h-1 w-6 bg-[#E31837]" />
            <div className="h-1 w-6 bg-[#012169]" />
            <div className="h-1 w-6 bg-[#E31837]" />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-1 mb-5">
          <label className="block text-sm font-semibold text-[#012169] mb-1">
            User ID
          </label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-[#012169] outline-none py-2 text-sm bg-transparent"
            placeholder=""
          />
        </div>
        <div className="mb-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-[#012169] outline-none py-2 text-sm bg-transparent"
            placeholder="Password"
          />
        </div>

        {/* Options */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
              className="w-4 h-4 rounded-full accent-[#012169]"
            />
            Save User ID
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={faceId}
              onChange={(e) => setFaceId(e.target.checked)}
              className="w-4 h-4 rounded-full accent-[#012169]"
            />
            Set Up Face ID
          </label>
        </div>

        <button
          onClick={onLogin}
          className="w-full bg-[#6B7280] hover:bg-[#4B5563] active:bg-[#374151] text-white font-bold py-3 rounded-full text-sm tracking-widest transition-colors"
        >
          LOG IN
        </button>

        <div className="text-center mt-4">
          <button className="text-sm text-[#E31837] font-medium">
            Forgot ID/Password
          </button>
        </div>
      </div>

      {/* My Balance section */}
      <div className="mt-2 border-t border-gray-100 pt-4 pb-6 px-5 bg-gray-50 flex-1">
        <h2 className="text-center text-sm font-semibold text-gray-800 mb-3">
          My Balance ™
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              title: "Zelle®",
              sub: "A safe way to send money to people you know",
              icon: (
                <span
                  className="text-xl font-black italic"
                  style={{ color: "#6D1ED4" }}
                >
                  Zelle
                </span>
              ),
              color: "white",
            },
            {
              title: "",
              sub: "Find out the value of your home",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E31837"
                  strokeWidth={1.5}
                  className="w-8 h-8"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              ),
              color: "white",
            },
            {
              title: "",
              sub: "Open an account or apply for a loan",
              icon: (
                <div className="w-9 h-9 border-2 border-[#E31837] rounded-full flex items-center justify-center">
                  <span className="text-[#E31837] font-bold text-base">$</span>
                </div>
              ),
              color: "white",
            },
            {
              title: "",
              sub: "Thinking of buying a home?",
              icon: <div className="text-2xl">🗺️</div>,
              color: "white",
            },
          ].map((card, i) => (
            <button
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center text-center gap-1 active:bg-gray-50 transition-colors shadow-sm"
            >
              {card.icon}
              {card.title && (
                <p className="text-sm font-bold text-gray-800">{card.title}</p>
              )}
              <p className="text-[11px] text-gray-500 leading-tight">
                {card.sub}
              </p>
            </button>
          ))}
        </div>
        <div className="text-center mt-5">
          <button className="text-sm text-[#E31837] font-medium">
            Locations | Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Account Detail + Transactions ─────────────────────────────────────────────
type AccountItem = {
  id: string;
  label: string;
  number: string;
  balance: number;
  available?: number;
  limit?: number;
};

function AccountDetail({ account }: { account: AccountItem }) {
  const [showRouting, setShowRouting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const txns = transactions[account.id] ?? [];
  const displayed = showAll ? txns : txns.slice(0, 5);
  const isCredit = account.id.startsWith("cc");

  const { showNumbers, toggleNumbers } = useAccountNumberVisibility();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Top: back + search + notif */}
      <SearchBar />

      {/* Account header */}
      <div className="px-3 pt-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 pt-5 pb-4">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-base font-bold text-gray-600">
              {account.label} - {account.number.slice(-4)}
            </h1>
            <div className="flex items-center gap-3">
              <button className="text-xs text-blue-500/80 tracking-wide">
                EDIT
              </button>
            </div>
          </div>
          <div className="text-center mb-2">
            <p className="text-4xl font-light text-gray-900">
              <span className="text-2xl font-normal align-super text-gray-700">
                $
              </span>
              {Math.abs(account.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-xs text-gray-500">
                {isCredit ? "Current Balance" : "Available Balance"}
              </p>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth={2}
                className="w-3.5 h-3.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            {isCredit && account.limit && (
              <p className="text-xs text-gray-400 mt-0.5">
                Available Credit: {fmtDollar(account.limit - account.balance)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account & Routing # */}
      <div className="px-3 pt-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowRouting((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Account & Routing #
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth={2}
              className="w-4 h-4"
              style={{
                transform: showRouting ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {showRouting && (
            <div className="px-4 pb-4 text-sm text-gray-700 ">
              {/* <div className="flex justify-between py-2">
                <span className="text-gray-500">Account Name</span>
                <span className="font-sans font-bold">BUDRO BG LLC</span>
              </div> */}
              <div className="flex justify-between py-2 border-b border-gray-200 pb-4">
                <span className="text-gray-500 text-sm font-bold border-gray-100">
                  Account Number
                </span>
                <span className="flex justify-center gap-2 font-sans font-bold">
                  {account.number}
                  {/* <button
                    onClick={toggleNumbers}
                    aria-label={
                      showNumbers
                        ? "Hide account number"
                        : "Show account number"
                    }
                    className="text-gray-600"
                  >
                    {showNumbers ? (
                      // eye-off icon
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      // eye icon
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button> */}
                </span>
              </div>

              <div className="pt-4 pb-2">
                <p className="text-sm font-bold tracking-wider text-gray-500  mb-3">
                  Routing Numbers
                </p>
                <div>
                  <div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Paper & Electronic</span>
                      <span className="font-sans font-bold">021200339</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5 max-w-[95%]">
                      Use this routing number to order checks, set up direct
                      deposits, and outgoing payments to other financial
                      institutions.
                    </p>
                  </div>
                  <div className="border-t border-gray-100 mt-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Wires</span>
                      <span className="font-sans font-bold">026009593</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5 max-w-[95%]">
                      Use this routing number for all incoming wire transfers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-3 pt-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">
              Recent Transactions
            </p>
            <div className="divide-y divide-gray-100">
              {displayed.map((tx, i) => (
                <div
                  key={i}
                  className="py-3 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{tx.date}</p>
                    <p className="text-sm font-semibold text-gray-500 uppercase leading-snug max-w-27.5">
                      {tx.desc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-400">
                      {tx.amount < 0
                        ? `-$${Math.abs(tx.amount).toFixed(2)}`
                        : `$${tx.amount.toFixed(2)}`}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      ${tx.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!showAll && txns.length > 5 && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-center text-sm font-bold text-gray-700 tracking-widest border-t border-gray-200 uppercase"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Spending & Budgeting teaser */}
      <div className="px-3 pt-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4">
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">
            Spending & Budgeting
          </p>
          <div className="flex items-center gap-4">
            {/* mini pie */}
            <svg viewBox="-2 -2 40 40" className="w-16 h-16 shrink-0">
              <circle cx="18" cy="18" r="15.9" fill="#eee" />
              <path
                d="M18 2 A16 16 0 0 1 34 18"
                fill="none"
                stroke="#E31837"
                strokeWidth="6"
              />
              <path
                d="M34 18 A16 16 0 0 1 20 33.9"
                fill="none"
                stroke="#012169"
                strokeWidth="6"
              />
              <path
                d="M20 33.9 A16 16 0 0 1 2 18"
                fill="none"
                stroke="#6B7280"
                strokeWidth="6"
              />
              <path
                d="M2 18 A16 16 0 0 1 18 2"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="6"
              />
            </svg>
            <p className="text-sm text-gray-600 leading-snug">
              On average, you spend{" "}
              <span className="font-bold text-gray-900">$1,240/mo</span> in this
              account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Accounts List ─────────────────────────────────────────────────────────────
function AccountsList({
  onSelectAccount,
}: {
  onSelectAccount: (a: AccountItem) => void;
}) {
  const bankingTotal = bankingAccounts.reduce((s, a) => s + a.balance, 0);
  const creditTotal = creditAccounts.reduce((s, a) => s + a.balance, 0);
  const [bankingOpen, setBankingOpen] = useState(true);
  const [creditOpen, setCreditOpen] = useState(true);
  const [loansOpen, setLoansOpen] = useState(true);

  // NEW
  const { showNumbers } = useAccountNumberVisibility();

  return (
    <div className="min-h-full">
      {/* Welcome card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-50">
          <div>
            <p className="text-base font-bold text-gray-900 text-left">
              Hello, {USER.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{USER.tier}</p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#999"
            strokeWidth={2}
            className="w-4 h-4 shrink-0"
          >
            <path
              d="M9 18l6-6-6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50">
            <div className="w-7 h-7 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-[#555] fill-black" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900">
                Bank of America Life Plan®
              </p>
              <p className="text-xs text-gray-500">
                Your next steps are ready. Let's go!
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth={2}
              className="w-4 h-4 shrink-0"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="border-t border-gray-100">
          <button className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">My Rewards</p>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth={1.8}
              className="w-5 h-5"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <p className="flex-1 text-left text-sm font-semibold text-gray-900">
              Contact Us
            </p>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth={2}
              className="w-4 h-4 shrink-0"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Show Net Worth */}
      <div className="flex justify-end px-1 py-2.5">
        <button className="flex items-center gap-1 text-sm text-[#254be0]">
          Show Net Worth
          <SettingsIcon className="w-4 h-4 text-[#3455d8]" />
        </button>
      </div>

      {/* Banking section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionBar />
        <div>
          <button
            onClick={() => setBankingOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <p className="text-xl font-extrabold text-gray-800">Banking</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-extrabold text-gray-800">
                {fmtDollar(bankingTotal)}
              </p>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth={2.5}
                className="w-4 h-4"
                style={{
                  transform: bankingOpen ? "none" : "rotate(180deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path
                  d="M18 15l-6-6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {bankingOpen && (
            <>
              <div className="px-4 pb-2 flex items-center justify-between">
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                  Bank of America
                </p>
                <img src="/boa-logo.jpg" alt="Banking" className="w-6 h-6" />
              </div>
              {bankingAccounts.map((acc, i) => (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-50 transition-colors ${i < bankingAccounts.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <p className="text-lg font-medium text-gray-800">
                    {acc.label} - {maskNumber(acc.number, showNumbers)}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-600">
                      {fmtDollar(acc.balance)}
                    </p>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#BBB"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Credit Cards section */}
      <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionBar />
        <div>
          <button
            onClick={() => setCreditOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <p className="text-xl font-extrabold text-gray-800">Credit Cards</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-extrabold text-gray-800">
                {fmtDollar(creditTotal)}
              </p>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth={2.5}
                className="w-4 h-4"
                style={{
                  transform: creditOpen ? "none" : "rotate(180deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path
                  d="M18 15l-6-6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          {creditOpen && (
            <>
              <div className="px-4 pb-2 flex items-center justify-between">
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                  Bank of America
                </p>
                <img src="/boa-logo.jpg" alt="Banking" className="w-6 h-6" />
              </div>
              {creditAccounts.map((acc, i) => (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-50 transition-colors ${i < creditAccounts.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <p className="text-lg font-medium text-gray-600">
                    {acc.label} - {maskNumber(acc.number, showNumbers)}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-600">
                      {fmtDollar(acc.balance)}
                    </p>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#BBB"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Loans section */}
      <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionBar />
        <div>
          <button
            onClick={() => setLoansOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <p className="text-base font-extrabold text-gray-800">Loans</p>
            <div className="flex items-center gap-2">
              <p className="text-base font-extrabold text-gray-800">
                {fmtDollar(creditTotal)}
              </p>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth={2.5}
                className="w-4 h-4"
                style={{
                  transform: loansOpen ? "none" : "rotate(180deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path
                  d="M18 15l-6-6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          {loansOpen && (
            <>
              <div className="px-4 pb-2 flex items-center justify-between">
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                  Bank of America
                </p>
                <img src="/boa-logo.jpg" alt="Banking" className="w-6 h-6" />
              </div>
              {loansAccounts.map((acc, i) => (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-50 transition-colors ${i < loansAccounts.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <p className="text-lg font-medium text-gray-800">
                    {acc.label} - {maskNumber(acc.number, showNumbers)}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-600">
                      {fmtDollar(acc.balance)}
                    </p>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#BBB"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}

// ── Pay & Transfer ─────────────────────────────────────────────────────────────
function PayTransfer() {
  const options = [
    { label: "Transfer between my accounts", icon: "⇄" },
    { label: "Pay bills", icon: "🏦" },
    { label: "Send & receive with Zelle®", icon: "Z", purple: true },
    { label: "Wire transfer", icon: "📡" },
    { label: "Loan payment", icon: "💳" },
  ];

  return (
    <div className="pb-28">
      <div className="px-1 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Pay & Transfer</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {options.map((opt) => (
          <button
            key={opt.label}
            className="w-full flex items-center gap-4 px-4 py-4 active:bg-gray-50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0"
              style={{
                background: opt.purple ? "#6D1ED4" : "#E31837",
                color: "white",
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              {opt.icon}
            </div>
            <p className="flex-1 text-sm font-medium text-gray-800 text-left">
              {opt.label}
            </p>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#BBB"
              strokeWidth={2}
              className="w-4 h-4 shrink-0"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
      <div className="px-1 pt-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Recent Transfers
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {[
            { name: "Budro BG LLC (Zelle)", date: "07/31/24", amount: -69.48 },
            { name: "Checking → Savings", date: "07/20/24", amount: -200.0 },
          ].map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.date}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${Math.abs(t.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Deposit Checks ─────────────────────────────────────────────────────────────
function DepositChecks() {
  return (
    <div className="pb-28">
      <div className="px-1 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Deposit Checks</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden px-4 py-8 text-center">
        <div className="w-20 h-20 bg-[#E31837]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E31837"
            strokeWidth={1.5}
            className="w-10 h-10"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <p className="text-base font-bold text-gray-900 mb-2">
          Mobile Check Deposit
        </p>
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
          Take a photo of the front and back of your check to deposit it
          instantly.
        </p>
        <button className="bg-[#E31837] text-white font-bold py-3 px-8 rounded-full text-sm active:bg-[#C01030] transition-colors">
          Deposit a Check
        </button>
      </div>
      <div className="px-1 pt-5">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
          Recent Deposits
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {[
            {
              date: "07/23/24",
              desc: "BKOFAMERICA MOBILE DEPOSIT",
              amount: 100.0,
            },
            {
              date: "07/22/24",
              desc: "BKOFAMERICA MOBILE DEPOSIT",
              amount: 250.0,
            },
          ].map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{d.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.date}</p>
              </div>
              <p className="text-sm font-semibold text-green-700">
                +${d.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Trade ──────────────────────────────────────────────────────────────────────
function Trade() {
  const holdings = [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      shares: 5.2,
      price: 224.18,
      change: +1.34,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      shares: 3,
      price: 416.78,
      change: -2.11,
    },
    {
      ticker: "VTI",
      name: "Vanguard Total Market ETF",
      shares: 10,
      price: 258.44,
      change: +0.88,
    },
  ];
  const total = holdings.reduce((s, h) => s + h.shares * h.price, 0);

  return (
    <div className="pb-28">
      <div className="px-1 pt-5 pb-1">
        <h1 className="text-xl font-bold text-gray-900">Trade</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4 mb-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
          Portfolio Value
        </p>
        <p className="text-3xl font-light text-gray-900">{fmtDollar(total)}</p>
        <p className="text-xs text-green-600 font-semibold mt-0.5">
          ▲ +$42.17 today
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SectionBar />
        <div className="divide-y divide-gray-100">
          {holdings.map((h) => (
            <button
              key={h.ticker}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#012169] flex items-center justify-center text-white text-xs font-black shrink-0">
                  {h.ticker.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{h.ticker}</p>
                  <p className="text-xs text-gray-500">{h.shares} shares</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {fmtDollar(h.shares * h.price)}
                </p>
                <p
                  className={`text-xs font-semibold ${h.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {h.change > 0 ? "+" : ""}
                  {h.change.toFixed(2)} today
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 px-1 mt-4">
        <button className="flex-1 bg-[#E31837] text-white font-bold py-3 rounded-full text-sm active:bg-[#C01030]">
          Buy
        </button>
        <button className="flex-1 border-2 border-[#E31837] text-[#E31837] font-bold py-3 rounded-full text-sm active:bg-[#E31837]/5">
          Sell
        </button>
      </div>
    </div>
  );
}

// ── Bottom Navigation ─────────────────────────────────────────────────────────
type Tab = "accounts" | "pay" | "deposit" | "trade";

function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    {
      id: "accounts",
      label: "Accounts",
      icon: <CurrencyCircleDollarIcon size={32} />,
    },
    {
      id: "pay",
      label: "Pay & Transfer",
      icon: <CurrencyCircleDollarArrow size={32} />,
    },
    {
      id: "deposit",
      label: "Deposit Checks",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-6 h-6"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" />
          <path d="M12 14v-2M10 14h4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "trade",
      label: "Trade",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-6 h-6"
        >
          <polyline
            points="22,7 13.5,15.5 8.5,10.5 2,17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="16,7 22,7 22,13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 active:bg-gray-50"
            style={{ color: active === t.id ? "#2f07f4" : "#6B7280" }}
          >
            {t.icon}
            <span className="text-[9px] font-semibold leading-tight text-center px-0.5">
              {t.label}
            </span>
          </button>
        ))}
      </div>
      <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("accounts");
  const [subtab, setSubtab] = useState<"accounts" | "dashboard">("accounts");
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // NEW: global show/hide state
  const [showNumbers, setShowNumbers] = useState(false);

  const toggleNumbers = () => setShowNumbers((v) => !v);

  const providerValue = { showNumbers, toggleNumbers };

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  if (selectedAccount) {
    return (
      <AccountNumberVisibilityContext.Provider value={providerValue}>
        <div className="max-w-md mx-auto min-h-screen bg-gray-50">
          <TopBar
            onMenu={() => setMenuOpen(true)}
            showBack
            onBack={() => setSelectedAccount(null)}
          />
          <AccountDetail account={selectedAccount} />
          <BottomNav active={tab} onChange={setTab} />
        </div>
      </AccountNumberVisibilityContext.Provider>
    );
  }

  return (
    <AccountNumberVisibilityContext.Provider value={providerValue}>
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 mb-16">
        {/* Slide-in Menu overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 flex"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="w-72 bg-white h-full shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#012169] px-5 pt-12 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">
                      {USER.name}
                    </p>
                    <p className="text-white/70 text-xs">{USER.tier}</p>
                  </div>
                </div>
              </div>
              {[
                "Home",
                "Accounts",
                "Card Manager",
                "Life Plan®",
                "Security Center",
                "Help & Support",
                "Locations & ATMs",
                "Log Out",
              ].map((item) => (
                <button
                  key={item}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 active:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {item}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#CCC"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
            <div className="flex-1 bg-black/40" />
          </div>
        )}

        <TopBar onMenu={() => setMenuOpen(true)} />

        {tab === "accounts" && (
          <>
            <AccountsDashboardTabs active={subtab} onChange={setSubtab} />
            {/* SearchBar as its own separate rounded section */}
            <SearchBar />
            <div className="px-3 pt-2">
              <AccountsList onSelectAccount={setSelectedAccount} />
            </div>
          </>
        )}

        {tab === "pay" && (
          <div className="px-3">
            <SearchBar />
            <PayTransfer />
          </div>
        )}

        {tab === "deposit" && (
          <div className="px-3">
            <SearchBar />
            <DepositChecks />
          </div>
        )}

        {tab === "trade" && (
          <div className="px-3">
            <SearchBar />
            <Trade />
          </div>
        )}

        <BottomNav active={tab} onChange={setTab} />
      </div>
    </AccountNumberVisibilityContext.Provider>
  );
}

function CurrencyCircleDollarArrow({ size = 24, color = "currentColor" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={color}
    >
      {/* Circle + $ from Phosphor CurrencyCircleDollar */}
      <circle
        cx="112"
        cy="128"
        r="88"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="112"
        y1="88"
        x2="112"
        y2="104"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <line
        x1="112"
        y1="152"
        x2="112"
        y2="168"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M92,152h28a16,16,0,0,0,0-32H104a16,16,0,0,1,0-32h28"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Forward arrow */}
      <line
        x1="184"
        y1="128"
        x2="232"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <polyline
        points="208,104 232,128 208,152"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// git push -u origin main
