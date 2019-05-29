import React, { Component, PropTypes } from 'react'
import { Table, Pagination, Popconfirm } from 'antd'
import { PAGE_SIZE } from '../../../constants/constants'
import numberFormat from '../../../utils/numberFormat'
import * as moment from 'moment'
import Spliter from '../../Spliter/Spliter'

const InstallationsList = ({
  total,
  current,
  loading,
  dataSource,
  defaultStatusList,
  customers,
  products,
  onPageChange,
  onModify,
  onReadOnly,
  onDel
}) => {
  const getStatus = (id) => {
    const s = defaultStatusList.filter(item => {
      return item.id === id
    })
    return s[0] ? s[0].label : ''
  }
  const getCustomer = (customerId) => {
    const temp = customers.filter(item => {
      return item.customerId === customerId
    })
    return temp[0] ? temp[0].customerName : ''
  }
  const getProduct = (productId) => {
    const temp = products.filter(item => {
      return item.productId === productId
    })
    return temp[0] ? temp[0].productName : ''
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render: (text, record, index) => <span>{index + 1}</span>
    },
    {
      title: '安装日期',
      dataIndex: 'installTime',
      key: 'installTime',
      render: (text) => <span>{ moment.parseZone(text).local().format('YYYY-MM-DD HH:mm') }</span>
    },
    {
      title: '客户',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (text) => getCustomer(text)
    },
    {
      title: '商品',
      dataIndex: 'productId',
      key: 'productId',
      render: (text) => getProduct(text)
    },
    {
      title: '安装数量',
      dataIndex: 'installNumber',
      key: 'installNumber'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => getStatus(text)
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <p>
          <a onClick={() => onModify(record.installId)}>编辑</a>
          <Spliter spliterText="|"></Spliter>
          <Popconfirm title="确定删除该条记录？" onConfirm={() => onDel(record.installId)}>
            <a type='ghost'>删除</a>
          </Popconfirm>
          <Spliter spliterText="|"></Spliter>
          <a onClick={() => onReadOnly(record.installId)}>详情</a>
        </p>
      )
    }
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={record => record.installId}
        pagination={false}
      ></Table>
      <Pagination
        className="ant-table-pagination"
        total={total}
        current={parseInt(current)}
        pageSize={PAGE_SIZE}
        onChange={onPageChange}
      ></Pagination>
    </div>
  )
}


export default InstallationsList