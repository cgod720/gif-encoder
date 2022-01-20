const GIFencoder = require('gif-encoder-2')
const { createCanvas, Image } = require('canvas')
const { createWriteStream, readdir } = require('fs')
const { promisify } = require('util')
const path = require('path')


const readdirAsync = promisify(readdir)
const imagesFolder = path.join(__dirname, 'input')


const createGIF = async (algo) => {
    return new Promise(async () => {
        const files = await readdirAsync(imagesFolder)

        const [width, height] = await new Promise((resolve2) => {
            const image = new Image()
            image.onload = () => resolve2([image.width, image.height])
            image.src = path.join(imagesFolder, files[0])
        })

        const dstPath = path.join(__dirname, 'output', `hunkz.gif`)

        const writeStream = createWriteStream(dstPath)

        writeStream.on('close', () => {
            resolve1()
        })

        const encoder = new GIFencoder(width, height, algo)

        encoder.createReadStream().pipe(writeStream)
        encoder.start()
        encoder.setDelay(250)


        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')

        for(const file of files){
            await new Promise((resolve3) => {
                const image = new Image()
                image.onload = () => {
                    ctx.drawImage(image, 0, 0)
                    encoder.addFrame(ctx)
                    resolve3()
                }
                image.src = path.join(imagesFolder, file)
            })
        }
    })
}


createGIF('neuquant')