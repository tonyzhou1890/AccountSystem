import React, { Component, PropTypes } from 'react'
import { Row, Form, Select, Button, Input, InputNumber, DatePicker } from 'antd'
import { formItemLayout } from '../../../constants/constants'
import { installationFormContainer, installationForm, formColumn, formTitle, buttonGroup, confirmButton, cancelButton } from './index.css'

const FormItem = Form.Item
const Option = Select.Option

const InstallationDetail = ({
  dispatch,
  title,
  customers,
  products,
  installation,
  defaultStatusList,
  disabled,
  form: {
    getFieldDecorator,
    validateFields
  }
}) => {
  const {
    installTime,
    installNumber,
    status,
    customerId,
    productId,
    installId
  } = installation

  const onSureHandler = (e) => {
    validateFields((errors, values) => {
      if (!!errors) {
        return false
      }
      if (values.installTime) {
				values.installTime = values.installTime.valueOf()
			}
      dispatch({
        type: 'installations/detail',
        payload: {
          ...values,
          installId
        }
      })
    })
  }

  const onCancelHandler = (e) => {
    dispatch({
      type: 'installations/hideEditor'
    })
  }

  return (
    <div>
      <Row className={installationFormContainer}>
        <p className={formTitle}>{ title.text }</p>
        <Form className={installationForm}>
          <FormItem label="安装日期" hasFeedback={!disabled} {...formItemLayout} className={formColumn}>
            {
              getFieldDecorator('installTime', {
                initialValue: installTime,
                rules: [
                  { required: true, message: '日期不能为空' }
                ]
              })(
                <DatePicker disabled={disabled}></DatePicker>
              )
            }
          </FormItem>
          <FormItem label="客户名称" {...formItemLayout} className={formColumn}>
            {
              getFieldDecorator('customerId', {
                initialValue: customerId,
                rules: [
                  { required: true, message: '客户必选'}
                ]
              })(
                <Select
                  disabled={disabled}
                  placeholder="选择一个客户"
                >
                  {
                    customers.map( customer => (
                      <Option key={customer.customerId} value={customer.customerId}>{ customer.customerName }</Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label="商品名称" {...formItemLayout} className={formColumn}>
            {
              getFieldDecorator('productId', {
                initialValue: productId,
                rules: [
                  { required: true, message: '商品必选'}
                ]
              })(
                <Select
                  disabled={disabled}
                  placeholder="选择一种商品"
                >
                  {
                    products.map( product => (
                      <Option key={product.productId} value={product.productId}>{ product.productName }</Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label="安装数量" hasFeedback={!disabled} {...formItemLayout} className={formColumn}>
            {
              getFieldDecorator('installNumber', {
                initialValue: installNumber,
                rules: [
                  { required: true, message: '安装数量不能为空' }
                ]
              })(
                <InputNumber disabled={disabled} min={1} step={1}></InputNumber>
              )
            }
          </FormItem>
          <FormItem label="安装状态" {...formItemLayout} className={formColumn}>
            {
              getFieldDecorator('status', {
                initialValue: status,
                rules: [
                  { required: true, message: '安装状态必选' }
                ]
              })(
                <Select
                  disabled={disabled}
                  placeholder="安装状态"
                  {...formItemLayout}
                >
                  {
                    defaultStatusList.map( statusItem => (
                      <Option key={statusItem.id} value={statusItem.id}>{ statusItem.label }</Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>
        </Form>
      </Row>
      
      <Row className={buttonGroup}>
        {
          disabled ? null : <Button type="primary" className={confirmButton} onClick={onSureHandler}>确定</Button>
        }
        <Button type="ghost" className={cancelButton} onClick={onCancelHandler}>取消</Button>
      </Row>
    </div>
  )
}

export default Form.create()(InstallationDetail)