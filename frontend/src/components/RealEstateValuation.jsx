import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Building, 
  MapPin, 
  Award, 
  FileDown, 
  RefreshCw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export const RealEstateValuation = ({ onOpenReport }) => {
  const [form, setForm] = useState({
    property_name: 'Emerald Bay Residences - Unit 804',
    property_type: 'Residential Apartment',
    location_tier: 'Tier 1 Prime / Metro CBD',
    land_area_sqft: 3200,
    built_up_area_sqft: 2150,
    property_age_years: 3,
    construction_quality: 'Premium / Grade B+',
    condition_state: 'Excellent',
    amenities: ['Basement Parking', '24/7 Security', 'Power Backup', 'Clubhouse & Gym', 'Solar Water Heating']
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const availableAmenities = [
    'Basement Parking',
    '24/7 Security',
    'Power Backup',
    'Clubhouse & Gym',
    'Solar Water Heating',
    'Swimming Pool',
    'EV Charging Station',
    'Smart Home Automation'
  ];

  const handleToggleAmenity = (item) => {
    if (form.amenities.includes(item)) {
      setForm({ ...form, amenities: form.amenities.filter((a) => a !== item) });
    } else {
      setForm({ ...form, amenities: [...form.amenities, item] });
    }
  };

  const handleEstimate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.estimateValuation(form);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Valuation estimation failed');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleEstimate();
  }, []);

  const getRatingBadge = (rating) => {
    const r = (rating || '').toLowerCase();
    if (r.includes('strong buy')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (r.includes('moderate')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (r.includes('hold')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Real Estate Valuation & Investment Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified cost-approach appraisal, age-life physical depreciation, comparable sales (CMA), and rental yield metrics.
          </p>
        </div>

        {report && (
          <button
            onClick={() => onOpenReport('Real Estate Appraisal & Valuation', report)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4 text-brand-400" />
            <span>Export Appraisal</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (4 cols) */}
        <div className="lg:col-span-4">
          <form onSubmit={handleEstimate} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Property Asset Specifications
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Asset Name</label>
              <input
                type="text"
                value={form.project_name || form.property_name}
                onChange={(e) => setForm({ ...form, property_name: e.target.value })}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Property Type</label>
                <select
                  value={form.property_type}
                  onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Residential Apartment">Apartment</option>
                  <option value="Commercial Office">Office</option>
                  <option value="Independent Villa">Villa</option>
                  <option value="Industrial Plot">Industrial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location Tier</label>
                <select
                  value={form.location_tier}
                  onChange={(e) => setForm({ ...form, location_tier: e.target.value })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Tier 1 Prime / Metro CBD">Tier 1 Metro</option>
                  <option value="Tier 2 Suburban">Suburban</option>
                  <option value="Developing Urban Fringe">Urban Fringe</option>
                  <option value="Industrial Corridor">Industrial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Built-Up (sq ft)</label>
                <input
                  type="number"
                  step="100"
                  value={form.built_up_area_sqft}
                  onChange={(e) => setForm({ ...form, built_up_area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Land Size (sq ft)</label>
                <input
                  type="number"
                  step="200"
                  value={form.land_area_sqft}
                  onChange={(e) => setForm({ ...form, land_area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Structure Age (yrs)</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={form.property_age_years}
                  onChange={(e) => setForm({ ...form, property_age_years: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Quality Grade</label>
                <select
                  value={form.construction_quality}
                  onChange={(e) => setForm({ ...form, construction_quality: e.target.value })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Luxury / Grade A">Luxury (Grade A)</option>
                  <option value="Premium / Grade B+">Premium (B+)</option>
                  <option value="Standard / Grade B">Standard (B)</option>
                  <option value="Economical / Grade C">Economical (C)</option>
                </select>
              </div>
            </div>

            {/* Amenities Multiselect */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Amenities & Infrastructure</label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableAmenities.map((am) => {
                  const isChecked = form.amenities.includes(am);
                  return (
                    <button
                      type="button"
                      key={am}
                      onClick={() => handleToggleAmenity(am)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-left flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                          : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="line-clamp-1">{am}</span>
                      {isChecked && <Check className="w-3 h-3 text-purple-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating Valuation...</span>
                </>
              ) : (
                <>
                  <span>Compute Appraisal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Valuation Results (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl text-xs">
              {error}
            </div>
          )}

          {report && (
            <>
              {/* Primary Value Card */}
              <div className="bg-gradient-to-br from-purple-900/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                      Estimated Fair Market Valuation
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      ${report.estimated_market_value.toLocaleString()}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 block">Unit Rate</span>
                    <span className="text-lg font-bold text-purple-300 font-mono">
                      ${report.rate_per_sqft} / sq ft
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">95% Confidence Band: </span>
                    <span className="font-semibold text-slate-200">
                      ${report.confidence_range_low.toLocaleString()} – ${report.confidence_range_high.toLocaleString()}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRatingBadge(report.investment_rating)}`}>
                    Rating: {report.investment_rating} ({report.investment_score}/100)
                  </div>
                </div>
              </div>

              {/* Cost-Approach Components Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Underlying Land Value
                  </span>
                  <div className="text-xl font-extrabold text-slate-100 mt-1">
                    ${report.land_value_component.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Location Tier Capitalization</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Replacement Cost (New)
                  </span>
                  <div className="text-xl font-extrabold text-slate-100 mt-1">
                    ${report.construction_replacement_cost.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Physical Reconstruction Base</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Depreciation Loss ({report.depreciation_rate_percentage}%)
                  </span>
                  <div className="text-xl font-extrabold text-rose-400 mt-1">
                    -${report.depreciation_amount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Straight-Line Age-Life</div>
                </div>
              </div>

              {/* Rental & Investment Metrics */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Rental Yield & Appreciation Forecast
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-xs">Estimated Monthly Rental</span>
                      <span className="text-xl font-bold text-emerald-400 mt-1 block">
                        ${report.estimated_monthly_rent.toLocaleString()} / mo
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-xs block">Cap Rate / Yield</span>
                      <span className="text-lg font-bold text-teal-300 font-mono">
                        {report.rental_yield_percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-xs">5-Year Capital Appreciation</span>
                      <span className="text-xl font-bold text-purple-300 mt-1 block">
                        +{report.five_year_appreciation_forecast_percentage}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-xs block">Market Outlook</span>
                      <span className="text-xs font-semibold text-slate-200">
                        Bullish Growth
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparable Sales (CMA) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Comparative Market Analysis (CMA) Recent Transactions
                </h3>
                <div className="space-y-2 text-xs">
                  {report.comparable_sales.map((cs, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{cs.property_title}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {cs.distance_km} km away • Sold {cs.sale_date}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-purple-300">
                        ${cs.sale_price_sqft} / sq ft
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valuation Rationale */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Appraisal Methodology & Investment Rationale
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-800">
                  {report.valuation_rationale}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
