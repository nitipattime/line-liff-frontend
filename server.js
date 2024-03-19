const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(express.json())

require('dotenv').config()

app.use(cors())
const port = 8888


const LINE_API_URL = 'https://api.line.me/v2/bot/message/push'
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
}

const sendMessage = async (userUid, message) => {
  const body = {
    to: userUid,
    messages: [
      {
        type: 'text',
        text: message
      }
    ]
  }
  const response = await axios.post(LINE_API_URL, body, { headers })
  return response
}

app.post('/send-message', async (req, res) => {
  const { userUid, message } = req.body
  console.log(userUid)
  console.log(message)
  try {
    const response = await sendMessage(userUid, message)
    console.log('=== LINE log', response.data)
    res.json({
      message: 'Message OK'
    })
  } catch (error) {
    console.log('error', error.response.data)
    res.status(400).json({
      error: error.response
    })
  }
})

app.post('/webhook',async (req, res) => {
  const { events } = req.body

  if (!events || events.length <= 0) {
    console.log('error event not found')
    res.json({
      message: 'event not found !'
    })
    return false
  }
  console.log('event',events)
  try {
    const lineEvent = events[0]
    const lineUserID = lineEvent.source.userId
    let commandMessage = 'UserID : ' + lineUserID
    const response = await sendMessage(lineUserID, commandMessage)
    res.json({
      message: 'Send Message Success',
      responseData: response.data
    })

    // if (lineEvent.type === 'message') {
    //   if (lineEvent.message.text === 'อยากกลับบ้าน') {
    //     commandMessage = 'back'
    //   }
    // }

    // // update richmenu ด้วย userId
    // if (commandMessage === 'back') {
    //   const richmenuResponse = await defaultRichmenu()
    //   const response = await updateRichmenu(lineUserID, richmenuResponse.data.richMenuId)
    //   console.log('=== LINE log', response.data)
    // }
  } catch (error) {
    console.log('error', error)
  }

})

app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`)
})

// const defaultRichmenu = async () => {
//     try {
//       const response = await axios.get(
//         `${LINT_BOT_API_URL}/all/richmenu`,
//         { headers }
//       )
//       return response
//     } catch (error) {
  
//     }
//   }
  
//   app.post('/webhook', async (req, res) => {
//     const { events } = req.body
  
//     if (!events || events.length <= 0) {
//       console.log('error event not found')
//       res.json({
//         message: 'event not found !'
//       })
//       return false
//     }
  
//     try {
//       const lineEvent = events[0]
//       const lineUserID = lineEvent.source.userId
//       let commandMessage = ''
  
//       if (lineEvent.type === 'message') {
//         if (lineEvent.message.text === 'อยากกลับบ้าน') {
//           commandMessage = 'back'
//         }
//       }
  
//       // update richmenu ด้วย userId
//       if (commandMessage === 'back') {
//         const richmenuResponse = await defaultRichmenu()
//         const response = await updateRichmenu(lineUserID, richmenuResponse.data.richMenuId)
//         console.log('=== LINE log', response.data)
//       }
//     } catch (error) {
//       console.log('error', error)
//     }
//   })

// // send Flex Message
// const sendFlexMessage = async (userUid, message) => {
//     try {
//       let contents = Object.assign({}, templateJSON)
//       contents.body.contents[0].text = message
  
//       const body = {
//         to: userUid,
//         messages: [
//           {
//             type: "flex",
//             altText: "this is a flex message",
//             contents
//           }
//         ]
//       }
//       console.log('body', JSON.stringify(body))
//       const response = await axios.post(LINE_API_URL, body, { headers })
//       return response
//     } catch (error) {
//       // console.log(error.response)
//       throw new Error(error.message)
//     }
//   }
  
//   app.post('/send-message', async (req, res) => {
//     const { userUid, message } = req.body
  
//     try {
//       // เปลี่ยนมายิงผ่าน flex message แทน
//       const response = await sendFlexMessage(userUid, message)
//       console.log('=== LINE log', response.data)
//       res.json({
//         message: 'Message OK'
//       })
//     } catch (error) {
//       console.log('error', error.response.data)
//       res.status(400).json({
//         error: error.response
//       })
//     }
//   })