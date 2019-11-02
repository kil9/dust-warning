const rp = require('request-promise')
const parse = require('node-html-parser').parse

const ALERT_THRESHOLD = 100 // ug/m3
const fetch_url = process.env['FETCH_URL']
const ifttt_url = process.env['IFTTT_URL']

const options = {
  url: fetch_url,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
  }
}

rp(options).then(body => {
  const root = parse(body)
  const pm10 = root.querySelectorAll('span.l em')[0].innerHTML
  const pm2 = root.querySelectorAll('span.l em')[1].innerHTML
  console.log('pm10', pm10, '\tpm2', pm2)

  if (parseInt(pm10) >= ALERT_THRESHOLD || parseInt(pm2) >= ALERT_THRESHOLD) {
    return rp(ifttt_url)
  } else {
    console.log('no warning sent. pm10: '+pm10+', pm2: '+pm2)
  }
}).then(body => {
  body && console.log('ifttt triggered', body)
}).catch(err => {
  console.error('failed to process dust-warning', err)
})
