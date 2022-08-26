import React from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AuthComponent({children, token}) {
  return token ? children : <Navigate to='/login' />
}

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(AuthComponent)