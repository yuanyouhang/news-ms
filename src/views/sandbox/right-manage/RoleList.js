import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { EditOutlined,DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])// 角色表格数据
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState()
  const [currentId, setCurrentId] = useState(0)

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
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      // axios.delete(`/roles/${item.id}`)
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            setIsModalVisible(true)
            setCurrentRights(item.rights)
            setCurrentId(item.id)
          }} />

          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showConfirm(item)}
          />
        </div>
      }
    },
  ]

  const getRoles = () => {
    axios.get('/roles').then(res => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }

  useEffect(() => {
    getRoles()
  }, [])

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])

  const handleOk = () => {
    setIsModalVisible(false)
    setDataSource(dataSource.map(item => {
      if(item.id===currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    // 修改后端数据
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    }).then(res => {
      getRoles()
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleCheck = (checkedKeys) => {
    // console.log(checkedKeys)
    setCurrentRights(checkedKeys.checked)
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item)=>item.id}
      >
      </Table>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={handleCheck}
          checkStrictly
        />
      </Modal>
    </div>
  )
}
