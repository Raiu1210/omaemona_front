export const state = () => ({
  publicAddress: 'aaa',
  verified: false
})


export const mutations = {
  setVerified (state, val) {
    state.publicAddress = val,
    state.verified = true
  },
 }
