import './index.css'

import axios from 'axios'

import { AppstoreOutlined } from '@ant-design/icons';

import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
const { Sider } = Layout;

function SideMenu(props) {
  const [menu, setMenu] = useState([])

  const navigate = useNavigate()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState(['/'+location.pathname.split('/')[1]])

  // 获取当前登录用户权限列表
  const currentUser = props.token
  const rightsList = currentUser.role.rights;

  // 根据当前用户权限过滤侧边栏
  const checkPagePermission = (item) => {
    return item.pagepermisson === 1 && rightsList.includes(item.key)
  }

  const getItems = (data) => {
    const items = data.map(item => {
      if(item.children && checkPagePermission(item)) {
        return {
          key: item.key,
          label: item.title,
          children: item.children.length===0 ? '' : getItems(item.children),
          icon: <AppstoreOutlined />
        }
      }
      else if(!item.children && checkPagePermission(item)) {
        return {
          key: item.key,
          label: item.title,
        }
      }
      return null
    })
    return items
  }

  useEffect(() => {
    setOpenKeys(['/'+location.pathname.split('/')[1]])
  }, [location.pathname])

  useEffect(() => {
    // console.log(location)
    axios.get('/rights?_embed=children').then(res => {
      setMenu(res.data)
    })
  }, [])

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display:'flex',height: '100%',flexDirection:'column'}}>
        <div className='logo'>全球新闻发布管理系统</div>
        <div style={{flex:1, overflow:'auto'}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={openKeys}
            selectedKeys={[location.pathname]}
            onClick={({key}) => {
              navigate(key)
            }}
            items={getItems(menu)}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = (state) => {
  // console.log(state)
  const isCollapsed = state.collapsedReducer.isCollapsed
  const token = state.userReducer.token
  return {
    isCollapsed,
    token
  }
}

export default connect(mapStateToProps)(SideMenu)