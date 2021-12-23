<template>
    <!-- 武器详情页面 -->
    <div class="weapon-detail">
        <div class="weapon-title">
            <div class="weapon-return return">
                <el-icon @click="returnBack"><Back></Back></el-icon>
                <h3>Flask Jinja2服务端模板注入漏洞木马上线</h3>
            </div>

            <ul>
                <li v-for="(item,index) in tabList" :key="index" :class="activeId == item.id ? 'active':''" @click="changeActive(item.id)">{{ item.name }}</li>
            </ul>
            
        </div>
        <div class="weapon-content" v-if="activeId == '0'">
            <div class="_title">
                <h3>基本信息</h3>
            </div>

            <!-- 查看状态下 -->
            <el-form label-position="left" label-width="120px" v-model="weaponInfo" v-if="!isEdit">
                <el-form-item label="武器名称"><span>{{ weaponInfo.payloadName || '--' }}</span></el-form-item>
                <el-form-item label="漏洞编号"><span>{{ weaponInfo.vulnerabilityNo || '--' }}</span></el-form-item>
                <el-form-item label="一级类别"><span>{{ weaponInfo.topType || '--' }}</span></el-form-item>
                <el-form-item label="武器类型"><span>{{ weaponInfo.payloadType || '--' }}</span></el-form-item>

                <el-form-item label="危害等级"><span>{{ weaponInfo.threatLevel || '--' }}</span></el-form-item>
                <el-form-item label="利用难度"><span>{{ weaponInfo.difficulty || '--' }}</span></el-form-item>
                <el-form-item label="开发语言"><span>{{ weaponInfo.lang || '--' }}</span></el-form-item>
                <el-form-item label="适用平台"><span>{{ weaponInfo.platform || '--' }}</span></el-form-item>
                <el-form-item label="运行权限"><span>{{ weaponInfo.permission || '--' }}</span></el-form-item>

                <el-form-item label="受影响产品"><span>{{ weaponInfo.appName || '--' }}</span></el-form-item>
                <el-form-item label="受影响版本"><span>{{ weaponInfo.appVersion || '--' }}</span></el-form-item>
                <el-form-item label="参考链接"><span>{{ weaponInfo.refUrl || '--' }}</span></el-form-item>
                <el-form-item label="描述" class="lines"><span>{{ weaponInfo.desc || '--' }}</span></el-form-item>
            </el-form>

            <!-- 编辑状态下 -->
            <el-form label-position="left" label-width="120px" v-model="weaponInfo" v-else>
                <el-form-item label="武器名称"><el-input placeholder="请输入" v-model="weaponInfo.payloadName" clearable></el-input></el-form-item>
                <el-form-item label="漏洞编号"><el-input placeholder="请输入" v-model="weaponInfo.vulnerabilityNo" clearable></el-input></el-form-item>
                <el-form-item label="一级类别"><el-input placeholder="请输入" v-model="weaponInfo.topType" clearable></el-input></el-form-item>
                <el-form-item label="武器类型"><el-input placeholder="请输入" v-model="weaponInfo.payloadType" clearable></el-input></el-form-item>
                
                <el-form-item label="危害等级"><el-input placeholder="请输入" v-model="weaponInfo.threatLevel" clearable></el-input></el-form-item>
                <el-form-item label="利用难度"><el-input placeholder="请输入" v-model="weaponInfo.difficulty" clearable></el-input></el-form-item>
                <el-form-item label="开发语言"><el-input placeholder="请输入" v-model="weaponInfo.lang" clearable></el-input></el-form-item>
                <el-form-item label="适用平台"><el-input placeholder="请输入" v-model="weaponInfo.platform" clearable></el-input></el-form-item>
                <el-form-item label="运行权限"><el-input placeholder="请输入" v-model="weaponInfo.permission" clearable></el-input></el-form-item>

                <el-form-item label="受影响产品"><el-input placeholder="请输入" v-model="weaponInfo.appName" clearable></el-input></el-form-item>
                <el-form-item label="受影响版本"><el-input placeholder="请输入" v-model="weaponInfo.appVersion" clearable></el-input></el-form-item>
                <el-form-item label="参考链接"><el-input placeholder="请输入" v-model="weaponInfo.refUrl" clearable></el-input></el-form-item>
                <el-form-item label="描述" class="lines"><el-input placeholder="请输入" v-model="weaponInfo.desc" clearable></el-input></el-form-item>
            </el-form>

            <!-- 两种状态  查看/编辑 的按钮 -->
            <div class="weapon-detail-button">
                <el-button type="info" v-if="!isEdit" @click="editWeapon">编辑</el-button>
                <template v-else>
                    <el-button type="success" @click="cancelSave">取消</el-button>
                    <el-button type="primary" @click="saveWeapon">保存</el-button>
                </template>
            </div>
        </div>

        <div class="weapon-content no-line" v-else>
            <div class="_title">
                <h3>武器源码</h3>
            </div>

            <!-- 查看状态下 -->
            <el-form label-position="left" label-width="120px" v-model="weaponInfo" v-if="!isEdit">
                <el-form-item label="武器源码"></el-form-item>
                <el-form-item label="执行命令" class="more"><el-input type="textarea" placeholder="请输入" clearable></el-input></el-form-item>
            </el-form>

            <!-- 编辑状态下 -->
            <el-form label-position="left" label-width="120px" v-model="weaponInfo" v-else>
                <el-form-item label="武器名称"><el-input placeholder="请输入" v-model="weaponInfo.payloadName" :rows="2" clearable></el-input></el-form-item>
            </el-form>

            <!-- 两种状态  查看/编辑 的按钮 -->
            <div class="weapon-detail-button">
                <!-- <el-button type="info" v-if="!isEdit" @click="editWeapon">编辑</el-button>
                <template v-else>
                    <el-button type="primary" @click="saveWeapon">保存</el-button>
                    <el-button type="success" @click="cancelSave">取消</el-button>
                </template> -->
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, toRef, toRefs, toRaw } from 'vue';
import { useRoute,useRouter } from 'vue-router'
import { Back } from '@element-plus/icons'


