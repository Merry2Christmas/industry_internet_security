<template>
    <!-- 武器弹窗 -->
    <div>
        <el-dialog title="新增武器"
            v-model="dialogVisible"
            width="450px"
            :before-close="handleClose"
            :close-on-click-modal="false"
            custom-class="common-dialog weapon-dialog">
            
            <div>
                <div class="weapon-dialog-step">
                    <el-steps :active="activeStep" finish-status="success" align-center>
                        <el-step title="基本信息"></el-step>
                        <el-step title="源码上传"></el-step>
                    </el-steps>
                </div>

                <el-form label-position="left" label-width="92px" ref="ruleForm" :model="weaponInfo" :rules="rules" v-if="activeStep == '0'">
                    <el-form-item label="武器名称" prop="payloadName"><el-input v-model="payloadName" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="漏洞编号" class="indent"><el-input v-model="vulnerabilityNo" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="一级类别" prop="topType">
                        <el-select v-model="topType" placeholder="选择">
                            <el-option
                            v-for="item in firstOpt"
                            :key="item.id"
                            :label="item.ba_zh_name"
                            :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="武器类型" prop="payloadType"><el-input v-model="payloadType" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="危害等级" prop="threatLevel">
                        <div class="weapon-opt"><el-radio v-for="(item,index) in levelOpt" :key="index" v-model="threatLevel" :label="item.name"></el-radio></div>
                    </el-form-item>
                    <el-form-item label="利用难度" prop="difficulty">
                        <div class="weapon-opt"><el-radio v-for="(item,index) in diffOpt" :key="index" v-model="difficulty" :label="item.name"></el-radio></div>
                    </el-form-item>
                    <el-form-item label="开发语言" class="indent"><el-input v-model="lang" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="受影响产品" class="indent"><el-input v-model="appName" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="受影响版本" class="indent"><el-input v-model="appVersion" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="适用平台" prop="platform">
                        <div class="weapon-opt"><el-checkbox v-for="(item,index) in plateOpt" :key="index" v-model="platform" :label="item.name"></el-checkbox></div>
                    </el-form-item>
                    <el-form-item label="运行权限" prop="permission">
                        <div class="weapon-opt"><el-radio v-for="(item,index) in userOpt" :key="index" v-model="permission" :label="item.name"></el-radio></div>
                    </el-form-item>
                    <el-form-item label="参考链接" class="indent"><el-input v-model="refUrl" placeholder="请输入" clearable></el-input></el-form-item>
                    <el-form-item label="描述" class="indent"><el-input v-model="desc" placeholder="请输入" type="textarea" :rows="2" clearable></el-input></el-form-item>
                </el-form>

                <el-form label-position="left" label-width="92px" ref="ruleForm2" :model="weaponInfo" :rules="rules" v-else>
                    <el-form-item label="武器源码" prop="fileName"><el-input v-model="fileName" placeholder=".py格式文件，文件大小不能超过5M" clearable></el-input></el-form-item>
                    <el-form-item label="执行命令" prop="cmd"><el-input v-model="cmd" placeholder="输入" type="textarea" :rows="2" clearable></el-input></el-form-item>
                    <el-row class="weapon-param weapon-param-title">
                        <el-col :span="6">参数名称</el-col>
                        <el-col :span="5">是否必填</el-col>
                        <el-col :span="5">默认值</el-col>
                        <el-col :span="8">说明</el-col>
                    </el-row>
                    <el-row class="weapon-param" v-for="(item,index) in paramList" :key="index">
                        <el-col :span="6"><el-input v-model="params.name" placeholder="输入" clearable></el-input></el-col>
                        <el-col :span="5"><el-input v-model="params.required" placeholder="输入" clearable></el-input></el-col>
                        <el-col :span="5"><el-input v-model="params.val" placeholder="输入" clearable></el-input></el-col>
                        <el-col :span="7"><el-input v-model="params.desc" placeholder="输入" clearable></el-input></el-col>
                        <el-col :span="1">
                            <el-icon :size="16" color="#DDDDDD">
                                <CircleCloseFilled @click="minusOne(item,index)"></CircleCloseFilled>
                            </el-icon>
                        </el-col>
                    </el-row>
                    <el-row class="weapon-param-add">
                        <el-icon :size="16" color="#25A4F4">
                            <CirclePlusFilled @click="plusOne"></CirclePlusFilled>
                        </el-icon>
                        <span @click="plusOne">添加</span>
                    </el-row>
                </el-form>
            </div>
            
            <template #footer>
                <span class="dialog-footer" v-if="activeStep == '0'">
                    <el-button @click="handleClose" size="small" color="#C3C3C3" style="color: white">取消</el-button>
                    <el-button type="primary" @click="handleClose2()" size="small">下一步</el-button>
                </span>
                <span class="dialog-footer" v-else>
                    <el-button @click="activeStep = 0" size="small" color="#C3C3C3" style="color: white">上一步</el-button>
                    <el-button type="primary" @click="handleClose3()" size="small">完成</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive, toRef, toRefs, toRaw } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCloseFilled, CirclePlusFilled } from '@element-plus/icons'


