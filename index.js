const rp = require('request-promise')
const parse = require('node-html-parser').parse

const ALERT_THRESHOLD = 100 // ug/m3
fetch_url = process.env['FETCH_URL']
ifttt_url = process.env['IFTTT_URL']

rp(fetch_url).then(body => {
  const root = parse(body)
  const pm10 = root.querySelectorAll('span.l em')[0].innerHTML
  const pm2 = root.querySelectorAll('span.l em')[1].innerHTML

  if (parseInt(pm10) >= ALERT_THRESHOLD || parseInt(pm2) >= ALERT_THRESHOLD) {
    return rp(ifttt_url)
  }
}).then(body => {
  body && console.log('ifttt triggered', body)
}).catch(err => {
  console.error('failed to process dust-warning', err)
})
