/**
 * 交叉路口红绿灯组件渲染引擎（重置版）
 * 支持更多的初始化配置
 * 可配置 路口个数 灯柱个数 各个路口红绿灯个数
 * 并根据配置自动识别灯柱编号
 * @method shuaiwuLi
 */
let $ = window['$']
class TrafficLightR {
  constructor (config = {}, api) {
    this.api = api
    this.timerObj = {}
    this.defaultConfig = {
      'id': 'cross_id', // 组件唯一ID
      'pCon': null, // 父容器对象
      'rotate': 0, // 旋转角度 可根据路口角度进行设置 默认不旋转
      'isShowInfo': false,
      'style': {
        'width': '28rem',
        'height': '28rem',
        'margin': '0 auto',
        'marginTop': '2rem'
      },
      'zebraCrosses': [ // 对各斑马线进行设置
        {
          'name': 'top',
          'isShow': true,
          'lampSet': { // 灯柱设置
            'left': [
              {
                'num': '1', // 灯柱编号
                'pos': 'edge' // 位置 edge:边缘 center:中间
              },
              {
                'num': '2', // 灯柱编号
                'pos': 'center' // 位置 edge:边缘 center:中间
              }
            ], // 左侧斑马线
            'right': [
              {
                'num': '3', // 灯柱编号
                'pos': 'center' // 位置 edge:边缘 center:中间
              },
              {
                'num': '4', // 灯柱编号
                'pos': 'edge' // 位置 edge:边缘 center:中间
              }
            ]// 右侧斑马线
          },
          'lightSet': [ // 红绿灯设置
            { 'direction': 'left', 'num': '1' },
            { 'direction': 'before', 'num': '2' },
            { 'direction': 'right', 'num': '3' }
          ]
        }
      ]
    }
    this.config = $.extend(this.defaultConfig, config)
    this.initComponent()
  }
  initComponent () { // 初始化组件
    let _self = this
    let $grid = this.createGrid()
    _self.config.zebraCrosses.forEach((item, index) => {
      if (item['name'] === 'top') {
        let $nTop = _self.renderTop(index)
        $grid.append($nTop)
      } else if (item['name'] === 'right') {
        let $nRight = _self.renderRight(index)
        $grid.append($nRight)
      } else if (item['name'] === 'bottom') {
        let $nBottom = _self.renderBottom(index)
        $grid.append($nBottom)
      } else if (item['name'] === 'left') {
        let $nLeft = _self.renderLeft(index)
        $grid.append($nLeft)
      }
    })
    // 渲染交通信号灯
    _self.renderTrafficLights()
    _self.setContainerStyle()
    // 展示信息列表
    if (this.config.isShowInfo) {
      this.showInfo()
    }
  }
  createGrid () { // 创建容器
    let conHtml = '<div class="cross-container" id="' + this.config.id + '"></div>'
    this.config.pCon.html(conHtml)
    return $('#' + this.config.id)
  }
  setContainerStyle () { // 设置样式
    $('.cross-container').css(this.config.style)
  }
  createRoadGrid (className, type, num) { // 生成组件 cross-top top
    let _self = this
    let html = ''
    let zebraCrosses = _self.config.zebraCrosses
    zebraCrosses.forEach((item, index) => {
      let trafficLight = ''
      if (item['name'] === type && item['isShow']) {
        if (!zebraCrosses.some(item => item.name === 'bottom')) {
          switch (type) {
            case 'top':
              html += '<div class="cross-con ' + className + ' road-red-2">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'right':
              html += '<div class="cross-con ' + className + ' road-red-3">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'left':
              html += '<div class="cross-con ' + className + ' road-red-1">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
          }
        } else if (!zebraCrosses.some(item => item.name === 'top')) {
          switch (type) {
            case 'bottom':
              html += '<div class="cross-con ' + className + ' road-red-2">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'right':
              html += '<div class="cross-con ' + className + ' road-red-1">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'left':
              html += '<div class="cross-con ' + className + ' road-red-3">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
          }
        } else if (!zebraCrosses.some(item => item.name === 'left')) {
          switch (type) {
            case 'bottom':
              html += '<div class="cross-con ' + className + ' road-red-3">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'right':
              html += '<div class="cross-con ' + className + ' road-red-2">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'top':
              html += '<div class="cross-con ' + className + ' road-red-1">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
          }
        } else if (!zebraCrosses.some(item => item.name === 'right')) {
          switch (type) {
            case 'bottom':
              html += '<div class="cross-con ' + className + ' road-red-1">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'left':
              html += '<div class="cross-con ' + className + ' road-red-2">'
              trafficLight = _self.renderTrafficLights(type, num, item)
              break
            case 'top':
              html += '<div class="cross-con ' + className + ' road-red-3">'
              _self.renderTrafficLights(type, num, zebraCrosses)
              break
          }
        } else {
          html += '<div class="cross-con ' + className + ' road-red-0">'
          trafficLight = _self.renderTrafficLights(type, num, item)
        }
        html += '<div class="cross-con-left">'
        item.lampSet.left.forEach((item2, index) => {
          if (item2['pos'] === 'center') {
            html += '<div class="light_num_' + item2['num'] + ' cross-con-left-center light-red"></div>'
          } else {
            html += '<div class="light_num_' + item2['num'] + ' cross-con-left-edge light-red transform-90"></div>'
          }
        })
        html += '</div>'
        html += '<div class="cross-con-right">'
        item.lampSet.right.forEach((item2, index) => {
          if (item2['pos'] === 'center') {
            html += '<div class="light_num_' + item2['num'] + ' cross-con-right-center light-red"></div>'
          } else {
            html += '<div class="light_num_' + item2['num'] + ' cross-con-right-edge light-red transform90"></div>'
          }
        })
        html += '</div>'
        html += trafficLight
        html += '</div>'
      }
    })
    return html
  }
  renderLightNumDomByRoadType (roadType) { // 分情况渲染信号灯读秒容器
    let html = ''
    switch (roadType) { //     /* transform: rotate(-90deg);
      case 'top':
        html += this.getLightNumSpan(0)
        break
      case 'right':
        html += this.getLightNumSpan(-90)
        break
      case 'bottom':
        html += this.getLightNumSpan(180)
        break
      case 'left':
        html += this.getLightNumSpan(90)
        break
    }
    return html
  }
  getLightNumSpan (num) { // 获取不同旋转角度信号灯读秒容器
    return '<span class="redColor" style="transform: rotate(' + num + 'deg);">88</span>'
  }
  renderTrafficLights (roadType, num, zebraCrossesObj) { // 渲染红绿灯
    let _self = this
    try {
      let html = ''
      if (zebraCrossesObj.hasOwnProperty('lightSet')) {
        html += '<div class="traffic-light-container">'
        let lights = zebraCrossesObj['lightSet']
        lights.forEach((item, index) => {
          switch (item['direction']) {
            case 'left':
              html += '<div><span class="trafficLight_' + item['num'] + ' traffic-light-left-red-0"></span>'
              html += _self.renderLightNumDomByRoadType(roadType)
              html += '</div>'
              break
            case 'before':
              html += '<div><span class="trafficLight_' + item['num'] + ' traffic-light-before-red-0"></span>'
              html += _self.renderLightNumDomByRoadType(roadType)
              html += '</div>'
              break
            case 'right':
              html += '<div><span class="trafficLight_' + item['num'] + ' traffic-light-right-red-0"></span>'
              html += _self.renderLightNumDomByRoadType(roadType)
              html += '</div>'
              break
          }
        })
      }
      html += '</div>'
      return html
    } catch (e) {
      console.error('错误待处理')
    }
  }
  renderTop (num) { // 渲染上路口
    let html = this.createRoadGrid('cross-top', 'top', num)
    return $(html)
  }
  renderRight (num) { // 渲染右路口
    let html = this.createRoadGrid('cross-right', 'right', num)
    return $(html)
  }
  renderBottom (num) { // 渲染下路口
    let html = this.createRoadGrid('cross-bottom', 'bottom', num)
    return $(html)
  }
  renderLeft (num) { // 渲染左路口
    let html = this.createRoadGrid('cross-left', 'left', num)
    return $(html)
  }

