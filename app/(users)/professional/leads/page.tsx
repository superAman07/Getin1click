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
  Loader2,
  ThumbsUp,
  ThumbsDown,
  User,
} from "lucide-react"

interface LeadTeaser {
  id: string;
  title: string;
  description: string; 
  createdAt: string;
  creditCost: number;
  location: string;
  budget: string;
  urgency: string;
  customerName: string;
  responses: number;
  assignmentId: string; // New field for lead assignment
  service: {
    name: string;
  };
}

interface CustomerDetails {
  name: string | null;
  email: string;
  phoneNumber: string | null;
}

type FullLead = LeadTeaser & {
  customerDetails?: CustomerDetails;
};

interface ExtendedUser {
  onboardingComplete?: boolean;
  credits?: number;
}

const Leads = () => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  
  // Data states
  const [leads, setLeads] = useState<FullLead[]>([])
  const [selectedLead, setSelectedLead] = useState<FullLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingLeadId, setProcessingLeadId] = useState<string | null>(null)
  
  // UI states
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const { data: session, update: updateSession } = useSession();

  const user = session?.user as ExtendedUser | undefined

  // Fetch leads assigned to this professional
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/professional/leads');
        setLeads(response.data);
      } catch (error) {
        toast.error("Could not load assigned leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Filter leads based on search query
  const filteredLeads = leads.filter((lead) => {
    return lead.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle selecting a lead
  const handleLeadClick = (lead: FullLead) => { 
    setSelectedLead(lead);
    setShowMobileDetail(true);
  };

  // Close mobile detail view
  const closeMobileDetail = () => {
    setShowMobileDetail(false);
  };
  
  // Handle lead acceptance
  const handleAcceptLead = async (lead: FullLead) => {
    if (!user?.onboardingComplete) {
      toast.error("Complete your profile first to accept leads");
      return;
    }
    
    if ((user?.credits ?? 0) < lead.creditCost) {
      toast.error("You don't have enough credits");
      return;
    }
    
    setProcessingLeadId(lead.id);
    const toastId = toast.loading("Processing...");
    
    try {
      const response = await axios.put(`/api/professional/leads/${lead.assignmentId}`, {
        action: 'ACCEPT'
      });
      
      toast.success("Lead accepted successfully!", { id: toastId });
      
      // Update lead with customer details
      const updatedLeads = leads.map(l => {
        if (l.id === lead.id) {
          return {
            ...l,
            customerDetails: response.data.customerDetails
          };
        }
        return l;
      });
      
      setLeads(updatedLeads.filter(l => l.id !== lead.id));
      
      // If this is the currently selected lead, update it
      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead(null); 
      }
      
      // Update session to reflect new credit balance
      await updateSession({
        creditsUpdated: true
      });

      setLeads(leads.filter(l => l.id !== lead.id));
      
      // If this was the selected lead, clear selection
      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead(null);
        setShowMobileDetail(false);
      }
      
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to accept lead";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setProcessingLeadId(null);
    }
  };
  
  // Handle lead rejection
  const handleRejectLead = async (lead: FullLead) => {
    setProcessingLeadId(lead.id);
    const toastId = toast.loading("Processing...");
    
    try {
      await axios.put(`/api/professional/leads/${lead.assignmentId}`, {
        action: 'REJECT'
      });
      
      toast.success("Lead rejected", { id: toastId });
      
      // Remove lead from the list
      setLeads(leads.filter(l => l.id !== lead.id));
      
      // If this was the selected lead, clear selection
      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead(null);
      }
      
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to reject lead";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setProcessingLeadId(null);
    }
  };
  
  const categories = ["all", "Renovation", "Painting", "Flooring", "Construction"];
  const urgencyLevels = ["all", "high", "medium", "low"];

  // This is the skeleton UI. The actual UI will be generated by bolt.new
  return (
    <div className="min-h-screen bg-slate-50 mt-14">
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-white border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Your Lead Opportunities
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              {filteredLeads.length} leads have been assigned to you
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 md:px-6 lg:px-8 py-4 bg-white border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input and filter toggles - UI will be built by bolt.new */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full flex">
            {/* Left Sidebar - Leads List */}
            <div className={`${showMobileDetail ? 'hidden md:block' : 'block'} w-full md:w-[380px] lg:w-[420px] border-r border-slate-200 bg-white overflow-y-auto`}>
              {loading ? (
                <div className="p-4 space-y-3">
                  {/* Loading skeleton - UI will be built by bolt.new */}
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No leads assigned</h3>
                  <p className="text-slate-600 text-sm">You don't have any pending leads at the moment</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className={`p-4 cursor-pointer transition-all duration-200`}
                    >
                      {/* Lead item - UI will be built by bolt.new */}
                      <h3 className="font-bold text-slate-900 mb-1">{lead.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">{lead.service.name}</span>
                        <span className="text-blue-600 text-xs font-bold">{lead.creditCost} Credits</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{lead.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Pane - Lead Details */}
            <div className="hidden md:block flex-1 bg-slate-50 overflow-y-auto">
              {!selectedLead ? (
                <div className="h-full flex items-center justify-center p-8">
                  {/* Empty state - UI will be built by bolt.new */}
                  <p className="text-slate-500">Select a lead to view details</p>
                </div>
              ) : (
                <div className="p-6 lg:p-8">
                  {/* Lead details - UI will be built by bolt.new */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedLead.title}</h2>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {selectedLead.service.name}
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {selectedLead.creditCost} Credits
                      </span>
                    </div>
                    <p className="text-slate-700">{selectedLead.description}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <button
                      onClick={() => handleAcceptLead(selectedLead)}
                      disabled={!!processingLeadId || !user?.onboardingComplete || (user?.credits ?? 0) < selectedLead.creditCost}
                      className="flex-1 h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer rounded-lg shadow-lg shadow-green-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {processingLeadId === selectedLead.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ThumbsUp className="w-5 h-5" />
                      )}
                      Accept Lead
                    </button>
                    <button
                      onClick={() => handleRejectLead(selectedLead)}
                      disabled={!!processingLeadId}
                      className="flex-1 h-12 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      {processingLeadId === selectedLead.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ThumbsDown className="w-5 h-5" />
                      )}
                      Reject Lead
                    </button>
                  </div>

                  {/* Lead info cards - UI will be built by bolt.new */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-2">Location</h3>
                      <p className="text-slate-700">{selectedLead.location}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-2">Budget</h3>
                      <p className="text-slate-700">{selectedLead.budget}</p>
                    </div>
                  </div>

                  {/* Customer info - only shown after accepting lead */}
                  {selectedLead.customerDetails && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                      <h3 className="text-lg font-bold text-green-800 mb-4">Customer Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <User className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-slate-900">{selectedLead.customerDetails.name || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Mail className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-slate-900">{selectedLead.customerDetails.email}</span>
                        </div>
                        {selectedLead.customerDetails.phoneNumber && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-slate-900">{selectedLead.customerDetails.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Detail View */}
            {showMobileDetail && selectedLead && (
              <div className="md:hidden fixed inset-0 z-50 bg-white mt-14 overflow-y-auto animate-in slide-in-from-right duration-300">
                {/* Mobile lead detail UI will be built by bolt.new */}
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
                
                <div className="p-4 space-y-4">
                  {/* Same content as desktop but optimized for mobile */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {selectedLead.service.name}
                      </span>
                      <span className="text-lg font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {selectedLead.creditCost} Credits
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm">{selectedLead.description}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleAcceptLead(selectedLead)}
                      disabled={!!processingLeadId || !user?.onboardingComplete || (user?.credits ?? 0) < selectedLead.creditCost}
                      className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg shadow-green-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {processingLeadId === selectedLead.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ThumbsUp className="w-5 h-5" />
                      )}
                      Accept Lead
                    </button>
                    <button
                      onClick={() => handleRejectLead(selectedLead)}
                      disabled={!!processingLeadId}
                      className="h-12 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      {processingLeadId === selectedLead.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ThumbsDown className="w-5 h-5" />
                      )}
                      Reject Lead
                    </button>
                  </div>

                  {/* Mobile lead info cards */}
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-1 text-sm">Location</h3>
                      <p className="text-slate-700 text-sm">{selectedLead.location}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-1 text-sm">Budget</h3>
                      <p className="text-slate-700 text-sm">{selectedLead.budget}</p>
                    </div>
                  </div>

                  {/* Customer info - only shown after accepting lead */}
                  {selectedLead.customerDetails && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-base font-bold text-green-800 mb-3">Customer Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-slate-900 text-sm">{selectedLead.customerDetails.name || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-slate-900 text-sm">{selectedLead.customerDetails.email}</span>
                        </div>
                        {selectedLead.customerDetails.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-slate-900 text-sm">{selectedLead.customerDetails.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leads;