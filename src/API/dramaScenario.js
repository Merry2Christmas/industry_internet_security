import {
    get,
    postJson,
    del
} from '@/request/https.js'


export default{
    async getScenarioInfo(id){
        // 获得剧本编排信息    -->   参数： id
        return await get(`v1/iist/scenario/get/${id}`);
    }
}