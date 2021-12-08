import { ref, reactive } from "vue"
import {
    get,
    postJson
} from '@/request/https.js'


// const hh;
export default{

    async aaa(){
        console.log('进行aaa函数');
        let id = ref(0)
        const aa = await get(`/v1/iist/scenario/get/${id}`)
        console.log(aa);
        return aa
    },
    
    bbb(){
        console.log('进行bbb函数');
    },
    ccc(){
        console.log('进行ccc函数');
    },
    vvv(){
        get(`/v1/iist/scenario/get/8`)
    },
    async hhh(){
        // get(`/v1/iist/scenario/get/8`)
        // const res = await get(`/v1/iist/scenario/get/8`);
        const res = await get(`v1/iist/scenario/list?pageIndex=1&pageSize=10`);
        return res;
    },

    async gg(){
        const g = get(`/v1/iist/scenario/get/8`);
        const res = await g;
        return res
    },
    
}
