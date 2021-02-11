import {axiosInstance as Api} from '~/myModules/api'

export default async function checkMyAddressRegistered () {
  const myAddress = await window.mpurse.getAddress();
  const postItem = {
    address: myAddress
  }

  const result = await Api.post('/checkAddressRegistered', postItem)
}
