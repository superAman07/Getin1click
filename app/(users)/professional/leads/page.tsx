"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { format, formatDistanceToNow } from "date-fns"
import {
  Search,
  X,
  Phone,
  Mail,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
  Calendar,
  MapPin,
  AlertCircle,
  ArrowRightCircle,
  Star,
  BookOpen,
  BriefcaseIcon,
  DollarSign,
  MessageSquare,
  Check,
  Coins,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface LeadTeaser {
  id: string
  title: string
  description: string
  createdAt: string
  creditCost: number
  location: string
  budget: string
  urgency: string
  status: string
  assignmentStatus?: 'ACCEPTED' | 'REJECTED' | 'MISSED'
  customerName: string
  responses: number
  assignmentId: string
  service: {
    name: string
  }
}

interface CustomerDetails {
  name: string | null
  email: string
  phoneNumber: string | null
  address: string | null
}

type FullLead = LeadTeaser & {

  customerDetails?: CustomerDetails
}

interface ExtendedUser {
  onboardingComplete?: boolean
  credits?: number
}

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending")
  const [leads, setLeads] = useState<FullLead[]>([])
  const [selectedLead, setSelectedLead] = useState<FullLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingLeadId, setProcessingLeadId] = useState<string | null>(null)
  const [respondedLeads, setRespondedLeads] = useState<FullLead[]>([])
  const [justAcceptedId, setJustAcceptedId] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [rejectingLead, setRejectingLead] = useState<FullLead | null>(null);
  const [respondedStatusFilter, setRespondedStatusFilter] = useState<'ALL' | 'ACCEPTED' | 'REJECTED' | 'MISSED'>('ALL');
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const { data: session, update: updateSession } = useSession()
  const user = session?.user as ExtendedUser | undefined

  const searchParams = useSearchParams()

  const [visiblePendingCount, setVisiblePendingCount] = useState(10);
  const [visibleRespondedCount, setVisibleRespondedCount] = useState(10);

  const fetchAllLeads = useCallback(async () => {
    setLoading(true)
    try {
      const [pendingResponse, respondedResponse] = await Promise.all([
        axios.get("/api/professional/leads"),
        axios.get("/api/professional/leads/responded")
      ]);
      setLeads(pendingResponse.data);
      setRespondedLeads(respondedResponse.data);

      const leadIdFromQuery = searchParams.get('leadId');
      if (leadIdFromQuery) {
        const allFetchedLeads = [...pendingResponse.data, ...respondedResponse.data];
        const leadToSelect = allFetchedLeads.find(l => l.id === leadIdFromQuery);
        if (leadToSelect) {
          const isResponded = respondedResponse.data.some((l: LeadTeaser) => l.id === leadIdFromQuery);
          if (isResponded) {
            setActiveTab("accepted");
          } else {
            setActiveTab("pending");
          }
          setSelectedLead(leadToSelect);
          setShowMobileDetail(true);
        }
      }
    } catch (error) {
      toast.error("Could not load your leads.");
      console.error(error);
    } finally {
      setLoading(false)
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user) {
      fetchAllLeads();
    }
  }, [session?.user, fetchAllLeads]);

  const filteredLeads = leads.filter((lead) => {
    return lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredRespondedLeads = respondedLeads.filter((lead) => {
    const searchMatch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customerDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase() || '');

    const statusMatch = respondedStatusFilter === 'ALL' || lead.assignmentStatus === respondedStatusFilter;

    return searchMatch && statusMatch;
  })

  const handleLeadClick = (lead: FullLead) => {
    setSelectedLead(lead)
    setShowMobileDetail(true)
  }

  const closeMobileDetail = () => {
    setShowMobileDetail(false)
  }

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return
    const node = carouselRef.current
    const delta = dir === "left" ? -Math.min(360, node.clientWidth * 0.9) : Math.min(360, node.clientWidth * 0.9)
    node.scrollBy({ left: delta, behavior: "smooth" })
  }

  const handleAcceptLead = async (lead: FullLead) => {
    if (!user?.onboardingComplete) {
      toast.error("Complete your profile first to accept leads")
      return
    }

    if ((user?.credits ?? 0) < lead.creditCost) {
      toast.error("You don't have enough credits")
      return
    }

    setProcessingLeadId(lead.id)
    const toastId = toast.loading("Processing...")

    try {
      const response = await axios.put(`/api/professional/leads/${lead.assignmentId}`, {
        action: "ACCEPT",
      })

      toast.success("Lead accepted successfully!", { id: toastId })

      const accepted = { ...lead, customerDetails: response.data.customerDetails } as FullLead
      setRespondedLeads((prev) => [accepted, ...prev])
      setJustAcceptedId(lead.id)
      setTimeout(() => setJustAcceptedId(null), 1200)

      setLeads((prevLeads) => prevLeads.filter((l) => l.id !== lead.id))

      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead(accepted)
        setActiveTab("accepted")
      }

      await updateSession({
        creditsUpdated: true,
      })

    } catch (error: any) {
      if (error.response?.status === 409) { // 409 Conflict: Lead already taken
        toast.error('Sorry, this lead was just taken by another professional.', { id: toastId });
        // Refetch all leads to update the status to MISSED
        fetchAllLeads();
      } else if (error.response?.status === 402) { // 402 Payment Required: Insufficient credits
        toast.error('Insufficient credits. Please top up your wallet.', { id: toastId });
      } else {
        const errorMessage = error.response?.data || "Failed to accept lead"
        toast.error(errorMessage, { id: toastId })
      }
    } finally {
      setProcessingLeadId(null)
    }
  }

  const handleRejectLead = async (lead: FullLead) => {
    setRejectingLead(lead);
  }

  const confirmRejectLead = async () => {
    if (!rejectingLead) return;

    setProcessingLeadId(rejectingLead.id)
    const toastId = toast.loading("Processing...")

    try {
      await axios.put(`/api/professional/leads/${rejectingLead.assignmentId}`, {
        action: "REJECT",
      })
      toast.success("Lead rejected", { id: toastId })
      setLeads((prevLeads) => prevLeads.filter((l) => l.id !== rejectingLead.id))
      if (selectedLead && selectedLead.id === rejectingLead.id) {
        setSelectedLead(null)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to reject lead"
      toast.error(errorMessage, { id: toastId })
    } finally {
      setProcessingLeadId(null)
      setRejectingLead(null);
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5

      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true })
      } else {
        return format(date, 'MMM d, yyyy')
      }
    } catch {
      return dateStr
    }
  }

  const hasPending = filteredLeads.length > 0
  const hasAccepted = filteredRespondedLeads.length > 0

  const getMainContent = () => {
    if (selectedLead) {
      return (
        <div className="transition-opacity duration-200" style={{ willChange: "opacity" }}>
          {/* Lead details content */}
          <div className="mb-6 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">{selectedLead.title}</h2>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${selectedLead.customerDetails
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-blue-700 bg-blue-50 border-blue-200"
                } border rounded-full px-2 py-0.5`}>
                {selectedLead.customerDetails ? (
                  <>
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Accepted
                  </>
                ) : (
                  <>Pending</>
                )}
              </span>
            </div>

            {/* Lead service & cost */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                {selectedLead.service.name}
              </span>
              <span className="text-xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {selectedLead.creditCost} Credits
              </span>
            </div>

            {/* Lead description */}
            <div className="mb-6">
              <p className="text-slate-700">{selectedLead.description}</p>
            </div>

            {/* Lead key info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Location</h3>
                  <p className="text-sm text-slate-700">{selectedLead.location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Budget</h3>
                  <p className="text-sm text-slate-700">{selectedLead.budget}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Urgency</h3>
                  <p className="text-sm text-slate-700">{selectedLead.urgency}</p>
                </div>
              </div>
            </div>

            {/* Posted date */}
            <div className="flex items-center mb-6 text-sm text-slate-500">
              <Calendar className="w-4 h-4 mr-1.5" />
              Posted {formatDate(selectedLead.createdAt)}
            </div>

            {!selectedLead.customerDetails ? (
              (() => {
                if (selectedLead.assignmentStatus === 'REJECTED') {
                  return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <p className="font-semibold text-red-800">
                          You have rejected this lead.
                        </p>
                      </div>
                      <p className="text-sm text-red-700">
                        Only an administrator can reassign it to you.
                      </p>
                    </div>
                  );
                }

                const userCredits = user?.credits ?? 0;
                const hasEnoughCredits = userCredits >= selectedLead.creditCost;
                const neededCredits = selectedLead.creditCost - userCredits;

                if (!hasEnoughCredits) {
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center space-y-2">
                      <p className="font-semibold text-amber-800">
                        You need {neededCredits} more credit{neededCredits > 1 ? 's' : ''} to accept this lead.
                      </p>
                      <p className="text-sm text-amber-700">
                        Your current balance is {userCredits} credits.
                      </p>
                      <Link
                        href="/professional/wallet"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Coins className="w-4 h-4" />
                        Buy Credits
                      </Link>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleAcceptLead(selectedLead)}
                      disabled={!!processingLeadId || !user?.onboardingComplete}
                      className="flex-1 inline-flex items-center cursor-pointer justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
                    >
                      {processingLeadId === selectedLead.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ThumbsUp className="w-5 h-5" />
                          Accept Lead ({selectedLead.creditCost} credits)
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectLead(selectedLead)}
                      disabled={!!processingLeadId}
                      className="flex-1 inline-flex items-center cursor-pointer justify-center gap-2 px-4 py-3 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:bg-slate-200 disabled:cursor-not-allowed"
                    >
                      {processingLeadId === selectedLead.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ThumbsDown className="w-5 h-5" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                );
              })()
            ) : (
              /* Lead status indicator for accepted leads */
              (() => {
                if (selectedLead.assignmentStatus === 'MISSED') {
                  return (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center space-y-2">
                      <div className="w-12 h-12 bg-white border-2 border-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <XCircle className="w-7 h-7 text-orange-500" />
                      </div>
                      <h4 className="font-semibold text-orange-800">Better luck next time!</h4>
                      <p className="text-sm text-orange-700">
                        Another professional accepted this lead before you.
                      </p>
                    </div>
                  );
                }
                switch (selectedLead.status) {
                  case 'COMPLETED':
                    return (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Job Completed</span>
                        </div>
                        <span className="text-sm font-bold text-green-800">Budget: {selectedLead.budget}</span>
                      </div>
                    );
                  case 'ISSUE_REPORTED':
                    return (
                      <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Job Cancelled - Issue Reported</span>
                        </div>
                      </div>
                    );
                  default:
                    return (
                      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm font-medium text-slate-800">Active - Awaiting Customer Confirmation</span>
                        </div>
                      </div>
                    );
                }
              })()
            )}
          </div>

          {/* Customer details card for accepted leads */}
          {selectedLead.customerDetails && (
            <div
              className={`bg-white rounded-xl border mb-6 transition-all duration-300 overflow-hidden ${justAcceptedId === selectedLead.id
                ? "border-green-400 shadow-lg shadow-green-100 scale-[1.01]"
                : "border-slate-200"
                }`}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-5 py-4 border-b border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-green-800">Customer Contact Details</h3>
                </div>
                {justAcceptedId === selectedLead.id && (
                  <span className="text-xs font-semibold text-green-700 bg-white px-2 py-1 rounded-full border border-green-300">
                    Just Unlocked!
                  </span>
                )}
              </div>

              <div className="p-5 space-y-6">
                {/* Customer name and main info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    {(selectedLead.customerDetails.name?.[0] || selectedLead.customerDetails.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      {selectedLead.customerDetails.name || "Customer"}
                    </h4>
                    <p className="text-sm text-slate-500">Project: {selectedLead.title}</p>
                  </div>
                </div>

                {/* Contact information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">Email Address</h5>
                      <a
                        href={`mailto:${selectedLead.customerDetails.email}`}
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {selectedLead.customerDetails.email}
                      </a>
                    </div>
                  </div>

                  {selectedLead.customerDetails.phoneNumber && (
                    <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-semibold text-slate-900">Phone Number</h5>
                        <a
                          href={`tel:${selectedLead.customerDetails.phoneNumber}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {selectedLead.customerDetails.phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedLead.customerDetails.address && (
                    <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 border border-slate-200 md:col-span-2">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-semibold text-slate-900">Address</h5>
                        <p className="text-sm text-slate-700">{selectedLead.customerDetails.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selectedLead.customerDetails.email}?subject=Regarding your ${selectedLead.service.name} project`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Customer
                  </a>

                  {selectedLead.customerDetails.phoneNumber && (
                    <a
                      href={`tel:${selectedLead.customerDetails.phoneNumber}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Customer
                    </a>
                  )}

                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors ml-auto">
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional information for accepted leads */}
          {selectedLead.customerDetails && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Next Steps
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Contact the Customer</h4>
                    <p className="text-sm text-slate-600">Reach out to the customer via email or phone to discuss their requirements in detail.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Provide a Quote</h4>
                    <p className="text-sm text-slate-600">Send a detailed quote based on the project requirements and timeline.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Begin the Project</h4>
                    <p className="text-sm text-slate-600">Once the quote is accepted, start working on the project as per the agreed timeline.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Get Customer Confirmation</h4>
                    <p className="text-sm text-slate-600">After completing the project, the customer will confirm completion on the platform.</p>
                  </div>
                </li>
              </ol>
            </div>
          )}
        </div>
      )
    } else if (activeTab === "pending" && !hasPending) {
      // No pending leads
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No pending leads</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            You're all caught up! When you receive new leads, they'll appear here.
            You can view your accepted leads in the "Accepted" tab.
          </p>
        </div>
      )
    } else if (activeTab === "accepted" && !hasAccepted) {
      // No accepted leads
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No accepted leads yet</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            When you accept a lead, you'll get access to customer details and they'll appear here for easy reference.
          </p>
        </div>
      )
    } else {
      // Default empty state
      return (
        <div className="bg-white/50 rounded-xl border border-slate-200 border-dashed p-8 text-center">
          <div className="w-16 h-16 bg-slate-100/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Select a lead to view details</h3>
          <p className="text-slate-600 text-sm">
            Click on any lead from the list to see its details here
          </p>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 mt-14">
      {rejectingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 animate-in zoom-in-95">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Confirm Rejection</h3>
              <div className="mt-2 text-sm text-slate-600">
                <p>
                  After rejecting, this lead will be removed from your "Pending" list. You will not be able to see it unless an admin reassigns it to you.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRejectingLead(null)}
                className="px-4 py-2 bg-slate-100 text-slate-800 cursor-pointer text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectLead}
                className="px-4 py-2 bg-red-600 text-white cursor-pointer text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Reject Lead
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-white border-b border-slate-200 sticky top-14 z-10">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-3">
            <div className="flex items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Your Lead Opportunities
                </h1>
                <p className="text-slate-600 text-sm md:text-base">
                  {filteredLeads.length} pending and {filteredRespondedLeads.length} accepted leads
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search leads by title, description or location..."
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
            <div
              className={`${showMobileDetail ? "hidden md:flex" : "flex"
                } w-full md:w-[380px] lg:w-[420px] border-r border-slate-200 bg-white flex-col overflow-hidden`}
            >
              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`flex-1 py-3 text-center font-medium cursor-pointer text-sm transition-colors border-b-2 ${activeTab === "pending"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Pending ({filteredLeads.length})
                </button>
                <button
                  onClick={() => setActiveTab("accepted")}
                  className={`flex-1 py-3 text-center font-medium cursor-pointer text-sm transition-colors border-b-2 ${activeTab === "accepted"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Responded ({filteredRespondedLeads.length})
                </button>
              </div>

              {/* Filter for Responded Tab */}
              {activeTab === 'accepted' && (
                <div className="p-3 bg-slate-50 border-b border-slate-200">
                  <select
                    value={respondedStatusFilter}
                    onChange={(e) => setRespondedStatusFilter(e.target.value as any)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="MISSED">Missed</option>
                  </select>
                </div>
              )}

              {/* List content */}
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-6">
                    <div className="flex items-center justify-center p-10">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  </div>
                ) : activeTab === "pending" && !hasPending ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No pending leads</h3>
                    <p className="text-slate-600 text-sm">You don't have any pending leads at the moment</p>
                  </div>
                ) : activeTab === "accepted" && !hasAccepted ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No accepted leads yet</h3>
                    <p className="text-slate-600 text-sm">When you accept leads, they'll appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {/* Render the appropriate list based on active tab */}
                    {activeTab === "pending"
                      ? <>
                        {filteredLeads.slice(0, visiblePendingCount).map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() => handleLeadClick(lead)}
                            className={`w-full text-left p-4 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] cursor-pointer ${selectedLead?.id === lead.id ? "bg-blue-50 hover:bg-blue-50" : ""
                              }`}
                            style={{ willChange: "transform, opacity" }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{lead.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
                                    {lead.service.name}
                                  </span>
                                  <span className="text-blue-600 text-xs font-bold">{lead.creditCost} Credits</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{lead.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(lead.createdAt)}
                                  </div>
                                  <span className="text-[10px] uppercase tracking-wide text-blue-700/80 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                    Pending
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        {visiblePendingCount < filteredLeads.length && (
                          <div className="p-4 text-center">
                            <button onClick={() => setVisiblePendingCount(c => c + 10)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              Load More
                            </button>
                          </div>
                        )}
                      </>
                      : <>
                        {filteredRespondedLeads.slice(0, visibleRespondedCount).map((lead) => (
                          <button
                            key={`acc-${lead.id}`}
                            onClick={() => handleLeadClick(lead)}
                            className={`w-full text-left p-4 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] cursor-pointer ${selectedLead?.id === lead.id ? "bg-green-50 hover:bg-green-50" : ""
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2 py-0.5 ${lead.assignmentStatus === 'ACCEPTED'
                                    ? 'text-green-700 bg-green-50 border-green-200'
                                    : 'text-red-700 bg-red-50 border-red-200'
                                    }`}>
                                    {lead.assignmentStatus === 'ACCEPTED' ? <BadgeCheck className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                    {lead.assignmentStatus}
                                  </span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{lead.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
                                    {lead.service.name}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{lead.description}</p>

                                {lead.customerDetails && (
                                  <div className="flex items-center gap-2 text-xs bg-white border border-green-200 rounded-md py-1 px-2">
                                    <User className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                    <span className="font-medium text-slate-900 truncate">
                                      {lead.customerDetails.name || "Customer"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                        {visibleRespondedCount < filteredRespondedLeads.length && (
                          <div className="p-4 text-center">
                            <button onClick={() => setVisibleRespondedCount(c => c + 10)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              Load More
                            </button>
                          </div>
                        )}
                      </>
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane - Lead Details */}
            <div className="hidden md:block flex-1 bg-slate-50 overflow-y-auto">
              <div className="p-6 lg:p-8">{getMainContent()}</div>
            </div>

            {/* Mobile Detail View */}
            {showMobileDetail && (
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
                    {selectedLead?.title || "Lead Details"}
                  </h2>
                </div>
                <div className="p-4">{getMainContent()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leads