import levelWeapon from "../../assets/json/weapon/levelWeapon.json"   // 一级类别json文件
import weaponType from "../../assets/json/weapon/weaponType.json"   // 一级类别json文件
export default {
    name:"weaponDialog",
    // 父组件传递的参数
    props:["dialogVisible"],
    components:{
        //element puls icon 图标
        CircleCloseFilled,
        CirclePlusFilled
    },
    // 父组件传递的自定义事件
    // emits:['hello'],
    setup(props,context){
        // 校验规则
        let rules  = reactive({
            payloadName: [{required: true, message: '请输入武器名称', trigger: 'blur'}],// 武器名称
            topType:[{required: true, message: '请输入一级类别', trigger: 'blur'}],     // 一级类别
            payloadType:[{required: true, message: '请输入武器类型', trigger: 'blur'}], // 武器类型
            threatLevel:[{required: true, message: '请输入危害等级', trigger: 'blur'}], // 危害等级
            difficulty:[{required: true, message: '请输入利用难度', trigger: 'blur'}],  // 利用难度
            platform:[{required: true, message: '请输入适用平台', trigger: 'blur'}],    // 适用平台
            permission:[{required: true, message: '请输入运行权限', trigger: 'blur'}],  // 运行权限
            fileName:[{required: true, message: '请输入武器源码', trigger: 'blur'}],    //武器源码
            cmd:[{required: true, message: '请输入执行命令', trigger: 'blur'}],         //执行命令
            
        })
        // 武器信息
        let weaponInfo = reactive({
            payloadName:'',// 武器名称
            vulnerabilityNo:'',// 漏洞编号
            topType:'',     // 一级类别
            topTypeId:'',   // 一级类别id
            payloadType:'',// 武器类型
            threatLevel:'',// 危害等级
            difficulty:'',// 利用难度
            lang:'',// 开发语言
            appName:'',// 受影响产品
            appVersion:'',// 受影响版本
            platform:'',// 适用平台
            permission:'',// 运行权限
            refUrl:'',// 参考链接
            desc:'',// 描述

            //第二阶段
            fileName:'',        // 武器源码
            cmd:'',             // 执行命令
            params:{
                id: "",         // 是否必填
                name: "",       // 参数名称
                required: true, // 是否必填
                val: "",        // 默认值
                desc: "",       // 说明
            }
            // 是否必填
            // 默认值
            // 说明
        })
        let activeStep = ref(0);  // 激活的步骤
        
        let paramList = reactive([1,2,3]);


        //#region 一级类型下拉选项
        const firstOpt = ref([])
        // firstOpt.value = levelWeapon.data;
        //#endregion


        //#region 武器类型下拉选项
        const weaponOpt = ref([
            
        ])
        //#endregion

        //#region  危害等级下拉选择
        const levelOpt = reactive([
            {
                value: 'low',
                name: '低危'
            },
            {
                value: 'medium',
                name: '中危'
            },
            {
                value: 'high',
                name: '高危'
            }
        ]);
        //#endregion
        
        //#region 利用难度下拉
        const diffOpt = reactive([
            {
                value: 'easy',
                name: '简单',
            },
            {
                value: 'normal',
                name: '一般',
            },
            {
                value: 'hard',
                name: '困难',
            }
        ])
        //#endregion
        
        //#region 平台下拉数据
        const plateOpt = reactive([
            {
                value: 'windows',
                name: 'windows',
            },
            {
                value: 'linux',
                name: 'linux',
            },
        ]);
        //#endregion
        
        //#region 是否必填下拉数据
        const needOpt = reactive([
            {
                value: true,
                name: '是',
            },
            {
                value: false,
                name: '否',
            },
        ])
        //#endregion
        
        //#region 运行权限的用户
        const userOpt = reactive([
            {
                value: '普通用户',
                name:'普通用户'
            },
            {
                value: 'Administrator',
                name:'Administrator'
            }
        ])
        //#endregion

        // 关闭弹窗
        function handleClose(){
            
            // 调用父组件的函数对弹窗进行关闭
            context.emit('show',false)
            // 回到起始页
            activeStep.value = 0;
        }
        // 进入下一步的同时提交数据
        function handleClose2(){

            // 进入下一步
            activeStep.value = 1;

            // 新增武器数据
            context.emit('Info');       // 刷新界面

            // ruleForm.value.validate(valid => {
            //     if (valid) {
            //         // 进入下一步
            //         activeStep.value = 2;
            //     } else {
            //         console.log('error submit!!')
            //         return false
            //     }
            // })
        }
        // 关闭弹窗的同时提交数据
        function handleClose3(){
            // ruleForm2.value.validate(valid => {
            //     if (valid) {
            //     } else {
            //         console.log('error submit!!')
            //         return false
            //     }
            // })
        }
        // 在编辑的时候为删除一条信息清空位置
        function minusOne(item,index){
            paramList.splice(index,1);
        }
        // 在编辑的时候为添加一条新信息展开位置
        function plusOne(){
            paramList.push({})
        }

        return{
            activeStep,
            rules,
            ...toRefs(weaponInfo),
            firstOpt,
            weaponOpt,

            levelOpt,
            diffOpt,
            plateOpt,
            needOpt,
            userOpt,
            paramList,


            // 方法
            minusOne,
            plusOne,
            handleClose,
            handleClose2,
            handleClose3
        }
    },
};
</script>

