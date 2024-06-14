module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://github.com/nk9/gannett',
        permanent: true,
      },
    ]
  },
};
