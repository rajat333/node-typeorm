const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("../auth_config.json");

// Filter files with multer
const multerFilter = (req, file, cb) => {
    console.log('multerFilter multerFilter', multerFilter);
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Not an image! Please upload only images.", false);
    }
  };
  const multerStorage = multer.memoryStorage();

  export const checkToken = (req, res, next)=>{
    const checkJwt = jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
      }),
      audience: authConfig.audience,
      issuer: `https://${authConfig.domain}/`,
      algorithms: ["RS256"]
    });
    next();
  }

 

  export const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
   
  // *****  Multer .fields() *****
  export const uploadProductImages = upload.fields([
    { name: "cover", maxCount: 2 },
    { name: "gallery", maxCount: 4 },
  ]);
   
  // *****  Multer .array() *****
  // const uploadProductImages = upload.array("gallery", 4);
   
  // *****  Multer .single() *****
  // const uploadProductImages = upload.single("cover");
  export const  sizes = [
    {
      path: "original",
      width: null,
      height: null,
    },
    {
      path: "large",
      width: 800,
      height: 950,
    },
    {
      path: "medium",
      width: 300,
      height: 450,
    },
    {
      path: "thumbnail",
      width: 100,
      height: 250,
    },
  ];
 
  export const resizerImages = async (req, res, next) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
   
    // Used by multer .array() or .single
    // const filename = `gallery-${Date.now()}`;
   
    // Used by multer .fields and filename must be same object prop
    const filename = {
      cover: `cover-${Date.now()}`,
      gallery: `gallery-${Date.now()}`,
    };
    
    const uploadPath = `./public/uploads/${year}/${month}`;
   
    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${year}/${month}`;
   
    // sharp options
    const sharpOptions = {
      fit: "contain",
      background: { r: 255, g: 255, b: 255 },
    };
   
    // create a new instance of MulterSharpResizer and pass params
    const resizeObj = new MulterSharpResizer(
      req,
      filename,
      sizes,
      uploadPath,
      fileUrl,
      sharpOptions
    );
   
    // call resize method for resizing files
    await resizeObj.resize();
    const getDataUploaded = resizeObj.getData();
   
    // Get details of uploaded files: Used by multer fields
    req.body.cover = getDataUploaded.cover;
    req.body.gallery = getDataUploaded.gallery;
   
    // Get details of uploaded files: Used by multer .array() or .single()
    // req.body.cover = getDataUploaded;
    // req.body.gallery = getDataUploaded;
   
    next();
  };