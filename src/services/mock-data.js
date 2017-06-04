import {TagType, MailType, ProcurementMessagType, ProcurementType, DetailContentType, CurrencyType} from "./data-type";

export const MOCK_MAILS = [
  {
    title: '供应商大会邀请函供应商大会邀请函供应商大会邀请函供应商大会邀请函',
    content: '付款条件被改为60天\n' + '10行[纸尿裤]交货日期被改为4月5日',
    from: '永辉超市集团永辉超市集团永辉超市集团永辉超市集团永辉超市集团',
    tags: [TagType.IMPORTANT],
    read: false,
    type: MailType.ANNOUNCEMENT,
    id: 'MAIL01',
  },
  {
    title: '质量投诉',
    content: '贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...',
    from: '上海爱婴室...',
    tags: [TagType.IMPORTANT, TagType.URGENT],
    read: true,
    type: MailType.APPEAL,
    id: 'MAIL02',
  }
];

export const MOCK_PROCUREMENT_MESSAGE = [
  {
    title: '询报价单13000018获报价',
    content: '付款条件被改为60天10行[纸尿裤]交货日期被改为4月5日',
    from: '永辉超市集团',
    tags: [TagType.IMPORTANT],
    read: false,
    id: 'PROCUREMENT01',
    type: ProcurementMessagType.CONTACTME,
    main_type: ProcurementType.CANCELED,
  },
  {
    title: '采购订单30000011被确认',
    content: '贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...',
    from: '上海爱婴室...',
    tags: [TagType.IMPORTANT, TagType.URGENT],
    read: false,
    id: 'PROCUREMENT02',
    type: ProcurementMessagType.INCHARGE,
    main_type: ProcurementType.COMPLETED,
  },
  {
    title: '结算单50000009被修改',
    content: '10行2017年2月结算款被改为1,639,870',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT03',
    type: ProcurementMessagType.PARTICIPANT,
    main_type: ProcurementType.CONFIRMED,
  },
  {
    title: '预计需求00000015被反馈',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT04',
    type: ProcurementMessagType.CONTACTME,
    main_type: ProcurementType.TO_BALANCE,
  },
  {
    title: '询报价单13000018获报价',
    content: '付款条件被改为60天10行[纸尿裤]交货日期被改为4月5日',
    from: '永辉超市集团',
    tags: [TagType.IMPORTANT],
    read: false,
    id: 'PROCUREMENT01',
    type: ProcurementMessagType.CONTACTME,
    main_type: ProcurementType.TO_CONFIRM,
  },
  {
    title: '采购订单30000011被确认',
    content: '贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...',
    from: '上海爱婴室...',
    tags: [TagType.IMPORTANT, TagType.URGENT],
    read: false,
    id: 'PROCUREMENT02',
    type: ProcurementMessagType.INCHARGE,
    main_type: ProcurementType.TO_PAY,
  },
  {
    title: '结算单50000009被修改',
    content: '10行2017年2月结算款被改为1,639,870',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT03',
    type: ProcurementMessagType.PARTICIPANT,
    main_type: ProcurementType.TO_RECEIVE,
  },
  {
    title: '预计需求00000015被反馈',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT04',
    type: ProcurementMessagType.CONTACTME,
    main_type: ProcurementType.CANCELED,
  },
  {
    title: '询报价单13000018获报价',
    content: '付款条件被改为60天10行[纸尿裤]交货日期被改为4月5日',
    from: '永辉超市集团',
    tags: [TagType.IMPORTANT],
    read: false,
    id: 'PROCUREMENT01',
    type: ProcurementMessagType.CONTACTME,
    main_type: ProcurementType.COMPLETED,
  },
  {
    title: '采购订单30000011被确认',
    content: '贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...',
    from: '上海爱婴室...',
    tags: [TagType.IMPORTANT, TagType.URGENT],
    read: false,
    id: 'PROCUREMENT02',
    type: ProcurementMessagType.INCHARGE,
    main_type: ProcurementType.CONFIRMED,
  },
  {
    title: '结算单50000009被修改',
    content: '10行2017年2月结算款被改为1,639,870',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT03',
    type: ProcurementMessagType.PARTICIPANT,
    main_type: ProcurementType.CONFIRMED,
  },
  {
    title: '预计需求00000015被反馈',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT04',
    type: ProcurementMessagType.CONTACTME,
    main_type: ProcurementType.TO_BALANCE,
  },
];

