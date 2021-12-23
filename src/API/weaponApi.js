import { ref, reactive } from "vue"
import {
    get,
    postJson,
    postFile,
    postZip,
    put,
    $del
} from '@/request/https.js'


export default{
    // 获得武器列表信息    -->   参数： 页码  (每页)条数, 筛选项
    async getWeaponInfo(pageIndex,pageSize, param){
        return await get(`v1/iist/weapon/pageList?pageIndex=${pageIndex}&pageSize=${pageSize}`)
    },
    // 获得武器详情信息    -->   参数： 该武器id
    async getWeaponDetail(id){
        return await get(`/v1/iist/weapon/${id}`)
    },
    // 武器源码上传    -->   参数： 上传的文件
    async weaponSrcUpload(file){
        return await postFile(`/v1/iist/weapon/upload`,file)
    },
    
    // 武器源码删除    -->   参数： 该武器id
    async weaponSrcDel(id){
        return await $del(`/v1/iist/deleteCode/${id}`)
    },
    
    // 武器源码下载    -->   参数： 该武器id
    async weaponSrcDown(id){
        return await get(`/v1/iist/download/${id}`)
    },

    // 武器源码批量下载    -->   参数：数组集合的武器id
    async weaponSrcBathDown(ids){
        return await postZip(`/v1/iist/file/downFiles`,ids)
    },

    // 武器删除    -->   参数：数组集合的武器id
    async weaponDel(ids){
        return await $del(`/v1/iist/delete`,ids)
    },

    // 武器新增    -->   参数：修改参数
    async weaponAdd(param){
        return await postJson(`/v1/iist/weapon`,param)
    },
    
    // 武器修改    -->   参数：修改的参数
    async weaponEdit(param){
        return await put(`/v1/iist/weapn`,param)
    },

    // 剧本编排中共选择武器    -->   参数：武器类型
    async chooseWeapon (top_type){
        return await get(`/v1/iist/weapon/select/${top_type}`)
    },

    // 查询基础攻击类型数据    -->   参数：level(基础攻击层级)  parentId(一级分类)
    async getAttackType(){
        // return await get(`/v1/iist/nao/typeList`)
    }
}