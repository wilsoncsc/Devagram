import { createBucketClient } from "@cosmicjs/sdk";
import multer from "multer";

const {BUCKET_SLUG, READ_KEY, WRITE_KEY} = process.env;

const bucketDevagram = createBucketClient({
    bucketSlug: BUCKET_SLUG as string,
    readKey: READ_KEY as string,
    writeKey: WRITE_KEY as string,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadImagemCosmic = async (req: any) => {
    if (req?.arq?.originalname) {
        if (
        !req.arq.originalname.includes(".png") &&
        !req.arq.originalname.includes(".jpg") &&
        !req.arq.originalname.includes(".jpeg")
        ){
            throw new Error("Formato de imagem inválido");
        }

        const value = req.arq?.originalname.data;
        if (value !== undefined) {
            console.log(value);
        } else {
            console.log("File não definido");
        }

        const media_obeject = {
            originalname: req.arq.originalname,
            buffer: req.arq.buffer,
        };

        if (req.url && req.url.includes("publicacao")) {
            return await bucketDevagram.media.insertOne({
                media: media_obeject,
                folder: "publicacao",
            });
        } else if (req.url && req.url.includes("usuario")) {
            return await bucketDevagram.media.insertOne({
                media: media_obeject,
                folder: "avatar",
        });
        } else {
            return await bucketDevagram.media.insertOne({
                media: media_obeject,
                folder: "stories",
            });
        }
    }
};

export { upload, uploadImagemCosmic };