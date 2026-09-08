import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  CircleCheckBig,
  ClipboardList,
  Handshake,
  Headset,
  Leaf,
  LoaderCircle,
  Mail,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import RequirementTable from "../components/requirements/RequirementTable";
import type { RequirementRowAction } from "../components/requirements/RequirementTable";
import {
  EMPTY_REQUIREMENT_FORM,
  RequirementDetailsModal,
  RequirementFormModal,
  RequirementOffersModal,
  requirementToForm,
} from "../components/requirements/RequirementModals";
import type { RequirementFormValues } from "../components/requirements/RequirementModals";
import type { BuyerRequirement, RequirementStatus } from "../data/buyerRequirements";
import {
  REQUIREMENT_OFFERS,
  todayIso,
  todayLabel,
} from "../data/buyerRequirements";
import type { CropKey } from "../data/buyerRequirements";
import { cn } from "../../utils/cn";
import { useBuyerRequirements } from "../hooks/useBuyerRequirements";
import { useBuyerToast } from "../hooks/useBuyerToast";

type ReqTabKey = "all" | RequirementStatus;

const TABS: { key: ReqTabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "negotiation", label: "In Negotiation" },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "closed", label: "Closed" },
];

interface ReqFilterValues {
  crop: string;
  location: string;
  status: string;
  date: string;
}

const EMPTY_REQ_FILTERS: ReqFilterValues = {
  crop: "All Crops",
  location: "All Locations",
  status: "All Status",
  date: "",
};

let requirementSeq = 6;
const nextRequirementId = () => `REQ${String(++requirementSeq).padStart(3, "0")}`;

function requiredByTimeline(iso: string): string {
  if (!iso) return "Within 15 days";
  const days = Math.max(1, Math.round((new Date(`${iso}T00:00:00`).getTime() - Date.now()) / 86_400_000));
  return `Within ${days} day${days === 1 ? "" : "s"}`;
}

function toCropKey(name: string): CropKey {
  const n = name.trim().toLowerCase();
  if (n.includes("paddy") || n.includes("rice")) return "paddy";
  if (n.includes("wheat")) return "wheat";
  if (n.includes("maize") || n.includes("corn")) return "maize";
  if (n.includes("moong") || n.includes("dal")) return "moong";
  if (n.includes("potato")) return "potato";
  if (n.includes("onion")) return "onion";
  return "paddy";
}

