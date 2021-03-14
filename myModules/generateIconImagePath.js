export default function generateIconImagePath(icon_image_path) {
  const env = process.env.NODE_ENV || 'development'
  let url = 'https://monaledge.com:8443'
  if(env == 'development') {
    url = 'http://localhost:3333'
  }

  if(icon_image_path == null) {
    return url + '/profileImages/Monacoin.png'
  } else {
    return icon_image_path
  }
}
