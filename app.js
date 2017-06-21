var SimplePeer = require('simple-peer')

var offerElm = document.getElementById('offer')
var offerInput = document.getElementById('remote-offer')
var saveOfferBtn = document.getElementById('save-remote-offer')
var remoteAnsElm = document.getElementById('remote-ans')
var remoteAnsInput = document.getElementById('remote-ans-input')
var saveRemoteAnsBtn = document.getElementById('save-remote-ans')
var logElm = document.getElementById('log')
var messageInput = document.getElementById('message')
var sendBtn = document.getElementById('send')

var peer = new SimplePeer({ initiator: true, trickle: false })

var addListeners = (peer, offerer) => {
  peer.on('connect', () => {
    console.log('CONNECTED')
  })

  if (offerer) {
    peer.on('signal', data => {
      offerElm.innerHTML = JSON.stringify(data)
    })
  } else {
    peer.on('signal', data => {
      remoteAnsElm.innerHTML = JSON.stringify(data)
    })
  }

  peer.on('data', data => {
    var obj = JSON.parse(data.toString())
    console.log(obj)
    var elm = document.createElement('div')
    elm.innerHTML = obj.time.toString() + ' - remote: ' + obj.msg
    logElm.appendChild(elm)
  })
}

addListeners(peer, true)

var sendMsg = () => {
  // if (!connected) {
  //   return
  // }
  var msg = messageInput.value
  messageInput.value = ''
  if (msg !== '') {
    var time = Date.now()
    var elm = document.createElement('div')
    elm.innerHTML = time.toString() + ' - you: ' + msg
    logElm.appendChild(elm)
    peer.send(JSON.stringify({ time: time, msg: msg }))
  }
}

sendBtn.addEventListener('click', sendMsg)
messageInput.addEventListener('keyup', ev => {
  if (ev.keyCode === 13) {
    sendMsg()
  }
})

saveOfferBtn.addEventListener('click', () => {
  if (offerInput.value !== '') {
    listenLog(offerInput.value)
  }
})

saveRemoteAnsBtn.addEventListener('click', () => {
  if (remoteAnsInput.value !== '') {
    peer.signal(remoteAnsInput.value)
  }
})

function listenLog (offer) {
  peer = new SimplePeer({ trickle: false })
  addListeners(peer, false)
  peer.signal(offer)
}
