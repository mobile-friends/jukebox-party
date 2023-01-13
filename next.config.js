const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
});
