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
  ChevronRight,
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
}

interface FullLead extends LeadTeaser {
  description: string;
  budget: string;
  customerName: string;
  customerRating: number;
  responses: number;
}

interface ExtendedUser {
  onboardingComplete?: boolean;
  credits?: number;
}

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLead, setSelectedLead] = useState<FullLead | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const { data: session } = useSession();
  const [leads, setLeads] = useState<LeadTeaser[]>([])
  const [loading, setLoading] = useState(true)

  const user = session?.user as ExtendedUser | undefined

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
    return matchesSearch
  })

  const handleLeadClick = (lead: LeadTeaser) => {
    const fullLead: FullLead = {
      ...lead,
      description: "This is a placeholder description for the selected lead. Full details would be loaded from the API.",
      budget: "$5,000 - $10,000",
      customerName: "John Doe",
      customerRating: 4.8,
      responses: 3,
    }
    setSelectedLead(fullLead)
    setShowMobileDetail(true)
  }

  const closeMobileDetail = () => {
    setShowMobileDetail(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 mt-14">
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-white border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Available Leads
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Find your next project from {filteredLeads.length} opportunities
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 md:px-6 lg:px-8 py-4 bg-white border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search leads by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showFilters && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${selectedCategory === category
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                            }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Urgency</label>
                    <div className="flex flex-wrap gap-2">
                      {urgencyLevels.map((urgency) => (
                        <button
                          key={urgency}
                          onClick={() => setSelectedUrgency(urgency)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${selectedUrgency === urgency
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
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
        </div>

        {/* Two-Column Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full flex">
            {/* Left Sidebar - Leads List */}
            <div className={`${showMobileDetail ? 'hidden md:block' : 'block'} w-full md:w-[380px] lg:w-[420px] border-r border-slate-200 bg-white overflow-y-auto`}>
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-slate-100 rounded-lg h-32 animate-pulse" />
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No leads found</h3>
                  <p className="text-slate-600 text-sm">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredLeads.map((lead, index) => (
                    <div
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                        selectedLead?.id === lead.id
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-white"
                      }`}
                      style={{
                        animation: `fadeInLeft 0.3s ease-out ${index * 40}ms both`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className={`text-base font-bold line-clamp-2 flex-1 ${
                          selectedLead?.id === lead.id ? "text-white" : "text-slate-900"
                        }`}>
                          {lead.title}
                        </h3>
                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                          selectedLead?.id === lead.id ? "text-white" : "text-slate-400"
                        }`} />
                      </div>

                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                          selectedLead?.id === lead.id
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {lead.service.name}
                        </span>
                        <span className={`text-xs font-semibold ${
                          selectedLead?.id === lead.id ? "text-blue-100" : "text-slate-500"
                        }`}>
                          •
                        </span>
                        <span className={`text-xs font-semibold ${
                          selectedLead?.id === lead.id ? "text-white" : "text-blue-600"
                        }`}>
                          {lead.creditCost} Credits
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${
                            selectedLead?.id === lead.id ? "text-blue-200" : "text-slate-400"
                          }`} />
                          <span className={`truncate ${
                            selectedLead?.id === lead.id ? "text-blue-50" : "text-slate-600"
                          }`}>
                            {lead.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${
                            selectedLead?.id === lead.id ? "text-blue-200" : "text-slate-400"
                          }`} />
                          <span className={`${
                            selectedLead?.id === lead.id ? "text-blue-50" : "text-slate-600"
                          }`}>
                            Posted {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Pane - Lead Details (Desktop) */}
            <div className="hidden md:block flex-1 bg-slate-50 overflow-y-auto">
              {!selectedLead ? (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Select a lead to view details</h3>
                    <p className="text-slate-600">
                      Click on any lead from the list to see full project details and contact information
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="p-6 lg:p-8 animate-in fade-in duration-300"
                  key={selectedLead.id}
                >
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                      {selectedLead.title}
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {selectedLead.service.name}
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {selectedLead.creditCost} Credits
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-xl">
                          {selectedLead.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xl font-bold text-slate-900 truncate">
                          {selectedLead.customerName}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-base font-semibold text-slate-900">{selectedLead.customerRating}</span>
                          <span className="text-slate-600 text-sm">rating</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Project Details</h3>
                    <p className="text-slate-700 text-base leading-relaxed mb-5">{selectedLead.description}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Location</div>
                          <div className="font-semibold text-slate-900 text-sm truncate">{selectedLead.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-emerald-200">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Budget</div>
                          <div className="font-semibold text-emerald-700 text-sm truncate">{selectedLead.budget}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-amber-200">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-amber-600 font-medium uppercase tracking-wide">Posted</div>
                          <div className="font-semibold text-amber-700 text-sm truncate">
                            {new Date(selectedLead.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-purple-200">
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex-1 h-12 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                      disabled={!user?.onboardingComplete || (user?.credits ?? 0) < selectedLead.creditCost}
                      title={
                        !user?.onboardingComplete
                          ? "Complete your profile to unlock leads"
                          : (user?.credits ?? 0) < selectedLead.creditCost
                          ? "Insufficient credits"
                          : `Unlock for ${selectedLead.creditCost} credits`
                      }
                    >
                      <Check className="w-5 h-5" />
                      {
                        !user?.onboardingComplete
                          ? "Complete Profile First"
                          : (user?.credits ?? 0) < selectedLead.creditCost
                          ? "Get More Credits"
                          : `Contact Customer (${selectedLead.creditCost} Credits)`
                      }
                    </button>
                    <button className="sm:w-auto h-12 px-6 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-semibold rounded-xl transition-all duration-200 cursor-pointer">
                      Save for Later
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Detail View (Full Screen) */}
            {showMobileDetail && selectedLead && (
              <div className="md:hidden fixed inset-0 z-50 bg-white mt-14 overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 flex items-center gap-3 z-10">
                  <button
                    onClick={closeMobileDetail}
                    className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label="Back to list"
                  >
                    <X className="w-5 h-5 text-slate-700" />
                  </button>
                  <h2 className="text-lg font-bold text-slate-900 line-clamp-1 flex-1">
                    {selectedLead.title}
                  </h2>
                </div>

                <div className="p-4 space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {selectedLead.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-slate-900 truncate">
                          {selectedLead.customerName}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-base font-semibold text-slate-900">{selectedLead.customerRating}</span>
                          <span className="text-slate-600 text-sm">rating</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
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
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Project Details</h3>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">{selectedLead.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-500 font-medium">Location</div>
                          <div className="font-semibold text-slate-900 text-xs truncate">{selectedLead.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-emerald-200">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-emerald-600 font-medium">Budget</div>
                          <div className="font-semibold text-emerald-700 text-xs truncate">{selectedLead.budget}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-amber-200">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-amber-600 font-medium">Posted</div>
                          <div className="font-semibold text-amber-700 text-xs truncate">
                            {new Date(selectedLead.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-purple-200">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-purple-600 font-medium">Responses</div>
                          <div className="font-semibold text-purple-700 text-xs truncate">
                            {selectedLead.responses} pros
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pb-4">
                    <button
                      className="h-12 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                      disabled={!user?.onboardingComplete || (user?.credits ?? 0) < selectedLead.creditCost}
                      title={
                        !user?.onboardingComplete
                          ? "Complete your profile to unlock leads"
                          : (user?.credits ?? 0) < selectedLead.creditCost
                          ? "Insufficient credits"
                          : `Unlock for ${selectedLead.creditCost} credits`
                      }
                    >
                      <Check className="w-5 h-5" />
                      {
                        !user?.onboardingComplete
                          ? "Complete Profile First"
                          : (user?.credits ?? 0) < selectedLead.creditCost
                          ? "Get More Credits"
                          : `Contact (${selectedLead.creditCost} Credits)`
                      }
                    </button>
                    <button className="h-12 px-6 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-semibold rounded-xl transition-all duration-200 cursor-pointer">
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Leads
