import React from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import './NewsSandBox.css'
import { Layout, Spin } from 'antd'
import { connect } from 'react-redux'
const { Content } = Layout;

function NewsSandBox(props) {
  return (
    <Layout>
      <SideMenu></SideMenu>

      <Layout className='site-layout'>
        <TopHeader></TopHeader>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 500,
            overflow: 'auto'
          }}
        >
          <Spin tip="Loading..." spinning={props.isLoading} delay={300}>
            <Outlet></Outlet>
          </Spin>
        </Content>

      </Layout>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const isLoading = state.loadingReducer.isLoading
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(NewsSandBox)