<template>
    <!-- 剧本弹窗 -->
    <div>
        <el-dialog title="创建剧本"
            v-model="dialogVisible"
            width="450px"
            :before-close="handleClose"
            :close-on-click-modal="false"
            custom-class="common-dialog drama-dialog">
            <el-form label-position="left" label-width="88px" ref="ruleForm" :model="dramaInfo" :rules="rules">
                <el-form-item label="名称" prop="name"><el-input placeholder="请输入" v-model="name" clearable></el-input></el-form-item>
                <el-form-item label="模板" class="indent"><el-input placeholder="请输入" v-model="templateId" clearable></el-input></el-form-item>
                <el-form-item label="描述" class="indent"><el-input placeholder="请输入" v-model="description"></el-input></el-form-item>
            </el-form>
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

import daramApi from "../../API/dramaApi"
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
    name: "dramaDialog",
    // 父组件传递的参数
    props:['dialogVisible'],    // VUE2  VUE3都支持
    // 父组件传递的自定义事件
    emits:['hello'],    

    // porps 将所有传递的参数变为proxy对象
    setup(porps,context) {

        // 新增、修改剧本信息
        let dramaInfo = reactive({
            name : "",          // 姓名
            templateId : "",    // 模板id
            description : ""    // 描述
        });

        const ruleForm = ref(null);
        

        let rules = reactive({
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        })

        // attrs   emit 触发自定义事件  slot

        // 关闭弹窗
        function handleClose(){
            // 调用父组件的函数对弹窗进行关闭
            context.emit('show',false)
        }
        
        // 关闭弹窗的同时提交数据
        const handleClose2 = ()=>{
            ruleForm.value.validate(valid => {
                if (valid) {
                    add();
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
        async function add(){
            let res = await daramApi.addDrama(dramaInfo);

            if(res.code == '200'){
                context.emit('Info');       // 刷新界面
            }
            context.emit('show',false); // 关闭弹窗

            ElMessage({
                message: res.msg,
                type: res.code == '200' ? 'success' : 'error',
                appendTo: document.getElementById('drama'),
            })
        }
        
        return{
            rules,
            ruleForm,
            dramaInfo,
            ...toRefs(dramaInfo),
            // 函数
            handleClose,
            handleClose2
        }
    },
};
</script>

<style lang="less" scoped>
.drama-dialog{
    .el-textarea{
        :deep(.el-textarea__inner){
            background-color: #F0F0F0;
            border: none;
            height: 76px !important;
            min-height: 76px !important;
            max-height: 76px !important;
        }
    }
    .el-form{
        .indent{
            :deep(.el-form-item__label){
                text-indent: 10px;
            }
        }
        
    }
}
</style>