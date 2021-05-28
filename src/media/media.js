import express from "express"
import { write } from "fs-extra"
import { getMedia, writeMedia } from "../helpers/files.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import uniqid from "uniqid"
const router = express.Router()


router.get("/", async (req, res, next) => {

    const media = await getMedia()
    res.send(media)

})

router.get("/:id", async (req, res, next) => {
    const media = await getMedia()

    const film = media.find(film => film.imdbID === req.params.id)

    film ? res.send(film) : next(new Error ("Incorrect ID, no movies found"))

    // try {
    //     let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=06749b45454775d74e6ecb748ff27029&with_genres=27`)
    //     let data = await response.json()
    //     console.log(data)
    // }
    // catch (error) {
    //     console.log(error)
    // }

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

router.post("/:id/review", async (req, res, next) => {
    try {
        const media = await getMedia()
        const film = media.find(film => film.imdbID === req.params.id)

        const review = {...req.body, _id: uniqid(), createdOn: new Date(), elementId: film.imdbID}

        film.Reviews.push(review)
        
        // media[film].Reviews.push(review)
        await writeMedia(media)
        res.send("success")

    } catch (error) {
        next(error)
    }
})

router.delete("/:id/review/:reviewId", async (req, res, next) => {
    try {
        const media = await getMedia()
        const film = media.find(film => film.imdbID === req.params.id)

        const reviewIndex = film.Reviews.findIndex(review => review._id === req.params.reviewId)
        film.Reviews.splice(reviewIndex, 1)

        await writeMedia(media)
        res.send("success")

    } catch (error) {
        next(error)
    }
})


export default router 