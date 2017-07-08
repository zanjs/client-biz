import {computed, action, runInAction, extendObservable} from 'mobx';
import homeSvc from "../../services/home";
import Storage from '../../utils/storage';
import {ToastStore as Toast} from "../../components/Toast";

class ProcurementActivitiesStore {
   constructor() {
     extendObservable(this, {
       purchaseList: [],
       recordCount: 0,
       pageNo: 1,
       hasMore: true,
       unReadListDS: computed(() => this.purchaseList.filter(item => !item.read_flag)),
       isReadListDS: computed(() => this.purchaseList.filter(item => item.read_flag === 1)),
       inChargeListDS: computed(() => this.purchaseList.filter(item => !item.read_flag && (item.user_id === Storage.getValue('user').current.id))),
       participantListDS: computed(() => this.purchaseList.filter(item => !item.read_flag && (item.user_id !== Storage.getValue('user').current.id))),
     });
   }
   pageSize = 20;

   load = action(async () => {
     if (this.loading || !this.hasMore) return;
     this.loading = true;
     const pageNo = this.pageNo > 1 ? this.pageNo : null;
     try {
       const resp = await homeSvc.getPurchaseList(pageNo, this.pageSize);
       // console.log(resp, 'procurement store');
       runInAction('after load list', () => {
         if (resp.code === '0' && resp.data.list) {
           this.purchaseList = this.pageNo > 1 ? [...this.purchaseList, ...resp.data.list] : resp.data.list;
           this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
           this.hasMore = this.purchaseList.length < this.recordCount;
           if (this.hasMore)  this.pageNo++;
         }
       })
     } catch (e) {
       Toast.show('抱歉，发生未知错误，请稍后重试');
     }
     this.loading = false;
   })
}

const activitiesStore = new ProcurementActivitiesStore();
export default activitiesStore;