module.exports = (err, callback) => {
  const response = {
    statusCode: 500,
    body: JSON.stringify({
      error: JSON.stringify(err)
    })
  };

  callback(JSON.stringify(err), response)
}
