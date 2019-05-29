import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import BreadcrumbList from '../../components/BreadcrumbList/BreadcrumbList'
import SearchBar from '../../components/SearchBar/SearchBar'
import InstallationSearchForm from '../../components/Installations/InstallationsSearchForm/InstallationsSearchForm'
import InstallationList from '../../components/Installations/InstallationsList/InstallationList'
import InstallationDetail from '../../components/Installations/InstallationDetail/InstallationDetail'
import {redirect} from '../../utils/webSessionUtils'
import { installationsContainer } from './index.css'

function renderInstallations({dispatch, installations}) {
  const {
    list,
    total,
    timeRange,
    customers,
    customerId,
    products,
    productId,
    defaultStatusList,
    loading,
    current,
    installation,
    currentItem,
    editorVisible,
    editorType,
    disabled,
    breadcrumbItems
  } = installations

  const installationsListProps = {
    total,
    current,
    loading,
    defaultStatusList,
    dataSource: list,
    customers,
    products,
    onPageChange(page) {
      dispatch({
        type: 'installations/query',
        payload: { timeRange, customerId, productId, page }
      })
    },
    onModify(installId) {
      dispatch({
        type: 'installations/getDetail',
        payload: { installId, type: 'modify' }
      })
    },
    onReadOnly(installId) {
      dispatch({
        type: 'installations/getDetail',
        payload: { installId, type: 'view' }
      })
    },
    onDel(installId) {
      dispatch({
        type: 'installations/del',
        payload: { installId }
      })
    }
  }

  let titleText = ''
  switch(editorType) {
    case 'create':
      titleText = '新增安装'
      break
    case 'edit':
      titleText = '编辑安装'
      break
    case 'view':
      titleText = '查看安装'
      break
    default:
      titleText = ''
      break
  }

  const installationDetialProps = {
    defaultStatusList,
    installation,
    customers,
    products,
    disabled,
    dispatch,
    title: {
      text: titleText
    }
  }

  const onAdd = () => {
    dispatch({
      type: 'installations/showEditor',
      payload: {
        type: 'create'
      }
    })
  }

  const onSearch = (values) => {
    dispatch({
      type: 'installations/query',
      payload: { ...values, page: current }
    })
  }

  return (
    <div>
      <BreadcrumbList breadcrumbItems={breadcrumbItems}></BreadcrumbList>
      {
        !editorVisible?
        (
          <div className={installationsContainer}>
            <SearchBar onAdd={onAdd}>
              <InstallationSearchForm onSearch={onSearch} customers={customers} products={products}></InstallationSearchForm>
            </SearchBar>
            <InstallationList {...installationsListProps}></InstallationList>
          </div>
        ):
        (
          <div>
            <InstallationDetail {...installationDetialProps}></InstallationDetail>
          </div>
        )
      }
      
    </div>
  )
}

class Installations extends Component{
  render() {
    console.log(this)
    return renderInstallations(this.props)
  }
}

function mapStateToProps({ installations }) {
  return { installations }
}

export default connect(mapStateToProps)(Installations)