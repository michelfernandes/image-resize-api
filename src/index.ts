import express from "express";
import sharp from "sharp";
import axios from "axios";

const app = express();


app.get('/', async function (req, res) {
    const imagePath = req.query.image;
    if(!imagePath || imagePath.trim() === ""){
        res.status(400).send({ error: "Missing 'image' parameter on the URL", status: 400});
        return;
    }

    let height = req.query.height || 200;
    let width = req.query.width || 200;
    if(isNaN(height) || isNaN(width)){
        res.status(400).send({ error: "'height' and 'width' parameters must be numeric values", status: 400});
        return;
    }

    height = parseInt(height);
    width = parseInt(width);
    if(height <= 0 || width <= 0){
        res.status(400).send({ error: "'height' and 'width' parameters must be positive integers", status: 400});
        return;
    }
    
    const input = (await axios({ url: imagePath, responseType: "arraybuffer" })).data as Buffer;
    
    const output = await sharp(input).resize(height,width,{fit:"fill"}).png().toBuffer();

    res.type('png').send(output)
});

// start the server in the port 3000 !
app.listen(3000, function () {
    console.log("App listening on port 3000.");
});