import weaponApi from "../../API/weaponApi"
import auth from "../../assets/js/auth.js"

export default {
    name: "weaponDetail",
    components:{
        //element puls icon 图标
        Back
    },
    setup() {
        // 路由信息
        let route = useRoute();
        let router = useRouter();
        
        // tab的两种信息
        let tabList = reactive([
            { name:'基本信息', id:'0' },
            { name:'武器源码', id:'1' }
        ]);
        
        let activeId = ref(0);  // 激活tab的id
        let weaponId = ref(''); // 获得武器id
        weaponId.value = route.query.id;    // 该武器的id

        let isEdit = ref(false);  //是否处于编辑界面

        
        let weaponInfo = ref([]);
        // 武器信息
        // let weaponInfo = ref({
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
            weaponInfo.value = res.data;
        }
        


        function Init(){
            getWeaponInfo();
        }
        Init();

        // 返回上一级
        function returnBack(){
            router.push({
                path: '/Weapon',
            })
        }
        // 基本信息/ 武器源码 切换
        function changeActive(id){
            activeId.value = id;
        }
        // 进入武器编辑状态
        function editWeapon(){
            isEdit.value = true;
        }
        // 保存武器编辑
        function saveWeapon(){
            isEdit.value = false;
        }
        // 武器编辑
        function cancelSave(){
            isEdit.value = false;
        }
        return {
            tabList,
            activeId,
            weaponId,
            isEdit,
            weaponInfo,
            // ...toRefs(weaponInfo),

            // 方法
            returnBack,
            changeActive,
            editWeapon,
            saveWeapon,
            cancelSave,
            
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
        ul{
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);

            width: 205px;
            height: 32px;
            background: #FFFFFF;
            box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
            border-radius: 16px;
            display: flex;
            padding: 2px;
            box-sizing: border-box;

            margin: 0 auto;
            li{
                flex: 1;
                line-height: 28px;
                cursor: pointer;
            }
            .active{
                color: #FFFFFF;
                background: #0082FF;
                box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
                border-radius: 16px;
            }
        }
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
                /deep/.el-input {
                    margin-top: 7px;    // 这种写法有问题，但是暂时想不起怎么写了
                    .el-input__inner {
                        border: none;
                        height: 30px;
                        background: #F0F0F0;
                        border-radius: 3px;
                    }
                }
            }
            .lines{
                span{
                    text-align: right;
                    display: inline-block;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .weapon-detail-button{
            padding: 16px 20px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-end;
            .el-button{
                width: 100px;
                max-height: 35px !important;
            }
        }
    }
    .no-line{
        .el-form{
            .el-form-item{
                border: none !important;
            }
        }
        .more{
            height: 70px;
            /deep/.el-textarea{
                height: 60px;
                .el-textarea__inner{
                    height: 60px !important;
                    min-height: 60px !important;
                    max-height: 60px !important;
                    background: rgba(235, 235, 235, 1);
                    border: none;
                }
            }
        }
    }
}
</style>