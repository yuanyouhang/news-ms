import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Row, Col, Card, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import _ from 'lodash'

import * as echarts from 'echarts'
import { connect } from 'react-redux';

const { Meta } = Card;

function Home(props) {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  const [allList, setAllList] = useState([])

  const barRef = useRef()
  const pieRef = useRef()
  const [visible, setVisible] = useState(false)

  const { username, region, role: { roleName } } = props.token

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      // console.log(res.data)
      setViewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      // console.log(res.data)
      setStarList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      setAllList(res.data)
      drawBar(_.groupBy(res.data, item => item.category.title))
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const drawBar = (obj) => {
    var myChart = echarts.init(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      // console.log('resize')
      myChart.resize()
    }
  }

  const drawPie = () => {
    var currentList = allList.filter(item => item.author===username)// 当前登录用户
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = [];
    for(var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    // console.log(list)

    var myChart;
    if(!pieChart) {
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart)
    }
    else {
      myChart = pieChart
    }

    // 指定图表的配置项和数据
    const option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    option && myChart.setOption(option);
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`} >{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多" bordered={true}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`} >{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined onClick={async () => {
                // 确保两个操作同步
                await setVisible(true)
                drawPie()
              }} key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ marginLeft: '20px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer width={500} title="个人新闻分类" placement="right" onClose={() => setVisible(false)} visible={visible}>
        <div ref={pieRef} style={{
          height: "400px",
          width: '100%',
          marginTop: '30px'
        }}></div>
      </Drawer>

      <div ref={barRef} style={{
        height: "400px",
        width: '100%',
        marginTop: '30px'
      }}></div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(Home)