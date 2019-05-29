import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, DatePicker } from 'antd'
import { installationsSearchForm } from './index.css'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const InstallationsSearchForm = ({
  onSearch,
  customers,
  products,
  form: {
    getFieldDecorator,
		getFieldsValue,
		validateFields
  }
}) => {
  const onSubmit = (e) => {
    e.preventDefault()
    validateFields((errors, values) => {
      if (!!errors) {
        return false
      } 
      if (values['timeRange']) {
				values['timeRange'] = values['timeRange'].map((time) => time.toLocaleString());
			}
			onSearch(values);
    })
  }

  return (
    <div className={installationsSearchForm}>
      <Form layout="inline" onSubmit={onSubmit}>
        <FormItem>
          {
            getFieldDecorator('timeRange')(
              <RangePicker size="large"></RangePicker>
            )
          }
        </FormItem>
        <FormItem label="客户名称">
          {
            getFieldDecorator('customerId')(
              <Select style={{minWidth: 150}}>
                {
                  customers.map(({customerId, customerName}) => (
                    <Option key={customerId}>{customerName}</Option>
                  ))
                }
              </Select>
            )
          }
        </FormItem>
        <FormItem label="商品名称">
          {
            getFieldDecorator('productId')(
              <Select style={{minWidth: 150}}>
                {
                  products.map(({productId, productName}) => (
                    <Option key={productId}>{productName}</Option>
                  ))
                }
              </Select>
            )
          }
        </FormItem>
        <Button type="primary" htmlType="submit">搜索</Button>
      </Form>
    </div>
  )
}

InstallationsSearchForm.prototype = {
  form: PropTypes.object,
  onSearch: PropTypes.func,
  customers: PropTypes.array,
  products: PropTypes.array
}

export default Form.create()(InstallationsSearchForm)
