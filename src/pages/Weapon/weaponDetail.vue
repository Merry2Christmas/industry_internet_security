<template>
    <!-- 武器详情页面 -->
    <div class="weapon-detail">
        <div class="weapon-title">
            <div class="weapon-return return">
                <div></div>
                <h3>Flask Jinja2服务端模板注入漏洞木马上线</h3>
            </div>

            <!-- <ul>
                <li v-for="(item,index) in tabList" :key="index" :class="activeId == item.id ? 'active':''">{{ item.name }}</li>
            </ul> -->
            
        </div>
        <div class="weapon-content">
            <div class="_title">
                <h3>基本信息</h3>
            </div>
            <h1>{{ weaponInfo }}</h1>
            <!-- <el-form label-position="left" label-width="120px" v-model="weaponInfo">
                <el-form-item label="武器名称"><span>{{ payloadName || '--' }}</span></el-form-item>
                <el-form-item label="漏洞编号"><span>{{ vulnerabilityNo || '--' }}</span></el-form-item>
                <el-form-item label="一级类别"><span>{{ topType || '--' }}</span></el-form-item>
                <el-form-item label="武器类型"><span>{{ payloadType || '--' }}</span></el-form-item>
                
                

                <el-form-item label="危害等级"><span>{{ threatLevel || '--' }}</span></el-form-item>
                <el-form-item label="利用难度"><span>{{ difficulty || '--' }}</span></el-form-item>
                <el-form-item label="开发语言"><span>{{ lang || '--' }}</span></el-form-item>
                <el-form-item label="适用平台"><span>{{ platform || '--' }}</span></el-form-item>
                <el-form-item label="运行权限"><span>{{ permission || '--' }}</span></el-form-item>

                <el-form-item label="受影响产品"><span>{{ appName || '--' }}</span></el-form-item>
                <el-form-item label="受影响版本"><span>{{ appVersion || '--' }}</span></el-form-item>
                <el-form-item label="参考链接"><span>{{ refUrl || '--' }}</span></el-form-item>
                <el-form-item label="描述"><span>{{ desc || '--' }}</span></el-form-item>
            </el-form> -->
            <div class="weapon-detail-button">
                <el-button type="info" v-if="!isEdit" @click="editWeapon">编辑</el-button>
                <template v-else>
                    <el-button type="primary">保存</el-button>
                    <el-button type="success">取消</el-button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, toRefs, toRaw } from 'vue';
import { useRoute } from 'vue-router'


import weaponApi from "../../API/weaponApi"
import auth from "../../assets/js/auth.js"

export default {
    name: "weaponDetail",
    setup() {
        // 路由信息
        let route = useRoute();
        
        // tab的两种信息
        let tabList = reactive([
            { name:'基本信息', id:'0' },
            { name:'武器源码', id:'1' }
        ]);
        
        let activeId = ref(0);  // 激活tab的id
        let weaponId = ref(''); // 获得武器id
        weaponId.value = route.query.id;    // 该武器的id

        let isEdit = ref(false);  //是否处于编辑界面

        
        let weaponInfo = ref();
        // 武器信息
        // let weaponInfo = reactive({
        //     payloadName:'',// 武器名称
        //     vulnerabilityNo:'',// 漏洞编号
        //     topType:'',     // 一级类别
        //     topTypeId:'',   // 一级类别id
        //     payloadType:'',// 武器类型
        //     threatLevel:'',// 危害等级
        //     difficulty:'',// 利用难度
        //     lang:'',// 开发语言
        //     appName:'',// 受影响产品
        //     appVersion:'',// 受影响版本
        //     platform:'',// 适用平台
        //     permission:'',// 运行权限
        //     refUrl:'',// 参考链接
        //     desc:'',// 描述

        //     //第二阶段
        //     fileName:'',        // 武器源码
        //     cmd:'',             // 执行命令
        //     params:{
        //         id: "",         // 是否必填
        //         name: "",       // 参数名称
        //         required: true, // 是否必填
        //         val: "",        // 默认值
        //         desc: "",       // 说明
        //     }
        //     // 是否必填
        //     // 默认值
        //     // 说明
        // })


        // 获得武器信息
        async function getWeaponInfo(){
            let res = await weaponApi.getWeaponDetail(weaponId.value);
            
        }
        


        function Init(){

            getWeaponInfo();
        }
        Init();

        function editWeapon(){}
        return {
            tabList,
            activeId,
            weaponId,
            isEdit,
            weaponInfo,
            // ...toRefs(weaponInfo),

            // 方法
            editWeapon
        };
    },
};
</script>

<style lang="less" scoped>
.weapon-detail{
    width: 100%;
    height: 100%;
    padding: 10px 27px;
    box-sizing: border-box;
    background: rgba(245, 245, 245, 1);
    .weapon-title{
        position: relative;
        width: 100%;
        height: 32px;
        .weapon-return{
            h3{
                line-height: 32px;
            }
        }
        // ul{
        //     position: absolute;
        //     top: 0;
        //     left: 50%;

        //     width: 205px;
        //     height: 32px;
        //     background: #FFFFFF;
        //     box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
        //     border-radius: 16px;
        //     display: flex;

        //     margin: 0 auto;
        //     li{
        //         flex: 1;
        //         line-height: 32px;
        //     }
        //     .active{

        //     }
        // }
    }
    .weapon-content{
        margin: 30px auto 0;
        width: 700px;
        // height: calc(100% - 62px);
        background: #FFFFFF;
        box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
        border-radius: 3px;
        ._title{
            width: 100%;
            border-bottom: 1px solid rgba(162, 189, 220, 0.25);
        }
        .el-form{
            width: 100%;
            .el-form-item{
                height: 45px;
                padding: 0 20px;
                margin: 0;
                line-height: 45px;
                box-sizing: border-box;
                border-bottom: 1px solid rgba(162, 189, 220, 0.25);
                span{
                    float: right;
                }
            }
        }
        .weapon-detail-button{
            padding: 16px 20px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>