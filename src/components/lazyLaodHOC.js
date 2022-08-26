import React from 'react'
import { Spin } from 'antd';

export default function lazyLaodHOC(Element) {
  return function() {
    return (
      <React.Suspense fallback={<Spin delay={500}/>}>
        <Element />
      </React.Suspense>
    )
  }
}