import React, { useEffect, useRef, useState } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import axios from 'axios';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
import { connect } from 'react-redux';

const { confirm } = Modal


function RightList(props) {
  const [isDisabled, setIsDisabled] = useState(false)

  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false)
  const [editorVisible, setEditorVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [currentEditId, setCurrentEditId] = useState(0)

  const {roleId, region, username} = props.token

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
    axios.delete(`/users/${item.id}`).then(() => {
      getUsers()
    })
  }

  const roleMap = {
    superAdmin: 1,
    admin: 2,
    editor: 3
  }

  function filterUsers(users) {
    const filtered = users.filter(item => {
      return item.author===username || (item.region===region && item.roleId===roleMap.editor)
    })
    return filtered
  }

  const getUsers = () => {
    axios.get('/users?_expand=role').then(res => {
      const allUsers = res.data;
      const renderUsers = (roleMap.superAdmin === roleId) ? allUsers : filterUsers(allUsers)
      setUsers(renderUsers)
    })
  }

  const handleChange = (item) => {
    axios.patch(`/users/${item.id}`, {
      roleState: !item.roleState
    }).then(() => {
      getUsers()
    })
  }

  const showEditor = async (item) => {
    setCurrentEditId(item.id); // 保存当前编辑的用户id，用于后面点击 确定 之后发请求给后端
    if(item.roleId===1) {
      setIsDisabled(true)
    }
    else {
      setIsDisabled(false)
    }
    await setEditorVisible(true)
    updateForm.current?.setFieldsValue(item)
  }
  
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region==='' ? '全球' : region}</b>
      },
      filters: [
        ...regionList.map(item => {
          return {
            text: item.title,
            value: item.value
          }
        }),
        {
          text: '全球',
          value: ''
        }
      ],
      onFilter: (value, record) => record.region === value,
      // filterSearch: true,
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button
            type="primary"
            shape="circle"
            disabled={item.default}
            icon={<EditOutlined />}
            onClick={() => showEditor(item)}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            disabled={item.default}
            onClick={() => showConfirm(item)}
          />
        </div>
      }
    },
  ];

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/roles').then(res => {
      setRoleList(res.data)
    })
  }, [])

  const showAddForm = () => {
    setVisible(true)
  }

  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      // console.log(value)
      setVisible(false);
      addForm.current.resetFields();
      axios.post('/users', {
        ...value,
        roleState: true,
        default: false
      }).then(res => {
        getUsers()
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      // console.log(value)
      setEditorVisible(false);
      // updateForm.current.resetFields();
      axios.patch(`/users/${currentEditId}`, {
        ...value
      }).then(res => {
        getUsers()
      })
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => {
        showAddForm()
      }}>添加用户</Button>
      <Table
        dataSource={users}
        columns={columns} 
        pagination={{
          pageSize: 6,
        }}
        rowKey={item=>item.id}
      />

      <Modal
        visible={visible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm
          ref={addForm}
          regionList={regionList}
          roleList={roleList}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
        >
        </UserForm>
      </Modal>

      <Modal
        visible={editorVisible}
        title="编辑用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setEditorVisible(false)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm
          ref={updateForm}
          regionList={regionList}
          roleList={roleList}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
          isUpdate={true}
        >
        </UserForm>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(RightList)