export default (birthdate: Date) => {
  const today = new Date()
  const differenceInMilliseconds = today.getTime() - birthdate.getTime()
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365))
}
