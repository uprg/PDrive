// const ws = require("ws")
// const fs = require("fs")

// websocket_server = new ws.WebSocketServer({port: 3000})

// websocket_server.on("connection", conn => {
//     conn.on("message", msg => {
//         const base64_data = msg.file_base64_data
//         const data_buffer = Buffer.from(base64_data, "base64")

//         fs.writeFileSync(msg.file_name, data_buffer)
//     })
// })


const http = require("http")
const fs = require("fs")

/**
 * 
 * create http web server
 */

const server = http.createServer(async (req, res) => {

    /**
     * 
     * Cross Origin Config
     */
    
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    /**
     * 
     * Global options handler
     */

    if (req.method === "OPTIONS"){
        res.writeHead(204)
        return res.end()
    }

    /**
     * 
     * file upload route
     */

    if (req.method === "POST" && req.url === "/upload"){
        let body = ""

        req.on("data", data_chunk => {
            // console.log(data_chunk)
            body += data_chunk // data_chunk is a buffer, adding string to buffer, its automatically internally its Buffer.toString() or data_chunk.toString("utf8")
        })

        req.on("end", async () => {
            const request_data = JSON.parse(body) // json as string
            const data_buffer = Buffer.from(request_data.file_base64_data, "base64")

            await fs.promises.writeFile(request_data.file_name, data_buffer)

            res.writeHead(200, {"Content-Type": "text/plain"})
            res.end("File uploaded!")
        })

    }else{
        res.writeHead(404, {"Content-Type": "text/plain"})
        res.end("route does not exists!")
    }
})

/**
 * 
 * server listening on 3000
 */

server.listen(3000, () => {console.log("listening on 3000...")})