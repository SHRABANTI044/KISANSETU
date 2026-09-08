import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  MapPin,
  Plus,
  ShieldCheck,
  Tractor,
  User,
  Wheat,
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
  TextField,
} from "../components/profile-ui";
import { clearProfileData, getProfileData, saveProfileData } from "../utils/authStore";
import { CircleAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

/* --------------------------------- Types ---------------------------------- */

interface CropEntry {
  crop: string;
  variety: string;
  area: string;
  quantity: string;
  unit: string;
  grade: string;
  availableDate: string;
  organic: string;
  listForSale: string; 
  expectedPrice?: string; 
  location?: string; 
}

interface FarmerProfileState {
  data: Record<string, string>;
  crops: CropEntry[];
  step: number;
  confirmed: boolean;
}

const STEPS = [
  "Personal Information",
  "Farm Information",
  "Crop Information",
  "Selling Preferences",
  "Verification",
  "Review & Submit",
];

const EMPTY_CROP: CropEntry = {
  crop: "",
  variety: "",
  area: "",
  quantity: "",
  unit: "quintal",
  grade: "A",
  availableDate: "",
  organic: "No",
  listForSale: "No",
  expectedPrice: "", 
  location: "", 
};

const YES_NO = ["Yes", "No"];

/* ---------------------------------- Page ---------------------------------- */

export default function FarmerProfilePage() {
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
      // 1. Save farmer profile details
      const { error: profileError } = await supabase.from("farmer_profiles").upsert({
        id: user.id,
        dob: data.dob || null,
        gender: data.gender,
        state: data.state || null,
        district: data.district || null,
        taluka: data.taluka || null,
        village: data.village || null,
        pincode: data.pincode || null,
        farmer_type: data.farmerType,
        farm_size: data.farmSize ? Number(data.farmSize) : null,
        farm_size_unit: data.farmSizeUnit,
        land_ownership: data.landOwnership,
        farming_type: data.farmingType,
        irrigation_type: data.irrigationType,
        experience_years: data.experience ? Number(data.experience) : null,
        fpo_member: data.fpoMember,
        fpo_name: data.fpoName || null,
        fpo_reg_id: data.fpoRegId || null,
        fpo_location: data.fpoLocation || null,
        preferred_market: data.market || null,
        max_travel_distance: data.maxDistance ? Number(data.maxDistance) : null,
        preferred_buyer_type: data.buyerType,
        selling_method: data.sellingMethod,
        payment_method: data.paymentMethod,
        selling_period: data.sellingPeriod || null,
        doc_type: data.docType,
        doc_number: data.docNumber || null,
        verification_status: "pending",
      });
      if (profileError) throw profileError;
            // 2. Save crops into farmer_crops and produce_listing
      if (crops && crops.length > 0) {
        const validCrops = crops.filter((c) => c.crop && c.crop.trim() !== "");

        for (const c of validCrops) {
          const isListed = c.listForSale === "Yes";
          const statusVal = isListed ? "Live" : "Negotiation";

          // Save to farmer_crops (All 3: Onion, Potato, Tomato)
          const { data: insertedCrop, error: cropErr } = await supabase
            .from("farmer_crops")
            .insert({
              farmer_id: user.id,
              crop_name: c.crop,
              variety: c.variety || null,
              cultivation_area: c.area ? Number(c.area) : null,
              quantity: c.quantity ? Number(c.quantity) : null,
              unit: c.unit,
              grade: c.grade,
              available_date: c.availableDate || null,
              is_organic: c.organic === "Yes",
              list_for_sale: isListed,
              status: statusVal, // 'Live' for Onion/Potato, 'Negotiation' for Tomato
            })
            .select()
            .single();

          // If toggled Yes, also save to produce_listing with status 'active'
          if (!cropErr && insertedCrop && isListed) {
            await supabase.from("produce_listings").insert({
              farmer_id: user.id,
              farmer_crop_id: insertedCrop.id,
              crop_name: c.crop,
              quantity: c.quantity ? Number(c.quantity) : 0,
              unit: c.unit,
              grade: c.grade,
              expected_price: c.expectedPrice ? Number(c.expectedPrice) : 0, // <-- Real price
              location: c.location || (data.district ? `${data.district}, ${data.state || ""}` : "Farm Location"), // <-- Real location
              status: "active", // Default active in marketplace
            });
          }
        }
      }
      // 3. Mark the profile as completed in the main profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("id", user.id);
      if (updateError) throw updateError;
      // 4. Update the app's auth state
            // 4. Update the app's auth state
      await refreshProfile();
      // 5. Clear saved draft from localStorage so it never gets stuck on Step 6
      if (user?.id) {
        clearProfileData("farmer", user.id);
      }
      // 6. Show completion screen
      setDone(true);
    } catch (err: any) {
      console.error("Error saving farmer profile:", err);
      alert(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  // --- END OF ADDED CODE ---
  const stepLabel = (i: number) => STEPS[i] ?? "";

  const [state, setState] = useState<FarmerProfileState>(() => {
    const saved = user ? getProfileData<FarmerProfileState>("farmer", user.id) : null;
    if (saved && saved.data) return { ...saved, confirmed: false };

    return {
      step: 0,
      crops: [EMPTY_CROP],
      confirmed: false,
      data: {
        fullName: profile?.full_name ?? user?.user_metadata?.full_name ?? "",
        mobile: profile?.mobile ?? user?.user_metadata?.mobile ?? "",
        email: profile?.email ?? user?.email ?? "",
        language: user?.user_metadata?.language ?? "English",
        gender: "Prefer not to say",
        farmSizeUnit: "Acres",
        landOwnership: "Owned",
        farmingType: "Conventional",
        irrigationType: "Rain-fed",
        farmerType: "Individual Farmer",
        fpoMember: "No",
        buyerType: "Wholesaler",
        sellingMethod: "Mandi",
        paymentMethod: "Bank Transfer",
        docType: "Aadhaar Card",
      },
    };
  });

  const { data, crops, step, confirmed } = state;
  const setData = (key: string) => (value: string) =>
    setState((s) => ({ ...s, data: { ...s.data, [key]: value } }));
  const setCrops = (updater: (current: CropEntry[]) => CropEntry[]) =>
    setState((s) => ({ ...s, crops: updater(s.crops) }));
  const goTo = (i: number) => setState((s) => ({ ...s, step: Math.max(0, Math.min(STEPS.length - 1, i)) }));
  const back = () => (step === 0 ? navigate("/register") : goTo(step - 1));

  /* Load this specific user's uncompleted draft or prefill with their details */
  useEffect(() => {
    if (!user) return;
    const saved = getProfileData<FarmerProfileState>("farmer", user.id);
    if (saved && saved.data) {
      // Reopen at the exact step where this user left off!
      setState((prev) => ({
        ...prev,
        ...saved,
        confirmed: false,
      }));
    } else {
      // First-time user: Start at step 0 and pre-fill with their signup info
      setState((prev) => ({
        ...prev,
        step: 0,
        data: {
          ...prev.data,
          fullName: prev.data.fullName || profile?.full_name || user.user_metadata?.full_name || "",
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
    saveProfileData("farmer", { data, crops, step, confirmed }, user.id);
  }, [user?.id, data, crops, step, confirmed, done]);

  /* Keep the viewport at the top when moving between steps */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (done) {
    return (
      <CompletionScreen
        title="Profile Completed Successfully!"
        text="Your farmer profile is ready. You can now explore market prices, price predictions, recommended markets and buyers."
        platformId="KS-FRM-000124"
        cta="Go to Farmer Dashboard"
        to="/farmer-dashboard"
      />
    );
  }

  return (
    <ProfileShell
      title="Complete Your Farmer Profile"
      subtitle="Tell us about yourself and your farm so KishanSetu can provide better market recommendations and buyer connections."
      steps={STEPS}
      current={step}
    >
      {/* ------------------------- STEP 1 · PERSONAL ------------------------- */}
      {step === 0 && (
        <SectionCard icon={User} title="Personal Information" description="Your basic details — pre-filled from registration where available.">
          <div className="mb-5">
            <FileField id="fp-photo" label="Profile Photo" value={data.photo ?? ""} onChange={setData("photo")} optional />
          </div>
          <FieldGrid>
            <TextField id="fp-name" label="Full Name" value={data.fullName} onChange={setData("fullName")} placeholder="Your full name" />
            <TextField id="fp-mobile" label="Mobile Number" value={data.mobile} onChange={setData("mobile")} placeholder="10-digit mobile number" inputMode="tel" />
            <TextField id="fp-email" label="Email Address" type="email" value={data.email} onChange={setData("email")} placeholder="you@example.com" />
            <TextField id="fp-dob" label="Date of Birth" type="date" value={data.dob ?? ""} onChange={setData("dob")} optional />
            <SelectField id="fp-gender" label="Gender" value={data.gender} onChange={setData("gender")} options={["Prefer not to say", "Male", "Female", "Other"]} optional />
            <SelectField id="fp-language" label="Preferred Language" value={data.language} onChange={setData("language")} options={["English", "हिंदी", "मराठी"]} />
            <TextField id="fp-state" label="State" value={data.state ?? ""} onChange={setData("state")} placeholder="e.g. Maharashtra" />
            <TextField id="fp-district" label="District" value={data.district ?? ""} onChange={setData("district")} placeholder="e.g. Nashik" />
            <TextField id="fp-taluka" label="Taluka" value={data.taluka ?? ""} onChange={setData("taluka")} placeholder="e.g. Sinnar" />
            <TextField id="fp-village" label="Village / Town" value={data.village ?? ""} onChange={setData("village")} placeholder="Your village or town" />
            <TextField id="fp-pincode" label="Pincode" value={data.pincode ?? ""} onChange={setData("pincode")} placeholder="e.g. 422103" inputMode="numeric" />
          </FieldGrid>
          <StepNav onBack={back} onContinue={() => goTo(1)} />
        </SectionCard>
      )}

      {/* -------------------------- STEP 2 · FARM ---------------------------- */}
      {step === 1 && (
        <SectionCard icon={Tractor} title="Farm Information" description="Details about your farm and how you cultivate.">
          <div className="flex flex-col gap-5">
            <ChoiceField label="Farmer Type" value={data.farmerType} onChange={setData("farmerType")} options={["Individual Farmer", "FPO Member", "Farmer Group"]} />
            <FieldGrid>
              <TextField id="fp-farm-size" label="Farm Size" value={data.farmSize ?? ""} onChange={setData("farmSize")} placeholder="e.g. 4.5" inputMode="numeric" />
              <SelectField id="fp-farm-unit" label="Unit" value={data.farmSizeUnit} onChange={setData("farmSizeUnit")} options={["Acres", "Hectares"]} />
            </FieldGrid>
            <FieldGrid>
              <ChoiceField label="Land Ownership" value={data.landOwnership} onChange={setData("landOwnership")} options={["Owned", "Leased", "Other"]} />
              <ChoiceField label="Farming Type" value={data.farmingType} onChange={setData("farmingType")} options={["Conventional", "Organic", "Mixed"]} />
            </FieldGrid>
            <FieldGrid>
              <SelectField id="fp-irrigation" label="Irrigation Type" value={data.irrigationType} onChange={setData("irrigationType")} options={["Rain-fed", "Borewell", "Canal", "Drip Irrigation", "Other"]} />
              <TextField id="fp-experience" label="Years of Farming Experience" value={data.experience ?? ""} onChange={setData("experience")} placeholder="e.g. 12" inputMode="numeric" />
            </FieldGrid>
            <ChoiceField label="FPO Membership" value={data.fpoMember} onChange={setData("fpoMember")} options={YES_NO} />
            {data.fpoMember === "Yes" && (
              <FieldGrid>
                <TextField id="fp-fpo-name" label="FPO Name" value={data.fpoName ?? ""} onChange={setData("fpoName")} placeholder="Your FPO's name" />
                <TextField id="fp-fpo-id" label="FPO Registration ID" value={data.fpoRegId ?? ""} onChange={setData("fpoRegId")} placeholder="Registration number" />
                <div className="sm:col-span-2">
                  <TextField id="fp-fpo-location" label="FPO Location" value={data.fpoLocation ?? ""} onChange={setData("fpoLocation")} placeholder="FPO village / town" />
                </div>
              </FieldGrid>
            )}
          </div>
          <StepNav onBack={back} onContinue={() => goTo(2)} />
        </SectionCard>
      )}

      {/* -------------------------- STEP 3 · CROPS --------------------------- */}
      {step === 2 && (
        <SectionCard icon={Wheat} title="Your Crops & Produce" description="Add every crop you grow — used for buyer matching, market recommendations and price prediction.">
          <Note>
            This information powers KisanSetu's WHERE / WHEN / TO WHOM / HOW MUCH recommendations for your produce.
          </Note>
          <div className="mt-5 flex flex-col gap-5">
            {crops.map((entry, i) => (
              <EntryCard
                key={i}
                title={`Crop ${i + 1}`}
                canRemove={crops.length > 1}
                onRemove={() => setCrops((c) => c.filter((_, idx) => idx !== i))}
              >
                <FieldGrid>
                  <TextField id={`crop-name-${i}`} label="Crop Name" value={entry.crop} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, crop: v } : x)))} placeholder="e.g. Tomato" />
                  <TextField id={`crop-variety-${i}`} label="Crop Variety" value={entry.variety} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, variety: v } : x)))} placeholder="e.g. Hybrid" />
                  <TextField id={`crop-area-${i}`} label="Cultivation Area (acres)" value={entry.area} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, area: v } : x)))} placeholder="e.g. 2" inputMode="numeric" />
                  <TextField id={`crop-qty-${i}`} label="Expected Production Quantity" value={entry.quantity} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, quantity: v } : x)))} placeholder="e.g. 5000" inputMode="numeric" />
                  <SelectField id={`crop-unit-${i}`} label="Unit" value={entry.unit} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, unit: v } : x)))} options={["kg", "quintal", "tonne"]} />
                  <SelectField id={`crop-grade-${i}`} label="Quality / Grade" value={entry.grade} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, grade: v } : x)))} options={["A", "B", "C", "Other"]} />
                  <TextField id={`crop-date-${i}`} label="Expected Harvest / Availability" type="date" value={entry.availableDate} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, availableDate: v } : x)))} />
                  <ChoiceField label="Organic" value={entry.organic} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, organic: v } : x)))} options={YES_NO} />
                  <ChoiceField label="List this crop for sale immediately?" value={entry.listForSale} onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, listForSale: v } : x)))} options={["Yes", "No"]} 
