import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'

const HomePage = () => {
  useEffect(() => {
    navigate(routes.records(), { replace: true })
  }, [])

  return null
}

export default HomePage
