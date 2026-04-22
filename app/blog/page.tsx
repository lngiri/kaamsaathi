import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function BlogPage() {
  return (
    <StaticInfoPage
      title="KaamSathi Blog"
      description="Stories, tips, and product updates from the KaamSathi team."
      sections={[
        { heading: 'Service Tips', body: 'We share simple advice for common home-service needs like cleaning, repairs, and safe booking practices.' },
        { heading: 'Tasker Stories', body: 'We highlight how local professionals are growing their income and building trust with customers.' },
        { heading: 'Product Updates', body: 'Important changes to booking, referrals, dashboards, and new service categories will be announced here.' },
      ]}
    />
  )
}
