const express = require('express')
const cron = require('node-cron')
const axios = require('axios')

cron.schedule('* * * * *', async () => {
    try {
        const response = await axios.request({
            method: "get",
            url: `https://talkies-frontend.onrender.com/`
        })
        if (response.ok || response.status == 200) {
            console.log("talkies server is awake")
        }
    } catch (error) {
        console.log(error)
    }
})

const app = express()



app.listen(3000, () => {
    console.log("app is running at 3000")
})