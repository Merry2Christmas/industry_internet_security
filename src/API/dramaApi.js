import { ref, reactive } from "vue"
import {
    get,
    postJson,
    del
} from '@/request/https.js'


// export function get(url, params) 由此可见，将参数放里面的，是路径；放在外侧的是带参

export default{
    // 获得剧本列表信息    -->   参数： 页码  (每页)条数, 筛选项
    async getDramaInfo(pageIndex,pageSize, param){
        return await get(`/v1/iist/scenario/list?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    },
    // 获得剧本状态
    async getStatusInfo(){
        return await get('v1/iist/scenario/statistics_scenario');
    },
    // 获得剧本模板信息    -->   参数： 筛选项(模板名称)
    async getDramaTempletInfo(param){
        return await get('v1/iist/scenario/template_list_all',param);
    },
    // 新增剧本         -->  参数：对象（名称，描述，模板id）
    async addDrama(param){
        return await postJson(`/v1/iist/scenario`,param);
    },
    // 删除剧本    -->  参数： id (剧本id)
    async delDrama(param){
        return await del(`/v1/iist/scenario/del_scenario/${param}`)
    }
}
