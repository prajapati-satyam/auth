const { profile_upload } = require('../controller/user.controller');
const upload = require('../middleware/file.upload.multer.middleware');
function check_file(req,res) {

    upload.single('profile_pic')(req,res, (err)=> {
        if (err) {
            return res.status(400).json({
                message: err.message,
                success: false
            })
        }
        profile_upload(req,res);
    })
}


module.exports = check_file
