export const loadingReducer = (prevState={isLoading: false}, action) => {
  // 避免直接修改原状态
  const newState = {...prevState}

  const { type, payload } = action
  switch(type) {
    case 'change_loading':
      newState.isLoading = payload
      return newState
    default:
      return prevState
  }
}