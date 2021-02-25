'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/up/:name', controller.home.findName);
  router.get('/video/:id', controller.home.findVideo);
};
