import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function RightList() {

  const [dataSource, setDataSource] = useState([])

  const showConfirm = (item) => {
    confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        confirmDelete(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const confirmDelete = (item) => {
    // console.log(item)
    if(item.grade===1) {
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      // axios.delete(`/rights/${item.id}`)
    }
    else {
      let list = dataSource.filter(data=>data.id===item.rightId)
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      setDataSource([...dataSource])
      // axios.delete(`/children/${item.id}`)
    }
  }

  const getRights = () => {
    axios.get('/rights?_embed=children').then(res => {
      const data = res.data
      // console.log(data)
      data.forEach(item => {
        if(item.children?.length===0){
          item.children=''
        }
      })
      // console.log(data)
      setDataSource(data)
    })
  }

  const changeSwitch = (item) => {
    // console.log(item)
    item.pagepermisson = item.pagepermisson===1?0:1
    setDataSource([...dataSource])
    if(item.grade===1) {
      axios.patch(`/rights/${item.id}`,{
        pagepermisson: item.pagepermisson
      })
    }
    else {
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{textAlign: 'center'}}><Switch checked={item.pagepermisson} onChange={()=>changeSwitch(item)}></Switch></div>} title="配置项" trigger={item.pagepermisson===undefined ? '' : "click"}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined} />
          </Popover>

          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showConfirm(item)}/>
        </div>
      }
    },
  ];

  useEffect(() => {
    getRights()
  }, [])

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns} 
        pagination={{
          pageSize: 6,
        }}
      />
    </div>
  )
}
