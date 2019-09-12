export default (title: string) => {
  if (!title) {
    return false
  }
  return (
    title.toLowerCase().includes('beat') ||
    title.toLowerCase().includes('trap') ||
    title.toLowerCase().includes('instrumental')
  )
}
