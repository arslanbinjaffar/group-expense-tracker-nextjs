"use client"
import React, { FC, ReactNode, useState,useEffect } from 'react'
import axios from 'axios'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {

  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        if (config.headers.has("isAsyncUpdate")) return config;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (config) => {
        console.log(config,"config")
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);
  return (
    <div>
      { children}
    </div>
  )
}

export default Layout
