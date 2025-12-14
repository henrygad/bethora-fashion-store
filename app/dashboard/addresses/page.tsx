"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1",
    name: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    isDefault: true,
  },
  {
    id: "2",
    name: "Office",
    street: "456 Park Ave",
    city: "New York",
    state: "NY",
    zip: "10022",
    country: "USA",
    isDefault: false,
  },
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground">Manage your delivery addresses</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-accent text-accent-foreground hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-border rounded-lg p-6 mb-6 space-y-4">
          <h2 className="text-lg font-semibold">Add New Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Address Name (e.g., Home)" />
            <Input placeholder="Street Address" />
            <Input placeholder="City" />
            <Input placeholder="State" />
            <Input placeholder="Zip Code" />
            <Input placeholder="Country" />
          </div>
          <div className="flex gap-2">
            <Button className="bg-accent text-accent-foreground hover:bg-orange-600">Save Address</Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{address.name}</h3>
                {address.isDefault && (
                  <span className="inline-block text-xs bg-accent/20 text-accent px-2 py-1 rounded mt-1">Default</span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {address.street}
              <br />
              {address.city}, {address.state} {address.zip}
              <br />
              {address.country}
            </p>
            {!address.isDefault && (
              <Button size="sm" variant="outline" className="mt-4 w-full bg-transparent">
                Set as Default
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