export default function MyRequirements() {
  const { requirements, setRequirements, loadState } = useBuyerRequirements();
  const [tab, setTab] = useState<ReqTabKey>("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ReqFilterValues>(EMPTY_REQ_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modal, setModal] = useState<
    | { kind: "create" }
    | { kind: "edit"; requirement: BuyerRequirement }
    | { kind: "details"; requirement: BuyerRequirement }
    | { kind: "offers"; requirement: BuyerRequirement }
    | null
  >(null);
  const { toast, showToast } = useBuyerToast();

  /* ----------------------- Derived stats (live from array) ------------------ */
  const summary = useMemo(() => {
    const total = requirements.length;
    const offers = requirements.reduce((sum, r) => sum + r.offersCount, 0);
    const open = requirements.filter((r) => r.status === "open").length;
    const negotiating = requirements.filter((r) => r.status === "negotiation").length;
    const fulfilled = requirements.filter((r) => r.status === "fulfilled").length;
    const closed = requirements.filter((r) => r.status === "closed").length;
    return { total, offers, open, negotiating, fulfilled, closed };
  }, [requirements]);

  const SUMMARY_CARDS = useMemo(
    () => [
      { key: "total", title: "Total Requirements", value: String(summary.total), supporting: "↑ 2 new this month", icon: ClipboardList, iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
      { key: "offers", title: "Offers Received", value: String(summary.offers), supporting: "↑ 50% vs last month", icon: Mail, iconClass: "bg-[#DCEAF7] text-[#1D6FB8]" },
      { key: "negotiation", title: "In Negotiation", value: String(summary.negotiating), supporting: "Active discussions", icon: Handshake, iconClass: "bg-[#F0E2B8] text-[#C08A18]" },
      { key: "fulfilled", title: "Fulfilled", value: String(summary.fulfilled), supporting: "Completed", icon: CircleCheckBig, iconClass: "bg-emerald-100 text-emerald-700" },
    ],
    [summary]
  );

  const counts = useMemo(
    () => ({
      all: summary.total,
      open: summary.open,
      negotiation: summary.negotiating,
      fulfilled: summary.fulfilled,
      closed: summary.closed,
    }),
    [summary]
  );

  /* --------------------------- Filters + search --------------------------- */
  const cropOptions = useMemo(
    () => ["All Crops", ...Array.from(new Set(requirements.map((r) => r.cropName)))],
    [requirements]
  );
  const locationOptions = useMemo(
    () => ["All Locations", ...Array.from(new Set(requirements.map((r) => r.location)))],
    [requirements]
  );

  const visibleRequirements = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requirements.filter((req) => {
      if (tab !== "all" && req.status !== tab) return false;
      if (filters.crop !== "All Crops" && req.cropName !== filters.crop) return false;
      if (filters.location !== "All Locations" && req.location !== filters.location) return false;
      if (filters.status !== "All Status" && req.status !== filters.status) return false;
      if (filters.date && req.createdIso.slice(0, 7) !== filters.date.slice(0, 7) && req.dueDateIso !== filters.date)
        return false;
      if (
        q &&
        ![req.cropName, req.variety, req.location, req.requirementId].some((f) =>
          f.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [requirements, tab, search, filters]);

  const hasActiveFilters =
    filters.crop !== "All Crops" ||
    filters.location !== "All Locations" ||
    filters.status !== "All Status" ||
    filters.date !== "" ||
    search.trim() !== "";

  const resetFilters = () => {
    setTab("all");
    setSearch("");
    setFilters(EMPTY_REQ_FILTERS);
    setFilterOpen(false);
  };

  /* ------------------------------- Mutations ------------------------------- */
  const saveRequirement = (values: RequirementFormValues) => {
    const minPrice = values.minPrice ? Number(values.minPrice) : 0;
    const maxPrice = values.maxPrice ? Number(values.maxPrice) : 0;
    const variety = values.variety.trim() || "Common";
    const description = values.description.trim();

    if (modal?.kind === "edit") {
      const target = modal.requirement;
      setRequirements((prev) =>
        prev.map((r) =>
          r.id === target.id
            ? {
                ...r,
                cropName: values.cropName.trim(),
                variety,
                grade: values.grade,
                quantity: Number(values.quantity) || r.quantity,
                unit: values.unit,
                minPrice,
                maxPrice,
                location: values.location.trim(),
                dueDateLabel: values.dueDateIso
                  ? new Date(`${values.dueDateIso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : r.dueDateLabel,
                dueDateIso: values.dueDateIso || r.dueDateIso,
                timeline: requiredByTimeline(values.dueDateIso || r.dueDateIso),
                description,
              }
            : r
        )
      );
      showToast(`Requirement ${target.requirementId} updated.`);
    } else {
      const newReq: BuyerRequirement = {
        id: `r${Date.now()}`,
        requirementId: nextRequirementId(),
        cropKey: toCropKey(values.cropName),
        cropName: values.cropName.trim(),
        variety,
        grade: values.grade,
        quantity: Number(values.quantity) || 0,
        unit: values.unit,
        minPrice,
        maxPrice,
        location: values.location.trim(),
        timeline: requiredByTimeline(values.dueDateIso),
        dueDateLabel: values.dueDateIso
          ? new Date(`${values.dueDateIso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : "—",
        dueDateIso: values.dueDateIso,
        offersCount: 0,
        status: "open",
        createdLabel: todayLabel(),
        createdIso: todayIso(),
        description: description || "No description provided yet.",
      };
      setRequirements((prev) => [newReq, ...prev]);
      showToast(`${newReq.requirementId} created as Open — farmers can now send offers.`);
    }
    setModal(null);
  };

  const handleRowAction = (req: BuyerRequirement, action: RequirementRowAction) => {
    if (action === "view") setModal({ kind: "details", requirement: req });
    else if (action === "edit") setModal({ kind: "edit", requirement: req });
    else if (action === "offers") setModal({ kind: "offers", requirement: req });
    else if (action === "close") {
      setRequirements((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "closed" as const } : r))
      );
      showToast(`Requirement ${req.requirementId} closed.`);
    }
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <BuyerDashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <ClipboardList className="h-[25px] w-[25px]" strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
                My Requirements
              </h1>
              <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
                Create and manage your procurement requirements. Get offers from verified farmers
                and compare to find the best deals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModal({ kind: "create" })}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#2E7D32] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
          >
            <Plus className="h-[17px] w-[17px]" strokeWidth={2.5} />
            Create New Requirement
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUMMARY_CARDS.map((card) => (
            <article
              key={card.key}
              className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12.5px] font-medium text-[#666666]">{card.title}</p>
                <span className={cn("grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full", card.iconClass)}>
                  <card.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
              </div>
              <p className="mt-3 font-display text-[24px] leading-none font-bold text-[#111111]">
                {card.value}
              </p>
              <p className="mt-2 text-[11.5px] font-semibold text-[#8A938A]">{card.supporting}</p>
            </article>
          ))}
        </div>

        {/* Tabs + search + filter */}
        <div className="flex flex-col gap-4 border-b border-[#E1E5E1] lg:flex-row lg:items-end lg:justify-between">
          <div className="no-scrollbar flex items-end gap-6 overflow-x-auto" role="tablist" aria-label="Requirement status">
            {TABS.map((t) => {
              const selected = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative shrink-0 pb-3 text-[13.5px] whitespace-nowrap transition-colors duration-200",
                    selected ? "font-semibold text-[#2E7D32]" : "font-medium text-[#666666] hover:text-[#111111]"
                  )}
                >
                  {t.label} ({counts[t.key]})
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute right-0 -bottom-px left-0 h-[2.5px] rounded-full bg-[#2E7D32] transition-all duration-300",
                      selected ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative flex items-center gap-2.5 pb-0 lg:pb-3">
            <div className="relative min-w-0 flex-1 lg:w-[290px] lg:flex-none">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
              <input
                type="search"
                aria-label="Search requirements"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requirements (crop, location, etc.)"
                className="h-[42px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3.5 pl-10 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                aria-label="Open filters"
                className={cn(
                  "relative inline-flex h-[42px] shrink-0 items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 text-[12.5px] font-semibold transition-colors",
                  filterOpen || hasActiveFilters
                    ? "border-[#2E7D32] text-[#2E7D32]"
                    : "border-[#E1E5E1] text-[#555555] hover:text-[#2E7D32]"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
                Filter
                {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#2E7D32]" aria-hidden="true" />}
              </button>

              {/* Filter panel */}
              {filterOpen && (
                <>
                  <span className="fixed inset-0 z-30 cursor-default" onClick={() => setFilterOpen(false)} aria-hidden="true" />
                  <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-40 w-[290px] rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)]">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#111111]">Filter Requirements</p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </div>
                    <div className="mt-3.5 flex flex-col gap-3">
                      {(
                        [
                          { label: "Crop", value: filters.crop, options: cropOptions, key: "crop" as const },
                          { label: "Location", value: filters.location, options: locationOptions, key: "location" as const },
                          { label: "Status", value: filters.status, options: ["All Status", "open", "negotiation", "fulfilled", "closed"], key: "status" as const },
                        ] as const
                      ).map((field) => (
                        <div key={field.key}>
                          <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">{field.label}</span>
                          <div className="relative">
                            <select
                              aria-label={field.label}
                              value={field.value}
                              onChange={(e) => setFilters((f) => ({ ...f, [field.key]: e.target.value }))}
                              className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-8 pl-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                            >
                              {field.options.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
                          </div>
                        </div>
                      ))}
                      <div>
                        <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">
                          Date Range
                        </span>
                        <input
                          type="date"
                          aria-label="Filter by date"
                          value={filters.date}
                          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
                          className="h-[42px] w-full rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#666666] transition-colors outline-none focus:border-[#2E7D32]"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Requirements table / states */}
        {loadState === "loading" ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-20 text-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#2E7D32]" strokeWidth={2.4} />
            <p className="text-[13.5px] font-medium text-[#666666]">Loading your requirements...</p>
          </div>
        ) : loadState === "error" ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <ClipboardList className="h-6 w-6" strokeWidth={1.9} />
            </span>
            <p className="text-[14px] font-semibold text-[#111111]">Unable to load requirements. Please try again.</p>
          </div>
        ) : visibleRequirements.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
              <ClipboardList className="h-6 w-6" strokeWidth={1.9} />
            </span>
            <p className="text-[14px] font-semibold text-[#111111]">No requirements match your filters</p>
            <p className="max-w-xs text-[12.5px] text-[#666666]">
              Try a different tab, search term or filter combination — or create a new requirement.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <RequirementTable
            requirements={visibleRequirements}
            onView={(requirement) => setModal({ kind: "details", requirement })}
            onViewOffers={(requirement) => setModal({ kind: "offers", requirement })}
            onAction={handleRowAction}
          />
        )}

        {/* Bottom information cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          <section className="flex flex-col rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Leaf className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[15.5px] font-semibold text-[#155B32]">
              Can&apos;t find what you need?
            </h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#3E5B47]">
              Post a new requirement and get offers from verified farmers across India.
            </p>
            <button
              type="button"
              onClick={() => setModal({ kind: "create" })}
              className="mt-4 inline-flex h-[42px] items-center justify-center rounded-xl bg-[#2E7D32] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
            >
              Create Requirement
            </button>
          </section>

          <section className="flex flex-col rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-sky-100 text-sky-700">
              <BarChart3 className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[15.5px] font-semibold text-[#111111]">Track Market Prices</h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#666666]">
              Check latest market prices to set the best price for your requirement.
            </p>
            <Link
              to="/buyer/prices"
              className="mt-4 inline-flex h-[42px] items-center justify-center rounded-xl border-[1.5px] border-[#1D6FB8] text-[12.5px] font-semibold text-[#1D6FB8] transition-colors hover:bg-[#F3F8FD]"
            >
              View Market Prices
            </Link>
          </section>

          <section className="flex flex-col rounded-2xl border border-[#E3D3F4] bg-[#F7F2FD] p-5">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-[#7C3AED] text-white">
              <Headset className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[15.5px] font-semibold text-[#111111]">Need Help?</h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#666666]">
              Our support team is here to assist you with your requirements.
            </p>
            <Link
              to="/buyer/help-support"
              className="mt-4 inline-flex h-[42px] items-center justify-center rounded-xl bg-[#7C3AED] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#682ec9]"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </div>

      {/* Modals */}
      {modal?.kind === "create" && (
        <RequirementFormModal
          mode="create"
          initialValues={EMPTY_REQUIREMENT_FORM}
          onClose={() => setModal(null)}
          onSave={saveRequirement}
        />
      )}
      {modal?.kind === "edit" && (
        <RequirementFormModal
          mode="edit"
          initialValues={requirementToForm(modal.requirement)}
          onClose={() => setModal(null)}
          onSave={saveRequirement}
        />
      )}
      {modal?.kind === "details" && (
        <RequirementDetailsModal requirement={modal.requirement} onClose={() => setModal(null)} />
      )}
      {modal?.kind === "offers" && (
        <RequirementOffersModal
          requirement={modal.requirement}
          offers={REQUIREMENT_OFFERS[modal.requirement.requirementId] ?? []}
          onClose={() => setModal(null)}
          onToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <p
          role="status"
          className={cn(
            "animate-pop-in fixed bottom-6 left-1/2 z-[90] max-w-[92vw] -translate-x-1/2 rounded-full",
            "bg-[#155B32] px-5 py-3 text-center text-[13px] font-medium text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
          )}
        >
          {toast}
        </p>
      )}
    </BuyerDashboardLayout>
  );
}
