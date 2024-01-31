// Error404 Errors
const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404)
    next(error);
}

// handle 404 errors
const HandleError = (error, req, res, next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500).json({message: error.message || "An unknown error occurred"})
}
export  {notFound, HandleError}
