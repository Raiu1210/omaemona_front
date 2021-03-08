export const state = () => ({
  postedArticleId: '',
  publicAddress: 'aaa',
  verified: false
})


export const mutations = {
  setVerified (state, val) {
    state.publicAddress = val,
    state.verified = true
  },

  setMyArticleId(state, val) {
    state.postedArticleId = val
  }
 }
