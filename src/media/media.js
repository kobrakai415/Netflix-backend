import express from "express"
import { write } from "fs-extra"
import { getMedia, writeMedia } from "../helpers/files.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const router = express.Router()


router.get("/", async (req, res, next) => {

    const media = await getMedia()
    res.send(media)

})

router.get("/:id", async (req, res, next) => {
    const media = await getMedia()

    const film = media.find(film => film.imdbID === req.params.id)

    film ? res.send(film) : next(new Error ("Incorrect ID, no movies found"))

})

router.post("/", async (req, res, next) => {
    const media = await getMedia()

    const newFilm = {...req.body, createdOn: new Date()}
    media.push(newFilm)

    await writeMedia(media)

    res.send(newFilm)
})

router.put("/:id", async (req, res, next) => {
    const media = await getMedia()
    const indexOfFilm = media.findIndex(film => film.imdbID === req.params.id)

    const updatedFilm = {...media[indexOfFilm], ...req.body, updatedOn: new Date()}

    media[indexOfFilm] = updatedFilm
    
    await writeMedia(media)

    res.send(updatedFilm)

})

router.delete("/:id", async (req, res, next) => {
    try {
        const media = await getMedia()
        const filmIndex = media.findIndex(film => film.imdbID === req.params.id)
        console.log(filmIndex)

        if(filmIndex !== -1) {
            media.splice(filmIndex, 1)
            await writeMedia(media)
            res.send(media)
        } else {
            next(new Error ("Id is incorrect"))
        }
        
    } catch (error) {
        next(error)
    }

})

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "filmPosters",
        resource_type: "auto"
    }
})

const upload = multer({
    storage: cloudinaryStorage,
    
}).single("filmPoster")

router.post("/:id/uploadPoster", upload, async (req, res, next) => {
    try {
        console.log(req.file)
        const media = await getMedia()
        const filmIndex = media.findIndex(film => film.imdbID === req.params.id)

        filmIndex ? media[filmIndex].Poster = req.file.path : next(new Error("WRong ID "))
            
        await writeMedia(media)
        res.send("success")
    } catch (error) {
        next(error)
    }   
})

router.post("/:id/review")


export default router 