  setLightColor (domArr, type) { // 配置灯柱颜色
    domArr.forEach((item, index) => {
      switch (type) {
        case 0:
          item.removeClass('light-green').addClass('light-red')
          break
        case 1:
          item.removeClass('light-red').addClass('light-green')
          break
      }
    })
    return domArr
  }

  setRoadColor (road, type) { // 设置相关斑马线颜色
    let className = road.attr('class').split(' ')[2]
    road.removeClass(className)
    let colorStr = className.split('-')[1]
    switch (type) {
      case 0:
        road.addClass(className.replace(colorStr, 'red'))
        break
      case 1:
        road.addClass(className.replace(colorStr, 'green'))
        break
    }
    return road
  }
  intervalTimer ({ $dom = null, secondReading = 0, timerName = null }) { // 设置信号灯读秒
    let lighNum = timerName.split('_')[1]
    Object.keys(this.timerObj).forEach((item) => {
      if (item.split('_')[1] === lighNum) {
        clearInterval(item)
      }
    })
    if (this.timerObj.hasOwnProperty(timerName)) {
      clearInterval(this.timerObj[timerName])
    }
    this.timerObj[timerName] = setInterval(() => {
      $dom.text(secondReading--)
      if (secondReading === 0) {
        clearInterval(this.timerObj[timerName])
      }
    }, 1000)
    return this.timerObj[timerName]
  }
  setTrafficColor (traffic, type, secondReading, isBusFirst) { // 设置相关红绿灯颜色
    let className = traffic.attr('class')
    traffic.removeClass(className)
    let colorStr = className.split('-')[3]
    let $timeing = traffic.siblings() // 获取信号灯读秒容器
    this.intervalTimer({ $dom: $timeing, secondReading: secondReading, timerName: className.split(' ')[0] })
    switch (type) {
      case 0: // 红灯
        $timeing.css('color', '#D31A07')
        isBusFirst === true
          ? traffic.addClass(className.replace(colorStr, 'red_first')).addClass('lightFlash')
          : traffic.addClass(className.replace(colorStr, 'red')).removeClass('lightFlash')
        break
      case 1: // 黄灯
        $timeing.css('color', '#E0B540')
        traffic.addClass(className.replace(colorStr, 'yellow')).removeClass('lightFlash')
        break
      case 2: // 绿灯
        $timeing.css('color', '#4CB904')
        isBusFirst === true
          ? traffic.addClass(className.replace(colorStr, 'green_first')).addClass('lightFlash')
          : traffic.addClass(className.replace(colorStr, 'green')).removeClass('lightFlash')
        break
    }
    return traffic
  }
  // 展示信息详情
  showInfo () {
    let pCon = $(`#${this.config.id}_pCon`)
    let html =
        `<div class="trafficInfo">
            <div>
                <div><span>行人警示立柱总数：</span><span id="${this.config.id}_trafficInfo1">--</span></div>
                <div><span>行人警示立柱在线数：</span><span id="${this.config.id}_trafficInfo2">--</span></div>
            </div>
            <div>
                <div><span>车路协同路侧单元总数：</span><span id="${this.config.id}_trafficInfo3">--</span></div>
                <div><span>车路协同路侧单元在线数：</span><span id="${this.config.id}_trafficInfo4">--</span></div>
            </div>
        </div>`
    pCon.append($(html))
  }

