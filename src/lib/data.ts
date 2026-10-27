export type NavLink = { label: string; href: string }

export const NAV_LINKS: NavLink[] = [
  { label: '窑口', href: '#kiln' },
  { label: '孤品', href: '#collection' },
  { label: '工序', href: '#craft' },
  { label: '匠人', href: '#artisan' },
  { label: '问答', href: '#faq' },
]

export type GlazeFamily = '曜变' | '油滴' | '兔毫' | '柿釉' | '灰被'

type Glaze = {
  /** deep body of the bowl */
  base: string
  /** second body tone for the glaze fall */
  body: string
  /** rim light colour */
  rim: string
  /** speck / streak colour */
  mark: string
  /** iridescent halo colours, used for the 曜变 shimmer */
  halo: string[]
}

export type Bowl = {
  id: string
  code: string
  name: string
  family: GlazeFamily
  price: number
  status: 'available' | 'reserved' | 'sold'
  diameter: string
  height: string
  weight: string
  kiln: string
  firing: string
  artist: string
  /**
   * 白底实拍图。把图片放进 public/products/ 后填 '/products/yelan.jpg' 即可。
   * 留空则使用代码绘制的盏。图片加载失败也会自动退回绘制版，不会破版。
   */
  photo?: string
  /**
   * 可选：同一只盏的多个角度（3–12 张最好）。
   * 给了两张以上，详情页就能按住左右拖换视角，等价于「转了一圈」。
   * 只有 photo 一张时，页面不会假装能转 —— 改用视差高光。
   */
  photos?: string[]
  glaze: Glaze
  /** short line shown on the card */
  line: string
  /** longer note inside the detail panel */
  note: string
  tags: string[]
}

const GLAZES: Record<GlazeFamily, Glaze> = {
  曜变: {
    base: '#0A0B10',
    body: '#141726',
    rim: '#E8D9B6',
    mark: '#3E6FA0',
    halo: ['#3E7FB4', '#6A4FA8', '#2F8F86', '#B48A4E'],
  },
  油滴: {
    base: '#0D0C0B',
    body: '#191714',
    rim: '#D8C7A2',
    mark: '#CFC3A6',
    halo: ['#8E8570', '#C9B98F', '#5F5A4C'],
  },
  兔毫: {
    base: '#171009',
    body: '#241809',
    rim: '#E2C48F',
    mark: '#9A6230',
    halo: ['#A9713A', '#D3A268', '#5B3D1E'],
  },
  柿釉: {
    base: '#7C2F12',
    body: '#9E4319',
    rim: '#F0C893',
    mark: '#D4772F',
    halo: ['#B85A22', '#E0913F', '#7A2C12'],
  },
  灰被: {
    base: '#2E2C27',
    body: '#413D35',
    rim: '#E4DCCB',
    mark: '#8C8776',
    halo: ['#6F6A5C', '#A7A08C', '#423E36'],
  },
}

