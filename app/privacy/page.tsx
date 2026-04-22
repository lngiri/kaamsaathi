import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function PrivacyPage() {
  return (
    <StaticInfoPage
      title="Privacy Policy"
      description="A summary of how KaamSathi stores and uses account and booking information."
      sections={[
        { heading: 'Account Data', body: 'KaamSathi stores the contact and account details needed to authenticate users and connect them with the right services.' },
        { heading: 'Booking Data', body: 'Task details, addresses, and payment information are used to manage the booking lifecycle and provide support if needed.' },
        { heading: 'Your Control', body: 'Users can review their profile data through their account and contact support for help with corrections or account issues.' },
      ]}
    />
  )
}
