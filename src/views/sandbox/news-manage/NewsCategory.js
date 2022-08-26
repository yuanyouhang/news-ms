import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Table, Modal, Form, Input } from 'antd'
import axios from 'axios';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import './NewsCategory.css'

const EditableContext = React.createContext(null);

const { confirm } = Modal

export default function NewsCategory() {

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
    axios.delete(`/categories/${item.id}`)
  }

  const getCategories = () => {
    axios.get('/categories').then(res => {
      setDataSource(res.data)
    })
  }

  useEffect(() => {
    getCategories()
  }, [])
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
        return (
        <div>
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showConfirm(item)}/>
        </div>
        )
      }
    },
  ];

  const handleSave = (row) => {
    // console.log(row)
    const { title, value, id } = row
    axios.patch(`/categories/${id}`, {
      title,
      value
    }).then(res => {
      getCategories()
    })
  };

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <div>
      <Table
        rowClassName={() => 'editable-row'}
        components={components}
        dataSource={dataSource}
        columns={columns} 
        pagination={{
          pageSize: 6,
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}