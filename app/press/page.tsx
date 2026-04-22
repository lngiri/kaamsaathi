import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function PressPage() {
  return (
    <StaticInfoPage
      title="Press"
      description="Information for media, announcements, and company updates about KaamSathi."
      sections={[
        { heading: 'Company Overview', body: 'KaamSathi connects customers with nearby verified taskers for local household and personal services.' },
        { heading: 'Media Requests', body: 'For interviews, product information, or company quotes, contact the team through the Contact page.' },
        { heading: 'Announcements', body: 'Major platform launches, partnerships, and milestones can be published here as the product grows.' },
      ]}
    />
  )
}
