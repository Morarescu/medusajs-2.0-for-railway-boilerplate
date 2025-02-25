import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import FeaturedProducts from "@modules/home/components/featured-products"
import StoreTemplate from "@modules/store/templates"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function Home(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { countryCode } = params
  const { sortBy = "created_at", page = "1" } = searchParams

  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-0">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <div className="py-12">
        <StoreTemplate sortBy={sortBy} page={page} countryCode={countryCode} />
      </div>
    </>
  )
}
