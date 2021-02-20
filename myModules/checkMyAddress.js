import {axiosInstance as Api} from '~/myModules/api'

export default async function checkMyAddressRegistered () {
  const myAddress = await window.mpurse.getAddress();
  const postItem = {
    address: myAddress
  }

  const result = await Api.post('/checkAddressRegistered', postItem)

  let returnObj = {}
  if (result['data']['result'] == 'existed') {
    returnObj['status'] = true
    returnObj['userInfo'] = result['data']['userInfo']
  } else {
    returnObj['status'] = false
  }

  console.log(returnObj)
  return returnObj
}
