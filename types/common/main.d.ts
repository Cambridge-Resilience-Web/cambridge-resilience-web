import { Prisma } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./next-auth.d.ts" />

declare global {
  type Listing = {
    id: number
    title: string
    categoryId?: number
    webId?: number
    website?: string
    description: string
    email?: string
    facebook?: string
    instagram?: string
    twitter?: string
    notes?: string
    seekingVolunteers: boolean
    featured: boolean
    inactive: boolean
    slug: string
    image?: string
    tags?: Tag[]
    relations?: Listing[]
    relationOf?: Listing[]
    pending: boolean
    location: {
      latitude?: number
      longitude?: number
      description?: string
    }
  }

  type CategoryWithListings = Prisma.CategoryGetPayload<{
    include: { listings: true }
  }>

  type TagWithListings = Prisma.TagGetPayload<{
    include: { listings: true }
  }>

  type ListingNodeType = {
    id: number
    title: string
    description: string
    image: string
    website: string
    facebook: string
    twitter: string
    instagram: string
    seekingVolunteers: boolean
    featured: boolean
    category: {
      color: string
      label: string
    }
    slug: string
    tags: any[]
    label: string
    color: string
    group?: string
  }
}
