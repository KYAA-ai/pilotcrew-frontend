import React from "react"
import { toast } from "sonner"

import { Plus } from "@/components/SimpleIcons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/api"

interface JobFormDialogProps {
  onJobCreated?: () => void
}

export function JobFormDialog({ onJobCreated }: JobFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Form state
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [features, setFeatures] = React.useState("") // multiline textarea, split by newline
  const [location, setLocation] = React.useState("")
  const [type, setType] = React.useState("CONTRACT")
  const [startDate, setStartDate] = React.useState("")
  const [durationValue, setDurationValue] = React.useState<number | "">("")
  const [durationUnit, setDurationUnit] = React.useState("MONTHS")
  const [salaryMin, setSalaryMin] = React.useState<number | "">("")
  const [salaryMax, setSalaryMax] = React.useState<number | "">("")
  const [currency, setCurrency] = React.useState("USD")

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setFeatures("")
    setLocation("")
    setType("CONTRACT")
    setStartDate("")
    setDurationValue("")
    setDurationUnit("MONTHS")
    setSalaryMin("")
    setSalaryMax("")
    setCurrency("USD")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!title || !description) {
      toast.error("Title and description are required")
      return
    }

    const payload = {
      title,
      description,
      features: features
        .split(/\n/)
        .map((feature) => feature.trim())
        .filter(Boolean),
      location,
      type,
      startDate,
      duration: {
        value: durationValue ? Number(durationValue) : undefined,
        unit: durationUnit,
      },
      salary: {
        min: salaryMin ? Number(salaryMin) : undefined,
        max: salaryMax ? Number(salaryMax) : undefined,
        currency,
      },
    }

    try {
      setSubmitting(true)
      await api.post("/jobs", payload)
      toast.success("Job posted successfully")
      setOpen(false)
      resetForm()
      onJobCreated?.()
    } catch (error) {
      console.error("Error creating job", error)
      toast.error("Failed to create job")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          <span className="hidden lg:inline">Post a Job</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a Job</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <textarea
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="TEMPORARY">Temporary</SelectItem>
                <SelectItem value="INTERN">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Duration</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                placeholder="Value"
                value={durationValue as number | undefined}
                onChange={(e) => setDurationValue(e.target.value ? Number(e.target.value) : "")}
                className="w-24"
              />
              <Select value={durationUnit} onValueChange={setDurationUnit}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAYS">Days</SelectItem>
                  <SelectItem value="WEEKS">Weeks</SelectItem>
                  <SelectItem value="MONTHS">Months</SelectItem>
                  <SelectItem value="YEARS">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Salary Range</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="number"
                min={0}
                placeholder="Min"
                value={salaryMin as number | undefined}
                onChange={(e) => setSalaryMin(e.target.value ? Number(e.target.value) : "")}
              />
              <Input
                type="number"
                min={0}
                placeholder="Max"
                value={salaryMax as number | undefined}
                onChange={(e) => setSalaryMax(e.target.value ? Number(e.target.value) : "")}
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 