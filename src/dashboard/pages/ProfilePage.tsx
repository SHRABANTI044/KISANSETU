import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle2, FileCheck2, MapPin, Pencil, Tractor, UserRound, Wheat } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getProfileData } from "../../utils/authStore";

type ProfileEntry = Record<string, string | undefined>;
type SavedProfile = { data?: ProfileEntry; crops?: ProfileEntry[]; requirements?: ProfileEntry[] };

const labels: Record<string, string> = {
  fullName: "Full name", mobile: "Mobile number", email: "Email address", dob: "Date of birth", gender: "Gender",
  language: "Preferred language", state: "State", district: "District", taluka: "Taluka", village: "Village / town",
  city: "City", pincode: "Pincode", farmerType: "Farmer type", farmSize: "Farm size", farmSizeUnit: "Farm size unit",
  landOwnership: "Land ownership", farmingType: "Farming type", irrigationType: "Irrigation", experience: "Farming experience",
  fpoMember: "FPO member", fpoName: "FPO name", fpoRegId: "FPO registration ID", fpoLocation: "FPO location",
  market: "Preferred market", maxDistance: "Maximum travel distance", buyerType: "Preferred buyer type", sellingMethod: "Selling method",
  paymentMethod: "Payment method", sellingPeriod: "Selling period", business: "Business name", contactPerson: "Contact person",
  businessType: "Business type", businessReg: "Business registration", years: "Years in business", address: "Address",
  maxProcurementDistance: "Maximum procurement distance", procLocations: "Procurement locations", categories: "Preferred categories",
  prefLocation: "Preferred location", deliveryMethod: "Delivery method", gst: "GST number",
  minPrice: "Minimum expected price", preferredCrops: "Preferred crops to sell", farmerDocId: "Farmer / agricultural ID",
  docType: "Document type", docNumber: "Document number", docFile: "Supporting document", photo: "Profile photo",
  availableDate: "Available date", organic: "Organic", variety: "Variety", area: "Cultivation area", quantity: "Quantity",
};

const farmerPersonalFields = ["fullName", "mobile", "email", "photo", "dob", "gender", "language", "state", "district", "taluka", "village", "pincode"];
const farmerFarmFields = ["farmerType", "farmSize", "farmSizeUnit", "landOwnership", "farmingType", "irrigationType", "experience", "fpoMember", "fpoName", "fpoRegId", "fpoLocation"];
const farmerSellingFields = ["market", "maxDistance", "buyerType", "sellingMethod", "paymentMethod", "minPrice", "preferredCrops", "sellingPeriod"];
const farmerVerificationFields = ["farmerDocId", "docType", "docNumber", "docFile"];
const buyerBusinessFields = ["business", "contactPerson", "mobile", "email", "language", "businessType", "businessReg", "years"];
const buyerLocationFields = ["state", "district", "taluka", "city", "pincode", "address", "maxProcurementDistance", "procLocations", "prefLocation"];
const buyerRequirementFields = ["categories", "farmerType", "paymentMethod", "deliveryMethod", "gst", "docType", "docNumber"];

function selectFields(data: ProfileEntry, fields: string[]): ProfileEntry {
  return Object.fromEntries(fields.filter((field) => field in data).map((field) => [field, data[field]]));
}

function DetailGrid({ data }: { data: ProfileEntry }) {
  const entries = Object.entries(data).filter(([, value]) => value?.trim());
  if (!entries.length) return <p className="text-[13px] text-[#777777]">No information added yet.</p>;
  return (
    <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A918A]">{labels[key] || key}</dt>
          <dd className="mt-1 text-[14px] font-medium text-[#222222]">{value}</dd>
        </div>
      ))}
    </div>
  );
}

function ProfileSection({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]"><Icon className="h-[18px] w-[18px]" /></span>
        <h2 className="font-display text-[17px] font-bold text-[#111111]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function ProfilePage() {
  const { profile } = useAuth();
  const role = profile?.role === "buyer" ? "buyer" : "farmer";
  const saved = useMemo(() => getProfileData<SavedProfile>(role), [role]);
  const data = saved?.data || {};
  const entries = saved?.crops || saved?.requirements || [];
  const editRoute = role === "buyer" ? "/buyer-profile" : "/farmer-profile";
  const name = profile?.full_name || data.fullName || data.contactPerson || "Your profile";
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const personalFields = role === "buyer" ? buyerBusinessFields : farmerPersonalFields;
  const farmFields = role === "buyer" ? buyerLocationFields : farmerFarmFields;
  const finalFields = role === "buyer" ? buyerRequirementFields : farmerSellingFields;
  const verificationFields = farmerVerificationFields;

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2E7D32] hover:text-[#256628]"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
            <h1 className="font-display text-[26px] font-bold text-[#111111]">My profile</h1>
            <p className="mt-1 text-[13.5px] text-[#666666]">All the information you added to KishanSetu.</p>
          </div>
          <Link to={editRoute} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2E7D32] px-4 text-[13px] font-semibold text-white hover:bg-[#256628]"><Pencil className="h-4 w-4" /> Edit profile</Link>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#D7E5D7] bg-[#F2FAF2] p-5">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#2E7D32] font-display text-lg font-bold text-white">{initials || "U"}</span>
          <div><h2 className="font-display text-[19px] font-bold text-[#111111]">{name}</h2><p className="mt-1 text-[13px] capitalize text-[#5E6A5E]">{role} account</p></div>
          <span className="ml-auto hidden items-center gap-1.5 text-[12px] font-semibold text-[#2E7D32] sm:flex"><CheckCircle2 className="h-4 w-4" /> Profile complete</span>
        </div>

        <ProfileSection icon={role === "buyer" ? Building2 : UserRound} title={role === "buyer" ? "Business and contact" : "Personal information"}><DetailGrid data={selectFields(data, personalFields)} /></ProfileSection>
        <ProfileSection icon={role === "buyer" ? MapPin : Tractor} title={role === "buyer" ? "Location and preferences" : "Farm information"}><DetailGrid data={selectFields(data, farmFields)} /></ProfileSection>
        <ProfileSection icon={role === "buyer" ? Wheat : MapPin} title={role === "buyer" ? "Buying requirements" : "Selling preferences"}>
          <DetailGrid data={selectFields(data, finalFields)} />
          {role === "buyer" && entries.length > 0 && <div className="mt-6 border-t border-[#E8ECE8] pt-5"><h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#8A918A]">Requirements</h3><div className="grid gap-3 sm:grid-cols-2">{entries.map((entry, index) => <div key={index} className="rounded-xl bg-[#F7FAF7] p-4"><DetailGrid data={entry} /></div>)}</div></div>}
        </ProfileSection>
        {role === "farmer" && <>
          <ProfileSection icon={Wheat} title="Crop information">
            {entries.length > 0 ? <div className="grid gap-3 sm:grid-cols-2">{entries.map((entry, index) => <div key={index} className="rounded-xl bg-[#F7FAF7] p-4"><DetailGrid data={entry} /></div>)}</div> : <p className="text-[13px] text-[#777777]">No crops added yet.</p>}
          </ProfileSection>
          <ProfileSection icon={FileCheck2} title="Verification">
            <DetailGrid data={selectFields(data, verificationFields)} />
          </ProfileSection>
        </>}
      </div>
    </DashboardLayout>
  );
}
