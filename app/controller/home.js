'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('/home/index.ejs');
  }
  async findName() {
    const { ctx } = this;
    const { name } = ctx.params;
    return ctx.service.home.findName(name);
  }
  async findVideo() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { page } = ctx.query;
    return ctx.service.home.findVideo(id, page);
  }
}

module.exports = HomeController;
