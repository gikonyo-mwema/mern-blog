const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err.stack || err.message);
    res.status(err.statusCode || 500).json({
      success: false,
      statusCode: err.statusCode || 500,
      message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  };
  
  export default errorHandler;
  