/>
 {entry.listForSale === "Yes" && (
<div className="sm:col-span-2 rounded-xl border border-[#BFE3C5] bg-[#F4FAF4] p-4 flex flex-col gap-3">
    <p className="text-[12px] font-semibold text-[#155B32]">
      Marketplace Listing Details:
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TextField 
        id={`crop-price-${i}`} 
        label="Expected Price (₹ per unit)" 
        value={entry.expectedPrice ?? ""} 
        onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, expectedPrice: v } : x)))} 
        placeholder="e.g. 25" 
        inputMode="numeric" 
      />
      <TextField 
        id={`crop-location-${i}`} 
        label="Produce Location" 
        value={entry.location ?? ""} 
        onChange={(v) => setCrops((c) => c.map((x, idx) => (idx === i ? { ...x, location: v } : x)))} 
        placeholder="e.g. Nashik, Maharashtra" 
      />
    </div>
  </div>
  )}
                </FieldGrid>
              </EntryCard>
            ))}
            <button
              type="button"
              onClick={() => setCrops((c) => [...c, { ...EMPTY_CROP }])}
              className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#2E7D32]/50 bg-[#EAF6EA]/40 text-[14px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA] sm:w-fit sm:px-7"
            >
              <Plus className="h-[17px] w-[17px]" strokeWidth={2.5} />
              Add Another Crop
            </button>
          </div>
          <StepNav onBack={back} onContinue={() => goTo(3)} />
        </SectionCard>
      )}

      

      {/* --------------------- STEP 4 · SELLING PREFS ------------------------ */}
      {step === 3 && (
        <SectionCard icon={MapPin} title="Selling Preferences" description="Helps KisanSetu answer WHERE, TO WHOM, WHEN and HOW MUCH for your produce.">
          <div className="flex flex-col gap-5">
            <FieldGrid>
              <TextField id="fp-market" label="Preferred Market / Mandi" value={data.market ?? ""} onChange={setData("market")} placeholder="e.g. Lasalgaon APMC" />
              <TextField id="fp-distance" label="Maximum Distance Willing to Travel (km)" value={data.maxDistance ?? ""} onChange={setData("maxDistance")} placeholder="e.g. 60" inputMode="numeric" />
            </FieldGrid>
            <ChoiceField label="Preferred Buyer Type" value={data.buyerType} onChange={setData("buyerType")} options={["Wholesaler", "Retailer", "Processor", "FPO", "Other"]} />
            <FieldGrid>
              <ChoiceField label="Preferred Selling Method" value={data.sellingMethod} onChange={setData("sellingMethod")} options={["Direct Sale", "Mandi", "Buyer Negotiation"]} />
              <SelectField id="fp-payment" label="Preferred Payment Method" value={data.paymentMethod} onChange={setData("paymentMethod")} options={["Bank Transfer", "UPI", "Other"]} />
            </FieldGrid>
            <FieldGrid>
              <TextField id="fp-min-price" label="Minimum Expected Price (per quintal)" value={data.minPrice ?? ""} onChange={setData("minPrice")} placeholder="e.g. ₹1,600" optional />
              <TextField id="fp-pref-crops" label="Preferred Crops to Sell" value={data.preferredCrops ?? ""} onChange={setData("preferredCrops")} placeholder="e.g. Onion, Tomato" />
            </FieldGrid>
            <TextField id="fp-period" label="Availability / Selling Period" value={data.sellingPeriod ?? ""} onChange={setData("sellingPeriod")} placeholder="e.g. October – December" />
          </div>
          <StepNav onBack={back} onContinue={() => goTo(4)} />
        </SectionCard>
      )}

      {/* ----------------------- STEP 5 · VERIFICATION ----------------------- */}
      {step === 4 && (
        <SectionCard icon={ShieldCheck} title="Verification Information" description="Provide optional information that may help verify your farmer profile.">
          <Note>
            This is a profile & document collection interface only — KisanSetu does not perform
            government verification. Your verification status will remain <b>Pending</b> until an
            authorised review takes place.
          </Note>
          <div className="mt-5 flex flex-col gap-5">
            <FieldGrid>
              <TextField id="fp-doc-id" label="Farmer / Agricultural ID" value={data.farmerDocId ?? ""} onChange={setData("farmerDocId")} placeholder="If applicable" optional />
              <SelectField id="fp-doc-type" label="Document Type" value={data.docType} onChange={setData("docType")} options={["Aadhaar Card", "Voter ID", "Driving Licence", "Bank Passbook", "Other"]} />
            </FieldGrid>
            <FieldGrid>
              <TextField id="fp-doc-number" label="Document Number" value={data.docNumber ?? ""} onChange={setData("docNumber")} placeholder="Enter document number" />
              <FileField id="fp-doc-file" label="Supporting Document Upload" value={data.docFile ?? ""} onChange={setData("docFile")} optional />
            </FieldGrid>
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
              ["Full Name", data.fullName], ["Mobile", data.mobile], ["Email", data.email],
              ["Language", data.language], ["State", data.state ?? ""], ["District", data.district ?? ""],
              ["Taluka", data.taluka ?? ""], ["Village / Town", data.village ?? ""], ["Pincode", data.pincode ?? ""],
            ]} />
            <ReviewBlock title={stepLabel(1)} onEdit={() => goTo(1)} rows={[
              ["Farmer Type", data.farmerType],
              ["Farm Size", data.farmSize ? `${data.farmSize} ${data.farmSizeUnit}` : ""],
              ["Land Ownership", data.landOwnership], ["Farming Type", data.farmingType],
              ["Irrigation", data.irrigationType], ["Experience", data.experience ? `${data.experience} years` : ""],
              ["FPO Membership", data.fpoMember], ["FPO Name", data.fpoName ?? ""],
            ]} />
            <ReviewBlock title={stepLabel(2)} onEdit={() => goTo(2)} rows={crops.flatMap((c, i): [string, string][] => c.crop ? [[
              `Crop ${i + 1}`,
              [c.crop, c.variety, c.quantity ? `${c.quantity} ${c.unit}` : "", `Grade ${c.grade}`, c.organic === "Yes" ? "Organic" : ""].filter(Boolean).join(" · "),
            ]] : [])} />
            <ReviewBlock title={stepLabel(3)} onEdit={() => goTo(3)} rows={[
              ["Preferred Market", data.market ?? ""], ["Max Distance", data.maxDistance ? `${data.maxDistance} km` : ""],
              ["Buyer Type", data.buyerType], ["Selling Method", data.sellingMethod],
              ["Payment Method", data.paymentMethod], ["Selling Period", data.sellingPeriod ?? ""],
            ]} />
            <ReviewBlock title={stepLabel(4)} onEdit={() => goTo(4)} rows={[
              ["Document Type", data.docType], ["Document Number", data.docNumber ?? ""],
              ["Document File", data.docFile ?? ""], ["Verification Status", "Pending"],
            ]} />

            <label htmlFor="fp-confirm" className="mt-2 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug font-medium text-[#555555]">
              <input
                id="fp-confirm"
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
