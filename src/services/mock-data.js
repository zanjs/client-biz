import {TagType, MailType} from "./data-type";

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
    content: '付款条件被改为60天\n' + '10行[纸尿裤]交货日期被改为4月5日',
    from: '永辉超市集团',
    tags: [TagType.IMPORTANT],
    read: false,
    id: 'PROCUREMENT01',
  },
  {
    title: '采购订单30000011被确认',
    content: '贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...贵司BizLink订单号30000001所供商品客诉率很高，存在明显质量问题，我司...',
    from: '上海爱婴室...',
    tags: [TagType.IMPORTANT, TagType.URGENT],
    read: false,
    id: 'PROCUREMENT02',
  },
  {
    title: '结算单50000009被修改',
    content: '10行2017年2月结算款被改为1,639,870',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT03',
  },
  {
    title: '预计需求00000015被反馈',
    from: '永辉超市集团',
    read: true,
    id: 'PROCUREMENT04',
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