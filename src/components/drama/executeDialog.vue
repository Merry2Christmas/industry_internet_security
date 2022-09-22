<template>
    <!-- 编辑执行步骤弹窗 -->
    <div>
        <el-dialog title="编辑执行步骤"
            v-model="dialogVisible"
            width="450px" 
            :before-close="handleClose"
            :close-on-click-modal="false"
            custom-class="common-dialog execute-dialog">
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="步骤名称"><el-input v-model="info.stepNode.name"></el-input></el-form-item>
                    <el-form-item label="执行武器"><el-input v-model="info.weaponNameShow"></el-input></el-form-item>
                    <el-form-item label="执行命令"><span>{{ info.stepNode.weaponObj.cmd || '--' }}</span></el-form-item>
                </el-form>

                <div class="excute-param">
                    <el-row class="excute-param-title"><el-col :span="8">参数名称</el-col><el-col :span="16">参数值</el-col></el-row>

                    <el-row v-for="(item,index) in info.stepNode.executeParams" :key="index">
                        <el-col :span="8">{{ item.name }}</el-col><el-col :span="16"><el-input placeholder="默认值" v-model="item.val"></el-input></el-col>
                    </el-row>
                </div>
                

                <span class="notice">注：同一参数的多个参数值以英文逗号分隔，如192.168.1.2，192.168.1.3</span>

                <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose" size="small" color="#C3C3C3" style="color: white">取消</el-button>
                    <el-button type="primary" @click="handleClose2()" size="small">确定</el-button>
                </span>
            </template>

            </el-dialog>
    </div>
</template>

<script>
import { ref, reactive, toRef, toRefs, toRaw } from 'vue';
export default {
    name: "executeDialog",
    props: ["dialogVisible","info"],
    
    // porps 将所有传递的参数变为proxy对象
    setup(porps,context){

        // 关闭界面
        function handleClose(){
            console.log(22);
            context.emit("switchDialog",false);
        }
        
        // 关闭界面并保存修改，调用父组件方法关闭
        function handleClose2(){
            console.log(333);
            context.emit("switchDialog",false);
        }
        return{

            // 函数
            handleClose,
            handleClose2
        }
    }
};
</script>

<style lang="less" scoped>
.execute-dialog{
    .el-form{
        .el-form-item{
            span{
                float: right;
                color: rgba(153, 153, 153, 1);
            }
        }
    }
    .excute-param{
        padding: 0 16px;
        box-sizing: border-box;
        background-color: rgba(250, 250, 250, 1);
        height: 300px;
        .el-row{
            height: 40px;
            line-height: 40px;
            .el-col{
                text-align: left;
                color: rgba(26, 26, 26, 1);
                :deep(.el-input__inner){
                    height: 30px;
                    border: none;
                    background-color: rgba(235, 235, 235, 1);
                }
            }
        }
        .excute-param-title{
            .el-col{
                font-weight: bold;
            }
            
        }
    }
    .notice{
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
        line-height: 30px;
    }
}
</style>