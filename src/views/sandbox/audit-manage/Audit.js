import { Button, notification, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

function Audit(props) {
  const [news, setNews] = useState([])

  const {roleId, region, username} = props.token

  const roleMap = {
    superAdmin: 1,
    admin: 2,
    editor: 3
  }

  function filterNews(news) {
    const filtered = news.filter(item => {
      return item.author===username || (item.region===region && item.roleId===roleMap.editor)
    })
    return filtered
  }

  const getNewsList = () => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const news = res.data;
      const renderNews = (roleMap.superAdmin === roleId) ? news : filterNews(news)
      setNews(renderNews)
    })
  }

  useEffect(() => {
    getNewsList()
  }, [])

  const handleAudit = (id, auditState, publishState) => {
    axios.patch(`/news/${id}`, {
      auditState,
      publishState
    }).then(res => {
      getNewsList()
      notification.success({
        message: `通知`,
        description: '操作成功！',
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
      title: '操作',
      render: (item) => {
        return <div>
            <Button
              type='primary'
              onClick={() => handleAudit(item.id, 2, 1)}
            >
              通过
            </Button>

            <Button
              danger
              onClick={() => handleAudit(item.id, 3, 0)}
            >
              驳回
            </Button>
        </div>
      }
    },
  ];

  return (
    <div>
      <Table
        dataSource={news}
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

export default connect(mapStateToProps)(Audit)