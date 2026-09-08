import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  CircleAlert,
  FileCheck,
  Handshake,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";
import {
  ChoiceField,
  CompletionScreen,
  EntryCard,
  FieldGrid,
  FileField,
  Note,
  ProfileShell,
  ReviewBlock,
  SectionCard,
  SelectField,
  StepNav,
  TextAreaField,
  TextField,
} from "../components/profile-ui";
import { clearProfileData, getProfileData, saveProfileData } from "../utils/authStore";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

/* --------------------------------- Types ---------------------------------- */

interface RequirementEntry {
  crop: string;
  quantity: string;
  unit: string;
  grade: string;
  variety: string;
  purchaseDate: string;
  minQuantity: string;
  maxQuantity: string;
  targetPrice: string;
}

interface BuyerProfileState {
  data: Record<string, string>;
  requirements: RequirementEntry[];
  step: number;
  confirmed: boolean;
}

const STEPS = [
  "Business Information",
  "Location",
  "Buying Requirements",
  "Preferences",
  "Verification",
  "Review & Submit",
];

const EMPTY_REQUIREMENT: RequirementEntry = {
  crop: "",
  quantity: "",
  unit: "quintal",
  grade: "A",
  variety: "",
  purchaseDate: "",
  minQuantity: "",
  maxQuantity: "",
  targetPrice: "",
};

/* ---------------------------------- Page ---------------------------------- */

