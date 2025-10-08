"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Star,
  ChevronDown,
  X,
  Phone,
  Mail,
  Calendar,
  Check,
} from "lucide-react"

interface LeadTeaser {
  id: string;
  title: string;
  createdAt: string;
  creditCost: number;
  location: string;
  service: {
    name: string;
  };
  // We will add urgency back to the API in the next step
  // urgency: 'HIGH' | 'MEDIUM' | 'LOW'; 
}

// This is the full data for the modal (we will use this later)
interface FullLead extends LeadTeaser {
  description: string;
  budget: string;
  customerName: string;
  customerRating: number;
  responses: number;
}

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLead, setSelectedLead] = useState<FullLead | null>(null)
  const { data: session } = useSession();
  const [leads, setLeads] = useState<LeadTeaser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/professional/leads');
        setLeads(response.data);
      } catch (error) {
        toast.error("Could not load new leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const categories = ["all", "Renovation", "Painting", "Flooring", "Construction"]
  const urgencyLevels = ["all", "high", "medium", "low"]

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase())
    //   lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   lead.description.toLowerCase().includes(searchQuery.toLowerCase())
    // const matchesCategory = selectedCategory === "all" || lead.category === selectedCategory
    // const matchesUrgency = selectedUrgency === "all" || lead.urgency === selectedUrgency
    // return matchesSearch && matchesCategory && matchesUrgency
  })

  const getUrgencyColors = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Available Leads
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Find your next project from {filteredLeads.length} opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search leads by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer active:scale-95 ${selectedCategory === category
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Urgency</label>
                  <div className="flex flex-wrap gap-2">
                    {urgencyLevels.map((urgency) => (
                      <button
                        key={urgency}
                        onClick={() => setSelectedUrgency(urgency)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer active:scale-95 ${selectedUrgency === urgency
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                      >
                        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredLeads.map((lead, index) => (
            <div
              key={lead.id}
              className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 50}ms both`,
              }}
            // onClick={() => setSelectedLead(lead)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {lead.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Urgency badge will be added back in the next step */}
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      {lead.service.name}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {lead.creditCost}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Credits</div>
                </div>
              </div>

              {/* Description (Hidden in teaser) */}
              <p className="text-slate-600 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
                Click to unlock and view the full project description.
              </p>
              {/* <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {lead.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColors(lead.urgency)}`}
                    >
                      {lead.urgency.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      {lead.category}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {lead.credits}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Credits</div>
                </div>
              </div>

              <p className="text-slate-600 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
                {lead.description}
              </p> */}

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{lead.location}</span>
                </div>
                {/* Budget is hidden in teaser */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Posted {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Footer (Customer info is hidden in teaser) */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                 <button 
                    className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    // Logic to check if professional can buy the lead
                    disabled={!session?.user?.onboardingComplete || (session?.user?.credits ?? 0) < lead.creditCost}
                    title={
                      !session?.user?.onboardingComplete 
                        ? "Complete your profile to unlock leads" 
                        : (session?.user?.credits ?? 0) < lead.creditCost 
                        ? "Insufficient credits" 
                        : `Unlock for ${lead.creditCost} credits`
                    }
                  >
                    {
                      !session?.user?.onboardingComplete 
                        ? "Profile Incomplete"
                        : (session?.user?.credits ?? 0) < lead.creditCost
                        ? "Get Credits"
                        : `View Details`
                    }
                 </button>
            </div>

              {/* Footer */}
              {/* <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {lead.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{lead.customerName}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-600 font-medium">{lead.customerRating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 font-medium flex-shrink-0">{lead.responses} responses</div>
              </div> */}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
            <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-5 md:p-6 flex items-start justify-between gap-4 z-10">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                    {selectedLead.title}
                  </h2>
                  {/* <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColors(selectedLead.urgency)}`}
                    >
                      {selectedLead.urgency.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      {selectedLead.category}
                    </span>
                  </div> */}
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-all duration-200 cursor-pointer flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 md:p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-lg md:text-xl">
                        {selectedLead.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg md:text-xl font-bold text-slate-900 truncate">
                        {selectedLead.customerName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-base font-semibold text-slate-900">{selectedLead.customerRating}</span>
                        <span className="text-slate-600 text-sm">rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 text-sm bg-white rounded-lg p-3 border border-blue-100">
                      <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm bg-white rounded-lg p-3 border border-blue-100">
                      <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium truncate">customer@email.com</span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">Project Details</h3>
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-5">{selectedLead.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Location</div>
                        <div className="font-semibold text-slate-900 text-sm truncate">{selectedLead.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Budget</div>
                        <div className="font-semibold text-emerald-700 text-sm truncate">{selectedLead.budget}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      {/* <div className="min-w-0">
                        <div className="text-xs text-amber-600 font-medium uppercase tracking-wide">Posted</div>
                        <div className="font-semibold text-amber-700 text-sm truncate">{selectedLead.postedTime}</div>
                      </div> */}
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-purple-600 font-medium uppercase tracking-wide">Responses</div>
                        <div className="font-semibold text-purple-700 text-sm truncate">
                          {selectedLead.responses} professionals
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button className="flex-1 h-12 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    {/* Contact Customer ({selectedLead.credits} Credits) */}
                  </button>
                  <button className="sm:w-auto h-12 px-6 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-semibold rounded-xl transition-all duration-200 cursor-pointer">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Leads
