const express = require("express")
const { WebSocketServer } = require("ws")
const app = express()

app.use(express.static("public"))

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})

const wss = new WebSocketServer({ port: 8001 })

wss.on("connection", (ws, request) => {
  wss.clients.forEach(client => {
    client.send(`SOMEONE ENTERED THE ROOM [NOW:${wss.clients.size}]`)
  })

  console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`)
})

wss.on("connection", (ws, request) => {
  ws.on("close", () => {
    wss.clients.forEach((client) => {
      client.send(`유저 연결 해제 [현재: ${wss.clients.size}명]`)
    })
  })
})

wss.on("connection", (ws, request) => {
  ws.on("message", data => {
    wss.clients.forEach(client => {
      client.send(data.toString())
    })
  })
})
