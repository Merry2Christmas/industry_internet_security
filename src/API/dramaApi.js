import { ref, reactive } from "vue"
import {
    get,
    postJson
} from '@/request/https.js'


export default{
    // 获得剧本列表信息    -->   参数： 页码  (每页)条数, 筛选项
    async getDramaInfo(pageIndex,pageSize, param){
        const res = await get(`/v1/iist/scenario/list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
        return res;
    },
    // 获得剧本状态
    async getStatusInfo(){
        const res = await get('v1/iist/scenario/statistics_scenario');
        return res;
    },
    // 获得剧本模板信息    -->   参数： 筛选项(模板名称)
    async getDramaTempletInfo(param){
        const res = await get('v1/iist/scenario/template_list_all',param);
        return res
    },
}