export const BOWLS: Bowl[] = [
  {
    id: 'yelan',
    code: 'NO.0412',
    name: '夜岚',
    family: '曜变',
    price: 18600,
    status: 'available',
    diameter: '12.4 cm',
    height: '6.8 cm',
    weight: '312 g',
    kiln: '龙窑 · 三号窑位',
    firing: '2024.11 · 第三十七窑',
    artist: '陈守拙',
    glaze: GLAZES.曜变,
    line: '釉面在暗处泛起蓝紫色的晕，像子夜山脊上的雾。',
    note:
      '同一个窑位连烧三窑才得一只。曜变的形成依赖还原气氛的细微失衡，火焰在 1320℃ 的十二小时里反复吞吐，釉中的铁析出成膜，才有了这一圈会随着角度呼吸的光。',
    tags: ['曜变', '孤品', '附窑照与证书'],
  },
  {
    id: 'hanshan',
    code: 'NO.0408',
    name: '寒山',
    family: '油滴',
    price: 9800,
    status: 'available',
    diameter: '11.8 cm',
    height: '6.2 cm',
    weight: '284 g',
    kiln: '龙窑 · 一号窑位',
    firing: '2024.11 · 第三十七窑',
    artist: '陈守拙',
    glaze: GLAZES.油滴,
    line: '斑点是铁在火里聚成的星，疏密没有一处重样。',
    note:
      '油滴最难的不是烧出来，是烧得「活」。这只盏的斑点从底心向上渐渐稀薄，留出一段干净的玄色，懂的人说那是山脚，斑点是雪。',
    tags: ['油滴', '孤品', '附窑照与证书'],
  },
  {
    id: 'qiuSheng',
    code: 'NO.0391',
    name: '秋声',
    family: '兔毫',
    price: 6400,
    status: 'reserved',
    diameter: '12.0 cm',
    height: '6.5 cm',
    weight: '296 g',
    kiln: '龙窑 · 五号窑位',
    firing: '2024.10 · 第三十五窑',
    artist: '陈守拙',
    glaze: GLAZES.兔毫,
    line: '褐色的毫纹自盏口垂下，像被风梳理过的枯草。',
    note:
      '兔毫要的是「毫」而不是「线」——釉流在倾斜的盏壁上被拉成极细的结晶，烧到一半转火太快，就会断。这只从口沿一路流到底心，没有断过。',
    tags: ['兔毫', '已被预约', '附证书'],
  },
  {
    id: 'qixia',
    code: 'NO.0421',
    name: '栖霞',
    family: '柿釉',
    price: 12200,
    status: 'available',
    diameter: '12.6 cm',
    height: '7.1 cm',
    weight: '326 g',
    kiln: '龙窑 · 二号窑位',
    firing: '2024.12 · 第三十八窑',
    artist: '陈守拙',
    glaze: GLAZES.柿釉,
    line: '秋日傍晚的颜色，口沿留了一线没挂住釉的胎。',
    note:
      '柿釉靠氧化火烧成，窑门一开，空气灌进去，那一瞬间温度决定了它是橙还是红。口沿的褐线不是瑕疵，是釉挂不住、露出胎骨的证据。',
    tags: ['柿釉', '孤品', '附窑照与证书'],
  },
  {
    id: 'konggu',
    code: 'NO.0417',
    name: '空谷',
    family: '灰被',
    price: 4800,
    status: 'available',
    diameter: '11.2 cm',
    height: '5.9 cm',
    weight: '268 g',
    kiln: '龙窑 · 七号窑位',
    firing: '2024.12 · 第三十八窑',
    artist: '陈守拙',
    glaze: GLAZES.灰被,
    line: '不抢眼的一只。放久了，才会觉得它最耐看。',
    note:
      '灰被是柴灰自然落在釉面上形成的，人力只能退后一步。它的好在于安静——你要是想找一件能让茶席沉下来的器，往往就是它。',
    tags: ['灰被', '孤品', '入门'],
  },
  {
    id: 'chenbi',
    code: 'NO.0362',
    name: '沉璧',
    family: '曜变',
    price: 24800,
    status: 'sold',
    diameter: '13.1 cm',
    height: '7.4 cm',
    weight: '348 g',
    kiln: '龙窑 · 三号窑位',
    firing: '2024.09 · 第三十二窑',
    artist: '陈守拙',
    glaze: GLAZES.曜变,
    line: '这一窑唯一的一只，已入藏。',
    note:
      '两年里烧出四只合格的曜变，这是第三只。已被一位杭州的藏家收走，用来日常点茶。',
    tags: ['曜变', '已入藏'],
  },
]

export const FEATURED = BOWLS[0]

export type CraftStep = {
  index: string
  title: string
  body: string
  detail: string
}

export const CRAFT_STEPS: CraftStep[] = [
  {
    index: '01',
    title: '选矿',
    body: '建阳水吉的红土与铁含量高的釉石，碾成粉，过三遍筛。',
    detail: '每批土都要先烧试片，颜色对了才敢上辘轳。',
  },
  {
    index: '02',
    title: '拉坯',
    body: '一只盏的壁厚在一毫米以内，手一抖就废。',
    detail: '陈守拙不用模具。拉完的坯要阴干二十天，急不得。',
  },
  {
    index: '03',
    title: '施釉',
    body: '釉只上到七分，留出的那一圈是火与手之间的余地。',
    detail: '厚一分则淌，薄一分则枯。凭手感，不凭称。',
  },
  {
    index: '04',
    title: '装窑',
    body: '窑位决定一切。同一只盏，前后挪半尺就是两种命。',
    detail: '三号位留给曜变，五号位留给兔毫，其余听天由命。',
  },
  {
    index: '05',
    title: '柴烧',
    body: '1320℃，连烧二十六小时，两个人轮班，每十分钟添一次松柴。',
    detail: '火焰与灰烬是唯一的画笔，人只能守着，不能改。',
  },
  {
    index: '06',
    title: '候冷',
    body: '封窑七日，等它自己凉。开早了，釉面会炸成蛛网。',
    detail: '七天里窑是热的，人不能碰。这是最像等待的一段。',
  },
]

