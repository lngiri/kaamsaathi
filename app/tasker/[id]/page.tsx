import TaskerProfileClient from './TaskerProfileClient'

export const dynamicParams = false

export function generateStaticParams() {
  // Generate static pages for all known tasker IDs
  // From browse page: 't1', 't2'
  // From admin page: 1, 2, 3, 4
  const taskerIds = [
    't1', 't2', // String IDs from browse page
    '1', '2', '3', '4' // Numeric IDs from admin page (as strings for URL)
  ]
  
  return taskerIds.map(id => ({ id }))
}

export default async function TaskerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <TaskerProfileClient id={id} />
}
