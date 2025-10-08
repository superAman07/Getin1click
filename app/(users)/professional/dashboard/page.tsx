"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Users, DollarSign, Star, ArrowRight, Zap, Target, Award } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const Index = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();
  const [mounted, setMounted] = useState(false)
  const [counters, setCounters] = useState({ leads: 0, responses: 0, revenue: 0, rating: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      const bundleName = searchParams.get('bundle_name');
      const creditsAdded = searchParams.get('credits_added');
      
      toast.success(`Purchase successful! ${creditsAdded} credits for "${bundleName}" have been added.`);
      
      updateSession();
    
      setTimeout(() => {
        router.replace('/professional/dashboard', { scroll: false });
      }, 500);
    }
  }, [searchParams, router, updateSession]);
  
  useEffect(() => {
    const targets = { leads: 127, responses: 89, revenue: 15420, rating: 4.8 }
    const duration = 1200

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const p = easeOutCubic(t)

      setCounters({
        leads: Math.round(targets.leads * p),
        responses: Math.round(targets.responses * p),
        revenue: Math.round(targets.revenue * p),
        rating: Number.parseFloat((targets.rating * p).toFixed(1)),
      })

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Mount transition for fade/slide-in
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const statCards = [
    {
      label: "Total Leads",
      value: counters.leads.toString(),
      icon: Users,
      iconWrap: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Response Rate",
      value: `${counters.responses}%`,
      icon: TrendingUp,
      iconWrap: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Revenue",
      value: `$${counters.revenue.toLocaleString()}`,
      icon: DollarSign,
      iconWrap: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Rating",
      value: counters.rating.toFixed(1),
      icon: Star,
      iconWrap: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ]

  const quickActions = [
    {
      label: "Browse Leads",
      icon: Users,
      href: "#",
      color: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
    },
    {
      label: "View Analytics",
      icon: TrendingUp,
      href: "#",
      color: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
    },
    {
      label: "Update Profile",
      icon: Target,
      href: '/professional/dashboard/update-profile',
      color: "bg-slate-200 hover:bg-slate-300 text-slate-900",
    },
  ]

  const recentActivity = [
    {
      type: "New Lead",
      description: "Kitchen renovation in Manhattan",
      time: "2 hours ago",
      status: "pending" as const,
    },
    {
      type: "Response Sent",
      description: "Bathroom remodel in Brooklyn",
      time: "5 hours ago",
      status: "success" as const,
    },
    { type: "Lead Won", description: "Home painting in Queens", time: "1 day ago", status: "success" as const },
    { type: "New Lead", description: "Flooring installation in Bronx", time: "1 day ago", status: "pending" as const },
  ]

  const cardBase =
    "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md will-change-transform"
  const sectionTitle = "text-xl font-semibold text-slate-900"

  return (
    <div className="min-h-screen px-4 md:px-8 pb-12 pt-20 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div
          className={[
            "mb-8 transform transition-all duration-500 ease-out will-change-[opacity,transform]",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-slate-900">{getGreeting()}, John!</h1>
          <p className="text-slate-600 text-lg">Here's what's happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className={[
                cardBase,
                "transform transition-all duration-500 ease-out",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              ].join(" ")}
              style={{ transitionDelay: `${index * 60}ms`, willChange: "opacity, transform" as any }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconWrap}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={sectionTitle}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {quickActions.map((action, index) => (
              <Link
                href={action.href}
                key={action.label}
                className={[
                  cardBase,
                  "text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/40",
                  action.color,
                ].join(" ")}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-white/10">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-lg">{action.label}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Overview */}
          <div className={cardBase}>
            <h2 className={sectionTitle}>Performance Overview</h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Lead Response Rate</span>
                  <span className="text-sm font-semibold text-green-700">89%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "89%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Profile Completion</span>
                  <span className="text-sm font-semibold text-blue-700">95%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Customer Satisfaction</span>
                  <span className="text-sm font-semibold text-amber-700">4.8/5.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "96%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={cardBase}>
            <h2 className={sectionTitle}>Recent Activity</h2>
            <div className="mt-4 space-y-3">
              {recentActivity.map((activity, idx) => {
                const isSuccess = activity.status === "success"
                return (
                  <div
                    key={`${activity.type}-${idx}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors duration-200 ease-out"
                  >
                    <div className={["p-2 rounded-lg", isSuccess ? "bg-green-100" : "bg-blue-100"].join(" ")}>
                      {isSuccess ? (
                        <Award className="w-4 h-4 text-green-700" />
                      ) : (
                        <Zap className="w-4 h-4 text-blue-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{activity.type}</div>
                          <div className="text-sm text-slate-600 truncate">{activity.description}</div>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Achievement Banner */}
        <div
          className={[
            "mt-8 relative overflow-hidden rounded-2xl p-5 sm:p-6",
            "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md",
            "transform transition-all duration-500 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
          style={{ willChange: "opacity, transform" as any }}
        >
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/15">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1">Top Performer This Month!</h3>
                <p className="text-white/85">You're in the top 10% of service providers</p>
              </div>
            </div>
            <button className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-100 transition-colors duration-200 ease-out shadow-sm cursor-pointer">
              View Achievements
            </button>
          </div>

          {/* subtle decorative circle */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-20">
            <div className="w-52 h-52 sm:w-64 sm:h-64 bg-white rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
