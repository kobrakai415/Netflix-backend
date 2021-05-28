import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import {badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler} from "../src/helpers/errorHandlers.js"
import mediaRoutes from "./media/media.js"

const server = express()
const port = process.env.PORT || 3001

const whitelist = [process.env.FRONTEND_LOCAL_URL, process.env.FRONTEND_CLOUD_URL]

const corsOptions = {
    origin: function(origin, next) {
        whitelist.indexOf(origin) !== -1 ? next(null, true) : new Error ("Cors problem")
    }
}

server.use(express.json())
server.use(cors(corsOptions))

server.use("/media", mediaRoutes)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

server.listen(port, () => {
console.log("Server listening on port: ", port)
} )

console.table(listEndpoints(server))