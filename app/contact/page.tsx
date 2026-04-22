import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function ContactPage() {
  return (
    <StaticInfoPage
      title="Contact Us"
      description="Reach the KaamSathi team for support, partnerships, or platform feedback."
      sections={[
        { heading: 'Customer Support', body: 'For booking issues or account help, contact hello@kaamsathi.com.np with your booking reference and a short summary.' },
        { heading: 'Tasker Support', body: 'Taskers can contact support for onboarding, profile setup, and payout questions.' },
        { heading: 'Office', body: 'KaamSathi is based in Kathmandu, Nepal and supports customers and taskers across major cities.' },
      ]}
    />
  )
}
