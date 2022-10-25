const imageFilter = function(req,file,cb)
{
    if(!file.originalname.match(/\.(jpg|JPG|JPEG|jpeg|png|PNG|gif|GIF)$/)){
        req.fileValidationError = 'Only image files are allowed';
        return cb(new Error('Only image files are allowed!'),false);
    }
    cb(null,true);
};
exports.imageFilter = imageFilter;