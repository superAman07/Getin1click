"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import type React from "react"
import { useEffect, useMemo, useState, memo } from "react"
import toast from "react-hot-toast"
import type { ProfessionalProfileData, ProfilePhoto, QAItem, Service } from "@/types/profileTypes"
import { X } from "lucide-react"

interface LocationItem {
  id: string;
  postcode: string;
  locationName: string;
  isPrimary: boolean;
}

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    className={`h-5 w-5 transition-transform duration-200 ease-out will-change-transform ${open ? "rotate-180" : "rotate-0"}`}
    viewBox="0 0 20 20"
    fill="none"
    stroke="#0f172a"
    strokeWidth="2"
  >
    <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconCircle = ({ filled = false }: { filled?: boolean }) =>
  filled ? (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="#2563eb">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16Z" />
      <path d="M8.5 10.5l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="#2563eb">
      <circle cx="10" cy="10" r="8" strokeWidth="2" />
    </svg>
  )

const IconSpinner = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2563eb"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
  </svg>
)

type SectionStatus = "complete" | "in-progress" | "incomplete"
type SectionHeaderProps = { title: string; status: SectionStatus; open: boolean; onToggle: () => void }

const SectionHeader = memo(function SectionHeader({ title, status, open, onToggle }: SectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full cursor-pointer"
      aria-expanded={open}
      aria-controls={`${title}-panel`}
    >
      <div className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-4 hover:bg-[#f8fafc] transition-colors duration-150 will-change-[background-color]">
        <div className="flex items-center gap-3">
          <span aria-hidden="true">
            {status === "complete" ? (
              <IconCircle filled />
            ) : status === "in-progress" ? (
              <IconSpinner />
            ) : (
              <IconCircle />
            )}
          </span>
          <span className="text-[15px] font-medium text-[#0f172a]">{title}</span>
        </div>
        <IconChevron open={open} />
      </div>
    </button>
  )
})

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-4">{children}</div>
)

type ActionBarProps = { onCancel: () => void; onSave: () => void; hasChanges: boolean; isSaving: boolean; }
const ActionBar = ({ onCancel, onSave, hasChanges, isSaving }: ActionBarProps) => (
  <div className="mt-4 flex items-center gap-3">
    <button
      type="button"
      onClick={onCancel}
      disabled={!hasChanges || isSaving}
      className="cursor-pointer rounded-md border border-[#e5e7eb] bg-[#ffffff] px-4 py-2 text-sm text-[#0f172a] transition-colors duration-150 hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {hasChanges ? 'Cancel' : 'Reset'}
    </button>
    <button
      type="button"
      onClick={onSave}
      disabled={!hasChanges || isSaving}
      className="cursor-pointer rounded-md bg-[#25252b] px-4 py-2 text-sm text-[#ffffff] transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isSaving && <IconSpinner />}
      {hasChanges ? 'Save' : 'Saved'}
    </button>
  </div>
)

