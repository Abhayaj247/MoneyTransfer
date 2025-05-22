"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, LogOut, Send, CreditCard, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

// Import the separated components
import { SendMoneyDialog } from "@/components/send-money-dialog"
import { ProfileUpdateDialog } from "@/components/profile-update-dialog"

type User = {
  _id: string
  username: string
  firstName: string
  lastName: string
}

type CurrentUser = User & {
  balance?: number
}

export default function Dashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [filter, setFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Dialog states
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [sendMoneyDialogOpen, setSendMoneyDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Fetch current user data
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/signin")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`, {
          headers: {
            Authorization: token,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            router.push("/signin")
            return
          }
          throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        setCurrentUser(userData)
      } catch (error) {
        console.error("Error fetching current user:", error)
        setError("Failed to load user data")
      }
    }

    fetchCurrentUser()
  }, [router])

  // Fetch balance
  useEffect(() => {
    async function fetchBalance() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/balance`, {
          headers: {
            Authorization: token,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch balance")
        }

        const data = await response.json()
        setBalance(data.balance)
      } catch (error) {
        console.error("Error fetching balance:", error)
        setError("Failed to load balance")
      } finally {
        setRefreshing(false)
      }
    }

    fetchBalance()
  }, [refreshing])

  // Fetch users with search
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/bulk?filter=${filter}`)

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data.user || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [filter])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const handleRefresh = () => {
    setRefreshing(true)
  }

  // Open profile dialog
  const openProfileDialog = useCallback(() => {
    setProfileDialogOpen(true)
  }, [])

  // Handle profile update success
  const handleProfileUpdateSuccess = useCallback(async () => {
    // Refresh user data after successful update
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`, {
        headers: {
          Authorization: token,
        },
      })

      if (response.ok) {
        const updatedUserData = await response.json()
        setCurrentUser(updatedUserData)
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }
  }, [])

  // Open send money dialog
  const openSendMoneyDialog = useCallback((user: User) => {
    setSelectedUser(user)
    setSendMoneyDialogOpen(true)
  }, [])

  // Handle successful money transfer
  const handleTransferSuccess = useCallback(() => {
    setRefreshing(true)
  }, [])

  const closeProfileDialog = useCallback(() => {
    setProfileDialogOpen(false)
  }, [])

  const closeSendMoneyDialog = useCallback(() => {
    setSendMoneyDialogOpen(false)
  }, [])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className=" flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MoneyTransfer</span>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && <div className="text-sm font-medium">Welcome, {currentUser.firstName.toUpperCase()}</div>}
            <ThemeToggle />
            <button
              onClick={openProfileDialog}
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="cursor-pointer">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className=" px-4 py-6">
        {/* Balance Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Your balance</CardTitle>
              <CardDescription>Current available balance in your account</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{balance !== null ? `Rs ${balance.toFixed(2)}` : "Loading..."}</div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {isLoading ? (
  <div className="text-center py-4">Loading users...</div>
) : users.filter((user) => user._id !== currentUser?._id).length === 0 ? (
  <div className="text-center py-4 text-muted-foreground">No users found</div>
) : (
  <div className="space-y-2">
    {users
      .filter((user) => user._id !== currentUser?._id)
      .map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-secondary">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-muted-foreground">@{user.username}</div>
            </div>
          </div>
          <Button size="sm" onClick={() => openSendMoneyDialog(user)} className="cursor-pointer">
            <Send className="h-4 w-4 mr-2" />
            Send Money
          </Button>
        </div>
      ))}
  </div>
)}

        </div>
      </main>

      {/* Profile Update Dialog Component */}
      <ProfileUpdateDialog
        isOpen={profileDialogOpen}
        onClose={closeProfileDialog}
        user={currentUser}
        onSuccess={handleProfileUpdateSuccess}
      />

      {/* Send Money Dialog Component */}
      <SendMoneyDialog
        isOpen={sendMoneyDialogOpen}
        onClose={closeSendMoneyDialog}
        recipient={selectedUser}
        onSuccess={handleTransferSuccess}
      />
    </div>
  )
}
