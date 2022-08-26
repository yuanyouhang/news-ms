import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { connect } from 'react-redux'

import React from 'react';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header } = Layout;

function TopHeader(props) {
  // console.log(props)
  const {role:{roleName}, username} = JSON.parse(localStorage.getItem('token'))

  const useMenu = () => {
    const navigate = useNavigate()
    const logout = () => {
      localStorage.removeItem('token')
      navigate('/login')
    }
    return (
      <Menu
        items={[
          {
            key: '1',
            label: roleName
          },
          {
            key: '/logout',
            danger: true,
            label: '退出登录',
          },
        ]}
        onClick={({key}) => {
          if(key==='/logout') {
            logout()
          }
        }}
      />
    )
  }

  const changeCollapsed =() => {
    props.changeCollapsed()
  }

  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
      }}
    >
      {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => changeCollapsed(),
      })}

      <div style={{float: 'right'}}>
        <span>欢迎<b style={{color: 'red'}}>{username}</b>回来</span>
        <Dropdown overlay={useMenu()}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = (state) => {
  // console.log(state)
  const isCollapsed = state.collapsedReducer.isCollapsed
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)