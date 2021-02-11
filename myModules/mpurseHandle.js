import {axiosInstance as Api} from '~/myModules/api'


export default {
  async ask_verify_sig () {
    var date = new Date();
    var a = date.getTime();
    let address = await window.mpurse.getAddress();

    var message = "Please sign this message :" + a
    var signature = await window.mpurse.signMessage(message);

    const item = { address: address, message: message, signature: signature }
    const result = await Api().post('/verify', item)

    return {address, message, signature, result}
  },

  async post_goods_info(address, message, signature, goods_name, discription, contact, price, amount, currency, imageFile) {
    try {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("message", message);
      formData.append("signature", signature);
      formData.append("goods_name", goods_name);
      formData.append("discription", discription);
      formData.append("contact", contact);
      formData.append("price", price);
      formData.append("amount", amount);
      formData.append("currency", currency);
      formData.append("file", imageFile[0]);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        }
      };
      let res = await Api().post("/image", formData, config);
      if (res.data.status === "error") {
        alert(res.data.error);
      } else {
        alert("登録完了したよ！")
      }
    } catch (error) {
      alert("商品の登録に失敗しちゃった orz\nもう一度やってみて！");
    }
  },

  async get_goods_list() {
    let res = await Api().get("/goods_list");

    return res;
  },

  async get_goods_info(id) {
    let res = await Api().get("/goods_detail?id=" + id);

    return res
  },

  async ask_my_goods_list() {
    let address = await window.mpurse.getAddress();

    const item = { address: address }
    const res = await Api().post('/get_my_goods', item)

    return res
  },

  async ask_delete_goods(delete_id) {
    var date = new Date();
    var a = date.getTime();
    let address = await window.mpurse.getAddress();

    var message = "I confirm to delete this goods :" + a
    var signature = await window.mpurse.signMessage(message);

    const item = { address:address, message:message, signature:signature, delete_id:delete_id }
    const result = await Api().post('/delete_goods', item)

    return result["data"]["message"]
  },

  async save_tx_history(id, to_address, price, tx_hash) {
    let from_address = await window.mpurse.getAddress()
    const item = { id:id, from_address:from_address, to_address:to_address, price:price, tx_hash:tx_hash }
    await Api().post('/save_tx', item)
  },

  async ask_tx_from_me_list() {
    let my_address = await window.mpurse.getAddress()
    let res = await Api().get("/tx_from_me_list?from_address=" + my_address)

    return res
  },

  async ask_tx_to_me_list() {
    let my_address = await window.mpurse.getAddress()
    let res = await Api().get("/tx_to_me_list?to_address=" + my_address)

    return res
  }
}
