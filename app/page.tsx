"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
// @ts-ignore
import { apiClient } from "@/shared-api-config/api/client"
// @ts-ignore
import ENDPOINTS from "@/shared-api-config/api/endpoints"
import { translations } from '../src/translations'

// Sample data (fallback)
const sampleAutoReplies = [
  {
    id: 1,
    name: "Welcome Response",
    keywords: ["مرحبا", "hello", "hi", "hey", "السلام عليكم"],
    platform: "both",
    matchType: "contains",
    caseSensitive: false,
    replyMessage: "مرحباً بك! 👋\n\nشكراً لتواصلك معنا. فريقنا سيرد عليك قريباً.\n\n---\nفريق Triggerio",
    delay: 2,
    createContact: true,
    status: "active",
    stats: {
      triggered: 456,
      sent: 423,
      failed: 2,
    },
    createdAt: "2025-12-10",
    updatedAt: "2025-12-15",
  },
  {
    id: 2,
    name: "Pricing Inquiry",
    keywords: ["سعر", "price", "cost", "كم", "how much"],
    platform: "instagram",
    matchType: "contains",
    caseSensitive: false,
    replyMessage:
      "شكراً لاهتمامك! 💰\n\nأسعارنا تبدأ من 99 ريال سنوياً.\n\nيمكنك الاطلاع على جميع الباقات هنا: triggerio.io/pricing",
    delay: 3,
    createContact: true,
    status: "active",
    stats: {
      triggered: 234,
      sent: 230,
      failed: 4,
    },
    createdAt: "2025-12-08",
    updatedAt: "2025-12-14",
  },
  {
    id: 3,
    name: "Product Info",
    keywords: ["منتج", "product", "features", "ميزات"],
    platform: "facebook",
    matchType: "contains",
    caseSensitive: false,
    replyMessage:
      "Triggerio هو منصة أتمتة شاملة! ✨\n\nالميزات الرئيسية:\n• أتمتة Instagram/Facebook\n• إدارة جهات الاتصال\n• تكامل مع GoHighLevel\n• حملات بريد إلكتروني\n\nجرب مجاناً: triggerio.io",
    delay: 5,
    createContact: true,
    status: "active",
    stats: {
      triggered: 189,
      sent: 185,
      failed: 4,
    },
    createdAt: "2025-12-12",
    updatedAt: "2025-12-15",
  },
  {
    id: 4,
    name: "Support Request",
    keywords: ["مساعدة", "help", "support", "دعم", "مشكلة", "problem"],
    platform: "both",
    matchType: "contains",
    caseSensitive: false,
    replyMessage:
      "نحن هنا للمساعدة! 🙋‍♂️\n\nيرجى وصف المشكلة وسنرد عليك في أقرب وقت.\n\nللدعم الفوري: support@triggerio.io",
    delay: 2,
    createContact: true,
    status: "active",
    stats: {
      triggered: 145,
      sent: 142,
      failed: 3,
    },
    createdAt: "2025-12-05",
    updatedAt: "2025-12-13",
  },
  {
    id: 5,
    name: "Demo Request",
    keywords: ["demo", "عرض", "تجربة", "try", "test"],
    platform: "instagram",
    matchType: "contains",
    caseSensitive: false,
    replyMessage:
      "رائع! نود أن نريك Triggerio! 🎬\n\nاحجز عرضاً توضيحياً مجانياً:\ntriggerio.io/demo\n\nأو جربه مباشرة:\ntriggerio.io/signup",
    delay: 3,
    createContact: true,
    status: "active",
    stats: {
      triggered: 98,
      sent: 95,
      failed: 3,
    },
    createdAt: "2025-12-11",
    updatedAt: "2025-12-14",
  },
  {
    id: 6,
    name: "Thank You Response",
    keywords: ["شكرا", "thank", "thanks", "thx"],
    platform: "both",
    matchType: "contains",
    caseSensitive: false,
    replyMessage: "العفو! 🙏\n\nسعداء بخدمتك دائماً.",
    delay: 1,
    createContact: false,
    status: "inactive",
    stats: {
      triggered: 0,
      sent: 0,
      failed: 0,
    },
    createdAt: "2025-12-13",
    updatedAt: "2025-12-13",
  },
]

