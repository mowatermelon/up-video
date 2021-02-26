'use strict';

const Service = require('egg').Service;
// https://eggjs.org/zh-cn/core/httpclient.html#options-%E5%8F%82%E6%95%B0%E8%AF%A6%E8%A7%A3
class HomeService extends Service {
  constructor(...args) {
    super(...args);
    this.config = {
      BASE_URL: 'https://api.bilibili.com',
      NUMBER_REG: /[1-9]/,
      FIND_USER_URL: '/x/web-interface/search/type',
      FIND_LIST_URL: '/x/space/arc/search',
      DEFAULT_UID: 546195,
      UID_ATTR: 'uid',
    };
  }
  error(msg) {
    return (this.ctx.body = { code: 0, msg });
  }
  success(data) {
    return (this.ctx.body = { code: 1, data });
  }
  async request(url, data) {
    const { ctx } = this;
    const result = await ctx.curl(this.config.BASE_URL + url, { data, dataType: 'json' });
    ctx.status = result.status;
    if (!!result.code || !result.data) {
      return;
    }
    return result.data;
  }
  async findName(uname) {
    const param = {
      search_type: 'bili_user',
      page: 1,
      user_type: 1,
      keyword: uname,
      order: 'pubdate',
      jsonp: 'jsonp',
    };
    const res = await this.request(this.config.FIND_USER_URL, param);
    if (!res || !res.data || !res.data.result || !res.data.numResults) {
      return this.error('未查询到有效数据');
    }
    const data = res.data.result;
    if (!data.length) {
      return this.error('未查询到有效数据');
    }
    let currItem = data.filter(item => item.uname === uname);
    if (!currItem || !currItem.length) {
      return this.error('未查询到有效数据');
    }
    currItem = currItem[0];
    if (!currItem || !currItem.mid) {
      return this.error('未查询到有效数据');
    }
    return this.success(currItem);
  }
  async findVideo(uid, page) {
    if (!uid || !this.config.NUMBER_REG.test(uid)) {
      return this.error('请输入有效的 UP 用户标识');
    }
    const pn = this.config.NUMBER_REG.test(page) ? page : 1;
    const param = {
      mid: uid,
      ps: 100,
      tid: 0,
      pn,
      order: 'pubdate',
      jsonp: 'jsonp',
    };

    const res = await this.request(this.config.FIND_LIST_URL, param);
    if (!res || !res.data) {
      return this.error(res.message);
    }
    if (!res.data.list || !res.data.page) {
      return this.error('未查询到有效数据');
    }
    const numResults = res.data.page.count;
    const data = res.data.list.vlist;
    if (!numResults || !data.length) {
      return this.error('未查询到有效数据');
    }
    return this.success({ data, page: res.data.page });
  }
}

module.exports = HomeService;
