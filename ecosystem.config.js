module.exports = {
  apps : [{
    name      : 'app',
    script    : 'app.js',
    env: {
      COMMON_VARIABLE: true
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '111.230.201.47',
      ref  : 'origin/master',
      repo : 'https://github.com/autumnQH/ecough.git',
      path : '/home/www/production',
      ssh_options: 'StrictHostKeyChecking=no',
      'post-deploy': 'git pull && npm install && pm2 startOrRestart ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
