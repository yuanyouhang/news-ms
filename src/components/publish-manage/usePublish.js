import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'

function usePublish(type, username) {
  // const {username} = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState()

  const getDataSource = () => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }

  useEffect(() => {
    getDataSource()
  }, [])

  function handlePublish(id) {
    // console.log(id)
    axios.patch(`/news/${id}`, {
      publishState: 2
    }).then(res => {
      getDataSource()
      notification.success({
        message: `通知`,
        description: '操作成功！',
        placement: 'top'
      })
    })
  }

  function handleSunset(id) {
    // console.log(id)
    axios.patch(`/news/${id}`, {
      publishState: 3
    }).then(res => {
      getDataSource()
      notification.success({
        message: `通知`,
        description: '操作成功！',
        placement: 'top'
      })
    })
  }

  function handleDelete(id) {
    // console.log(id)
    axios.delete(`/news/${id}`).then(res => {
      getDataSource()
      notification.success({
        message: `通知`,
        description: '操作成功！',
        placement: 'top'
      })
    })
  }

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

export default usePublish