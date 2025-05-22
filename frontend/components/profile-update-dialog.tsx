"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Import the existing schema from your auth file
import { updateUserSchema } from "@/lib/validations/auth"

type User = {
  _id: string
  username: string
  firstName: string
  lastName: string
}

// Use the existing schema type
type ProfileUpdateFormValues = z.infer<typeof updateUserSchema>

interface ProfileUpdateDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSuccess: () => void
}

export function ProfileUpdateDialog({ isOpen, onClose, user, onSuccess }: ProfileUpdateDialogProps) {
  const router = useRouter()
  const [updateStatus, setUpdateStatus] = useState<{
    status: "idle" | "loading" | "success" | "error"
    message: string
  }>({
    status: "idle",
    message: "",
  })

  // Profile update form using your existing schema
  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        firstName: "",
        lastName: "",
        password: "",
      })
      setUpdateStatus({
        status: "idle",
        message: "",
      })
    }
  }, [isOpen, user, form])

  const onProfileUpdate = async (data: ProfileUpdateFormValues) => {
    // Filter out empty fields
    const updateData: Partial<ProfileUpdateFormValues> = {}
    if (data.firstName) updateData.firstName = data.firstName
    if (data.lastName) updateData.lastName = data.lastName
    if (data.password) updateData.password = data.password

    // If no fields to update, show message
    if (Object.keys(updateData).length === 0) {
      setUpdateStatus({
        status: "error",
        message: "No changes to update",
      })
      return
    }

    try {
      setUpdateStatus({
        status: "loading",
        message: "Updating profile...",
      })

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        setUpdateStatus({
          status: "error",
          message: result.message || "Failed to update profile",
        })
        return
      }

      setUpdateStatus({
        status: "success",
        message: "Profile updated successfully!",
      })

      // Close dialog after a short delay on success
      setTimeout(() => {
        onClose()
        onSuccess()
        form.reset()
        setUpdateStatus({
          status: "idle",
          message: "",
        })
      }, 2000)
    } catch (error) {
      console.error("Profile update error:", error)
      setUpdateStatus({
        status: "error",
        message: "An unexpected error occurred",
      })
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Leave fields blank to keep current values.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onProfileUpdate)} className="space-y-4 py-2">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-lg">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-muted-foreground">@{user.username}</div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder={user.firstName || "First Name"} {...field} />
                  </FormControl>
                  <FormDescription>Leave blank to keep current first name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder={user.lastName || "Last Name"} {...field} />
                  </FormControl>
                  <FormDescription>Leave blank to keep current last name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormDescription>Leave blank to keep current password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {updateStatus.status !== "idle" && (
              <Alert
                variant={updateStatus.status === "error" ? "destructive" : "default"}
                className={updateStatus.status === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
              >
                <AlertDescription>{updateStatus.message}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose} disabled={updateStatus.status === "loading"}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateStatus.status === "loading" || updateStatus.status === "success"}>
                {updateStatus.status === "loading" ? "Updating..." : "Update Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
