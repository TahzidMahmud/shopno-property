import React from 'react'
import Hero from '../components/Hero'
import SearchForm from '../components/SearchForm'
import WhyChooseUs from '../components/WhyChooseUs'
import PropertyGrid from '../components/PropertyGrid'
import WhyInvest from '../components/WhyInvest'
import LandShareGrid from '../components/LandShareGrid'
import BlogSection from '../components/BlogSection'
import ExploreByProperty from '../components/ExploreByProperty'
import CallToAction from '../components/CallToAction'
import PartnersSection from '../components/PartnersSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <SearchForm />
      <WhyChooseUs />
      <PropertyGrid />
      <WhyInvest />
      <LandShareGrid />
      <BlogSection />
      <ExploreByProperty />
      <CallToAction />
      <PartnersSection />
      <Footer />
    </>
  )
}
