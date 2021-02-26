[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/mowatermelon/all-year-calendar)

# bili-up

最近看 B 站比较多，想着弄一个 UP 更新日历，主要是每次关注了一个 宝藏 up 之后，想着跳到指定日期观看，也可以看看他这一年的更新情况，比如累计的更新频率，点赞数和投币数之类。
页面整体是一个全年日历的形式，一个搜索框吊顶，可以输入 B 站 up 姓名 或者 UID，再加上一行全年累计统计，累计的更新频率，点赞数和投币数之类，还有一块图例(说明不同颜色代表的含义)

单天如果有发布视频，日历上会显示 蓝色，点击蓝色日历块吗，可以弹出当天的发布的视频概要和跳转地址。

![image](https://user-images.githubusercontent.com/18508817/109245326-35faa180-781b-11eb-82d5-ac1cecdc0bf6.png)


![image](https://user-images.githubusercontent.com/18508817/108489388-79658500-72dc-11eb-8c6f-347ea05ca680.png)

## 项目使用

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
