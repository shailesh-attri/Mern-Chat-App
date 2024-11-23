const HandleError = (error, req, res, next) => {
    console.error(error); // Log the error for debugging purposes
    
    if (res.headersSent) {
        return next(error);
    }
    
    res.status(500).json({ message: "An unexpected error occurred" });
};

export { HandleError };
