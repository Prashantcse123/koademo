const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const views = require('koa-views');
const schedule = require('node-schedule');
const KoaRouter = require('koa-router');

const date = new Date(2018, 8, 19, 18, 30, 0);
const rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 1);

schedule.scheduleJob('*/5 * * * * *', () => {
  console.log('Prashant Sharma');
});


schedule.scheduleJob(rule, () => {
  console.log(rule);
  console.log('Today is recognized by Rebecca Black!---------------------------');
});

const j = schedule.scheduleJob(date, () => {
  console.log('The world is going to end today.');
});
const Router = new KoaRouter();
const app = new Koa();
const serverCallback = app.callback();
app.use(views(path.join(__dirname, '/angular'), {
  extension: 'html',
}));

const config = {
  domain: 'localhost',
  http: {
    port: 8080,
  },
  https: {
    port: 8081,
    options: {
      key: fs
        .readFileSync(
          path.resolve(process.cwd(), 'cert/server_key.pem'),
          'utf8',
        )
        .toString(),
      cert: fs
        .readFileSync(
          path.resolve(process.cwd(), 'cert/server_cert.pem'),
          'utf8',
        )
        .toString(),
      requestCert: true,
      rejectUnauthorized: false,
      ca: [
        fs.readFileSync(
          path.resolve(process.cwd(), 'cert/server_key.pem'),
          'utf8',
        ),
      ],
    },
  },
};

function getHello(ctx) {
  const clientIP = ctx.request.ip;
  ctx.body = `Hello World ${clientIP}`;
  console.log(clientIP);
}

async function showIndexPage(ctx) {
  await ctx.render('index');
}

async function getRed(ctx) {
  await ctx.render('red');
}
async function getGreen(ctx) {
  await ctx.render('green');
}
async function getBlue(ctx) {
  await ctx.render('blue');
}

Router.get('/', showIndexPage);

Router.get('/hello', getHello);
Router.get('/red', getRed);
Router.get('/green', getGreen);
Router.get('/blue', getBlue);

app.use(Router.routes());

try {
  const httpServer = http.createServer(serverCallback);
  httpServer.listen(config.http.port, (err) => {
    if (err) {
      console.error('HTTP server FAIL: ', err, err && err.stack);
    } else {
      console.log(
        `HTTP  server OK: http://${config.domain}:${config.http.port}`,
      );
    }
  });
} catch (ex) {
  console.error('Failed to start HTTP server\n', ex, ex && ex.stack);
}

try {
  const httpsServer = https.createServer(config.https.options, serverCallback);
  httpsServer.listen(config.https.port, (err) => {
    if (err) {
      console.error('HTTPS server FAIL: ', err, err && err.stack);
    } else {
      console.log(
        `HTTPS server OK: http://${config.domain}:${config.https.port}`,
      );
    }
  });
} catch (ex) {
  console.error('Failed to start HTTPS server\n', ex, ex && ex.stack);
}
