(function () {
  // #region 公共方法和全局状态管理
  const $ = mdui.$;
  const config = {
    PUBLISH_CLASS: 'mdui-color-teal',
    DATE_RENDER_SELECTOR: 'dateRender',
    DATE_RENDER_TYPE: ['cn', 'en'],
    LAN_SWITCH_SELECTOR: '#languageSelect',
    LAN_VAL_SELECTOR: '#dateLanguage',
    VIDEO_LIST_SELECTOR: '#VideoLengthCount',
    PUBLISH_SELECTOR: '#publishCount',
    COMMENT_SELECTOR: '#commentCount',
    BARRAGE_SELECTOR: '#barrageCount',
    UNION_SELECTOR: '#unionCount',
    VIDEO_LIST_ATTR: 'length',
    CREATED_TIME_ATTR: 'created',
    COMMENT_ATTR: 'comment',
    BARRAGE_ATTR: 'video_review',
    UNION_ATTR: 'is_union_video',
  };
  /**
   * 成功执行之后的提示
   * @param {string} msg 提示的信息
   * @return null
   */
  const successTip = function (msg) {
    msg && mdui.snackbar({
      message: msg,
      position: 'top',
    });
  };
  const throttleFn = fn => $.throttle(fn, 300);
  // @config：配置，具体配置项目看下面
  // @param：为方法时需要传递的参数
  $.fn.extend({
    fullYearPicker(_config, param) {
      if (_config === 'setDisabledDay' || _config === 'setYear'
        || _config === 'getSelected'
        || _config === 'acceptChange') { // 方法
        const me = $(this);
        if (_config === 'setYear') { // 重置年份
          me.data('config').year = param;// 更新缓存数据年份
          me.find('div.year a:first').trigger('click', true);
        } else if (_config === 'getSelected') { // 获取当前当前年份选中的日期集合（注意不更新默认传入的值，要更新值请调用acceptChange方法）
          return me.find('td.selected').map(function () {
            return getDateStr(this);
          }).get();
        } else if (_config === 'acceptChange') { // 更新日历值，这样才会保存选中的值，更换其他年份后，再切换到当前年份才会自动选中上一次选中的值
          me.data('config').value = me
            .fullYearPicker('getSelected');
        } else {
          me.find('td.disabled').removeClass('disabled');
          me.data('config').disabledDay = param;// 更新不可点击星期
          if (param) {
            me
              .find('table tr:gt(1)')
              .find('td')
              .each(
                function () {
                  if (param
                    .indexOf(this.cellIndex) !== -1) {
                    this.className = (this.className || '')
                      .replace(
                        'selected',
                        '')
                      + (this.className ? ' '
                        : '')
                      + 'disabled';
                  }
                });
          }
        }
        return this;
      }
      // @year:显示的年份
      // @disabledDay:不允许选择的星期列，注意星期日是0，其他一样
      // @cellClick:单元格点击事件（可缺省）。事件有2个参数，第一个@dateStr：日期字符串，格式“年-月-日”，第二个@isDisabled，此单元格是否允许点击
      // @value:选中的值，注意为数组字符串，格式如['2016-6-25','2016-8-26'.......]
      _config = $.extend({
        year: new Date().getFullYear(),
        disabledDay: '',
        value: [],
      }, _config);
      return this
        .addClass('fullYearPicker')
        .each(
          function () {
            const me = $(this),
              year = _config.year || new Date().getFullYear(),
              newConifg = {
                cellClick: _config.cellClick,
                disabledDay: _config.disabledDay,
                year,
                value: _config.value,
              };
            me.data('config', newConifg);

            me.append('<div class="year">'
              + '<table>'
              + '<th class="year-operation-btn"><a href="#" class="chevron-left"><i class="mdui-icon material-icons">chevron_left</i></a></th>'
              + '<th class="left_sencond_year year_btn">' + '' + '</th>'
              + '<th class="left_first_year year_btn">' + '' + '</th>'
              + '<th id="cen_year" class="cen_year year_btn">' + year + '</th>'
              + '<th class="right_first_year year_btn">' + '' + '</th>'
              + '<th class="right_sencond_year year_btn">' + '' + '</th>'
              + '<th class="year-operation-btn"><a href="#" class="chevron-right"><i class="mdui-icon material-icons">chevron_right</i></a></th>'
              + '</table>'
              + '<div class="stone"></div></div><div class="picker"></div>')
              .find('.year-operation-btn')
              .on('click',
                function (e, setYear) {
                  if (setYear) { year = me.data('config').year; } else { $(this).children('a').hasClass('chevron-left') ? year-- : year++; }
                  setYearMenu(year);
                  renderYear(
                    year,
                    $(this).closest('div.fullYearPicker'),
                    newConifg.disabledDay,
                    newConifg.value);
                  renderListDate();
                  document.getElementById('cen_year').firstChild.data = year;
                  return false;
                });
            setYearMenu(year);
            // 年份选择
            $('.year .year_btn').on('click', function () {
              const class_name = $(this).attr('class');
              if (class_name.indexOf('cen_year') < 0) {
                const year = parseInt($(this).text());
                setYearMenu(year);
                renderYear(year, me, newConifg.disabledDay, newConifg.value);
                renderListDate();
              }
            });
            renderYear(year, me, newConifg.disabledDay,
              newConifg.value);

          });
    },
  });
  window.onload = function () {
    // 绑定检索事件
    window.searchFn = function (...args) {
      $(`td.${config.PUBLISH_CLASS}`).removeClass(config.PUBLISH_CLASS);
      const keywords = $('#keywords').val();
      window.requestByName(keywords, ...args);
    };

    $('[data-toggle="search"]').on('click', throttleFn(searchFn));
    $('#keywords').on('keydown', throttleFn(function (e) {
      e.code === 'Enter' && searchFn();
    }));

    $(config.LAN_SWITCH_SELECTOR).on('change', throttleFn(function () {
      // const selectLanguage = $(this).prop('checked') ? config.DATE_RENDER_TYPE[0] : config.DATE_RENDER_TYPE[1];
      // $(config.LAN_VAL_SELECTOR).text(selectLanguage);
      // loading_calendar(config.DATE_RENDER_SELECTOR, selectLanguage);
      // renderListDate();
    }));
    /* 日历*/
    window.onresize = change;
    change();

    // 加载默认数据
    window.initStore();
    // const mockData = window.getMockData().data;
    // window.renderListDate(mockData.list.vlist, mockData.page);
  };
  // #endregion


  // #region 日历基础渲染相关代码

  let aim_div = '';// 目标div 放置日历的位置
  let m = 0;// 使用标识,之前页面记录的几列
  let n = 0;// 使用标识,根据页面宽度决定日历分为几列
  let language = 'cn';// 语言选择
  let month_arry;
  let week_arry;
  const month_cn = new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月');// 月
  const month_en = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');// 月
  const week_cn = new Array('日', '一', '二', '三', '四', '五', '六');// 星期
  const week_en = new Array('Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa');// 星期


  loading_calendar(config.DATE_RENDER_SELECTOR, config.DATE_RENDER_TYPE[0]);
  function loading_calendar(id, lan) {
    aim_div = '#' + id;
    language = lan;
    if (lan == 'cn') {
      month_arry = month_cn;
      week_arry = week_cn;
    } else {
      month_arry = month_en;
      week_arry = week_en;
    }
    // 开始
    $(aim_div).fullYearPicker({
      disabledDay: '',
      value: [ /* '2016-6-25', '2016-8-26'  */],
      cellClick(_dateStr, isDisabled) {
        // $("#calendar-modal-1").modal();
        $('.month-container .selected').removeClass('selected');
      },
    });
  }

  function change() {
    const obj = $(aim_div);
    const m_obj = $('.fullYearPicker .month-container');
    const width = obj.width();
    const class_width = 'month-width-';
    n = parseInt(width / 400);
    if (n == 5) n = 4;
    if (n > 6) n = 6;

    if (n != m) {
      m_obj.removeClass(class_width + m);
      m_obj.addClass(class_width + n);
      m = n;
    }

  }

  function changeHandle() {
    m = 0;
    change();

  }

  // 设置年份菜单
  function setYearMenu(year) {
    $('.year .left_first_year').text(year - 1 + '');
    $('.year .left_sencond_year').text(year - 2 + '');
    $('.year .cen_year').text(year);
    $('.year .right_first_year').text(year + 1 + '');
    $('.year .right_sencond_year').text(year + 2 + '');
  }

  function getTdClass(i, disabledDay, sameMonth, values, dateStr) {

    let cls = i == 0 || i == 6 ? 'weekend' : '';
    if (disabledDay && disabledDay.indexOf(i) != -1) { cls += (cls ? ' ' : '') + 'disabled'; }
    if (!sameMonth) {
      cls += (cls ? ' ' : '') + 'empty';
    } else {
      cls += (cls ? ' ' : '') + 'able_day';
    }
    if (sameMonth && values && cls.indexOf('disabled') == -1
      && values.indexOf(',' + dateStr + ',') != -1) { cls += (cls ? ' ' : '') + 'selected'; }
    return cls == '' ? '' : ' class="' + cls + '"';
  }
  function renderMonth(year, month, clear, disabledDay, values) {

    const d = new Date(year, month - 1, 1);
    let s = "<div class='month-container'>" + '<table cellpadding="0" cellspacing="1" border="0"'
      + (clear ? ' class="right"' : '')
      + '>'
      + '<tr><th colspan="7" class="head"  index="' + month + '">' /* + year + '年'  */
      + month_arry[month - 1]
      + '</th></tr>'
      + '<tr><th class="weekend">' + week_arry[0] + '</th><th>' + week_arry[1] + '</th><th>' + week_arry[2] + '</th><th>' + week_arry[3] + '</th><th>' + week_arry[4] + '</th><th>' + week_arry[5] + '</th><th class="weekend">' + week_arry[6] + '</th></tr>';
    const dMonth = month - 1;
    const firstDay = d.getDay();
    let hit = false;
    s += '<tr>';
    for (let i = 0; i < 7; i++) {
      if (firstDay == i || hit) {
        s += '<td'
          + getTdClass(i, disabledDay, true, values, year
            + '-' + month + '-' + d.getDate())
          + (d.getMonth() == dMonth ? 'data-date="' + year + '-' + month + '-' + d.getDate() + '"'
            : '')
          + '>' + d.getDate() + '</td>';
        d.setDate(d.getDate() + 1);
        hit = true;
      } else {
        s += '<td' + getTdClass(i, disabledDay, false)
          + '>&nbsp;</td>';
      }
    }
    s += '</tr>';
    for (let i = 0; i < 5; i++) {
      s += '<tr>';
      for (let j = 0; j < 7; j++) {
        s += '<td'
          + getTdClass(j, disabledDay,
            d.getMonth() == dMonth, values, year
            + '-' + month + '-'
          + d.getDate())
          + (d.getMonth() == dMonth ? 'data-date="' + year + '-' + month + '-' + d.getDate() + '"'
            : '')
          + '>'
          + (d.getMonth() == dMonth ? d.getDate()
            : '&nbsp;') + '</td>';
        d.setDate(d.getDate() + 1);
      }
      s += '</tr>';
    }
    return s + '</table></div>' + (clear ? '<br>' : '');
  }
  function getDateStr(td) {
    return td.parentNode.parentNode.rows[0].cells[0].getAttribute('index') + '-' + td.innerHTML;
  }
  function renderYear(year, el, disabledDay, value) {
    el.find('td').off();
    let s = '',
      values = ',' + value.join(',') + ',';
    for (let i = 1; i <= 12; i++) { s += renderMonth(year, i, false, disabledDay, values); }
    s += "<div class='date_clear'></div>";
    el
      .find('div.picker')
      .html(s)
      .find('td')
      /* 单击日期单元格*/
      .on('click',
        function () {
          if (!/disabled|empty/g.test(this.className)) { $(this).toggleClass('selected'); }
          if (this.className.indexOf('empty') == -1
            && typeof el.data('config').cellClick === 'function') {
            el
              .data('config')
              .cellClick(
                getDateStr(this),
                this.className
                  .indexOf('disabled') != -1);
          }
        }
      );
    changeHandle();
  }
  // #endregion 日历基础渲染相关代码

  // #region 处理 B 站接口返回数据相关
  function getDateSelector(dateStr) {
    return dateStr ? $(`td[data-date="${dateStr}"]`) : $('td[data-date]');
  }
  /**
   * 对边界数据做相关处理，比如单次请求得到的，最早日期和最晚日期
   * @param {array} data 接口返回的数据
   * @param {number} type 边界处理类型，0 最早日期，1 最晚日期
   * @return {Boolean} res 当前日期是否超出边界
   */
  function formatBoundaryDate(data, type) {
    const isEarliest = type === 0;
    const dealIndex = isEarliest ? data.length - 1 : 0;
    const currYear = Number($('.year .cen_year').text());
    const currDate = data[dealIndex][config.CREATED_TIME_ATTR];
    const currDateObj = formatTime(currDate, true);
    // 校验年和边界年在一年的时候，才做校验
    if (currYear !== currDateObj.year) {
      return false;
    }
    const checkDay = isEarliest ? new Date(currYear, 0, 1) : new Date(currYear, 11, 30);
    const currDay = new Date(currDateObj.year, currDateObj.month - 1, currDateObj.day);

    let isExceed = false;
    switch (type) {
      case 0: {
        // 视频数据的最早日期是小于当前年一月，则代表数据是安全的
        isExceed = checkDay - currDay < 0;
        break;
      }
      case 1: {
        // 视频数据的最晚日期是大于当前年十二月，则代表数据是安全的
        isExceed = currDay - checkDay < 0;
        break;
      }
    }
    return isExceed;

  }
  function formatTime(time, needObj) {
    const currDate = new Date(Number(time) * 1000);
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth() + 1;
    const currDay = currDate.getDate();
    return !needObj ? `${currYear}-${currMonth}-${currDay}` : {
      year: currYear,
      month: currMonth,
      day: currDay,
    };
  }
  function dealWithMinuteAdd(data) {
    if (data === 0) {
      return data;
    }
    const minutesArr = data.split(',');
    return minutesArr && minutesArr.reduce(function (acc, cur) {
      if (cur === '0') {
        return acc;
      }
      const timeArr = cur.split(':');
      const hoursInMilliseconds = timeArr[0] * 60;	// hours
      const minutesInMilliseconds = timeArr[1]; // minutes
      acc += Number(hoursInMilliseconds) + Number(minutesInMilliseconds);
      return acc;
    }, 0);
  }
  function renderCountByUser(data) {
    $(config.VIDEO_LIST_SELECTOR).text(dealWithMinuteAdd(data[config.VIDEO_LIST_SELECTOR]));
    $(config.PUBLISH_SELECTOR).text(data[config.PUBLISH_SELECTOR]);
    $(config.COMMENT_SELECTOR).text(data[config.COMMENT_SELECTOR]);
    $(config.BARRAGE_SELECTOR).text(data[config.BARRAGE_SELECTOR]);
    $(config.UNION_SELECTOR).text(data[config.UNION_SELECTOR]);
  }

  window.checkBoundaryDate = function (data, page) {
    // debugger;
    !page && (page = { pn: 1, count: data.length, numPages: 1 });
    const DEFAULT_RETURN = true;
    // 先确认是否还有可检索的数据
    if (page.count <= data.length || page.pn === page.numPages) {
      return DEFAULT_RETURN;
    }
    // 再确认最早的日期是否超过的边界
    let isExceed = formatBoundaryDate(data, 0);
    if (isExceed) {
      window.searchFn(++page.pn);
      return !DEFAULT_RETURN;
    }
    // 再确认最晚的日期是否超过的边界
    isExceed = formatBoundaryDate(data, 0);
    if (isExceed) {
      window.searchFn(--page.pn);
      return !DEFAULT_RETURN;
    }
    return DEFAULT_RETURN;
  };

  window.renderListDate = function (data, page) {
    const countData = {
      [config.VIDEO_LIST_SELECTOR]: 0,
      [config.PUBLISH_SELECTOR]: 0,
      [config.COMMENT_SELECTOR]: 0,
      [config.BARRAGE_SELECTOR]: 0,
      [config.UNION_SELECTOR]: 0,
    };
    renderCountByUser(countData);
    const oldData = $.data(document.body, 'findData') || [];
    !data && (data = oldData);
    !page && (page = $.data(document.body, 'page') || {});
    page.numPages = Math.floor(page.count / page.ps);
    if (!data || !data.length) {
      return;
    }
    if (!checkBoundaryDate(data, page)) {
      // 如果超过了边界，则不做存储和后续处理
      return;
    }
    if (oldData[0]) {
      const oldItem = oldData[0]
        .title !== oldData[0].title
      const currItem = data[0]
      if (oldItem.author === currItem.author && oldItem.title !== currItem.title) {
        // 代表是同一个 UP 检索数据库后一页数据
        // 则将两次的数据都缓存起来
        data = data.concat(oldData);
      }
    }
    const storeData = {};

    const currYear = $('#cen_year').text();
    const currUser = $('#keywords').val();
    $(getDateSelector()).off('click');
    $.each(data, function (index, item) {
      const currDate = formatTime(item[config.CREATED_TIME_ATTR]);
      !storeData[currDate] && (storeData[currDate] = []);
      storeData[currDate].push(item);
      const $item = $(getDateSelector(currDate));
      if ($item.length) {
        countData[config.VIDEO_LIST_SELECTOR] += ',' + item[config.VIDEO_LIST_ATTR];
        countData[config.PUBLISH_SELECTOR]++;
        countData[config.COMMENT_SELECTOR] += item[config.COMMENT_ATTR];
        countData[config.BARRAGE_SELECTOR] += item[config.BARRAGE_ATTR];
        item[config.UNION_ATTR] && countData[config.UNION_SELECTOR]++;
      }
      $item.addClass(config.PUBLISH_CLASS).on('click', function (e) {
        const currPublishData = storeData[currDate];
        mdui.alert(window.getPublishDateStr(currPublishData), currDate);
      });
      renderCountByUser(countData);
    });
    successTip(`${currUser} 在 ${currYear} 年一共发布了 ${countData[config.PUBLISH_SELECTOR]} 支视频~~`);

    // 缓存相关数据
    $.data(document.body, {
      findData: data,
      storeData,
      countData,
      page,
    });
  };

  // #endregion 处理 B 站接口返回数据相关
})();
