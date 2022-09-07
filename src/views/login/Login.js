import React from 'react'
import { useNavigate } from 'react-router-dom'
import style from './Login.module.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { store } from '../../redux/store';

export default function Login() {
  const navigate = useNavigate()

  // 提交表单
  const onFinish = (values) => {
    // console.log(values)
    const {username, password} = values;
    axios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`)
    .then(res => {
      // console.log(res.data)
      if(res.data.length===0) {
        message.error('用户名或密码错误！');
      }
      else {
        // localStorage.setItem('token', JSON.stringify(res.data[0]))
        store.dispatch({
          type: 'add_token',
          payload: res.data[0]
        })
        navigate('/')
      }
    })
  }

  const particlesInit = async (main) => {
    // console.log(main);
    await loadFull(main);
  };
  const particlesLoaded = (container) => {
    // console.log(container);
  };
  const params = {
    background: {
      color: {
        value: "#0d47a1",
      },
    },
    fpsLimit: 100,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 600,
        },
        value: 40,
      },
      opacity: {
        value: 0.6,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 2, max: 8 },
      },
    },
    detectRetina: true,
  }

  return (
    <div className={style.content}>
      <Particles height='500px' width='600px' params={params} init={particlesInit} loaded={particlesLoaded} />
      <div className={style.formField}>
        <div className={style.title}>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="admin" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="123456"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
