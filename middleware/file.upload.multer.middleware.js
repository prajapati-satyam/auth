const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '_' + file.originalname)
    }
})
const file_filter = (req,file,cb) => {
if (file.mimetype.startsWith('image/')) {
cb(null, true)
} else{
    cb(new Error ("Only images are allowed"), false);
}
}

const upload = multer({
    storage: storage,
    fileFilter: file_filter,
    limits:{fileSize: 5 * 1024 * 1024}
})

module.exports = upload;