export default function BuyerProfilePage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleCompleteProfile = async () => {
    if (!user) {
      alert("Please log in first to save your profile.");
      return;
    }
    setSaving(true);
    try {
      // 1. Save buyer profile details
      const { error: profileError } = await supabase.from("buyer_profiles").upsert({
        id: user.id,
        business_name: data.business || null,
        contact_person: data.contactPerson,
        business_type: data.businessType,
        business_reg: data.businessReg || null,
        years_in_business: data.years ? Number(data.years) : null,
        state: data.state || null,
        district: data.district || null,
        taluka: data.taluka || null,
        city: data.city || null,
        pincode: data.pincode || null,
        address: data.address || null,
        max_procurement_distance: data.maxDistance ? Number(data.maxDistance) : null,
        procurement_locations: data.procLocations || null,
        preferred_categories: data.categories || null,
        preferred_farmer_type: data.farmerType,
        preferred_location: data.prefLocation || null,
        payment_method: data.paymentMethod,
        delivery_method: data.deliveryMethod,
        gst_number: data.gst || null,
        doc_type: data.docType,
        doc_number: data.docNumber || null,
        verification_status: "pending",
      });
      if (profileError) throw profileError;
      // 2. Save buying requirements if any were entered
      if (requirements && requirements.length > 0) {
        const reqRows = requirements
          .filter((r) => r.crop && r.crop.trim() !== "")
          .map((r) => ({
            buyer_id: user.id,
            crop_name: r.crop,
            variety: r.variety || null,
            quantity: r.quantity ? Number(r.quantity) : null,
            unit: r.unit,
            grade: r.grade,
            purchase_date: r.purchaseDate || null,
            min_quantity: r.minQuantity ? Number(r.minQuantity) : null,
            max_quantity: r.maxQuantity ? Number(r.maxQuantity) : null,
            target_price: r.targetPrice || null,
            status: "open",
          }));
        if (reqRows.length > 0) {
          await supabase.from("buyer_requirements").insert(reqRows);
        }
      }
      // 3. Mark profile completed in base profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("id", user.id);
      if (updateError) throw updateError;
      // 4. Update auth state
            // 4. Update auth state
      await refreshProfile();
      // 5. Clear saved draft from localStorage
      if (user?.id) {
        clearProfileData("buyer", user.id);
      }
      // 6. Show completion screen
      setDone(true);
    } catch (err: any) {
      console.error("Error saving buyer profile:", err);
      alert(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  // --- END OF ADDED CODE ---
  const stepLabel = (i: number) => STEPS[i] ?? "";

    const [state, setState] = useState<BuyerProfileState>(() => {
    const saved = user ? getProfileData<BuyerProfileState>("buyer", user.id) : null;
    if (saved && saved.data) return { ...saved, confirmed: false };

    return {
      step: 0,
      requirements: [EMPTY_REQUIREMENT],
      confirmed: false,
      data: {
        contactPerson: profile?.full_name ?? user?.user_metadata?.full_name ?? "",
        mobile: profile?.mobile ?? user?.user_metadata?.mobile ?? "",
        email: profile?.email ?? user?.email ?? "",
        language: user?.user_metadata?.language ?? "English",
        businessType: "Wholesaler",
        farmerType: "Any",
        paymentMethod: "Bank Transfer",
        deliveryMethod: "Pickup by Buyer",
        docType: "GST Certificate",
      },
    };
  });

  const { data, requirements, step, confirmed } = state;
  const setData = (key: string) => (value: string) =>
    setState((s) => ({ ...s, data: { ...s.data, [key]: value } }));
  const setRequirements = (updater: (current: RequirementEntry[]) => RequirementEntry[]) =>
    setState((s) => ({ ...s, requirements: updater(s.requirements) }));
  const goTo = (i: number) => setState((s) => ({ ...s, step: Math.max(0, Math.min(STEPS.length - 1, i)) }));
  const back = () => (step === 0 ? navigate("/register") : goTo(step - 1));
  const setReq = (i: number, key: keyof RequirementEntry) => (value: string) =>
    setRequirements((r) => r.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)));

  /* Load this specific buyer's uncompleted draft or prefill with their details */
  useEffect(() => {
    if (!user) return;
    const saved = getProfileData<BuyerProfileState>("buyer", user.id);
    if (saved && saved.data) {
      setState((prev) => ({
        ...prev,
        ...saved,
        confirmed: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        step: 0,
        data: {
          ...prev.data,
          contactPerson: prev.data.contactPerson || profile?.full_name || user.user_metadata?.full_name || "",
          mobile: prev.data.mobile || profile?.mobile || user.user_metadata?.mobile || "",
          email: prev.data.email || profile?.email || user.email || "",
          language: prev.data.language || user.user_metadata?.language || "English",
        },
      }));
    }
  }, [user?.id, profile]);

  /* Persist progress for this specific user */
  useEffect(() => {
    if (!user?.id || done) return;
    saveProfileData("buyer", { data, requirements, step, confirmed }, user.id);
  }, [user?.id, data, requirements, step, confirmed, done]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (done) {
    return (
      <CompletionScreen
        title="Profile Completed Successfully!"
        text="Your buyer profile is ready. You can now discover produce, connect with farmers and manage your requirements."
        platformId="KS-BYR-000087"
        cta="Go to Buyer Dashboard"
        to="/buyer/dashboard"
      />
    );
  }

  return (
    <ProfileShell
      title="Complete Your Buyer Profile"
      subtitle="Tell us about your business and requirements so KishanSetu can connect you with suitable farmers and produce."
      steps={STEPS}
      current={step}
    >
      {/* --------------------- STEP 1 · BUSINESS INFO ------------------------ */}
      {step === 0 && (
        <SectionCard icon={Building} title="Business Information" description="Your business and primary contact details.">
          <FieldGrid>
            <TextField id="bp-business" label="Business / Organization Name" value={data.business ?? ""} onChange={setData("business")} placeholder="e.g. Sahyadri Agro Traders" />
            <TextField id="bp-contact" label="Contact Person Name" value={data.contactPerson} onChange={setData("contactPerson")} placeholder="Your full name" />
            <TextField id="bp-mobile" label="Mobile Number" value={data.mobile} onChange={setData("mobile")} placeholder="10-digit mobile number" inputMode="tel" />
            <TextField id="bp-email" label="Email Address" type="email" value={data.email} onChange={setData("email")} placeholder="you@example.com" />
          </FieldGrid>
          <div className="mt-5 flex flex-col gap-5">
            <ChoiceField
              label="Business Type"
              value={data.businessType}
              onChange={setData("businessType")}
              options={["Wholesaler", "Retailer", "Processor", "Restaurant", "Exporter", "FPO", "Other"]}
            />
            <FieldGrid>
              <TextField id="bp-reg" label="Business Registration Number" value={data.businessReg ?? ""} onChange={setData("businessReg")} placeholder="Registration / license number" optional />
              <TextField id="bp-years" label="Years in Business" value={data.years ?? ""} onChange={setData("years")} placeholder="e.g. 8" inputMode="numeric" />
            </FieldGrid>
          </div>
          <StepNav onBack={back} onContinue={() => goTo(1)} />
        </SectionCard>
      )}

      {/* ------------------------ STEP 2 · LOCATION -------------------------- */}
      {step === 1 && (
        <SectionCard icon={MapPin} title="Location" description="Where your business operates and procures produce.">
          <FieldGrid>
            <TextField id="bp-state" label="State" value={data.state ?? ""} onChange={setData("state")} placeholder="e.g. Maharashtra" />
            <TextField id="bp-district" label="District" value={data.district ?? ""} onChange={setData("district")} placeholder="e.g. Nashik" />
            <TextField id="bp-taluka" label="Taluka" value={data.taluka ?? ""} onChange={setData("taluka")} placeholder="e.g. Nashik" />
            <TextField id="bp-city" label="City / Town" value={data.city ?? ""} onChange={setData("city")} placeholder="Your city or town" />
            <TextField id="bp-pincode" label="Pincode" value={data.pincode ?? ""} onChange={setData("pincode")} placeholder="e.g. 422001" inputMode="numeric" />
            <TextField id="bp-max-distance" label="Maximum Procurement Distance (km)" value={data.maxDistance ?? ""} onChange={setData("maxDistance")} placeholder="e.g. 120" inputMode="numeric" />
          </FieldGrid>
          <div className="mt-5 flex flex-col gap-5">
            <TextAreaField id="bp-address" label="Business Address" value={data.address ?? ""} onChange={setData("address")} placeholder="Full business address" />
            <TextField id="bp-proc-locations" label="Preferred Procurement Locations" value={data.procLocations ?? ""} onChange={setData("procLocations")} placeholder="e.g. Nashik, Lasalgaon, Sinnar" />
          </div>
          <StepNav onBack={back} onContinue={() => goTo(2)} />
        </SectionCard>
      )}

      {/* ------------------- STEP 3 · BUYING REQUIREMENTS -------------------- */}
      {step === 2 && (
        <SectionCard icon={ShoppingBasket} title="Buying Requirements" description="Add the produce you want to buy — used for buyer–farmer matching.">
          <Note>
            These requirements help KisanSetu match you with suitable farmers by crop, quantity,
            quality, location and expected dates.
          </Note>
          <div className="mt-5 flex flex-col gap-5">
            {requirements.map((entry, i) => (
              <EntryCard
                key={i}
                title={`Requirement ${i + 1}`}
                canRemove={requirements.length > 1}
                onRemove={() => setRequirements((r) => r.filter((_, idx) => idx !== i))}
              >
                <FieldGrid>
                  <TextField id={`req-crop-${i}`} label="Crop / Produce" value={entry.crop} onChange={setReq(i, "crop")} placeholder="e.g. Tomato" />
                  <TextField id={`req-variety-${i}`} label="Preferred Variety" value={entry.variety} onChange={setReq(i, "variety")} placeholder="e.g. Hybrid" />
                  <TextField id={`req-qty-${i}`} label="Required Quantity" value={entry.quantity} onChange={setReq(i, "quantity")} placeholder="e.g. 5000" inputMode="numeric" />
                  <SelectField id={`req-unit-${i}`} label="Unit" value={entry.unit} onChange={setReq(i, "unit")} options={["kg", "quintal", "tonne"]} />
                  <SelectField id={`req-grade-${i}`} label="Required Quality / Grade" value={entry.grade} onChange={setReq(i, "grade")} options={["A", "B", "C", "Other"]} />
                  <TextField id={`req-date-${i}`} label="Expected Purchase Date" type="date" value={entry.purchaseDate} onChange={setReq(i, "purchaseDate")} />
                  <TextField id={`req-min-${i}`} label="Minimum Quantity" value={entry.minQuantity} onChange={setReq(i, "minQuantity")} placeholder="e.g. 2000" inputMode="numeric" />
                  <TextField id={`req-max-${i}`} label="Maximum Quantity" value={entry.maxQuantity} onChange={setReq(i, "maxQuantity")} placeholder="e.g. 8000" inputMode="numeric" />
                  <div className="sm:col-span-2">
                    <TextField id={`req-price-${i}`} label="Target Price (per unit)" value={entry.targetPrice} onChange={setReq(i, "targetPrice")} placeholder="e.g. ₹1,450" optional />
                  </div>
                </FieldGrid>
              </EntryCard>
            ))}
            <button
              type="button"
              onClick={() => setRequirements((r) => [...r, { ...EMPTY_REQUIREMENT }])}
              className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#2E7D32]/50 bg-[#EAF6EA]/40 text-[14px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA] sm:w-fit sm:px-7"
            >
              <Plus className="h-[17px] w-[17px]" strokeWidth={2.5} />
              Add Another Requirement
            </button>
          </div>
          <StepNav onBack={back} onContinue={() => goTo(3)} />
        </SectionCard>
      )}

      {/* ----------------------- STEP 4 · PREFERENCES ------------------------ */}
      {step === 3 && (
        <SectionCard icon={Handshake} title="Preferences" description="How you prefer to source and transact.">
          <div className="flex flex-col gap-5">
            <TextField id="bp-categories" label="Preferred Produce Categories" value={data.categories ?? ""} onChange={setData("categories")} placeholder="e.g. Vegetables, Grains, Fruits" />
            <ChoiceField label="Preferred Farmer Type" value={data.farmerType} onChange={setData("farmerType")} options={["Individual Farmer", "FPO", "Farmer Group", "Any"]} />
            <FieldGrid>
              <TextField id="bp-pref-location" label="Preferred Location" value={data.prefLocation ?? ""} onChange={setData("prefLocation")} placeholder="e.g. Within Maharashtra" />
              <SelectField id="bp-payment" label="Preferred Payment Method" value={data.paymentMethod} onChange={setData("paymentMethod")} options={["Bank Transfer", "UPI", "Other"]} />
            </FieldGrid>
            <ChoiceField label="Preferred Delivery Method" value={data.deliveryMethod} onChange={setData("deliveryMethod")} options={["Pickup by Buyer", "Farmer Delivery", "Transport Partner"]} />
            <TextAreaField id="bp-additional" label="Additional Requirements" value={data.additional ?? ""} onChange={setData("additional")} placeholder="Anything else farmers should know" optional />
          </div>
          <StepNav onBack={back} onContinue={() => goTo(4)} />
        </SectionCard>
      )}

      {/* ----------------------- STEP 5 · VERIFICATION ----------------------- */}
      {step === 4 && (
        <SectionCard icon={ShieldCheck} title="Business Verification" description="Optional details that help build trust with farmers.">
          <Note>
            This is a business-profile collection interface only — KisanSetu does not perform
            government verification. Your verification status will remain <b>Pending</b> until an
            authorised review takes place.
          </Note>
          <div className="mt-5 flex flex-col gap-5">
            <FieldGrid>
              <TextField id="bp-business-reg" label="Business Registration Number" value={data.businessReg ?? ""} onChange={setData("businessReg")} placeholder="If applicable" optional />
              <TextField id="bp-gst" label="GST Number" value={data.gst ?? ""} onChange={setData("gst")} placeholder="e.g. 27ABCDE1234F1Z5" optional />
            </FieldGrid>
            <FieldGrid>
              <SelectField id="bp-doc-type" label="Document Type" value={data.docType} onChange={setData("docType")} options={["GST Certificate", "Shop Act Licence", "Trade Licence", "Other"]} />
              <TextField id="bp-doc-number" label="Document Number" value={data.docNumber ?? ""} onChange={setData("docNumber")} placeholder="Enter document number" />
            </FieldGrid>
            <FileField id="bp-doc-file" label="Supporting Document" value={data.docFile ?? ""} onChange={setData("docFile")} optional />
            <p className="flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[12.5px] font-semibold text-amber-700">
              <CircleAlert className="h-4 w-4" />
              Verification Status: Pending
            </p>
          </div>
          <StepNav onBack={back} onContinue={() => goTo(5)} />
        </SectionCard>
      )}

      {/* ------------------------- STEP 6 · REVIEW --------------------------- */}
      {step === 5 && (
        <SectionCard icon={FileCheck} title="Review Your Profile" description="Check everything looks right before completing your profile.">
          <div className="flex flex-col gap-4">
            <ReviewBlock title={stepLabel(0)} onEdit={() => goTo(0)} rows={[
              ["Business Name", data.business ?? ""], ["Contact Person", data.contactPerson],
              ["Mobile", data.mobile], ["Email", data.email],
              ["Business Type", data.businessType], ["Years in Business", data.years ?? ""],
            ]} />
            <ReviewBlock title={stepLabel(1)} onEdit={() => goTo(1)} rows={[
              ["State", data.state ?? ""], ["District", data.district ?? ""], ["City / Town", data.city ?? ""],
              ["Pincode", data.pincode ?? ""], ["Max Distance", data.maxDistance ? `${data.maxDistance} km` : ""],
              ["Procurement Locations", data.procLocations ?? ""],
            ]} />
            <ReviewBlock title={stepLabel(2)} onEdit={() => goTo(2)} rows={requirements.flatMap((r, i): [string, string][] => r.crop ? [[
              `Requirement ${i + 1}`,
              [r.crop, r.variety, r.quantity ? `${r.quantity} ${r.unit}` : "", `Grade ${r.grade}`, r.targetPrice].filter(Boolean).join(" · "),
            ]] : [])} />
            <ReviewBlock title={stepLabel(3)} onEdit={() => goTo(3)} rows={[
              ["Produce Categories", data.categories ?? ""], ["Farmer Type", data.farmerType],
              ["Preferred Location", data.prefLocation ?? ""], ["Payment Method", data.paymentMethod],
              ["Delivery Method", data.deliveryMethod],
            ]} />
            <ReviewBlock title={stepLabel(4)} onEdit={() => goTo(4)} rows={[
              ["GST Number", data.gst ?? ""], ["Document Type", data.docType],
              ["Document Number", data.docNumber ?? ""], ["Verification Status", "Pending"],
            ]} />

            <label htmlFor="bp-confirm" className="mt-2 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug font-medium text-[#555555]">
              <input
                id="bp-confirm"
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setState((s) => ({ ...s, confirmed: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#2E7D32]"
              />
              I confirm that the information provided is accurate.
            </label>
          </div>
          <StepNav
            onBack={back}
            backLabel="Back"
            continueLabel={
              saving
                ? "Saving Profile..."
                : confirmed
                ? "Complete Profile"
                : "Confirm & Complete Profile"
            }
            onContinue={() => {
              if (confirmed && !saving) {
                handleCompleteProfile();
              }
            }}
          />
        </SectionCard>
      )}
    </ProfileShell>
  );
}