export const MOCK_SALE_MESSAGE = [
  {
    title: '结算单50000009被修改',
    content: '10行2017年2月结算款被改为1,639,870',
    from: '永辉超市集团',
    read: true,
    id: 'SALE01',
  },
  {
    title: '预计需求00000015被反馈',
    from: '永辉超市集团',
    read: true,
    id: 'SALE02',
  },
  {
    title: '询报价单13000018获报价',
    content: '付款条件被改为60天\n' + '10行[纸尿裤]交货日期被改为4月5日',
    from: '永辉超市集团',
    tags: [TagType.IMPORTANT],
    read: true,
    id: 'SALE03',
  },
  {
    title: '采购订单30000011被确认',
    content: '贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...',
    from: '上海爱婴室...',
    tags: [TagType.IMPORTANT, TagType.URGENT],
    read: false,
    id: 'SALE04',
  },
];

export const MESSAGE_DETAIL = {
  title: '供应商大会邀请函',
  type: DetailContentType.ANNOUNCE,
  sender: {
    company: '永辉超市集团',
    display_name: '张三',
    position: '采购部总监',
  },
  timestamp: 1488006480000,
  content: '尊敬的合作伙伴，永辉超市2017年度供应商大会将于3月31日下午2点于上海浦东嘉里中心2楼会议中心隆重举行，本次会议议程非常重要，包括我司对供应商最新考核标准及扶持政策的介绍，作为我司重要供应商伙伴，我们诚邀贵司参与本次大会，报名人数最多三人，请将贵司与会人员姓名和职位在本公告进行留言，方便我司统计，有任何关于本次会议的问题，可咨询我司采购部助理@李倩 id:32563421\n' +
  '\n' +
  '我谨代表永辉超市集团欢迎贵司伙伴们的到来，期待届时与你们多作交流！',
  in_charge: {
    display_name: '肖云起',
    position: '销售部总监',
  },
  follower: [
    {display_name: '肖益龙', position: '总经理'},
    {display_name: '陆黎婷', position: '大客户经理'},
    {display_name: '俞雪英', position: '市场部总监'},
    {display_name: '肖益龙', position: '总经理'},
    {display_name: '陆黎婷', position: '大客户经理'},
    {display_name: '俞雪英', position: '市场部总监'},
    {display_name: '肖益龙', position: '总经理'},
    {display_name: '陆黎婷', position: '大客户经理'},
    {display_name: '俞雪英', position: '市场部总监'},
  ],
};

export const ORDER_DETAIL = {
  order_no: '30000012',
  label: '采购-订单',
  type: DetailContentType.PROCUREMENT_ORDER,
  timestamp: 1488247680000,
  supplier: {
    company: 'Babycare Co, Ltd',
    display_name: '王五',
    position: '客户经理',
  },
  in_charge: {
    display_name: '黄秀梅',
    position: '采购经理',
  },
  follower: [
    {display_name: '肖云初', position: '采购总监'},
  ],
  currency: CurrencyType.CNY,
  tax: true,
  price_type: '单价',
  payment: '30天',
  total_price: 34000,
  discount: null,
  goods_list: [
    {line_no: 10, goods_no: 20012, name: '不粘胶', size: '20m', count: 200, unit: '卷', unit_price: 80, discount: '￥', total_price: 16000, due_date: 1489334400000},
    {line_no: 20, goods_no: 21005, name: '中号白色无纺布', size: '60mm', count: 300, unit: '匹', unit_price: 60, discount: '￥', total_price: 18000, due_date: 1489334400000}
  ],
  comments_list: [
    {
      company: 'Babycare',
      sender: {
        display_name: '王五',
        position: '客户经理',
      },
      reply: '黄秀梅',
      content: '可以准时交货',
      timestamp: 1488954360000,
    },
    {
      company: '起初母婴用品',
      sender: {
        display_name: '黄秀梅',
        position: '采购经理',
      },
      content: '可否准时交货？',
      timestamp: 1488953760000,
    },
  ],
  activity_list: [
    {
      timestamp: 1488954360000,
      activities: [
        {
          company: 'Babycare',
          sender: {
            display_name: '王五',
            position: '客户经理',
          },
          activity: '发表留言',
          content: '贵司欠款已超信用额度，本单需现结，敬请理解！另：不粘胶产能告急，需调整交期，敬请谅解！',
        },
        {
          company: 'Babycare',
          sender: {
            display_name: '王五',
            position: '客户经理',
          },
          activity: '修改了抬头信息',
          content: '付款条件：30天  改为  现款现结',
        },
        {
          company: 'Babycare',
          sender: {
            display_name: '王五',
            position: '客户经理',
          },
          activity: '修改了行项目信息',
          content: '10行 交期/收货：2017/3/13  改为  2017/3/20',
        }
      ],
    },
    {
      timestamp: 1488247920000,
      activities: [
        {
          sender: {
            display_name: '肖云初',
            position: '采购总监',
          },
          activity: '确认采购订单',
          content: '发送采购订单至：BabyCare Co., Ltd',
        },
      ],
    },
    {
      timestamp: 1488247680000,
      activities: [
        {
          sender: {
            display_name: '黄秀梅',
            position: '采购经理',
          },
          activity: '创建采购订单',
        },
      ],
    },
  ],
};