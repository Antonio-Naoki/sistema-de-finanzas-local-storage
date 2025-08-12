"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Calculator,
  Command,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Minus,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import jsPDF from "jspdf"

// Types
interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  timestamp: number
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

interface CategoryData {
  name: string
  amount: number
  percentage: number
  color: string
}

// Categories
const EXPENSE_CATEGORIES = [
  { name: "Alimentación", icon: "🍔", color: "from-red-500 to-pink-500" },
  { name: "Transporte", icon: "🚗", color: "from-blue-500 to-cyan-500" },
  { name: "Entretenimiento", icon: "🎮", color: "from-purple-500 to-indigo-500" },
  { name: "Salud", icon: "🏥", color: "from-green-500 to-emerald-500" },
  { name: "Educación", icon: "📚", color: "from-yellow-500 to-orange-500" },
  { name: "Servicios", icon: "💡", color: "from-teal-500 to-cyan-500" },
  { name: "Compras", icon: "🛍️", color: "from-pink-500 to-rose-500" },
  { name: "Otros", icon: "📦", color: "from-gray-500 to-slate-500" },
]

const INCOME_CATEGORIES = [
  { name: "Salario", icon: "💼", color: "from-green-500 to-emerald-500" },
  { name: "Freelance", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { name: "Inversiones", icon: "📈", color: "from-purple-500 to-indigo-500" },
  { name: "Ventas", icon: "🏪", color: "from-yellow-500 to-orange-500" },
  { name: "Otros", icon: "💰", color: "from-teal-500 to-cyan-500" },
]

export default function FinancialDashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<"dashboard" | "analysis" | "settings">("dashboard")
  const [financialGoals, setFinancialGoals] = useState({
    monthlyGoal: 1000,
    emergencyGoal: 5000,
    vacationGoal: 2000,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Form states
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [calculatorDisplay, setCalculatorDisplay] = useState("0")
  const [calculatorPrevValue, setCalculatorPrevValue] = useState<number | null>(null)
  const [calculatorOperation, setCalculatorOperation] = useState<string | null>(null)
  const [calculatorWaitingForOperand, setCalculatorWaitingForOperand] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("financial-transactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("financial-transactions", JSON.stringify(transactions))
  }, [transactions])

  // Load financial goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("financial-goals")
    if (savedGoals) {
      setFinancialGoals(JSON.parse(savedGoals))
    }
  }, [])

  // Save financial goals to localStorage
  useEffect(() => {
    localStorage.setItem("financial-goals", JSON.stringify(financialGoals))
  }, [financialGoals])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 80

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Financial calculations
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const thisMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    const now = new Date()
    return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
  })

  const monthlyIncome = thisMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyBalance = monthlyIncome - monthlyExpenses

  // Get expense categories data
  const expensesByCategory = EXPENSE_CATEGORIES.map((cat) => {
    const categoryExpenses = transactions
      .filter((t) => t.type === "expense" && t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      name: cat.name,
      amount: categoryExpenses,
      percentage: totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0,
      color: cat.color,
      icon: cat.icon,
    }
  }).filter((cat) => cat.amount > 0)

  // Get recent transactions with search filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.type.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    )
  })

  const recentTransactions = filteredTransactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Add transaction
  const addTransaction = () => {
    if (!amount || !category || !description) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: Number.parseFloat(amount),
      category,
      description,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setIsAddTransactionOpen(false)
  }

  // Delete transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Calculator functions
  const inputCalculatorDigit = (digit: string) => {
    if (calculatorWaitingForOperand) {
      setCalculatorDisplay(digit)
      setCalculatorWaitingForOperand(false)
    } else {
      setCalculatorDisplay(calculatorDisplay === "0" ? digit : calculatorDisplay + digit)
    }
  }

  const inputCalculatorDecimal = () => {
    if (calculatorWaitingForOperand) {
      setCalculatorDisplay("0.")
      setCalculatorWaitingForOperand(false)
    } else if (calculatorDisplay.indexOf(".") === -1) {
      setCalculatorDisplay(calculatorDisplay + ".")
    }
  }

  const clearCalculator = () => {
    setCalculatorDisplay("0")
    setCalculatorPrevValue(null)
    setCalculatorOperation(null)
    setCalculatorWaitingForOperand(false)
  }

  const performCalculatorOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(calculatorDisplay)

    if (calculatorPrevValue === null) {
      setCalculatorPrevValue(inputValue)
    } else if (calculatorOperation) {
      const currentValue = calculatorPrevValue || 0
      const newValue = calculate(currentValue, inputValue, calculatorOperation)

      setCalculatorDisplay(String(newValue))
      setCalculatorPrevValue(newValue)
    }

    setCalculatorWaitingForOperand(true)
    setCalculatorOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  // Export to PDF function
  const exportToPDF = async () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Header
    pdf.setFontSize(20)
    pdf.setTextColor(0, 150, 200)
    pdf.text("FINTECH OS - Reporte Financiero", pageWidth / 2, 20, { align: "center" })

    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generado el: ${formatDate(new Date())} ${formatTime(new Date())}`, pageWidth / 2, 30, {
      align: "center",
    })

    let yPosition = 50

    // Resumen Financiero
    pdf.setFontSize(16)
    pdf.setTextColor(0, 0, 0)
    pdf.text("Resumen Financiero", 20, yPosition)
    yPosition += 15

    pdf.setFontSize(12)
    pdf.text(`Balance Total: ${formatCurrency(balance)}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Total Ingresos: ${formatCurrency(totalIncome)}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Total Gastos: ${formatCurrency(totalExpenses)}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Total Transacciones: ${transactions.length}`, 20, yPosition)
    yPosition += 20

    // Resumen Mensual
    pdf.setFontSize(16)
    pdf.setTextColor(0, 0, 0)
    pdf.text("Resumen del Mes Actual", 20, yPosition)
    yPosition += 15

    pdf.setFontSize(12)
    pdf.text(`Ingresos del Mes: ${formatCurrency(monthlyIncome)}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Gastos del Mes: ${formatCurrency(monthlyExpenses)}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Balance Mensual: ${formatCurrency(monthlyBalance)}`, 20, yPosition)
    yPosition += 8
    pdf.text(`Transacciones del Mes: ${thisMonthTransactions.length}`, 20, yPosition)
    yPosition += 20

    // Gastos por Categoría
    if (expensesByCategory.length > 0) {
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Gastos por Categoría", 20, yPosition)
      yPosition += 15

      pdf.setFontSize(12)
      expensesByCategory.forEach((cat) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(
          `${cat.icon} ${cat.name}: ${formatCurrency(cat.amount)} (${cat.percentage.toFixed(1)}%)`,
          20,
          yPosition,
        )
        yPosition += 8
      })
      yPosition += 15
    }

    // Transacciones Recientes
    if (recentTransactions.length > 0) {
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Transacciones Recientes", 20, yPosition)
      yPosition += 15

      pdf.setFontSize(10)
      pdf.text("Fecha", 20, yPosition)
      pdf.text("Tipo", 60, yPosition)
      pdf.text("Categoría", 90, yPosition)
      pdf.text("Descripción", 130, yPosition)
      pdf.text("Cantidad", 170, yPosition)
      yPosition += 8

      // Línea separadora
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2)
      yPosition += 5

      recentTransactions.slice(0, 15).forEach((transaction) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }

        const categoryIcon = getCategoryIcon(transaction.category, transaction.type)

        pdf.text(transaction.date, 20, yPosition)
        pdf.text(transaction.type === "income" ? "Ingreso" : "Gasto", 60, yPosition)
        pdf.text(`${categoryIcon} ${transaction.category}`, 90, yPosition)
        pdf.text(transaction.description.substring(0, 20), 130, yPosition)

        // Color para la cantidad
        if (transaction.type === "income") {
          pdf.setTextColor(0, 150, 0)
          pdf.text(`+${formatCurrency(transaction.amount)}`, 170, yPosition)
        } else {
          pdf.setTextColor(200, 0, 0)
          pdf.text(`-${formatCurrency(transaction.amount)}`, 170, yPosition)
        }
        pdf.setTextColor(0, 0, 0)

        yPosition += 8
      })
    }

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text("Generado por FINTECH OS - Sistema de Control Financiero", pageWidth / 2, pageHeight - 10, {
      align: "center",
    })

    // Guardar el PDF
    pdf.save(`reporte-financiero-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  // Helper function for getting category icon (move this outside the component if needed)
  const getCategoryIcon = (category: string, type: "income" | "expense") => {
    const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    const cat = categories.find((c) => c.name === category)
    return cat?.icon || "💰"
  }

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">CARGANDO SISTEMA FINANCIERO</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FINTECH OS
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar transacciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500 text-slate-200"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Transacción
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400">Agregar Transacción</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        variant={transactionType === "income" ? "default" : "outline"}
                        onClick={() => setTransactionType("income")}
                        className={transactionType === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Ingreso
                      </Button>
                      <Button
                        variant={transactionType === "expense" ? "default" : "outline"}
                        onClick={() => setTransactionType("expense")}
                        className={transactionType === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Gasto
                      </Button>
                    </div>

                    <div>
                      <Label className="text-slate-200">Cantidad</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-200">Categoría</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {(transactionType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-200">Descripción</Label>
                      <Input
                        placeholder="Descripción de la transacción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>

                    <Button onClick={addTransaction} className="w-full bg-cyan-600 hover:bg-cyan-700">
                      Agregar Transacción
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      {recentTransactions.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notificaciones</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cambiar tema</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">FU</AvatarFallback>
              </Avatar> */}
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem
                    icon={Command}
                    label="Dashboard"
                    active={activeSection === "dashboard"}
                    onClick={() => setActiveSection("dashboard")}
                  />
                  <NavItem
                    icon={BarChart3}
                    label="Análisis"
                    active={activeSection === "analysis"}
                    onClick={() => setActiveSection("analysis")}
                  />
                  <NavItem
                    icon={Settings}
                    label="Configuración"
                    active={activeSection === "settings"}
                    onClick={() => setActiveSection("settings")}
                  />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">ESTADO FINANCIERO</div>
                  <div className="space-y-3">
                    <StatusItem
                      label="Balance General"
                      value={balance > 0 ? Math.min((balance / 5000) * 100, 100) : 0}
                      color={balance >= 0 ? "green" : "red"}
                    />
                    <StatusItem
                      label="Gastos del Mes"
                      value={monthlyExpenses > 0 ? Math.min((monthlyExpenses / 2000) * 100, 100) : 0}
                      color={monthlyExpenses > 1500 ? "red" : monthlyExpenses > 1000 ? "orange" : "green"}
                    />
                    <StatusItem
                      label="Objetivos"
                      value={
                        financialGoals.monthlyGoal > 0 &&
                        financialGoals.emergencyGoal > 0 &&
                        financialGoals.vacationGoal > 0
                          ? Math.round(
                              (Math.min((monthlyBalance / financialGoals.monthlyGoal) * 100, 100) +
                                Math.min(((balance * 0.4) / financialGoals.emergencyGoal) * 100, 100) +
                                Math.min(((balance * 0.25) / financialGoals.vacationGoal) * 100, 100)) /
                                3,
                            )
                          : 0
                      }
                      color="cyan"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            {activeSection === "dashboard" && (
              <DashboardSection
                showBalance={showBalance}
                setShowBalance={setShowBalance}
                balance={balance}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                transactions={transactions}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                monthlyBalance={monthlyBalance}
                thisMonthTransactions={thisMonthTransactions}
                expensesByCategory={expensesByCategory}
                recentTransactions={recentTransactions}
                deleteTransaction={deleteTransaction}
                formatCurrency={formatCurrency}
                searchQuery={searchQuery}
              />
            )}

            {activeSection === "analysis" && (
              <AnalysisSection
                transactions={transactions}
                showBalance={showBalance}
                formatCurrency={formatCurrency}
                expensesByCategory={expensesByCategory}
                thisMonthTransactions={thisMonthTransactions}
              />
            )}

            {activeSection === "settings" && (
              <SettingsSection financialGoals={financialGoals} setFinancialGoals={setFinancialGoals} />
            )}
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* System time */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">HORA DEL SISTEMA</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Transacciones</div>
                        <div className="text-sm font-mono text-slate-200">{transactions.length}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Este Mes</div>
                        <div className="text-sm font-mono text-slate-200">{thisMonthTransactions.length}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                      icon={Plus}
                      label="Ingreso"
                      onClick={() => {
                        setTransactionType("income")
                        setIsAddTransactionOpen(true)
                      }}
                    />
                    <ActionButton
                      icon={Minus}
                      label="Gasto"
                      onClick={() => {
                        setTransactionType("expense")
                        setIsAddTransactionOpen(true)
                      }}
                    />
                    <ActionButton icon={Calculator} label="Calculadora" onClick={() => setIsCalculatorOpen(true)} />
                    <ActionButton icon={Download} label="Exportar" onClick={exportToPDF} />
                  </div>
                </CardContent>
              </Card>

              {/* Financial goals */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Objetivos Financieros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Ahorro Mensual</div>
                        <div className="text-xs text-cyan-400">
                          {Math.round(
                            (Math.min(monthlyBalance, financialGoals.monthlyGoal) / financialGoals.monthlyGoal) * 100,
                          )}
                          % completado
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${Math.min((monthlyBalance / financialGoals.monthlyGoal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ${Math.max(0, monthlyBalance)} / ${financialGoals.monthlyGoal}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Fondo de Emergencia</div>
                        <div className="text-xs text-green-400">
                          {Math.round(
                            (Math.min(balance * 0.4, financialGoals.emergencyGoal) / financialGoals.emergencyGoal) *
                              100,
                          )}
                          % completado
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${Math.min(((balance * 0.4) / financialGoals.emergencyGoal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ${Math.round(Math.max(0, balance * 0.4))} / ${financialGoals.emergencyGoal}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Vacaciones</div>
                        <div className="text-xs text-purple-400">
                          {Math.round(
                            (Math.min(balance * 0.25, financialGoals.vacationGoal) / financialGoals.vacationGoal) * 100,
                          )}
                          % completado
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${Math.min(((balance * 0.25) / financialGoals.vacationGoal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ${Math.round(Math.max(0, balance * 0.25))} / ${financialGoals.vacationGoal}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget alerts */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                    Alertas de Presupuesto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthlyExpenses > 2000 && (
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 p-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                          <AlertCircle className="h-3 w-3 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">Gastos Elevados</div>
                          <div className="text-xs text-slate-400">Has superado tu presupuesto mensual</div>
                        </div>
                      </div>
                    )}

                    {balance < 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 p-1 rounded-full bg-red-500/20 border border-red-500/30">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">Balance Negativo</div>
                          <div className="text-xs text-slate-400">Tus gastos superan tus ingresos</div>
                        </div>
                      </div>
                    )}

                    {transactions.length === 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 p-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                          <AlertCircle className="h-3 w-3 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">Comenzar</div>
                          <div className="text-xs text-slate-400">Agrega tu primera transacción</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Calculator Modal */}
        <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Calculadora</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="text-right text-2xl font-mono text-slate-100 mb-4 min-h-[40px] flex items-center justify-end">
                  {calculatorDisplay}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Button onClick={clearCalculator} className="bg-red-600 hover:bg-red-700 text-white">
                    C
                  </Button>
                  <Button onClick={() => performCalculatorOperation("÷")} className="bg-slate-600 hover:bg-slate-700">
                    ÷
                  </Button>
                  <Button onClick={() => performCalculatorOperation("×")} className="bg-slate-600 hover:bg-slate-700">
                    ×
                  </Button>
                  <Button onClick={() => performCalculatorOperation("-")} className="bg-slate-600 hover:bg-slate-700">
                    -
                  </Button>

                  <Button onClick={() => inputCalculatorDigit("7")} className="bg-slate-700 hover:bg-slate-600">
                    7
                  </Button>
                  <Button onClick={() => inputCalculatorDigit("8")} className="bg-slate-700 hover:bg-slate-600">
                    8
                  </Button>
                  <Button onClick={() => inputCalculatorDigit("9")} className="bg-slate-700 hover:bg-slate-600">
                    9
                  </Button>
                  <Button
                    onClick={() => performCalculatorOperation("+")}
                    className="bg-slate-600 hover:bg-slate-700 row-span-2"
                  >
                    +
                  </Button>

                  <Button onClick={() => inputCalculatorDigit("4")} className="bg-slate-700 hover:bg-slate-600">
                    4
                  </Button>
                  <Button onClick={() => inputCalculatorDigit("5")} className="bg-slate-700 hover:bg-slate-600">
                    5
                  </Button>
                  <Button onClick={() => inputCalculatorDigit("6")} className="bg-slate-700 hover:bg-slate-600">
                    6
                  </Button>

                  <Button onClick={() => inputCalculatorDigit("1")} className="bg-slate-700 hover:bg-slate-600">
                    1
                  </Button>
                  <Button onClick={() => inputCalculatorDigit("2")} className="bg-slate-700 hover:bg-slate-600">
                    2
                  </Button>
                  <Button onClick={() => inputCalculatorDigit("3")} className="bg-slate-700 hover:bg-slate-600">
                    3
                  </Button>
                  <Button
                    onClick={() => performCalculatorOperation("=")}
                    className="bg-cyan-600 hover:bg-cyan-700 row-span-2"
                  >
                    =
                  </Button>

                  <Button
                    onClick={() => inputCalculatorDigit("0")}
                    className="bg-slate-700 hover:bg-slate-600 col-span-2"
                  >
                    0
                  </Button>
                  <Button onClick={inputCalculatorDecimal} className="bg-slate-700 hover:bg-slate-600">
                    .
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Component for nav items
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "red":
        return "from-red-500 to-pink-500"
      case "orange":
        return "from-orange-500 to-yellow-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{Math.round(value)}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for financial cards
function FinancialCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
  hidden,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
  hidden: boolean
}) {
  const getColor = () => {
    switch (color) {
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "red":
        return "from-red-500 to-pink-500 border-red-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {hidden ? "****" : formatCurrency(value)}
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

// Monthly chart component
function MonthlyChart({ transactions, showBalance }: { transactions: Transaction[]; showBalance: boolean }) {
  if (!showBalance) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-slate-400">Datos ocultos</div>
      </div>
    )
  }

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">$1000</div>
        <div className="text-xs text-slate-500">$750</div>
        <div className="text-xs text-slate-500">$500</div>
        <div className="text-xs text-slate-500">$250</div>
        <div className="text-xs text-slate-500">$0</div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {days.slice(0, 15).map((day) => {
          const dayTransactions = transactions.filter((t) => {
            const transactionDate = new Date(t.date)
            return transactionDate.getDate() === day
          })

          const dayIncome = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

          const dayExpenses = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

          const incomeHeight = Math.min((dayIncome / 1000) * 100, 100)
          const expenseHeight = Math.min((dayExpenses / 1000) * 100, 100)

          return (
            <div key={day} className="flex space-x-0.5">
              <div
                className="w-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                style={{ height: `${incomeHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
                style={{ height: `${expenseHeight}%` }}
              ></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Category item component
function CategoryItem({
  name,
  amount,
  percentage,
  color,
  icon,
  hidden,
}: {
  name: string
  amount: number
  percentage: number
  color: string
  icon: string
  hidden: boolean
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <div className="text-sm text-slate-300">{name}</div>
        </div>
        <div className="text-xs text-slate-400">{percentage.toFixed(1)}%</div>
      </div>
      <div className="text-lg font-bold text-slate-100 mb-2">{hidden ? "****" : formatCurrency(amount)}</div>
      <Progress value={percentage} className="h-1.5 bg-slate-700">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${percentage}%` }} />
      </Progress>
    </div>
  )
}

// Transaction item component
function TransactionItem({
  transaction,
  onDelete,
  showBalance,
}: {
  transaction: Transaction
  onDelete: (id: string) => void
  showBalance: boolean
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryIcon = (category: string, type: "income" | "expense") => {
    const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    const cat = categories.find((c) => c.name === category)
    return cat?.icon || "💰"
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-500/20" : "bg-red-500/20"}`}>
          <span className="text-lg">{getCategoryIcon(transaction.category, transaction.type)}</span>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">{transaction.description}</div>
          <div className="text-xs text-slate-400">
            {transaction.category} • {transaction.date}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`text-lg font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
          {transaction.type === "income" ? "+" : "-"}
          {showBalance ? formatCurrency(transaction.amount) : "****"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(transaction.id)}
          className="h-8 w-8 text-slate-400 hover:text-red-400"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Dashboard Section Component
function DashboardSection({
  showBalance,
  setShowBalance,
  balance,
  totalIncome,
  totalExpenses,
  transactions,
  monthlyIncome,
  monthlyExpenses,
  monthlyBalance,
  thisMonthTransactions,
  expensesByCategory,
  recentTransactions,
  deleteTransaction,
  formatCurrency,
  searchQuery,
}: any) {
  return (
    <div className="grid gap-6">
      {/* Balance overview */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-cyan-500" />
              Resumen Financiero
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="h-8 w-8 text-slate-400"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                EN VIVO
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinancialCard
              title="Balance Total"
              value={showBalance ? balance : 0}
              icon={DollarSign}
              trend={balance >= 0 ? "up" : "down"}
              color={balance >= 0 ? "green" : "red"}
              detail={`${transactions.length} transacciones`}
              hidden={!showBalance}
            />
            <FinancialCard
              title="Ingresos"
              value={showBalance ? totalIncome : 0}
              icon={TrendingUp}
              trend="up"
              color="green"
              detail={`${transactions.filter((t) => t.type === "income").length} ingresos`}
              hidden={!showBalance}
            />
            <FinancialCard
              title="Gastos"
              value={showBalance ? totalExpenses : 0}
              icon={TrendingDown}
              trend="down"
              color="red"
              detail={`${transactions.filter((t) => t.type === "expense").length} gastos`}
              hidden={!showBalance}
            />
          </div>

          <div className="mt-8">
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-slate-800/50 p-1">
                  <TabsTrigger
                    value="monthly"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                  >
                    Este Mes
                  </TabsTrigger>
                  <TabsTrigger
                    value="categories"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                  >
                    Categorías
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    Ingresos
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                    Gastos
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                    Balance
                  </div>
                </div>
              </div>

              <TabsContent value="monthly" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                    <div className="text-sm text-slate-400 mb-1">Ingresos del Mes</div>
                    <div className="text-2xl font-bold text-green-400">
                      {showBalance ? formatCurrency(monthlyIncome) : "****"}
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                    <div className="text-sm text-slate-400 mb-1">Gastos del Mes</div>
                    <div className="text-2xl font-bold text-red-400">
                      {showBalance ? formatCurrency(monthlyExpenses) : "****"}
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                    <div className="text-sm text-slate-400 mb-1">Balance Mensual</div>
                    <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? "text-cyan-400" : "text-red-400"}`}>
                      {showBalance ? formatCurrency(monthlyBalance) : "****"}
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                  <MonthlyChart transactions={thisMonthTransactions} showBalance={showBalance} />
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expensesByCategory.length > 0 ? (
                      expensesByCategory.map((cat, index) => (
                        <CategoryItem
                          key={cat.name}
                          name={cat.name}
                          amount={showBalance ? cat.amount : 0}
                          percentage={cat.percentage}
                          color={cat.color}
                          icon={cat.icon}
                          hidden={!showBalance}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-slate-400 py-8">No hay gastos por categorías aún</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Recent transactions */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center text-base">
            <Activity className="mr-2 h-5 w-5 text-blue-500" />
            {searchQuery ? `Resultados: "${searchQuery}"` : "Transacciones Recientes"}
          </CardTitle>
          <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
            {recentTransactions.length} {searchQuery ? "encontradas" : "transacciones"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={deleteTransaction}
                  showBalance={showBalance}
                />
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                {searchQuery
                  ? `No se encontraron transacciones que coincidan con "${searchQuery}"`
                  : "No hay transacciones aún. ¡Agrega tu primera transacción!"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Analysis Section Component
function AnalysisSection({
  transactions,
  showBalance,
  formatCurrency,
  expensesByCategory,
  thisMonthTransactions,
}: any) {
  // Calculate monthly data for the last 6 months
  const getMonthlyData = () => {
    const monthlyData = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthTransactions = transactions.filter((t: Transaction) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear()
      })

      const income = monthTransactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      const expenses = monthTransactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

      monthlyData.push({
        month: date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" }),
        income,
        expenses,
        balance: income - expenses,
      })
    }

    return monthlyData
  }

  const monthlyData = getMonthlyData()

  // Calculate weekly data for current month
  const getWeeklyData = () => {
    const weeklyData = []
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(startOfMonth)
      weekStart.setDate(startOfMonth.getDate() + week * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekTransactions = thisMonthTransactions.filter((t: Transaction) => {
        const transactionDate = new Date(t.date)
        return transactionDate >= weekStart && transactionDate <= weekEnd
      })

      const income = weekTransactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      const expenses = weekTransactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

      weeklyData.push({
        week: `Semana ${week + 1}`,
        income,
        expenses,
        balance: income - expenses,
      })
    }

    return weeklyData
  }

  const weeklyData = getWeeklyData()

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
            Análisis Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="bg-slate-800/50 p-1 mb-6">
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Tendencia Mensual
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Análisis Semanal
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Distribución por Categorías
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Últimos 6 Meses</h3>
                <div className="h-80 w-full">
                  <MonthlyTrendChart data={monthlyData} showBalance={showBalance} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-0">
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Análisis Semanal del Mes Actual</h3>
                <div className="h-80 w-full">
                  <WeeklyChart data={weeklyData} showBalance={showBalance} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Gráfico Circular - Gastos</h3>
                  <div className="h-64 w-full">
                    <DonutChart data={expensesByCategory} showBalance={showBalance} />
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Top Categorías</h3>
                  <div className="space-y-4">
                    {expensesByCategory.slice(0, 5).map((cat: any, index: number) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{
                              background: `linear-gradient(45deg, ${cat.color.split(" ")[1]}, ${cat.color.split(" ")[3]})`,
                            }}
                          ></div>
                          <span className="text-sm text-slate-300">
                            {cat.icon} {cat.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-200">
                            {showBalance ? formatCurrency(cat.amount) : "****"}
                          </div>
                          <div className="text-xs text-slate-400">{cat.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Section Component
function SettingsSection({ financialGoals, setFinancialGoals }: any) {
  const [tempGoals, setTempGoals] = useState(financialGoals)

  const handleSave = () => {
    setFinancialGoals(tempGoals)
  }

  const handleReset = () => {
    setTempGoals(financialGoals)
  }

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center">
            <Settings className="mr-2 h-5 w-5 text-cyan-500" />
            Configuración de Objetivos Financieros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-200 text-base font-medium">Objetivo de Ahorro Mensual</Label>
                <div className="mt-2">
                  <Input
                    type="number"
                    value={tempGoals.monthlyGoal}
                    onChange={(e) => setTempGoals({ ...tempGoals, monthlyGoal: Number(e.target.value) })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                    placeholder="1000"
                  />
                </div>
                <p className="text-sm text-slate-400 mt-1">Cantidad que deseas ahorrar cada mes</p>
              </div>

              <div>
                <Label className="text-slate-200 text-base font-medium">Fondo de Emergencia</Label>
                <div className="mt-2">
                  <Input
                    type="number"
                    value={tempGoals.emergencyGoal}
                    onChange={(e) => setTempGoals({ ...tempGoals, emergencyGoal: Number(e.target.value) })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                    placeholder="5000"
                  />
                </div>
                <p className="text-sm text-slate-400 mt-1">Meta para tu fondo de emergencia</p>
              </div>

              <div>
                <Label className="text-slate-200 text-base font-medium">Objetivo de Vacaciones</Label>
                <div className="mt-2">
                  <Input
                    type="number"
                    value={tempGoals.vacationGoal}
                    onChange={(e) => setTempGoals({ ...tempGoals, vacationGoal: Number(e.target.value) })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                    placeholder="2000"
                  />
                </div>
                <p className="text-sm text-slate-400 mt-1">Cantidad que quieres ahorrar para vacaciones</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-slate-700/50">
              <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                Guardar Cambios
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                Cancelar
              </Button>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 mt-6">
            <h4 className="text-slate-200 font-medium mb-3">Vista Previa de Objetivos</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ahorro Mensual:</span>
                <span className="text-cyan-400 font-semibold">${tempGoals.monthlyGoal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fondo de Emergencia:</span>
                <span className="text-green-400 font-semibold">${tempGoals.emergencyGoal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vacaciones:</span>
                <span className="text-purple-400 font-semibold">${tempGoals.vacationGoal}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Chart Components
function MonthlyTrendChart({ data, showBalance }: any) {
  if (!showBalance) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-slate-400">Datos ocultos</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-slate-400">No hay datos disponibles</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d: any) => Math.max(d.income, d.expenses, Math.abs(d.balance))))

  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-12 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">${Math.round(maxValue)}</div>
        <div className="text-xs text-slate-500">${Math.round(maxValue * 0.75)}</div>
        <div className="text-xs text-slate-500">${Math.round(maxValue * 0.5)}</div>
        <div className="text-xs text-slate-500">${Math.round(maxValue * 0.25)}</div>
        <div className="text-xs text-slate-500">$0</div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-8">
        {data.map((month: any, index: number) => {
          const incomeHeight = maxValue > 0 ? (month.income / maxValue) * 80 : 0
          const expenseHeight = maxValue > 0 ? (month.expenses / maxValue) * 80 : 0

          return (
            <div key={index} className="flex flex-col items-center space-y-2 group">
              <div className="flex space-x-1 items-end" style={{ height: "240px" }}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 group-hover:from-green-400 group-hover:to-green-300"
                    style={{ height: `${incomeHeight}%`, minHeight: month.income > 0 ? "4px" : "0px" }}
                    title={`Ingresos: $${month.income}`}
                  ></div>
                  <div className="text-xs text-green-400 mt-1">${Math.round(month.income)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm transition-all duration-300 group-hover:from-red-400 group-hover:to-red-300"
                    style={{ height: `${expenseHeight}%`, minHeight: month.expenses > 0 ? "4px" : "0px" }}
                    title={`Gastos: $${month.expenses}`}
                  ></div>
                  <div className="text-xs text-red-400 mt-1">${Math.round(month.expenses)}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">{month.month}</div>
              <div className={`text-xs font-semibold ${month.balance >= 0 ? "text-cyan-400" : "text-orange-400"}`}>
                {month.balance >= 0 ? "+" : ""}${Math.round(month.balance)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeeklyChart({ data, showBalance }: any) {
  if (!showBalance) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-slate-400">Datos ocultos</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-slate-400">No hay datos disponibles</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d: any) => Math.max(d.income, d.expenses)))

  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-12 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">${Math.round(maxValue)}</div>
        <div className="text-xs text-slate-500">${Math.round(maxValue * 0.75)}</div>
        <div className="text-xs text-slate-500">${Math.round(maxValue * 0.5)}</div>
        <div className="text-xs text-slate-500">${Math.round(maxValue * 0.25)}</div>
        <div className="text-xs text-slate-500">$0</div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-8">
        {data.map((week: any, index: number) => {
          const incomeHeight = maxValue > 0 ? (week.income / maxValue) * 80 : 0
          const expenseHeight = maxValue > 0 ? (week.expenses / maxValue) * 80 : 0

          return (
            <div key={index} className="flex flex-col items-center space-y-2 group">
              <div className="flex space-x-2 items-end" style={{ height: "240px" }}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 group-hover:from-green-400 group-hover:to-green-300"
                    style={{ height: `${incomeHeight}%`, minHeight: week.income > 0 ? "4px" : "0px" }}
                    title={`Ingresos: $${week.income}`}
                  ></div>
                  <div className="text-xs text-green-400 mt-1">${Math.round(week.income)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm transition-all duration-300 group-hover:from-red-400 group-hover:to-red-300"
                    style={{ height: `${expenseHeight}%`, minHeight: week.expenses > 0 ? "4px" : "0px" }}
                    title={`Gastos: $${week.expenses}`}
                  ></div>
                  <div className="text-xs text-red-400 mt-1">${Math.round(week.expenses)}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">{week.week}</div>
              <div className={`text-xs font-semibold ${week.balance >= 0 ? "text-cyan-400" : "text-orange-400"}`}>
                {week.balance >= 0 ? "+" : ""}${Math.round(week.balance)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DonutChart({ data, showBalance }: any) {
  if (!showBalance || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-slate-400">{!showBalance ? "Datos ocultos" : "No hay datos disponibles"}</div>
      </div>
    )
  }

  const total = data.reduce((sum: number, item: any) => sum + item.amount, 0)
  const centerX = 100
  const centerY = 100
  const radius = 60
  let currentAngle = -90 // Start from top

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform rotate-0">
          {/* Background circle */}
          <circle cx={centerX} cy={centerY} r={radius} fill="transparent" stroke="#1e293b" strokeWidth="20" />

          {/* Data segments */}
          {data.map((item: any, index: number) => {
            const percentage = (item.amount / total) * 100
            const angle = (percentage / 100) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle

            // Calculate path coordinates
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ")

            currentAngle += angle

            // Get colors from the gradient string
            const colorMatch = item.color.match(/from-(\w+)-\d+\s+to-(\w+)-\d+/)
            const color1 = colorMatch ? getColorValue(colorMatch[1]) : "#06b6d4"
            const color2 = colorMatch ? getColorValue(colorMatch[2]) : "#3b82f6"

            return (
              <g key={index}>
                <defs>
                  <linearGradient id={`donut-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="100%" stopColor={color2} />
                  </linearGradient>
                </defs>
                <path
                  d={pathData}
                  fill={`url(#donut-gradient-${index})`}
                  stroke="#0f172a"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-80"
                  title={`${item.name}: $${item.amount} (${percentage.toFixed(1)}%)`}
                />
              </g>
            )
          })}

          {/* Center circle */}
          <circle cx={centerX} cy={centerY} r="25" fill="#0f172a" stroke="#334155" strokeWidth="2" />

          {/* Center text */}
          <text x={centerX} y={centerY - 5} textAnchor="middle" className="fill-slate-300 text-xs font-semibold">
            Total
          </text>
          <text x={centerX} y={centerY + 8} textAnchor="middle" className="fill-cyan-400 text-xs font-bold">
            ${Math.round(total)}
          </text>
        </svg>

        {/* Legend */}
        <div className="absolute -right-32 top-0 space-y-2">
          {data.slice(0, 4).map((item: any, index: number) => {
            const colorMatch = item.color.match(/from-(\w+)-\d+\s+to-(\w+)-\d+/)
            const color = colorMatch ? getColorValue(colorMatch[1]) : "#06b6d4"

            return (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-xs text-slate-300">
                  {item.icon} {item.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getColorValue(colorName: string): string {
  switch (colorName) {
    case "red":
      return "#f43f5e"
    case "pink":
      return "#ec4899"
    case "orange":
      return "#f97316"
    case "yellow":
      return "#facc15"
    case "green":
      return "#16a34a"
    case "emerald":
      return "#059669"
    case "teal":
      return "#0d9488"
    case "cyan":
      return "#06b6d4"
    case "blue":
      return "#2563eb"
    case "indigo":
      return "#4f46e5"
    case "purple":
      return "#7c3aed"
    case "rose":
      return "#fb7185"
    case "gray":
      return "#6b7280"
    case "slate":
      return "#64748b"
    default:
      return "#06b6d4" // Default to cyan
  }
}