export default function AutoRepliesPage() {
  const [autoReplies, setAutoReplies] = useState(sampleAutoReplies)
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [selectedReply, setSelectedReply] = useState<any>(null)
  const [newKeyword, setNewKeyword] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    if (typeof window === 'undefined') return 'ar'
    const urlLang = new URLSearchParams(window.location.search).get('lang')
    if (urlLang === 'ar' || urlLang === 'en') return urlLang as 'ar' | 'en'
    const stored = localStorage.getItem('triggerio_language')
    if (stored === 'ar' || stored === 'en') return stored as 'ar' | 'en'
    return 'ar'
  })

  // Set document direction synchronously before first render
  if (typeof document !== 'undefined') {
    document.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr'
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    if (urlToken) {
      localStorage.setItem('triggerio_token', urlToken)
      window.history.replaceState({}, '', window.location.pathname)
    }
    fetchAutoReplies()
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dir = language === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = language
      document.body.dir = language === 'ar' ? 'rtl' : 'ltr'
      document.body.style.textAlign = language === 'ar' ? 'right' : 'left'
    }
  }, [language])

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'LANGUAGE_CHANGE') {
        setLanguage(event.data.language)
        if (typeof localStorage !== 'undefined') localStorage.setItem('triggerio_language', event.data.language)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const fetchAutoReplies = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(ENDPOINTS.AUTO_RESPONSES.BASE)
      const data = response.data?.data?.autoResponses || response.data?.data || []
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((r: any) => ({
          id: r._id || r.id,
          name: r.name || "",
          keywords: r.triggers?.keywords || [],
          platform: r.platforms?.length === 2 ? "both" : r.platforms?.[0] || "both",
          matchType: r.triggers?.matchType || "contains",
          caseSensitive: r.triggers?.caseSensitive || false,
          replyMessage: r.responseText || "",
          delay: r.delay || 0,
          createContact: r.createContact !== false,
          status: r.isActive ? "active" : "inactive",
          stats: r.stats || { triggered: 0, sent: 0, failed: 0 },
          createdAt: r.createdAt || "",
          updatedAt: r.updatedAt || "",
        }))
        setAutoReplies(mapped)
      }
    } catch (err: any) {
      console.error("Failed to fetch auto-replies:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return alert("الاسم مطلوب")
    if (formData.keywords.length === 0) return alert("أضف كلمة مفتاحية واحدة على الأقل")
    if (!formData.replyMessage.trim()) return alert("رسالة الرد مطلوبة")

    setSaving(true)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        responseText: formData.replyMessage,
        platforms: formData.platform === "both" ? ["facebook", "instagram"] : [formData.platform],
        triggers: {
          keywords: formData.keywords,
          matchType: formData.matchType,
          caseSensitive: formData.caseSensitive,
        },
        delay: formData.delay,
        createContact: formData.createContact,
        isActive: formData.status === "active",
      }

      if (selectedReply) {
        await apiClient.put(ENDPOINTS.AUTO_RESPONSES.BY_ID(selectedReply.id), payload)
      } else {
        await apiClient.post(ENDPOINTS.AUTO_RESPONSES.BASE, payload)
      }

      setIsCreateModalOpen(false)
      setSelectedReply(null)
      setFormData({
        name: "",
        description: "",
        platform: "both",
        keywords: [],
        matchType: "contains",
        caseSensitive: false,
        replyMessage: "",
        delay: 2,
        createContact: true,
        status: "active",
      })
      fetchAutoReplies()
    } catch (err: any) {
      console.error("Failed to save auto-reply:", err)
      alert(err.response?.data?.message || err.message || "فشل في حفظ الرد التلقائي")
    } finally {
      setSaving(false)
    }
  }

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "both",
    keywords: [] as string[],
    matchType: "contains",
    caseSensitive: false,
    replyMessage: "",
    delay: 2,
    createContact: true,
    status: "active",
  })

  // Filter auto replies
  const filteredReplies = autoReplies.filter((reply) => {
    const matchesSearch =
      searchQuery === "" ||
      reply.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reply.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPlatform = platformFilter === "all" || reply.platform === platformFilter
    const matchesStatus = statusFilter === "all" || reply.status === statusFilter

    return matchesSearch && matchesPlatform && matchesStatus
  })

  const toggleStatus = (id: number) => {
    setAutoReplies((prev) =>
      prev.map((reply) =>
        reply.id === id ? { ...reply, status: reply.status === "active" ? "inactive" : "active" } : reply,
      ),
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPlatformFilter("all")
    setStatusFilter("all")
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const totalActive = autoReplies.filter((r) => r.status === "active").length
  const totalSentToday = autoReplies.reduce((sum, r) => sum + (r.stats?.sent || 0), 0)
  const totalTriggered = autoReplies.reduce((sum, r) => sum + (r.stats?.triggered || 0), 0)
  const successRate = totalTriggered > 0 ? ((totalSentToday / totalTriggered) * 100).toFixed(1) : "0.0"

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F3F4F6] p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">{translations[language].pageTitle}</h1>
            <p className="text-sm text-[#6B7280]">{translations[language].pageSubtitle}</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#7C3AED] text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-300">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {translations[language].createBtn}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Active Replies */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">{totalActive}</div>
                <div className="text-sm text-[#6B7280] mb-2">{translations[language].activeReplies}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <span>+2 {translations[language].thisWeek}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Sent Today */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">{totalSentToday.toLocaleString()}</div>
                <div className="text-sm text-[#6B7280] mb-2">{translations[language].sentToday}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <span>+234</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Success Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">{successRate}%</div>
                <div className="text-sm text-[#6B7280] mb-2">{translations[language].successRate}</div>
                <div className="text-xs text-green-600">{translations[language].excellent}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 lg:w-[40%] relative">
              <svg
                className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder={translations[language].searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <div className="lg:w-[20%]">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="المنصة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations[language].allPlatforms}</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="both">{translations[language].both}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:w-[20%]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations[language].allStatus}</SelectItem>
                  <SelectItem value="active">{translations[language].active}</SelectItem>
                  <SelectItem value="inactive">{translations[language].inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters} className="lg:w-auto bg-transparent">
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {translations[language].clearFilters}
            </Button>
          </div>
        </div>

        {/* Table */}
        {filteredReplies.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[40%]">
                      {translations[language].nameAndKeywords}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                      {translations[language].platformCol}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                      {translations[language].statusCol}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                      {translations[language].stats}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
                      {translations[language].actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReplies.map((reply) => (
                    <tr key={reply.id} className="hover:bg-gray-50 transition-colors">
                      {/* Name & Keywords */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1F2937] mb-2">{reply.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {reply.keywords.slice(0, 3).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280]"
                            >
                              {keyword}
                            </span>
                          ))}
                          {reply.keywords.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280]">
                              +{reply.keywords.length - 3} {translations[language].moreKeywords}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="px-6 py-4">
                        {reply.platform === "instagram" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm9 3a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Instagram
                          </span>
                        )}
                        {reply.platform === "facebook" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 4v-4H4a2 2 0 01-2-2V5z" />
                            </svg>
                            Facebook
                          </span>
                        )}
                        {reply.platform === "both" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                            </svg>
                            {translations[language].both}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(reply.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                            reply.status === "active" ? "bg-purple-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-all duration-300 ${
                              reply.status === "active" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="text-gray-600">{translations[language].triggered} {reply.stats.triggered}</div>
                          <div className="text-green-600">{translations[language].sent} {reply.stats.sent}</div>
                          {reply.stats.failed > 0 && <div className="text-red-600">{translations[language].failed} {reply.stats.failed}</div>}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setFormData({
                                  name: reply.name,
                                  description: "",
                                  platform: reply.platform,
                                  keywords: reply.keywords,
                                  matchType: reply.matchType,
                                  caseSensitive: reply.caseSensitive,
                                  replyMessage: reply.replyMessage,
                                  delay: reply.delay,
                                  createContact: reply.createContact,
                                  status: reply.status,
                                })
                                setSelectedReply(reply)
                                setIsCreateModalOpen(true)
                              }}
                            >
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              {translations[language].edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReply(reply)
                                setIsTestModalOpen(true)
                              }}
                            >
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                />
                              </svg>
                              {translations[language].test}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              {translations[language].copy}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              {translations[language].delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm py-16 px-6 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2">{translations[language].noReplies}</h3>
            <p className="text-sm text-[#6B7280] mb-6">{translations[language].noRepliesSubtitle}</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#7C3AED] text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-300">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {translations[language].createBtn}
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-right">
              {selectedReply ? translations[language].editModalTitle : translations[language].createModalTitle}
            </DialogTitle>
            <DialogDescription className="text-right">{translations[language].modalDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">1️⃣ {translations[language].basicInfo}</h3>

              <div>
                <Label htmlFor="name">{translations[language].nameLabel}</Label>
                <Input
                  id="name"
                  placeholder="مثال: Welcome Response"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">{translations[language].descLabel}</Label>
                <Textarea
                  id="description"
                  placeholder={translations[language].descPlaceholder}
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">2️⃣ {translations[language].platformSection}</h3>
              <div className="grid grid-cols-3 gap-3">
                {["instagram", "facebook", "both"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setFormData((prev) => ({ ...prev, platform }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.platform === platform
                        ? "border-[#7C3AED] bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium mb-1">
                        {platform === "instagram" && "Instagram"}
                        {platform === "facebook" && "Facebook"}
                        {platform === "both" && translations[language].both}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full mx-auto ${
                          formData.platform === platform ? "bg-[#7C3AED]" : "bg-gray-300"
                        }`}
                      >
                        {formData.platform === platform && <div className="w-2 h-2 bg-white rounded-full m-1" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">3️⃣ {translations[language].keywordsSection}</h3>

              <div>
                <Label>{translations[language].keywordsLabel}</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder={translations[language].addKeywordPlaceholder}
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeyword()
                      }
                    }}
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    {translations[language].addKeywordBtn}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280]"
                    >
                      {keyword}
                      <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="matchType">{translations[language].matchType}</Label>
                <Select
                  value={formData.matchType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, matchType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">{translations[language].contains}</SelectItem>
                    <SelectItem value="exact">{translations[language].exact}</SelectItem>
                    <SelectItem value="starts_with">{translations[language].startsWith}</SelectItem>
                    <SelectItem value="ends_with">{translations[language].endsWith}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="caseSensitive"
                  checked={formData.caseSensitive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, caseSensitive: checked as boolean }))}
                />
                <Label htmlFor="caseSensitive" className="cursor-pointer">
                  {translations[language].caseSensitive}
                </Label>
              </div>
            </div>

            {/* Response Message */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">4️⃣ {translations[language].replySection}</h3>

              <div>
                <Label htmlFor="replyMessage">{translations[language].replyLabel}</Label>
                <Textarea
                  id="replyMessage"
                  placeholder={translations[language].replyPlaceholder}
                  rows={6}
                  value={formData.replyMessage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, replyMessage: e.target.value }))}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 italic">
                    {translations[language].replyHelper} {"{"}
                    {"{"} name{"}"}
                    {"}"}, {"{"}
                    {"{"} username{"}"}
                    {"}"}.
                  </p>
                  <p
                    className={`text-xs ${
                      formData.replyMessage.length >= 490
                        ? "text-red-600"
                        : formData.replyMessage.length >= 450
                          ? "text-orange-600"
                          : "text-gray-500"
                    }`}
                  >
                    {formData.replyMessage.length} / 500
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="delay">{translations[language].delayLabel}</Label>
                <Input
                  id="delay"
                  type="number"
                  min={0}
                  max={60}
                  value={formData.delay}
                  onChange={(e) => setFormData((prev) => ({ ...prev, delay: Number.parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">5️⃣ {translations[language].optionsSection}</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="createContact"
                    checked={formData.createContact}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, createContact: checked as boolean }))
                    }
                  />
                  <Label htmlFor="createContact" className="cursor-pointer">
                    {translations[language].autoCreateContact}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="status"
                    checked={formData.status === "active"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                    }
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {translations[language].enableReply}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setSelectedReply(null)
                setFormData({
                  name: "",
                  description: "",
                  platform: "both",
                  keywords: [],
                  matchType: "contains",
                  caseSensitive: false,
                  replyMessage: "",
                  delay: 2,
                  createContact: true,
                  status: "active",
                })
              }}
            >
              {translations[language].cancel}
            </Button>
            <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" onClick={handleSave} disabled={saving}>
              {saving ? translations[language].saving : selectedReply ? translations[language].saveEdit : translations[language].saveCreate}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-right">
              {translations[language].testModalTitle}: {selectedReply?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">{translations[language].testPlatformLabel}</Label>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                  Instagram
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#7C3AED] bg-purple-50">
                  <div className="w-4 h-4 rounded-full border-2 border-[#7C3AED] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  </div>
                  Facebook
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="testMessage">{translations[language].testMessageLabel}</Label>
              <Input id="testMessage" placeholder="أدخل رسالة الاختبار..." defaultValue="hello" />
            </div>

            <div>
              <Label htmlFor="senderName">{translations[language].testSenderLabel}</Label>
              <Input id="senderName" placeholder="Test User" defaultValue="Test User" />
            </div>

            <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">{translations[language].runTest}</Button>

            {/* Test Result */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-green-800">{translations[language].matchFound}</span>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                <p>{translations[language].matchedKeyword} "hello"</p>
                <p className="font-medium">{translations[language].replySent}</p>
                <div className="p-3 rounded bg-white border border-green-200 text-gray-700 whitespace-pre-wrap">
                  {selectedReply?.replyMessage}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              {translations[language].close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
