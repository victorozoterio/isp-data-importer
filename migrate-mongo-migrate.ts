const config = {
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://root:root@localhost:27017/isp-data-importer?authSource=admin',
    options: {},
  },
  migrationsDir: 'src/migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.ts',
};

module.exports = config;