export default memo(function SettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false);
  const [initialState, setInitialState] = useState<any>(null);

  const [open, setOpen] = useState<Record<string, boolean>>({
    about: true,
    services: false,
    photos: false,
    social: false,
    qas: false,
  })

  const [companyName, setCompanyName] = useState("")
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [yearInBusiness, setYearInBusiness] = useState("")
  const [aboutCompany, setAboutCompany] = useState("")
  const [selectedServices, setSelectedServices] = useState<Service[]>([]) // Now uses Service type
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]) // Now uses ProfilePhoto type
  const [linkedIn, setLinkedIn] = useState("")
  const [twitter, setTwitter] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [qas, setQAs] = useState<QAItem[]>([])

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [newPostcode, setNewPostcode] = useState("");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const [allServices, setAllServices] = useState<Service[]>([])
  const [serviceQuery, setServiceQuery] = useState("")

  const [lastFocusedId, setLastFocusedId] = useState<string | null>(null)

  const yourName = session?.user?.name || ""

  const aboutCompanyLimit = 500

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        // Fetch both profile and all available services concurrently
        const [profileRes, servicesRes] = await Promise.all([
          axios.get("/api/professional/profile"),
          axios.get("/api/professional/services"),
        ])

        const data: ProfessionalProfileData = profileRes.data
        setAllServices(servicesRes.data)

        const loadedState = {
          companyName: data.companyName || "",
          companyLogo: data.companyLogoUrl || null,
          profilePic: data.profilePictureUrl || null,
          companyEmail: data.companyEmail || "",
          companyPhone: data.companyPhoneNumber || "",
          website: data.websiteUrl || "",
          companySize: data.companySize || "",
          yearInBusiness: data.yearFounded?.toString() || "",
          aboutCompany: data.bio || "",
          selectedServices: data.services || [],
          photos: data.photos || [],
          linkedIn: data.socialMedia?.linkedin || "",
          twitter: data.socialMedia?.twitter || "",
          facebook: data.socialMedia?.facebook || "",
          instagram: data.socialMedia?.instagram || "",
          locations: data.locations || [],
          qas: data.qas.map(q => {
            const existingAnswer = data.user.professionalAnswers.find(a => a.questionId === q.id);
            return { id: q.id, question: q.text, answer: existingAnswer?.answerText || "" };
          })
        };
        setInitialState(JSON.parse(JSON.stringify(loadedState))); // Deep copy

        // Populate editable state
        Object.keys(loadedState).forEach(key => {
          const setter = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
          const stateSetter = (window as any)[setter]; // A bit of a hack for brevity, in a real app use a reducer
          if (typeof stateSetter === 'function') {
            stateSetter(loadedState[key as keyof typeof loadedState]);
          }
        });
        setCompanyName(loadedState.companyName);
        setCompanyLogo(loadedState.companyLogo);
        setProfilePic(loadedState.profilePic);
        setCompanyEmail(loadedState.companyEmail);
        setCompanyPhone(loadedState.companyPhone);
        setWebsite(loadedState.website);
        setCompanySize(loadedState.companySize);
        setYearInBusiness(loadedState.yearInBusiness);
        setAboutCompany(loadedState.aboutCompany);
        setSelectedServices(loadedState.selectedServices);
        setPhotos(loadedState.photos);
        setLinkedIn(loadedState.linkedIn);
        setTwitter(loadedState.twitter);
        setFacebook(loadedState.facebook);
        setInstagram(loadedState.instagram);
        setLocations(loadedState.locations);
        setQAs(loadedState.qas);
      } catch (error) {
        toast.error("Failed to load page data.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // CHANGE add an effect to restore focus if it's unintentionally lost between renders
  useEffect(() => {
    if (!lastFocusedId) return

    const el = document.getElementById(lastFocusedId) as HTMLInputElement | HTMLTextAreaElement | null

    if (!el) return

    const active = document.activeElement as Element | null

    // If the same element already has focus, do nothing
    if (active === el) return

    // If another input/textarea has focus (user intentionally moved), do nothing
    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.getAttribute("contenteditable") === "true")
    ) {
      return
    }

    // Otherwise, restore focus to the last focused field
    requestAnimationFrame(() => {
      const stillThere = document.getElementById(lastFocusedId)
      if (!stillThere) return
        ; (stillThere as HTMLInputElement | HTMLTextAreaElement).focus({ preventScroll: true })
      try {
        const val = (stillThere as HTMLInputElement).value ?? (stillThere as HTMLTextAreaElement).value ?? ""
          ; (stillThere as any).setSelectionRange?.(val.length, val.length)
      } catch {
        // no-op if setSelectionRange isn't supported
      }
    })
  }, [lastFocusedId])

  // --- Derived State & Handlers (Corrected) ---

  const filteredServices = useMemo(() => {
    const selectedIds = new Set(selectedServices.map((s) => s.id))
    return allServices
      .filter((s) => s.name.toLowerCase().includes(serviceQuery.trim().toLowerCase()) && !selectedIds.has(s.id))
      .slice(0, 6)
  }, [serviceQuery, allServices, selectedServices])

  const completion = useMemo(() => {
    // ... (completion logic is now correct because `yourName` is defined) ...
    let total = 0,
      done = 0
    const add = (cond: boolean) => {
      total++
      if (cond) done++
    }
    add(companyName.trim().length > 1)
    add(!!companyLogo)
    add(yourName.trim().length > 0)
    add(!!profilePic)
    add(companyEmail.trim().length > 3)
    add(companyPhone.trim().length > 6)
    add(website.trim().length > 5)
    add(companySize.trim().length > 0)
    add(!!yearInBusiness)
    add(aboutCompany.trim().length > 50)
    add(selectedServices.length > 0)
    add(photos.length > 0)
    add([linkedIn, twitter, facebook, instagram].some((v) => v.trim().length > 0))
    add(qas.some((q) => q.answer.trim().length > 0))
    return Math.min(100, Math.round((done / total) * 100) || 0)
  }, [
    aboutCompany,
    companyEmail,
    companyLogo,
    companyName,
    companyPhone,
    companySize,
    photos.length,
    profilePic,
    qas,
    selectedServices.length,
    website,
    yearInBusiness,
    yourName,
    linkedIn,
    twitter,
    facebook,
    instagram,
  ])

  // Handlers
  const toggle = (key: keyof typeof open) => setOpen((s) => ({ ...s, [key]: !s[key] }))

  const onLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setCompanyLogo(url)
  }

  const onProfilePicPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setProfilePic(url)
  }

  const onUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const next: ProfilePhoto[] = []
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]!)
      next.push({ id: `${Date.now()}-${i}`, url, caption: "" })
    }
    setPhotos((prev) => [...prev, ...next])
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const addService = (service: Service) => {
    setSelectedServices((prev) => [...prev, service])
    setServiceQuery("")
  }

  const removeService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId))
  }

  const setCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)))
  }

  const setAnswer = (id: string, answer: string) => {
    setQAs((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)))
  }

  const onCancel = () => {
    if (initialState) {
      setCompanyName(initialState.companyName);
      setCompanyLogo(initialState.companyLogo);
      setProfilePic(initialState.profilePic);
      setCompanyEmail(initialState.companyEmail);
      setCompanyPhone(initialState.companyPhone);
      setWebsite(initialState.website);
      setCompanySize(initialState.companySize);
      setYearInBusiness(initialState.yearInBusiness);
      setAboutCompany(initialState.aboutCompany);
      setSelectedServices(initialState.selectedServices);
      setPhotos(initialState.photos);
      setLinkedIn(initialState.linkedIn);
      setTwitter(initialState.twitter);
      setFacebook(initialState.facebook);
      setInstagram(initialState.instagram);
      setQAs(initialState.qas);
      toast("Changes have been reset.");
    }
  }

  const addLocation = async () => {
    if (newPostcode.length !== 6 || locations.some(l => l.postcode === newPostcode)) {
      toast.error("Enter a valid, unique 6-digit postcode.");
      return;
    }
    setIsPincodeLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${newPostcode}`);
      if (response.data && response.data[0].Status === 'Success') {
        const postOffice = response.data[0].PostOffice[0];
        const locationName = `${postOffice.District}, ${postOffice.State}`;
        setLocations(prev => [...prev, {
          id: `new-${Date.now()}`,
          postcode: newPostcode,
          locationName,
          isPrimary: prev.length === 0 // Make first one primary
        }]);
        setNewPostcode("");
      } else {
        toast.error('Invalid Pincode.');
      }
    } catch (error) {
      toast.error('Failed to verify pincode.');
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const removeLocation = (postcode: string) => {
    setLocations(prev => prev.filter(l => l.postcode !== postcode));
  };

  const setPrimaryLocation = (postcode: string) => {
    setLocations(prev => prev.map(l => ({ ...l, isPrimary: l.postcode === postcode })));
  };

  const onSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving your profile...")
    try {
      const payload = {
        companyName,
        companyLogoUrl: companyLogo,
        profilePictureUrl: profilePic,
        companyEmail,
        companyPhoneNumber: companyPhone,
        websiteUrl: website,
        companySize,
        yearFounded: Number(yearInBusiness) || null,
        bio: aboutCompany,
        socialMedia: {
          linkedin: linkedIn,
          twitter: twitter,
          facebook: facebook,
          instagram: instagram,
        },
        locations,
        photos,
        // Convert answers array back to object for API
        qas: qas.reduce(
          (acc, qa) => {
            acc[qa.id] = qa.answer
            return acc
          },
          {} as Record<string, string>,
        ),
        // Note: services are handled separately in a real app, but this is a demo
      }

      await axios.put("/api/professional/profile", payload)
      toast.success("Profile updated successfully!", { id: toastId })
    } catch (error) {
      toast.error("Failed to save your profile.", { id: toastId })
      console.error(error)
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>
  }

  const currentState = { companyName, companyLogo, profilePic, companyEmail, companyPhone, website, companySize, yearInBusiness, aboutCompany, selectedServices, photos, linkedIn, twitter, facebook, instagram, qas };
  const hasUnsavedChanges = JSON.stringify(initialState) !== JSON.stringify(currentState);

  return (
    // CHANGE capture focus events at the page root to remember which field the user is typing in
    <main
      className="min-h-dvh bg-[#f8fafc]"
      onFocusCapture={(e) => {
        const target = e.target as HTMLElement
        // Only track inputs and textareas that have an id
        if ((target.tagName === "INPUT" || target.tagName === "TEXTAREA") && target.id) {
          setLastFocusedId(target.id)
        }
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#e5e7eb] bg-[#ffffff]/95 backdrop-blur supports-[backdrop-filter]:bg-[#ffffff]/75">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <a
                href="/professional/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] transition-colors duration-150 hover:bg-[#f8fafc] cursor-pointer"
                aria-label="Back to dashboard"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="2"
                >
                  <path d="M12 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Back</span>
              </a>
              <h1 className="text-balance text-lg font-semibold text-[#0f172a]">Settings</h1>
            </div>
            <a href="#" className="text-sm text-[#2563eb] underline-offset-4 hover:underline cursor-pointer">
              View public profile
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Progress */}
        <section aria-label="Profile completion" className="mb-6">
          <div className="rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-[#0f172a]">
                Your profile is <span className="font-semibold">{completion}%</span> complete
              </p>
              <span className="text-xs text-[#0f172a]">{completion}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#2563eb] transition-[width] duration-300 ease-out will-change-[width]"
                style={{ width: `${completion}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-5">
          <SectionHeader
            title="About"
            open={open.about}
            onToggle={() => toggle("about")}
            status={
              companyName && companyEmail && companyPhone && companySize && aboutCompany.length > 50
                ? "complete"
                : aboutCompany.length > 0 || companyName || companyEmail || companyPhone
                  ? "in-progress"
                  : "incomplete"
            }
          />
          {open.about && (
            <div
              id="About-panel"
              role="region"
              aria-labelledby="About"
              className="mt-3 grid gap-4 transition-opacity duration-200 ease-out will-change-opacity"
            >
              {/* Company Details */}
              <Card>
                <h3 className="mb-3 text-[15px] font-medium text-[#0f172a]">Company Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company-name" className="text-sm text-[#0f172a]">
                      Company name
                    </label>
                    <input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="e.g. Stellar Studio"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#0f172a]">Company logo</span>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f8fafc]">
                        {companyLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={companyLogo || "/placeholder.svg"}
                            alt="Company logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-[#0f172a]">No logo</span>
                        )}
                      </div>
                      <label className="cursor-pointer rounded-md bg-[#2563eb] px-3 py-2 text-sm text-[#ffffff] transition-transform duration-150 hover:brightness-110 active:scale-[0.98]">
                        <span>Upload</span>
                        <input onChange={onLogoPick} type="file" accept="image/*" className="sr-only" />
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Personal Details */}
              <Card>
                <h3 className="mb-3 text-[15px] font-medium text-[#0f172a]">Personal Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="your-name" className="text-sm text-[#0f172a]">
                      Your name
                    </label>
                    <input
                      id="your-name"
                      value={yourName}
                      disabled
                      className="rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-sm text-[#0f172a] opacity-80"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#0f172a]">Profile picture</span>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f8fafc]">
                        {profilePic ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profilePic || "/placeholder.svg"}
                            alt="Profile picture preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-[#0f172a]">No photo</span>
                        )}
                      </div>
                      <label className="cursor-pointer rounded-md bg-[#2563eb] px-3 py-2 text-sm text-[#ffffff] transition-transform duration-150 hover:brightness-110 active:scale-[0.98]">
                        <span>Upload</span>
                        <input onChange={onProfilePicPick} type="file" accept="image/*" className="sr-only" />
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card>
                <h3 className="mb-1 text-[15px] font-medium text-[#0f172a]">Contact Information</h3>
                <p className="mb-4 text-xs text-[#0f172a]">
                  This information will be seen by customers on Bark. Change the details Bark uses to contact you
                  privately in Account Details.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company-email" className="text-sm text-[#0f172a]">
                      Company email address
                    </label>
                    <input
                      id="company-email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company-phone" className="text-sm text-[#0f172a]">
                      Company phone number
                    </label>
                    <input
                      id="company-phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company-website" className="text-sm text-[#0f172a]">
                      Website
                    </label>
                    <input
                      id="company-website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </Card>

              {/* About the Company */}
              <Card>
                <h3 className="mb-3 text-[15px] font-medium text-[#0f172a]">About the Company</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company-size" className="text-sm text-[#0f172a]">
                      Company size
                    </label>
                    <select
                      id="company-size"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="cursor-pointer rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] transition-colors duration-150 focus:border-[#2563eb] outline-none"
                    >
                      <option value="">Select company size</option>
                      <option value="SOLO">Just me (Solo)</option>
                      <option value="SMALL_TEAM">2-10 employees</option>
                      <option value="MEDIUM_TEAM">11-50 employees</option>
                      <option value="LARGE_TEAM">51+ employees</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="year-in-business" className="text-sm text-[#0f172a]">
                      Year in business
                    </label>
                    <input
                      id="year-in-business"
                      type="number"
                      value={yearInBusiness}
                      onChange={(e) => setYearInBusiness(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="e.g. 2018"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label htmlFor="about-company" className="text-sm text-[#0f172a]">
                      About your company
                    </label>
                    <textarea
                      id="about-company"
                      value={aboutCompany}
                      onChange={(e) => setAboutCompany(e.target.value.slice(0, aboutCompanyLimit))}
                      rows={5}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] p-3 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="Tell customers about your company, values, and services..."
                    />
                    <div className="text-right text-xs text-[#0f172a]">
                      {aboutCompany.length}/{aboutCompanyLimit}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </section>

        <section className="mb-5">
          <SectionHeader
            title="Service Areas"
            open={open.locations}
            onToggle={() => toggle("locations")}
            status={locations.length > 0 ? "complete" : "incomplete"}
          />
          {open.locations && (
            <div className="mt-3">
              <Card>
                <h3 className="mb-3 text-[15px] font-medium text-[#0f172a]">Your Postcodes</h3>
                <div className="flex items-end gap-2 mb-4">
                  <div className="flex-grow">
                    <label htmlFor="postcode-input" className="text-sm text-[#0f172a]">Add Postcode</label>
                    <input
                      id="postcode-input"
                      value={newPostcode}
                      onChange={(e) => setNewPostcode(e.target.value)}
                      maxLength={6}
                      placeholder="Enter 6-digit postcode"
                      className="w-full mt-1 rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                    />
                  </div>
                  <button onClick={addLocation} disabled={isPincodeLoading} className="rounded-md bg-[#2563eb] px-4 py-2 text-sm text-[#ffffff] transition-transform duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
                    {isPincodeLoading ? <IconSpinner /> : 'Add'}
                  </button>
                </div>
                <div className="space-y-2">
                  {locations.map(loc => (
                    <div key={loc.postcode} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                      <div>
                        <span className="font-medium">{loc.postcode}</span>
                        <span className="text-sm text-slate-600 ml-2">{loc.locationName}</span>
                        {loc.isPrimary && <span className="ml-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Primary</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {!loc.isPrimary && <button onClick={() => setPrimaryLocation(loc.postcode)} className="text-xs text-blue-600 hover:underline">Make Primary</button>}
                        <button onClick={() => removeLocation(loc.postcode)} className="text-red-500 hover:text-red-700">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {locations.length === 0 && <p className="text-sm text-slate-500 text-center py-2">Add postcodes where you provide services.</p>}
                </div>
              </Card>
            </div>
          )}
        </section>

        <section className="mb-5">
          <SectionHeader
            title="Services"
            open={open.services}
            onToggle={() => toggle("services")}
            status={selectedServices.length > 0 ? "complete" : serviceQuery ? "in-progress" : "incomplete"}
          />
          {open.services && (
            <div
              id="Services-panel"
              role="region"
              aria-labelledby="Services"
              className="mt-3 grid gap-4 transition-opacity duration-200 ease-out will-change-opacity"
            >
              <Card>
                <div className="mb-3">
                  <h3 className="text-[15px] font-medium text-[#0f172a]">Selected services</h3>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedServices.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-2 py-1 text-xs text-[#0f172a]"
                    >
                      {s.name}
                      <button
                        type="button"
                        onClick={() => removeService(s.id)}
                        className="cursor-pointer rounded p-1 transition-colors duration-150 hover:bg-[#e5e7eb]"
                        aria-label={`Remove ${s.name}`}
                        title="Remove"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="2"
                        >
                          <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  {selectedServices.length === 0 && <span className="text-xs text-[#0f172a]">No services yet</span>}
                </div>

                <div className="relative">
                  <input
                    id="service-search"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    placeholder="Search and add services..."
                    className="w-full rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                  />
                  {serviceQuery.trim() && filteredServices.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-[#e5e7eb] bg-[#ffffff] shadow-sm">
                      <ul className="max-h-56 overflow-auto">
                        {filteredServices.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => addService(s)}
                              className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-[#0f172a] transition-colors duration-150 hover:bg-[#f8fafc]"
                            >
                              <span>{s.name}</span>
                              <span className="rounded bg-[#2563eb] px-2 py-0.5 text-xs text-[#ffffff]">Add</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </section>

        <section className="mb-5">
          <SectionHeader
            title="Photos"
            open={open.photos}
            onToggle={() => toggle("photos")}
            status={photos.length > 0 ? "complete" : "incomplete"}
          />
          {open.photos && (
            <div
              id="Photos-panel"
              role="region"
              aria-labelledby="Photos"
              className="mt-3 grid gap-4 transition-opacity duration-200 ease-out will-change-opacity"
            >
              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-medium text-[#0f172a]">Photo gallery</h3>
                  <label className="cursor-pointer rounded-md bg-[#2563eb] px-3 py-2 text-sm text-[#ffffff] transition-transform duration-150 hover:brightness-110 active:scale-[0.98]">
                    <span>Upload photos</span>
                    <input type="file" multiple accept="image/*" onChange={onUploadPhotos} className="sr-only" />
                  </label>
                </div>

                {photos.length === 0 ? (
                  <div className="grid place-items-center rounded-md border border-dashed border-[#e5e7eb] p-8 text-center text-sm text-[#0f172a]">
                    Drag and drop photos here or use the Upload button
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {photos.map((p) => (
                      <div key={p.id} className="rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-2">
                        <div className="relative aspect-square overflow-hidden rounded-md border border-[#e5e7eb]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.url || "/placeholder.svg"}
                            alt="Uploaded photo"
                            className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.01]"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(p.id)}
                            className="absolute right-1 top-1 rounded bg-[#ffffff]/90 p-1 text-[#0f172a] shadow-sm transition-colors duration-150 hover:bg-[#f8fafc] cursor-pointer"
                            aria-label="Delete photo"
                            title="Delete"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="#0f172a"
                              strokeWidth="2"
                            >
                              <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2">
                          <label className="mb-1 block text-xs text-[#0f172a]">Caption</label>
                          <input
                            id={`photo-caption-${p.id}`}
                            value={p.caption}
                            onChange={(e) => setCaption(p.id, e.target.value)}
                            placeholder="Add a caption"
                            className="w-full rounded-md border border-[#e5e7eb] bg-[#ffffff] px-2 py-1 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </section>

        <section className="mb-5">
          <SectionHeader
            title="Social Media & Links"
            open={open.social}
            onToggle={() => toggle("social")}
            status={[linkedIn, twitter, facebook, instagram].some((v) => v.trim()) ? "complete" : "incomplete"}
          />
          {open.social && (
            <div
              id="Social Media & Links-panel"
              role="region"
              aria-labelledby="Social Media & Links"
              className="mt-3 grid gap-4 transition-opacity duration-200 ease-out will-change-opacity"
            >
              <Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="linkedin" className="text-sm text-[#0f172a]">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="twitter" className="text-sm text-[#0f172a]">
                      Twitter
                    </label>
                    <input
                      id="twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="facebook" className="text-sm text-[#0f172a]">
                      Facebook
                    </label>
                    <input
                      id="facebook"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="instagram" className="text-sm text-[#0f172a]">
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </section>

        <section className="mb-5">
          <SectionHeader
            title="Q&As"
            open={open.qas}
            onToggle={() => toggle("qas")}
            status={
              qas.length > 0 && qas.every((q) => q.answer.trim().length > 5)
                ? "complete"
                : qas.some((q) => q.answer.trim())
                  ? "in-progress"
                  : "incomplete"
            }
          />
          {open.qas && (
            <div
              id="Q&As-panel"
              role="region"
              aria-labelledby="Q&As"
              className="mt-3 grid gap-4 transition-opacity duration-200 ease-out will-change-opacity"
            >
              <Card>
                <div className="grid gap-4">
                  {qas.map((q) => (
                    <div key={q.id} className="flex flex-col gap-2">
                      <label htmlFor={`qa-${q.id}`} className="text-sm font-medium text-[#0f172a]">
                        {q.question}
                      </label>
                      <textarea
                        id={`qa-${q.id}`}
                        value={q.answer}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        rows={4}
                        className="rounded-md border border-[#e5e7eb] bg-[#ffffff] p-3 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]"
                        placeholder="Write your answer..."
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </section>

        <ActionBar onCancel={onCancel} onSave={onSave} hasChanges={hasUnsavedChanges} isSaving={isSaving} />
      </div>
    </main>
  )
})
