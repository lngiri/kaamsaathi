import TaskerProfileClient from './TaskerProfileClient'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: 't1' }, { id: 't2' }]
}

export default async function TaskerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <TaskerProfileClient id={id} />
}
