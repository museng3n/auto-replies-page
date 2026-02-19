"use client"

import { useState } from "react"
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

// Sample data
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
    <div dir="rtl" className="min-h-screen bg-[#F3F4F6] p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">الردود التلقائية</h1>
            <p className="text-sm text-[#6B7280]">ردود سريعة على الكلمات المفتاحية | Quick replies to keywords</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إنشاء رد تلقائي
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">{totalActive}</div>
                <div className="text-sm text-[#6B7280] mb-2">ردود نشطة | Active Replies</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <span>+2 this week</span>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3.293 3.293 3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">{totalSentToday.toLocaleString()}</div>
                <div className="text-sm text-[#6B7280] mb-2">أُرسل اليوم | Sent Today</div>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">{successRate}%</div>
                <div className="text-sm text-[#6B7280] mb-2">معدل النجاح | Success Rate</div>
                <div className="text-xs text-green-600">Excellent</div>
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
                placeholder="ابحث بالاسم، الكلمات المفتاحية..."
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
                  <SelectItem value="all">الكل | All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="both">كلاهما | Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:w-[20%]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل | All</SelectItem>
                  <SelectItem value="active">نشط | Active</SelectItem>
                  <SelectItem value="inactive">معطّل | Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters} className="lg:w-auto bg-transparent">
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              مسح الفلاتر
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
                      الاسم والكلمات المفتاحية
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                      المنصة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                      الإحصائيات
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
                      إجراءات
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
                              +{reply.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="px-6 py-4">
                        {reply.platform === "instagram" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Instagram
                          </span>
                        )}
                        {reply.platform === "facebook" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                          </span>
                        )}
                        {reply.platform === "both" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            كلاهما | Both
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(reply.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            reply.status === "active" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              reply.status === "active" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="text-gray-600">تفعيل: {reply.stats.triggered}</div>
                          <div className="text-green-600">أرسل: {reply.stats.sent}</div>
                          {reply.stats.failed > 0 && <div className="text-red-600">فشل: {reply.stats.failed}</div>}
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
                              تعديل
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
                              اختبار
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
                              نسخ
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
                              حذف
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
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2">لا توجد ردود تلقائية</h3>
            <p className="text-sm text-[#6B7280] mb-6">ابدأ بإنشاء أول رد تلقائي للكلمات المفتاحية</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إنشاء رد تلقائي
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-right">
              {selectedReply ? "تعديل الرد التلقائي" : "إنشاء رد تلقائي"}
            </DialogTitle>
            <DialogDescription className="text-right">أنشئ ردوداً تلقائية على الكلمات المفتاحية</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">1️⃣ المعلومات الأساسية</h3>

              <div>
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  placeholder="مثال: Welcome Response"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف (اختياري)</Label>
                <Textarea
                  id="description"
                  placeholder="وصف مختصر..."
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">2️⃣ المنصة</h3>
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
                        {platform === "both" && "كلاهما"}
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
              <h3 className="font-semibold text-[#1F2937]">3️⃣ الكلمات المفتاحية</h3>

              <div>
                <Label>الكلمات المفتاحية *</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="أضف كلمة مفتاحية..."
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
                    إضافة +
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
                <Label htmlFor="matchType">نوع المطابقة</Label>
                <Select
                  value={formData.matchType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, matchType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">يحتوي | Contains</SelectItem>
                    <SelectItem value="exact">مطابقة تامة | Exact</SelectItem>
                    <SelectItem value="starts_with">يبدأ بـ | Starts With</SelectItem>
                    <SelectItem value="ends_with">ينتهي بـ | Ends With</SelectItem>
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
                  حساس لحالة الأحرف
                </Label>
              </div>
            </div>

            {/* Response Message */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F2937]">4️⃣ رسالة الرد</h3>

              <div>
                <Label htmlFor="replyMessage">الرسالة *</Label>
                <Textarea
                  id="replyMessage"
                  placeholder="مرحباً {{name}}! شكراً..."
                  rows={6}
                  value={formData.replyMessage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, replyMessage: e.target.value }))}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 italic">
                    يمكنك استخدام: {"{"}
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
                <Label htmlFor="delay">التأخير (بالثواني)</Label>
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
              <h3 className="font-semibold text-[#1F2937]">5️⃣ الخيارات</h3>

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
                    إنشاء جهة اتصال تلقائياً
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
                    تفعيل الرد التلقائي
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
              إلغاء
            </Button>
            <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]">
              {selectedReply ? "حفظ التغييرات" : "حفظ الرد التلقائي"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-right">
              اختبار الرد التلقائي: {selectedReply?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">المنصة:</Label>
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
              <Label htmlFor="testMessage">رسالة الاختبار:</Label>
              <Input id="testMessage" placeholder="أدخل رسالة الاختبار..." defaultValue="hello" />
            </div>

            <div>
              <Label htmlFor="senderName">اسم المرسل:</Label>
              <Input id="senderName" placeholder="Test User" defaultValue="Test User" />
            </div>

            <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">تشغيل الاختبار</Button>

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
                <span className="font-semibold text-green-800">تم العثور على مطابقة!</span>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                <p>الكلمة المطابقة: "hello"</p>
                <p className="font-medium">الرد المرسل:</p>
                <div className="p-3 rounded bg-white border border-green-200 text-gray-700 whitespace-pre-wrap">
                  {selectedReply?.replyMessage}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
