"use client"
import React, { useState, useEffect } from "react"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import Loading from "../components/layout/Loading"
import TestFilter from "../components/opportunities/TestFilter"

interface Opportunity {
  id: string
  contactEmail: string
  projectName: string
  types: Array<{ id: number; name: string }>
  categories: Array<{ id: number; name: string }>
  organization: {
    id: number
    name: string
    description: string
    logoUrl: string
    bannerUrl: string
    activeEventsCount: number
    websiteUrl: string
    contactEmail: string
    slug: string
    verified: boolean
  }
  projectDescription: string
  startDateTime: string
  endDateTime: string
  slug: string
  country: string
  region: string
  city: string
  adress: string
  projectLanguage: string
  banner_url: string
  participationFeeType: number
  participationFee: number
  views: number | null
  registrationLink: string
  registrationDeadline: string
  infoPack: string
  timestamp: string
  isSaved?: boolean
  privateOpp?: boolean
}

interface Filters {
  types: string[]
  categories: string[]
  startDate: string[]
  locations: string[]
  languages: string[]
}

interface ActiveFilters {
  types: string[]
  categories: string[]
  startDate: Date[]
  locations: string[]
  languages: string[]
}

export default function ClientPart() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [filters, setFilters] = useState<Filters>({
    types: [],
    categories: [],
    startDate: [],
    locations: [],
    languages: []
  })
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    types: [],
    categories: [],
    startDate: [],
    locations: [],
    languages: []
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/opportunity/all`)
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data: Opportunity[] = await response.json()
        const trimmedData = data.map(opp => ({
          ...opp,
          city: opp.city.trim()
        }))
        
        setOpportunities(trimmedData)
        setFilteredOpportunities(trimmedData)

        const extractedFilters: Filters = {
          types: Array.from(new Set(data.flatMap(opp => opp.types.map(type => type.name)))),
          categories: Array.from(new Set(data.flatMap(opp => opp.categories.map(cat => cat.name)))),
          startDate: Array.from(new Set(data.map(opp => opp.startDateTime))),
          locations: Array.from(new Set(data.map(opp => opp.city.trimEnd()))),
          languages: Array.from(new Set(data.map(opp => opp.projectLanguage)))
        }
        setFilters(extractedFilters)

        setLoading(false)
      } catch (error) {
        setError((error as Error).message)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    filterOpportunities()
  }, [activeFilters, opportunities])
  
  const filterOpportunities = () => {
    let filtered = [...opportunities]
  
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter(opp =>
        opp.types.some(type => activeFilters.types.includes(type.name))
      )
    }
  
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(opp =>
        opp.categories.some(cat => activeFilters.categories.includes(cat.name))
      )
    }
  
    if (activeFilters.locations.length > 0) {
      filtered = filtered.filter(opp => {
        return activeFilters.locations.some(location => {
          if (!location.includes('|')) {
            return opp.country === location
          } 
          else {
            const [city, country] = location.split('|')
            return opp.city.trim() === city.trim() && opp.country === country
          }
        })
      })
    }
  
    if (activeFilters.languages.length > 0) {
      filtered = filtered.filter(opp => 
        activeFilters.languages.includes(opp.projectLanguage)
      )
    }
  
    if (activeFilters.startDate.length > 0) {
      filtered = filtered.filter(opp => {
        const oppDate = new Date(opp.startDateTime)
        return activeFilters.startDate.some(filterDate => 
          oppDate.toDateString() === filterDate.toDateString()
        )
      })
    }
  
    filtered.sort((a, b) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    )
  
    setFilteredOpportunities(filtered)
  }

  const handleFilterUpdate = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters)
  }

  if (loading) return <div className="text-center"><Loading /></div>
  if (error) return <div className="text-center text-red-500">Error: {error}</div>

  return (
    <div className="bg-white">
      <Navbar />
      <TestFilter
        filters={filters}
        activeFilters={activeFilters}
        onFilterUpdate={handleFilterUpdate}
        opportunities={filteredOpportunities}
      />
      <Footer />
    </div>
  )
}