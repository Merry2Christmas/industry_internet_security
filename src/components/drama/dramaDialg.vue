<template>
    <!-- 武器 -->
    <div>
        <el-dialog title="创建剧本"
            v-model="dialogVisible"
            width="450px"
            :before-close="handleClose"
            custom-class="common-dialog drama-dialog">
            <el-form label-position="left" label-width="88px">
                <el-form-item label="名称"><el-input placeholder="请输入"></el-input></el-form-item>
                <el-form-item label="模板"><el-input placeholder="请输入"></el-input></el-form-item>
                <el-form-item label="描述"><el-input placeholder="请输入" type="textarea"></el-input></el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false" size="small">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive, toRef, toRefs } from 'vue';
export default {
    name: "dramaDialg",
    setup(porps,context) {
        let dialog = reactive({
            dialogVisible: false,
        })
        return{
            ...toRefs(dialog)
        }
    },
};
</script>

<style lang="less" scoped>
.drama-dialog{
    .el-textarea{
        /deep/.el-textarea__inner{
            background-color: #F0F0F0;
            border: none;
            height: 76px !important;
            min-height: 76px !important;
            max-height: 76px !important;
        }
    }
}
</style>