
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images!', 400), false);
    }
}


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();
    // console.log( await req.body.imageCover);

    //1) Cover Image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/tours/${req.body.imageCover}`);

      //  res.json({url:'https://shielded-retreat-77960.herokuapp.com/images/tours/'+req.body.imageCover})

    //2)Images
    req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/tours/${filename}`);


      req.body.images.push('https://shielded-retreat-77960.herokuapp.com/images/tours/'+filename);
    })
  );


    next();
});



exports.getAllTours = catchAsync(async (req, res) => {
    //BUILD QUERY
    //1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);


    //Advanced filtering
    //    let quertStr=JSON.stringify(queryObj);
    //    quertStr=quertStr.replace(/\b(gte||gt||lte||lt)\b/g, match =>`$${match}`);

    //console.log(req.query,queryObj);
    let query = Tour.find(queryObj);

    //2) Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createAt');
    }

    const tours = await query;


    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })

});

exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);


