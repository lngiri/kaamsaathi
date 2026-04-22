import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function SafetyPage() {
  return (
    <StaticInfoPage
      title="Safety"
      description="How KaamSathi protects customers and taskers during every booking."
      sections={[
        { heading: 'Verified Profiles', body: 'Taskers are expected to complete profile verification and maintain accurate service information so customers can book confidently.' },
        { heading: 'Secure Payments', body: 'Booking and payment records are tracked in the platform so each task has a clear status from request to completion.' },
        { heading: 'Issue Resolution', body: 'If a task does not go as expected, contact support quickly with the booking reference and a short description of the issue.' },
      ]}
    />
  )
}
