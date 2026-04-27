class ResponseFormatter {
  static success(data, message = 'Operação realizada com sucesso', statusCode = 200) {
    return {
      statusCode,
      body: {
        success: true,
        data,
        message
      }
    };
  }

  static error(error, statusCode = 500) {
    return {
      statusCode,
      body: {
        success: false,
        error: error.message || error,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    };
  }

  static paginated(data, page = 1, limit = 10, total = 0) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = ResponseFormatter;
