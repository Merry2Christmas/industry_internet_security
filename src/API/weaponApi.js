import { ref, reactive } from "vue"
import {
    get,
    postJson
} from '@/request/https.js'


export default{
    // 获得剧本列表信息    -->   参数： 页码  (每页)条数, 筛选项
    async getWeaponInfo(pageIndex,pageSize, param){
        return await get(`v1/iist/weapon/pageList?pageIndex=${pageIndex}&pageSize=${pageSize}`)
    },
    // 获得剧本详情信息    -->   参数： 该武器id
    async getWeaponDetail(id){
        return await get(`/v1/iist/weapon/${id}`)
    }
}