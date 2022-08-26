import React from 'react'
import PublishManageHOC from './PublishManageHOC'

export default function Sunset() {
  const Component = PublishManageHOC(3) // 获取已下线新闻

  return (
    <div>
      <Component />
    </div>
  )
}