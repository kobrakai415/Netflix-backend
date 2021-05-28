import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import {badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler} from "../src/helpers/errorHandlers.js"
import mediaRoutes from "./media/media.js"
// import dotenv from 'dotenv'
// import {v2 as cloudinary} from "cloudinary"

// cloudinary.config({
//     cloud_name: "dgli1cavd",
//     api_key: "993934628452523",
//     api_secret: "5ZSOTKcaTMZFYiu57fCpq5YUDQg",
// });

const server = express()
const port = process.env.PORT || 3001
console.log(process.env.CLOUDINARY_URL)

const whitelist = [process.env.FRONTEND_LOCAL_URL, process.env.FRONTEND_CLOUD_URL]

const corsOptions = {
    origin: function(origin, next) {
        whitelist.indexOf(origin) !== -1 ? next(null, true) : new Error ("Cors problem")
    }
}

server.use(express.json())
// server.use(cors())

server.use("/media", mediaRoutes)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

server.listen(port, () => {
console.log("Server listening on port: ", port)
} )

console.table(listEndpoints(server))