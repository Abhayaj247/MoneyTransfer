"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type User = {
  _id: string
  username: string
  firstName: string
  lastName: string
}

interface SendMoneyDialogProps {
  isOpen: boolean
  onClose: () => void
  recipient: User | null
  onSuccess: () => void
}

export function SendMoneyDialog({ isOpen, onClose, recipient, onSuccess }: SendMoneyDialogProps) {
  const [transferAmount, setTransferAmount] = useState("")
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)

  // Reset state when dialog opens with new recipient
  useEffect(() => {
    if (isOpen && recipient) {
      setTransferAmount("")
      setTransferSuccess(false)
      setTransferError(null)
      setIsTransferring(false)
    }
  }, [isOpen, recipient])

  // Auto-close success alert after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (transferSuccess) {
      timer = setTimeout(() => {
        setTransferSuccess(false)
        onClose()
        onSuccess()
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [transferSuccess, onClose, onSuccess])

  // Handle money transfer
  const handleTransfer = async () => {
    if (!recipient) return

    const amount = Number(transferAmount)
    if (!amount || isNaN(amount) || amount <= 0) {
      setTransferError("Please enter a valid amount")
      return
    }

    setIsTransferring(true)
    setTransferError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setTransferError("Authentication required")
        setIsTransferring(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          to: recipient._id,
          amount,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setTransferError(result.message || "Failed to transfer money")
        setIsTransferring(false)
        return
      }

      setTransferSuccess(true)
      setTransferAmount("")
      setIsTransferring(false)
    } catch (error) {
      console.error("Transfer error:", error)
      setTransferError("An unexpected error occurred")
      setIsTransferring(false)
    }
  }

  if (!recipient) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Send Money</DialogTitle>
        </DialogHeader>

        <div className="p-2">
          {transferSuccess && (
            <Alert className="bg-green-50 border-green-200 mb-4">
              <AlertDescription className="text-green-800">Money transferred successfully!</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl text-primary-foreground">{recipient.firstName[0].toUpperCase()}</span>
            </div>
            <h3 className="text-2xl font-semibold">
              {recipient.firstName} {recipient.lastName}
            </h3>
          </div>

          <div className="space-y-4 pb-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="amount"
              >
                Amount (in Rs)
              </label>
              <input
                onChange={(e) => setTransferAmount(e.target.value)}
                value={transferAmount}
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2 outline-none"
                id="amount"
                placeholder="Enter amount"
                disabled={transferSuccess}
              />
            </div>

            {transferError && (
              <Alert variant="destructive">
                <AlertDescription>{transferError}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleTransfer}
              className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={isTransferring || transferSuccess || !transferAmount}
            >
              {isTransferring ? "Processing..." : "Initiate Transfer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
