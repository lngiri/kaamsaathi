import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function TermsPage() {
  return (
    <StaticInfoPage
      title="Terms of Service"
      description="Basic platform expectations for using KaamSathi as a customer or tasker."
      sections={[
        { heading: 'Using the Platform', body: 'Users should provide accurate booking details, contact information, and service descriptions when using KaamSathi.' },
        { heading: 'Tasker Responsibilities', body: 'Taskers should keep availability, pricing, and service information updated, and complete accepted tasks professionally.' },
        { heading: 'Payments and Refunds', body: 'Payments and refunds depend on task status, booking details, and the final resolution of any reported issue.' },
      ]}
    />
  )
}
