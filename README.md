# trafficLight
### trafficLight 交通信号灯组件
### DEMO https://hulalalalala.github.io/trafficLight/index.html

### #========= API ==============#

> 
let config = {  
'id': 'cross_id', // 组件唯一ID
>       'pCon': null, // 父容器对象 jQuery dom 对象
>       'rotate': 0, // 旋转角度 可根据路口角度进行设置 默认不旋转
>       'isShowInfo': false, // 是否显示基础信息
>       'style': { // 样式设置
>         'width': '28rem',
>         'height': '28rem',
>         'margin': '0 auto',
>         'marginTop': '2rem'
>       },
>       'zebraCrosses': [ // 对各斑马线进行设置
>         {
>           'name': 'top', // 路口位置  'top','right','bottom','left'
>           'isShow': true, // 是否展示此方向的路口
>           'lampSet': { // 灯柱设置
>             'left': [
>               {
>                 'num': '1', // 灯柱编号
>                 'pos': 'edge' // 位置 edge:边缘 center:中间
>               },
>               {
>                 'num': '2', // 灯柱编号
>                 'pos': 'center' // 位置 edge:边缘 center:中间
>               }
>             ], // 左侧斑马线
>             'right': [
>               {
>                 'num': '3', // 灯柱编号
>                 'pos': 'center' // 位置 edge:边缘 center:中间
>               },
>              {
>                 'num': '4', // 灯柱编号
>                 'pos': 'edge' // 位置 edge:边缘 center:中间
>               }
>             ]// 右侧斑马线
>           },
>           'lightSet': [ // 红绿灯设置
>             { 'direction': 'left', 'num': '1' },
>             { 'direction': 'before', 'num': '2' },
>             { 'direction': 'right', 'num': '3' }
>           ]
>         }
>      ]
> }

>  
let traffic = new TrafficLightR(config) // 初始化此实例
>  // 内置方法
>  // 改变指定编号灯柱（斑马线）的颜色状态 seq灯柱编号 state状态 0 红色 1 绿色
>  setLightByCode ({seq = Number,state = Number })
>  // 更改指定编码交通指示灯的状态
>  // seq 编号 state 0表示红灯,1表示黄灯,2表示绿灯 secondReading 读秒 isBusFirst 将灯改为实心样式
>  setTrafficLightByCode ({ seq = Number, state = Number, secondReading = Number, isBusFirst = Boolean }) 
>  // 鼠标 点击、滑过 灯柱 回调函数
>  roadLightClickEventBack (func)
>  func (event, { num: Number, id: String })=> {} // num 灯柱序号 id 容器 id