export type Artisan = {
  name: string
  title: string
  since: string
  quote: string
  body: string
  photo: string
}

export const ARTISAN: Artisan = {
  name: '陈守拙',
  title: '无二窑 · 窑主',
  since: '自 1998 年起守窑',
  quote: '火不听话的时候，才对。',
  body:
    '他不太谈「艺术」，只说窑。二十六小时不合眼，添柴、看火色、听窑里的声音。问他一窑能出几只好的，他说三只，有时候一只也没有。问他心疼吗，他想了想说：柴烧这件事，本来就是把不能控制的部分也一起收下。',
  photo:
    'https://images.pexels.com/photos/4706134/pexels-photo-4706134.jpeg?auto=compress&cs=tinysrgb&w=1200',
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  city: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '收到的时候先看的是窑照——从出窑那一刻到装箱，每张都有时间。这种坦白，比证书更有说服力。',
    name: '林知远',
    role: '茶人',
    city: '杭州',
  },
  {
    quote:
      '我用它喝了两年的生普。盏底养出一层温润的光，跟刚到手时完全不是一只盏了。',
    name: '许怀',
    role: '收藏者',
    city: '成都',
  },
  {
    quote:
      '问了很多问题，回信不催单，还劝我先来窑上看看再决定。这种不着急卖的态度，反而让我下了单。',
    name: '周敏',
    role: '建筑设计师',
    city: '上海',
  },
]

export type Tier = {
  name: string
  from: string
  line: string
  features: string[]
  cta: string
  featured?: boolean
}

export const TIERS: Tier[] = [
  {
    name: '日用之器',
    from: '¥3,800 起',
    line: '可以每天用来喝茶的那一只。',
    cta: '看现有孤品',
    features: ['灰被、兔毫为主', '附唯一编号与窑照', '顺丰保价寄送', '七日鉴赏期'],
  },
  {
    name: '收藏之器',
    from: '¥9,000 起',
    line: '一窑里能挑出来的那几只。',
    cta: '预约看盏',
    featured: true,
    features: ['曜变、油滴、柿釉', '附亲签证书与烧成记录', '窑主一对一说盏', '可指定窑位预约下一窑'],
  },
  {
    name: '定制之器',
    from: '面谈',
    line: '从一团土开始，只做一只。',
    cta: '与窑口联系',
    features: ['指定器型与釉路', '拉坯与施釉过程影像留档', '落款可定制', '约 10 个月周期'],
  },
]

export type Faq = { q: string; a: string }

export const FAQS: Faq[] = [
  {
    q: '怎么证明它真的是孤品？',
    a: '每只盏出窑即编号、称重、拍五面窑照，连同烧成记录（窑位、温度曲线、开窑时间）一起归档。编号与窑照永久对应，不存在第二只。',
  },
  {
    q: '照片和实物会有色差吗？',
    a: '会。曜变、油滴在自然光与灯光下差别很大——这不是缺点，是它们的一部分。我们尽量在日光下拍，并且不修色。如果你介意，可以先看实物视频再决定。',
  },
  {
    q: '可以退换吗？',
    a: '收到七日内，未使用、包装完好，可无理由退回，运费由我们承担。养过的盏我们不建议退，釉面已经有你的痕迹了。',
  },
  {
    q: '日常怎么用、怎么养？',
    a: '可以正常泡茶，也可以用洗碗机（不建议）。养盏只需要用它喝水喝茶，别用钢丝球，别用洗洁精长时间浸泡。剩下的交给时间。',
  },
  {
    q: '能指定窑位，预约下一窑吗？',
    a: '收藏之器可以。下一窑预计 2025 年秋开窑，现在可登记意向，不收定金；出窑后你先看，再决定。',
  },
  {
    q: '运输破损怎么办？',
    a: '双层木盒 + 防震内衬，顺丰保价。若真在途中损坏，全额退款，不需要你退回碎片——我们会重新为你找一只相近的。',
  },
]

export const STATS: { value: string; label: string }[] = [
  { value: '1320℃', label: '柴窑烧成温度' },
  { value: '26 小时', label: '一窑的守火时间' },
  { value: '1 / 20', label: '能留下的比例' },
  { value: '0', label: '相同的两只' },
]

export const KILN_MARKS: string[] = [
  '第三十八窑 · 2024.12',
  '一器一样 · 落款存档',
  '水吉 · 龙窑柴烧',
  '建阳红土 · 松柴二十六时',
  '不复制 · 不量产',
]
