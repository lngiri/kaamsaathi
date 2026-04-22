import StaticInfoPage from '@/app/components/StaticInfoPage'

export default function CareersPage() {
  return (
    <StaticInfoPage
      title="Careers"
      description="KaamSathi is growing and looking for people who want to improve local services in Nepal."
      sections={[
        { heading: 'Why Join', body: 'You will help build tools that make booking trusted local help simpler for households and professionals.' },
        { heading: 'Who We Hire', body: 'We look for thoughtful builders, operators, and support teammates who care about real-world service quality.' },
        { heading: 'How to Apply', body: 'Share your background and the role you are interested in through the contact address on the Contact page.' },
      ]}
    />
  )
}
