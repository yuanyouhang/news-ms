export const collapsedReducer = (prevState={isCollapsed: false}, action) => {
  // console.log(action)
  // 避免直接修改原状态
  const newState = {...prevState}

  const { type } = action
  switch(type) {
    case 'change_collapsed':
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return prevState
  }
}