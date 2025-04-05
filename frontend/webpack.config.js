module.exports = {
  devServer: {
    allowedHosts: ['.localhost', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': 'http://localhost:5000'
    },
    host: 'localhost',
    port: 3000,
    hot: true
  }
}; 