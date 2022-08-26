import React from 'react'
import PublishManageHOC from './PublishManageHOC'

export default function Published() {
  const Component = PublishManageHOC(2) // 获取已发布新闻

  return (
    <div>
      <Component />
    </div>
  )
}