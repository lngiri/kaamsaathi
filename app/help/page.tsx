import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function HelpPage() {
  return (
    <StaticInfoPage
      title="Help Center"
      description="Answers to common questions about bookings, payments, and using KaamSathi."
      sections={[
        { heading: 'Booking Help', body: 'Browse taskers, compare profiles, and submit a booking request with your address, time, and task details. You will receive updates in your dashboard after confirmation.' },
        { heading: 'Account Help', body: 'Sign in using phone OTP or email magic link. If you are joining as a tasker, complete your tasker profile before accepting work.' },
        { heading: 'Payments & Support', body: 'Payments are recorded during booking and released after task completion. If something looks wrong, contact support from the Contact page so the team can review it.' },
      ]}
    />
  )
}
