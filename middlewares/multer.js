const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//const storage = multer.memoryStorage();

const imageFileFilter = async (req, file, cb) => {

    console.log('multer ', req.body);
    console.log('multer file ', file);
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "/mycarparts",
    allowedFormats: [imageFileFilter],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const multerUpload = multer({ storage: storage }).single('image');


module.exports = multerUpload;