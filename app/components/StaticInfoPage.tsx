import { theme } from '@/lib/theme'

type Props = {
  title: string
  description: string
  sections: Array<{
    heading: string
    body: string
  }>
}

export default function StaticInfoPage({ title, description, sections }: Props) {
  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: '18px', padding: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px', color: theme.text }}>{title}</h1>
          <p style={{ fontSize: '15px', color: theme.muted, lineHeight: 1.7, marginBottom: '28px' }}>{description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: theme.secondary, marginBottom: '8px' }}>{section.heading}</h2>
                <p style={{ fontSize: '14px', color: theme.muted, lineHeight: 1.8 }}>{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
