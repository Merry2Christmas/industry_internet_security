import { ref, reactive } from "vue"
import {
    get,
    postJson
} from '@/request/https.js'


export default{
    // 获得剧本信息
    async getDramaInfo(param){

        // await get(`/v1/iist/scenario/list${param}`)

        // await get(`/v1/iist/scenario/list${param}`).then(res => {
        //     console.log(res);
        //     return res
        // })
    },
    
}