  /**
  * 拓展操作方法
  * */
  // 更改指定编号灯柱颜色
  setLightByCode ({ seq = 1, state = 0 }) { // seq灯柱编号 state状态 0 红灯 1 绿灯
    // TODO:根据灯柱编号获取灯柱节和其兄弟灯柱节点和斑马线节点，改变其样式
    try {
      let $light = $(`#${this.config.id} .light_num_${seq}`) // 获取当前编码的灯柱节点
      let $subLight = $light.siblings() // 获取当前灯柱的兄弟节点
      let $lightPar = $light.parent() // 获取父节点
      let $subLightPar = $lightPar.siblings() // 父节点的兄弟节点
      let $nextLight = null // 另一侧的灯柱父节点
      for (let i = 0; i < $subLightPar.length; i++) {
        if ($($subLightPar[i]).attr('class') !== 'traffic-light-container') {
          $nextLight = $($subLightPar[i])
        }
      }
      let $nextLightChild = $nextLight.children()
      // 设置相关灯柱的颜色
      this.setLightColor([$light, $subLight, $nextLightChild], state)
      // 获取斑马线节点
      let $road = $lightPar.parent()
      // 设置相关斑马线的颜色
      this.setRoadColor($road, state)
    } catch (e) {
      console.error('当前灯柱编号不存在，请检查您的配置参数：' + e)
    }
  }

