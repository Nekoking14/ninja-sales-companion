import { useState, useEffect } from 'react'
import { FRAMEWORKS } from '../data/frameworks.js'
import { api } from '../api/index.js'

export function useFrameworks () {
  const [frameworks, setFrameworks] = useState(FRAMEWORKS)

  useEffect(() => {
    api.settings.list('fw_').then(settings => {
      if (!settings.length) return
      setFrameworks(FRAMEWORKS.map(fw => {
        if (fw.tabs) {
          const tabs = fw.tabs.map((tab, i) => {
            const custom = settings.find(s => s.key === `fw_${fw.id}_${i}`)
            return custom ? { ...tab, items: custom.value } : tab
          })
          return { ...fw, tabs }
        } else {
          const custom = settings.find(s => s.key === `fw_${fw.id}_flat`)
          return custom ? { ...fw, items: custom.value } : fw
        }
      }))
    }).catch(() => {})
  }, [])

  return frameworks
}
