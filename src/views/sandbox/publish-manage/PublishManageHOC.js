import { Button } from 'antd'
import React from 'react'
import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'

export default function PublishManageHOC(publishState) {
  const {dataSource, handlePublish, handleSunset, handleDelete} = usePublish(publishState) // 获取已发布新闻
  let handler;

  switch(publishState) {
    case 1:
      handler = (id) => <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>
      break;
    case 2:
      handler = (id) => <Button danger onClick={() => handleSunset(id)}>下线</Button>
      break;
    case 3:
      handler = (id) => <Button danger onClick={() => handleDelete(id)}>删除</Button>
      break;
    default:
      break
  }

  return function() {
    return (
      <NewsPublish dataSource={dataSource} button={handler}></NewsPublish>
    )
  }
}
