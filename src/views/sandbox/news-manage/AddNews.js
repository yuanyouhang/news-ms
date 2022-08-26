import React, { useEffect, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';

import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';

const { Step } = Steps;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 22,
  },
};

function AddNews(props) {
  const navigate = useNavigate()
  const [ currentStep, setCurrentStep] = useState(0)
  const [ formRef ] = Form.useForm()
  const [ categoryList, setCategoryList] = useState([])

  const [ formInfo, setFormInfo ] = useState({})// 新闻基本信息表单
  const [content, setContent ] = useState('')// 富文本内容

  const user = props.token // 登录的用户信息

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  const nextStep = () => {
    if(currentStep === 0) {
      formRef.validateFields().then(res => {
        // console.log(res)
        setFormInfo(res)
        setCurrentStep(currentStep + 1)
      })
      .catch(err => {
        console.log(err)
      })
    }
    else {
      if(content==='' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空！')
      }
      else {
        // console.log(formInfo, content)
        setCurrentStep(currentStep + 1)
      }
    }
  }
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const save = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": user.region ? user.region : "全球",
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res => {
      navigate(auditState===0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.success({
        message: `通知`,
        description: `已${auditState===0?'保存至草稿箱':'提交审核'}`,
        placement: 'top'
      });    
    })
  }

  const onFinish = () => {

  }
  const onGenderChange = () => {

  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>

      <div style={{marginTop: '40px'}}>
        <div style={currentStep===0 ? {} : {display: 'none'}}>
          <Form {...layout} form={formRef} onFinish={onFinish}>
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="请选择..."
                onChange={onGenderChange}
                allowClear
              >
                {
                  categoryList.map(item =>
                    <Option key={item.id} value={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div style={currentStep===1 ? {} : {display: 'none'}}>
          <NewsEditor getContent={(content) => {
            // console.log(content)
            setContent(content)
          }} />
        </div>

        <div style={currentStep===2 ? {} : {display: 'none'}}>
          
        </div>
      </div>

      <div style={{marginTop: '50px'}}>
        {
          currentStep === 2 && <span>
            <Button onClick={() => save(0)}>保存草稿箱</Button>
            <Button type="primary" onClick={() => save(1)}>提交审核</Button>
          </span>
        }
        {
          currentStep < 2 && <Button type="primary" onClick={() => nextStep()}>下一步</Button>
        }
        {
          currentStep > 0 && <Button onClick={() => prevStep()}>上一步</Button>
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const token = state.userReducer.token
  return {
    token
  }
}

export default connect(mapStateToProps)(AddNews)