import React from 'react'
import PublishManageHOC from './PublishManageHOC'

export default function Unpublished() {
  const Component = PublishManageHOC(1) // 获取待发布新闻

  return (
    <div>
      <Component />
    </div>
  )
}