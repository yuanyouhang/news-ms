import React from 'react'
import { connect } from 'react-redux'
import PublishManageHOC from './PublishManageHOC'

function Published(props) {
  const username = props.token.username
  const Component = PublishManageHOC(2, username) // 获取已发布新闻

  return (
    <div>
      <Component />
    </div>
  )
}

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(Published)