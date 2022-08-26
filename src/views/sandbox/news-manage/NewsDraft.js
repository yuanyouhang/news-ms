import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, notification } from 'antd'
import axios from 'axios';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const { confirm } = Modal

function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()

  const {username} = props.token

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
    axios.delete(`/news/${item.id}`).then(res => {
      getNews()
    })
  }

  const getNews = () => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }

  useEffect(() => {
    getNews()
  }, [])

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1 // 1表示正在审核
    }).then(res => {
      navigate('/audit-manage/list')
      notification.success({
        message: `通知`,
        description: '已提交审核',
        placement: 'top'
      })
    })
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
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Link to={`/news-manage/preview/${item.id}`} >{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showConfirm(item)}
          />

          <Button shape="circle" icon={<EditOutlined />} onClick={() => {
            navigate(`/news-manage/update/${item.id}`)
          }} />

          <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
        </div>
      }
    },
  ];

  return (
    <div>
      <Table
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

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(NewsDraft)