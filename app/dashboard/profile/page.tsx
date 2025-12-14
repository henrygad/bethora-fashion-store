"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log("Saving profile:", formData)
    setIsEditing(false)
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-accent text-accent-foreground hover:bg-orange-600">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Picture */}
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-xl font-bold text-accent-foreground">
              JD
            </div>
            {isEditing && <Button variant="outline">Change Photo</Button>}
          </div>
        </div>

        {/* Personal Information */}
        <div className="border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              {isEditing ? (
                <Input name="firstName" value={formData.firstName} onChange={handleInputChange} />
              ) : (
                <p className="px-3 py-2 text-muted-foreground">{formData.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              {isEditing ? (
                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} />
              ) : (
                <p className="px-3 py-2 text-muted-foreground">{formData.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            ) : (
              <p className="px-3 py-2 text-muted-foreground">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            ) : (
              <p className="px-3 py-2 text-muted-foreground">{formData.phone}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-orange-600">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Security</h2>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Last password change: 3 months ago</p>
            <Button variant="outline">Change Password</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
