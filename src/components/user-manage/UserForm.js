import React, { forwardRef } from 'react'
import { Form, Input, Select } from 'antd'


const { Option } = Select;

const UserForm = forwardRef((props,ref) => {
  // const [isDisabled, setIsDisabled] = useState(false)
  const {roleId, region} = JSON.parse(localStorage.getItem('token'))
  const roleMap = {
    superAdmin: 1,
    admin: 2,
    editor: 3
  }

  // 检查是否禁用某个区域选项
  const checkRegionDisabled = (item)=> {
    if (props.isUpdate) {// 如果是 编辑 表单时
      if(roleId===roleMap.superAdmin) {
        return false
      }
      else {
        return true
      }
    }
    else {// 如果是 添加 表单时
      if(roleId===roleMap.superAdmin) {
        return false
      }
      else {
        return item.value!==region
      }
    }
  }

  // 检查是否禁用某个角色选项
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {// 如果是 编辑 表单时
      if(roleId===roleMap.superAdmin) {
        return false
      }
      else {
        return true
      }
    }
    else {// 如果是 添加 表单时
      if(roleId===roleMap.superAdmin) {
        return false
      }
      else {
        return item.id!==roleMap.editor // 如果不是超级管理员，则添加用户时角色只能选择‘区域编辑’
      }
    }
  }

  return (
    <Form
      layout="vertical"
      ref={ref}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={props.isDisabled ? [] : [{
            required: true,
            message: 'Please input the title of collection!',
          }]}
      >
        <Select disabled={props.isDisabled} style={{width: 120}}>
          {
            props.regionList.map(item =>
              <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
            )
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select style={{width: 120}} onChange={(value) => {
          // console.log(value)
          if(value===1) {
            // 角色是超级管理员时禁用 区域 选择框，并设置为空字符串
            props.setIsDisabled(true)
            ref.current.setFieldsValue({
              region: ''
            })
          }
          else {
            props.setIsDisabled(false)
          }
        }}>
          {
            props.roleList.map(item =>
              <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
            )
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm