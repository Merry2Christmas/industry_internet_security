<template>
    <!-- 页面头部 -->
    <div class="page-head">
        <ul>
            <li v-for="item in List" 
            :key="item.id" 
            :class="item.id == activeId?'active':''"
            @click="changeActive(item)">{{ item.name }}</li>
        </ul>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'
export default {
    name: "Login",
    setup() {
        let activeId = ref('0');
        let router = useRouter(); // 路由跳转
        let List = reactive(
            [{ name:'剧本管理', id: 0, path:'/Drama' }, { name:'武器管理', id: 1, path:'/Weapon' }]);
        
        
        function changeActive(item){
            activeId.value = item.id;
            router.push({
                path: item.path
            })
        }
        
        return {
            activeId,
            List,

            // 函数
            changeActive,
        };
    },
};
</script>

<style lang="less" scoped>
.page-head{
    width: 100%;
    height: 44px;
    background: linear-gradient(90deg, #0067E4 0%, #00A2F7 100%);
    ul{
        width: 240px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        li{
            flex: 1;
            line-height: 44px;
            color: white;
            cursor: pointer;
        }
        .active{
            position: relative;
            font-weight: bold;
            color: rgba(0, 130, 255, 1);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 70%);
        }
    }
}
</style>