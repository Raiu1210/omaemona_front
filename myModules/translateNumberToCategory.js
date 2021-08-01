export default function translateNumberToCategory (number) {
  if(number == 0) {
    return '未分類'
  } else if(number == 1) {
    return 'その他'
  } else if(number == 2) {
    return '暗号通貨'
  } else if(number == 3) {
    return 'モナコイン'
  } else if(number == 4) {
    return '温泉'
  } else if(number == 5) {
    return '神社・お寺'
  } else if(number == 6) {
    return '趣味'
  } else if(number == 7) {
    return '日記'
  } else if(number == 8) {
    return 'IT技術'
  } else if(number == 9) {
    return 'ガジェット'
  }
}
