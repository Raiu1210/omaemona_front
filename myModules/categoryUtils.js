export default {
  getCategoriesObj() {
    return [
      { id: 2, name:'暗号通貨' },
      { id: 3, name:'モナコイン' },
      { id: 4, name:'温泉' },
      { id: 5, name:'神社・お寺' },
      { id: 6, name:'趣味' },
      { id: 10, name:'カーライフ' },
      { id: 7, name:'日記' },
      { id: 8, name:'IT技術' },
      { id: 9, name:'ガジェット' },
      { id: 11, name:'本' },
      { id: 12, name:'創作話' },
      { id: 13, name:'怖い話' },
      { id: 1, name:'その他' },
    ]
  },
  getAllCategoriesObj() {
    return [
      { id: 2, name:'暗号通貨' },
      { id: 3, name:'モナコイン' },
      { id: 4, name:'温泉' },
      { id: 5, name:'神社・お寺' },
      { id: 6, name:'趣味' },
      { id: 10, name:'カーライフ' },
      { id: 7, name:'日記' },
      { id: 8, name:'IT技術' },
      { id: 9, name:'ガジェット' },
      { id: 11, name:'本' },
      { id: 12, name:'創作話' },
      { id: 13, name:'怖い話' },
      { id: 1, name:'その他' },
      { id: 0, name:'未分類' },
    ]
  },
  translateNumberToCategory(number) {
    if(number == 0) {
      return '未分類'
    }
    let categories = this.getCategoriesObj()
    let return_name = ''
    categories.forEach(element => {
      if(element.id == number) {
        return_name = element.name
      }
    })

    return return_name
  }
}