<style lang="less" scoped>

:deep(.weapon-dialog){
    margin-top: 4vh;
    .weapon-dialog-step{
        padding: 0 100px 15px;
        box-sizing: border-box;
        
        .el-step__head.is-process{
            color: rgba(0, 130, 255, 1);
            border-color: rgba(0, 130, 255, 1);
        }
        .el-step__head.is-success{
            .el-step__icon.is-text{
                color: white;
                border-color: rgba(0, 130, 255, 1);
                background-color: rgba(0, 130, 255, 1);
            }
        }
        
        .el-step__main{
            .el-step__title{
                color: rgba(0, 130, 255, 1);
                font-size: 12px;
                line-height: 20px
            }
        }
    }
    .weapon-param-title{
        background-color:  #F8F8F8;
        border-radius: 3px;
        margin-left: 10px;
        box-sizing: border-box;
    }
    .weapon-param-add{
        height: 25px;
        text-indent: 10px;
        color: #25A4F4;
        .el-icon{
            line-height: 25px;
        }
        span{
            margin-left: 5px;
            cursor: pointer;
        }
    }
    .weapon-param{
        padding-left: 10px;
        box-sizing: border-box;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        color: #1A1A1A;
        line-height: 33px;
        margin-bottom: 4px;
        
        .el-col{
            padding-right: 5px;
            box-sizing: border-box;
        }
        .el-col:last-of-type{
            padding: none;
        }
    }
    .el-form{
        .el-form-item__content{
            .el-select{
                width: 100%;
            }
            .weapon-opt{
                display: flex;
                justify-content: flex-end
            }
        }
        .indent{
            .el-form-item__label{
                text-indent: 10px;
            }
        }
        .el-textarea{
            height: 60px;
            .el-textarea__inner{
                height: 60px !important;
                min-height: 60px !important;
                max-height: 60px !important;
            }
        }
    }   
}
</style>