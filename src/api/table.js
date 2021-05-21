import request from '@/utils/request'
var host = "http://172.17.16.142:5000"
// var host = "http://localhost:5000"
export function getList(params) {
  return request({
    baseURL: host,
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
//查询首页
export function getTable(data) {
  return request({
    baseURL: host,
    url: '/query',
    method: 'post',
    data
  })
}
//获取业务名称
export function getBusiness() {
  return request({
    baseURL: host,
    url: '/business',
    method: 'get',
  })
}
//根据业务名称获取功能模块
export function getfunctionMoudalList(business_name) {
  return request({
    baseURL: host,
    url: '/module?business=' + business_name,
    method: 'get',
    business_name
  })
}

//根据case_id删除用例
export function deleteCase(case_id){
  return request({
    baseURL: host,
    url:'/delete?case_id='+case_id,
    method:'get',
    case_id
  })
}

// 创建用例
export function addCase(data) {
  return request({
    baseURL: host,
    url: '/add',
    method: 'post',
    data

  })
}

// 查询用例数据
export function getCaseDetail(case_id) {
  return request({
    baseURL: host,
    url: '/single?case_id='+case_id,
    method: 'get',
    case_id
  })
}