  // 更改指定编码交通指示灯的状态
  // seq 编号 state 0表示红灯,1表示黄灯,2表示绿灯 secondReading 读秒 isBusFirst 是否启动公交优先 Boolean
  setTrafficLightByCode ({ seq = 1, state = 0, secondReading = 0, isBusFirst = false }) {
    let $trafficLight = $(`#${this.config.id} .trafficLight_${seq}`)
    this.setTrafficColor($trafficLight, state, secondReading, isBusFirst)
  }

  // 灯柱点击事件回调函数
  roadLightClickEventBack (callBack) {
    this.config.zebraCrosses.forEach((item, index) => {
      let lampSet = item['lampSet']
      lampSet['left'].forEach((itemL, indexL) => {
        let $light = $(`#${this.config.id} .light_num_${itemL['num']}`)
        $light.bind('click', (event) => {
          if (callBack !== undefined && typeof callBack === 'function') {
            callBack(event, { num: itemL['num'], id: this.config.id })
          }
        })
        $light.bind('mouseover', (event) => {
          this.showLightSnapNum(event, { num: itemL['num'], id: this.config.id, name: item['name'] })
        })
        $light.bind('mouseout', (event) => {
          this.removeLightSnapNum()
        })
      })
      lampSet['right'].forEach((itemR, indexR) => {
        let $light = $(`#${this.config.id} .light_num_${itemR['num']}`)
        $light.bind('click', (event) => {
          if (callBack !== undefined && typeof callBack === 'function') {
            callBack(event, { num: itemR['num'], id: this.config.id })
          }
        })
        $light.bind('mouseover', (event) => {
          this.showLightSnapNum(event, { num: itemR['num'], id: this.config.id, name: item['name'] })
        })
        $light.bind('mouseout', (event) => {
          this.removeLightSnapNum()
        })
      })
    })
  }
  removeLightSnapNum () {
    if ($('.popView').length > 0) { $('.popView').remove() }
  }
  showLightSnapNum (event, { num = 1, id = 'cross1', name = 'top' }) {
    this.removeLightSnapNum()
    let $parCon = $('#' + id)
    let html = `
      <div class="popView">
        <div><span>立柱 ${num}#</span></div>
        <div><span>抓拍次数：</span><span id="${this.config.id}_snapNum">--</span></div>
      </div>`
    $parCon.append($(html))
    let x = event.pageX - $parCon.offset().left
    let y = event.pageY - $parCon.offset().top
    let popW = $('.popView').width()
    let popH = $('.popView').height()
    let style = {
      left: x - popW / 2,
      top: y - popH - 20
    }
    $('.popView').css(style)
    this.showLightSnapNumCallback(num, id)
  }
  showLightSnapNumCallback (num, id) {}
  // 加载traffic列表数据
  showTrafficInfo (api, crossName) {
    api['crossingLine.getInformationByCrossName']({
      'crossName': crossName
    }).then(res => {
      if (res['head'] && res['head']['success'] === 'true') {
        // 设置指标
        $(`#${this.config.id}_trafficInfo1`).text(res['data']['warnPost'])
        $(`#${this.config.id}_trafficInfo2`).text(res['data']['warnPostInline'])
        $(`#${this.config.id}_trafficInfo3`).text(res['data']['vRoad'])
        $(`#${this.config.id}_trafficInfo4`).text(res['data']['vRoadInline'])
      }
    })
  }
}
