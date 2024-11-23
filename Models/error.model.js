class HttpError extends Error {
    constructor(message, errCode){
        super(message)
        this.code = errCode;
    }
}
export default HttpError;