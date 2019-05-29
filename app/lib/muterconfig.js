import multer from 'multer';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/uploads')
    },
    filename:  (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  const upload = multer({storage:storage});
  export default upload;