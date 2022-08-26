export const userReducer = (prevState={token: null}, action) => {
  // 避免直接修改原状态
  // const newState = {...prevState}

  const { type, payload } = action
  switch(type) {
    case 'add_token':
      const newState = Object.assign({}, {token: payload})
      return newState
    case 'remove_token':
      return { token: null }
    default:
      return prevState
  }
}