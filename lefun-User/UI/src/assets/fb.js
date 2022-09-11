(function (d, s, id) {
  var js = d.getElementsByTagName(s)[0]
  var fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s)
  js.id = id
  js.src = '//connect.facebook.net/en_US/sdk.js#version=v2.9&appId=1067869950062672&cookie=true&xfbml=true&autoLogAppEvents=true'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))
