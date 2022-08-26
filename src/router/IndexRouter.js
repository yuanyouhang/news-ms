import React, { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'

import AuthComponent from '../components/AuthComponent'

import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import NotFound from '../views/404'

import axios from 'axios'
import lazyLaodHOC from '../components/lazyLaodHOC'
import { connect } from 'react-redux'

const Home = lazyLaodHOC(React.lazy(() => import('../views/sandbox/home/Home')))
const UserList = lazyLaodHOC(React.lazy(() => import('../views/sandbox/user-manage/UserList')))
const RoleList = lazyLaodHOC(React.lazy(() => import('../views/sandbox/right-manage/RoleList')))
const RightList = lazyLaodHOC(React.lazy(() => import('../views/sandbox/right-manage/RightList')))
const AddNews = lazyLaodHOC(React.lazy(() => import('../views/sandbox/news-manage/AddNews')))
const NewsDraft = lazyLaodHOC(React.lazy(() => import('../views/sandbox/news-manage/NewsDraft')))
const NewsCategory = lazyLaodHOC(React.lazy(() => import('../views/sandbox/news-manage/NewsCategory')))
const Audit = lazyLaodHOC(React.lazy(() => import('../views/sandbox/audit-manage/Audit')))
const AuditList = lazyLaodHOC(React.lazy(() => import('../views/sandbox/audit-manage/AuditList')))
const Unpublished = lazyLaodHOC(React.lazy(() => import('../views/sandbox/publish-manage/Unpublished')))
const Published = lazyLaodHOC(React.lazy(() => import('../views/sandbox/publish-manage/Published')))
const Sunset = lazyLaodHOC(React.lazy(() => import('../views/sandbox/publish-manage/Sunset')))
const NewsPreview = lazyLaodHOC(React.lazy(() => import('../views/sandbox/news-manage/NewsPreview')))
const NewsUpdate = lazyLaodHOC(React.lazy(() => import('../views/sandbox/news-manage/NewsUpdate')))

const LocalRouterMap = {
  '/home': <Home />,
  '/user-manage/list': <UserList />,
  '/right-manage/role/list': <RoleList />,
  '/right-manage/right/list': <RightList />,
  '/news-manage/add': <AddNews />,
  '/news-manage/draft': <NewsDraft />,
  '/news-manage/category': <NewsCategory />,
  '/news-manage/preview/:id': <NewsPreview />,
  '/news-manage/update/:id': <NewsUpdate />,
  '/audit-manage/audit': <Audit />,
  '/audit-manage/list': <AuditList />,
  '/publish-manage/unpublished': <Unpublished />,
  '/publish-manage/published': <Published />,
  '/publish-manage/sunset': <Sunset />
}


function IndexRouter(props) {
  const [allRouteList, setAllRouteList] = useState([])

  const getAllRouteList = () => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ])
    .then(res => {
      const levelOneRoutes = res[0].data
      const levelTwoRoutes = res[1].data
      setAllRouteList(levelOneRoutes.concat(levelTwoRoutes))
    })
  }

  useEffect(() => {
    getAllRouteList()
  }, [])

  // 获取当前登录用户权限列表
  const currentUser = props.token
  const rightsList = currentUser?.role.rights;
  console.log(rightsList)

  const authRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson) && rightsList?.includes(item.key)
  }

  return (
    <HashRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        {/* <Route path='/' element={<AuthComponent><NewsSandBox /></AuthComponent>}>
          <Route index element={<Navigate to='/home' />}></Route> */}
          {/* <Route index element={<Navigate to='/home' />}></Route>
          <Route path='home' element={<Home />}></Route>
          <Route path='user-manage/list' element={<UserList />}></Route>
          <Route path='right-manage/role/list' element={<RoleList />}></Route>
          <Route path='right-manage/right/list' element={<RightList />}></Route>
          <Route path='*' element={<NotFound />}></Route> */}

        <Route path='/' element={<AuthComponent><NewsSandBox /></AuthComponent>}>
          <Route index element={<Navigate to='/home' />}></Route>
          {
            allRouteList.map(item => {
              if(authRoute(item)) {// 校验当前路由合法性及登录用户是否有权访问，是则创建该路由
                return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} />
              }
              return null
            })
          }
          {
            allRouteList.length > 0 && <Route path='*' element={<NotFound />}></Route>
          }
        </Route>
      </Routes>
    </HashRouter>
  )
}

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(IndexRouter)