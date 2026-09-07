import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, CheckCircle2, ShieldCheck, Sprout, Store } from "lucide-react";
import LoginBrandPanel from "../components/LoginBrandPanel";

export default function CompleteProfilePromptPage() {
 const { profile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  // If user logs out or is not logged in, immediately kick to Home:
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  const isFarmer = profile?.role === "farmer";
  const targetRoute = isFarmer ? "/farmer-profile" : "/buyer-profile";

  return (
    <main className="min-h-screen bg-white lg:flex">
      <LoginBrandPanel />

      <section className="flex flex-1 items-center justify-center bg-white px-5 py-14 sm:px-8 lg:min-h-screen lg:py-10">
        <div className="w-full max-w-[500px] text-center">
          {/* Role Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF6EA]">
            {isFarmer ? (
              <Sprout className="h-10 w-10 text-[#2E7D32]" />
            ) : (
              <Store className="h-10 w-10 text-[#1976D2]" />
            )}
          </div>

          <h1 className="mt-6 font-display text-[26px] font-bold text-[#111111] sm:text-[30px]">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
          </h1>

          <p className="mt-2.5 text-[15px] leading-relaxed text-[#666666]">
            Your account is set up. Before you can access real-time market prices, 
            sell produce, or connect with buyers, please complete your {profile?.role || "user"} profile.
          </p>

          {/* Benefits summary */}
          <div className="mt-6 rounded-2xl border border-[#E1E5E1] bg-[#FAFBFA] p-5 text-left">
            <h3 className="text-[13px] font-bold text-[#111111] uppercase tracking-wider">
              Why complete your profile?
            </h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-[#555555]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                Get customized mandi price predictions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                Connect directly with verified {isFarmer ? "buyers" : "farmers"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                Track deals and orders with complete security
              </li>
            </ul>
          </div>

          {/* Action button to open the form */}
          <button
            type="button"
            onClick={() => navigate(targetRoute)}
            className="mt-8 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[15px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628]"
          >
            Complete Your Profile
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </button>

          <footer className="mt-8 flex items-center justify-center gap-2 text-[12px] font-medium text-[#777777]">
            <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
            Takes only 2–3 minutes to fill
          </footer>
        </div>
      </section>
    </main>
  );
}