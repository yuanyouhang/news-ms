import { Table, Button, Tag, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()

  const getAuditList = () => {
    // 获取审核列表数据，条件：auditState不等于0（不在草稿箱），publishState小于等于1（未发布0或待发布1，刚创建新闻为0，新闻已审核为1）
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
    .then(res => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }

  useEffect(() => {
    getAuditList()
  }, [])

  // 撤销
  const handleRevert = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 0
    }).then(res => {
      getAuditList()
      notification.success({
        message: `通知`,
        description: '已撤销到草稿箱',
        placement: 'top'
      })
    })
  }

  // 发布
  const handlePublish = (id) => {
    axios.patch(`/news/${id}`, {
      publishState: 2, // 已发布
      publishTime: Date.now()
    }).then(res => {
      getAuditList()
      notification.success({
        message: `通知`,
        description: '已发布，您可前往【发布管理/已发布】中查看',
        placement: 'top'
      })
    })
  }

  const columns = [
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
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <span>{category.title}</span>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState===1 &&
            <Button
              danger
              onClick={() => handleRevert(item.id)}
            >
              撤销
            </Button>
          }

          {
            item.auditState===2 &&
            <Button
              type='primary'
              onClick={() => handlePublish(item.id)}
            >
              发布
            </Button>
          }

          {
            item.auditState===3 &&
            <Button
              danger
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`)
              }}
            >
              更新
            </Button>
          }
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
