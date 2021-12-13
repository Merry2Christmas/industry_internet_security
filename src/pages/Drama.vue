<template>
    
    <!-- 剧本管理 -->
    <div class="drama">
        <div class="drama-left">
            <ul class="drama-type">
                <li v-for="(item,index) in dramaList" :key="index" class="standard-box">
                    <div class="dramaImg" :class="item.key"></div>
                    <div class="dramaData">
                        <p>{{ item.name }}</p>
                        <h3>{{ item.total }}</h3>
                    </div>
                </li>
            </ul>
            <div class="drama-content standard-box">
                <div class="drama-list">
                    <div class="_title">
                        <h3>剧本列表<span>共{{ total }}条</span></h3>
                        <div class="icon">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="删除剧本"
                                placement="top-start"
                                :show-after="800">
                                <div class="del" @click="delDaram"></div>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="新增剧本"
                                placement="top-start"
                                :show-after="800">
                                <div class="add" @click="addDrama"></div>
                            </el-tooltip>
                            
                        </div>
                    </div>
                    <div class="_filter">这里是请求参数</div>
                    <div class="_list">
                        <el-row class="list-title">
                            <el-col v-for="(item,index) in titleList" :key="index" :span="item.width">{{ item.name || '--' }}</el-col>
                        </el-row>
                        <div class="content-list">
                            <el-scrollbar style="height:100%" class="scrollbar-for">
                                <el-row v-for="(item,index) in contentList" :key="index">
                                    <el-col :span="1">{{ index+1 }}</el-col>
                                    <el-col :span="4">{{ item.name || '--' }}</el-col>
                                    <el-col :span="5">{{ item.createTime || '--' }}</el-col>
                                    <el-col :span="5">{{ item.publishTime || '--' }}</el-col>
                                    <el-col :span="3">{{ item.runNum || '--' }}</el-col>
                                    <el-col :span="3" :style="`color: ${item.status=='1'?'rgba(4, 199, 126, 1)':'rgba(153, 153, 153, 1)'}`">{{ statusList[item.status] }}</el-col>
                                    <el-col :span="3" class="operate">
                                        <div class="del" @click="delDaram"></div>
                                        <div class="refresh" @click="reFresh"></div>
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
                
                <div class="page">
                    <el-pagination background layout="prev, pager, next" :total="total"
                     v-model:currentPage="currentPage"
                     @size-change="handleSizeChange" 
                     @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
            
        </div>


        <div class="drama-right standard-box">
            <div class="_title">
                <h3>剧本模板<span>共23条</span></h3>
            </div>
            <div class="filter">
                <el-select v-model="value" filterable placeholder="搜索">
                    <!-- <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option> -->
                </el-select>
            </div>
            <div class="content">
                <ul>
                    <li v-for="(item,index) in templetList" :key="index">
                        <div class="temple-title">
                            <h5>{{index +1 }} {{item.name}}</h5>
                            <span>应用</span>
                        </div>
                        <div class="temple-content">{{ item.description || '暂无描述' }}</div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- <el-dialog title="创建剧本"
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
        </el-dialog> -->
        <Dialog :dialogVisible="dialogVisible" @handleClose='handleClose'></Dialog>

    </div>

</template>

<script>
import { ref, toRef, toRefs, reactive, onMounted, onUpdated } from 'vue';
import { defineComponent } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import test from "../API/test.js"
import daramApi from "../API/dramaApi"
import auth from "../assets/js/auth.js"
import Dialog from "../components/drama/dramaDialg.vue"
export default {
    name: "Drama",
    components:{ Dialog },
    setup() {
        // 剧本总数，待发布，已发布的三个状态
        let dramaList = ref([])

        // 剧本列表的标题头部数据
        const titleList = reactive([
            { name:"序号", width: 1 },
            { name:"剧本名称", width: 4 },
            { name:"创建时间", width: 5 },
            { name:"最近发布时间", width: 5 },
            { name:"发布次数", width: 3 },
            { name:"当前状态", width: 3 },
            { name:"操作", width: 3 },
        ])
        // 发布状态下拉框
        let statusList = {
            0:'未发布',
            1:'已发布'
        }
        let dialog = reactive({
            dialogVisible: false,
        })
        
        // let contentList = reactive([]);  // 这里reactive的锅我真的是要打人
        // 一直赋值不上去，我以为是异步的问题，结果是reactive在接受后端变量的时候，proxy对象转为了数组，导致无法实现响应式，在前端自定义数据中，最好用ref（以先阶段粗浅的理解），reative支持修改和删除
        
        // let contentList = reactive([]);
        // 剧本列表内容数据
        let contentList = ref([]);
        // 剧本模板内容数据
        let templetList = ref([]);

        // 剧本列表相关的参数信息
        let dramaInfo = reactive({
            pageIndex: 1,
            pageSize: 10,
            param: '',
            total: 0,
            currentPage:1
        });

        // 获得信息
        async function Info(){
            // 页码  (每页)条数
            let res = await daramApi.getDramaInfo(dramaInfo.pageIndex,dramaInfo.pageSize);
            if(res.code == '200'){
                res.data.list.forEach((d,i)=>{
                    d.createTime  = d.createTime ? auth.getDateTime(d.createTime): '';
                    d.publishTime  = d.publishTime ? auth.getDateTime(d.publishTime): '';
                })
                contentList.value = res.data.list;
                dramaInfo.total = res.data.total;
            }
        }
        // 获得状态信息
        async function StatusInfo(){
            let res = await daramApi.getStatusInfo();
            if(res.code == '200'){
                for(let key in res.data){
                    dramaList.value.push({
                        key: key,
                        name: key == 'total' ? '剧本总数' : key == 'planning' ? '待发布' : '已发布',
                        total: res.data[key]
                    })
                }
            }

        }
        // 获得模板信息
        async function TempleInfo(){
            let param = {
                name: ''
            }
            let res = await daramApi.getDramaTempletInfo(param);
            if(res.code == '200'){
                templetList.value = res.data;
            }
        }
        // 初始化信息
        function init(){
            Info();
            StatusInfo();
            TempleInfo();
        }
        
        
        init()
        // 设置每页多少条
        function handleSizeChange(val){
            dramaInfo.pageSize = val;
            dramaInfo.pageIndex = 1;    // 改变后，回到第一页
            Info();
        }
        // 设置当前多少页
        function handleCurrentChange(val){
            dramaInfo.pageIndex = val;
            Info();
        }
        // 添加剧本
        function addDrama(){
            console.log('??????');
            dialog.dialogVisible=true;
            console.log(dialog.dialogVisible);
        }
        // 关闭弹窗
        function handleClose(){
            dialog.dialogVisible = false;   // 关闭弹窗
        }
        
        // 删除剧本
        const delDaram = () => {
            ElMessageBox.confirm( '是否删除该剧本?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消删除',
                })
            })
        }
        // 更新剧本
        const reFresh = () => {
            ElMessageBox.confirm( '是否重置该剧本?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                ElMessage({
                    type: 'success',
                    message: '重置成功',
                })
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消重置',
                })
            })
        }
        return {
            dramaList,
            titleList,
            contentList,
            templetList,
            ...toRefs(dramaInfo),
            statusList,
            ...toRefs(dialog),
            // 方法
            handleSizeChange,
            handleCurrentChange,
            addDrama,
            handleClose,
            delDaram,
            reFresh,
        };
    },
};
</script>


<style lang="less">
.drama{
    .filter{
        .el-input{
            .el-input__inner{
                border-radius: 15px;
                height: 30px;
                line-height: 30px;
            }
        }
    }
}

</style>
<style lang="less" scoped>
.drama{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(245, 245, 245, 1);
    display: flex;
    .standard-box{
        box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
        border-radius: 3px;
        background: #FFFFFF;
    }
    .drama-left{
        flex: 7;
        margin-right: 20px;
        .drama-type{
            height: 93px;
            display: flex;
            li{
                position: relative;
                flex: 1;
                margin-right: 20px;
                box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
                .dramaImg{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    margin-left: 10px;
                    
                    width: 40%;
                    height: 90%;
                    max-width: 84px;
                    max-height: 72px;
                    min-width: 42px;
                    min-height: 36px;

                    background-repeat: no-repeat;
                    background-size: cover;
                }
                .total{
                    background-image: url("../assets/image/script-maage/juben.png");
                }
                .planning{
                    background-image: url("../assets/image/script-maage/daifabu.png");
                }
                .running{
                    background-image: url("../assets/image/script-maage/yifabu.png");
                }
                .dramaData{
                    float: right;
                    width: 40%;
                    margin-right: 10px;
                    p{
                        font-size: 14px;
                        font-weight: 400;
                        color: #1A1A1A;
                        line-height: 21px;

                        
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    h3{
                        font-size: 30px;
                        font-weight: bold;
                        color: #0082FF;
                        line-height: 25px;

                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
            li:last-of-type{
                margin: 0;
            }
        }
        .drama-content{
            margin-top: 20px;
            width: 100%;
            height: calc(100% - 113px);
            .drama-list{
                max-height: calc(100% - 163px);
                ._title{
                    height: 49px;
                    border-bottom: 1px solid rgba(162, 189, 220, 0.25);
                    .icon{
                        >div{
                            width: 22px;
                            height: 22px;
                            cursor: pointer;
                        }
                        .add{
                            background-image: url(../assets/image/script-maage/add.png);
                        }
                        .del{
                            background-image: url(../assets/image/script-maage/del.png);
                        }
                    }
                }
                ._filter{
                    height: 64px;
                    line-height: 64px;
                }
                ._list{
                    max-height: calc(100% - 114px);
                    .list-title{
                        width: 100%;
                        height: 46px;
                        background-color: rgba(0, 130, 255, 0.04);
                        padding-left: 22px;
                        box-sizing: border-box;
                        .el-col{
                            height: 46px;
                            font-size: 14px;
                            line-height: 46px;
                            font-weight: bold;
                            color: #1A1A1A;
                            text-align: left;
    
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .content-list{
                        .el-row{
                            width: 100%;
                            height: 44px;
                            padding-left: 22px;
                            box-sizing: border-box;
                            .el-col{
                                height: 44px;
                                font-size: 14px;
                                font-weight: 400;
                                color: #4D4D4D;
                                line-height: 44px;
                                text-align: left;
    
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                            .operate{
                                >div{
                                    float: left;
                                    margin-top: 10px;
                                    flex: 1;
                                    width: 22px;
                                    height: 22px;
                                    background-repeat: no-repeat;
                                    vertical-align: middle;
                                    cursor: pointer;
                                }
                                .del{
                                    background-image: url(../assets/image/script-maage/red-del.png);
                                }
                                .refresh{
                                    margin-left: 20px;
                                    background-image: url(../assets/image/script-maage/rest-status.png);
                                    background-size: contain;
                                }
                            }
                        }
                        .el-row:nth-of-type(2n){
                            background-color: rgba(0, 130, 255, 0.04);
                        }
                    }
                    
                }
            }
            .page{
                height: 50px;
                padding: 9px;
                .el-pagination{
                    float: right;
                }
            }
        }
    }
    .drama-right{
        flex: 2;
        background: white;
        .filter{
            width: 100%;
            height: 48px;

            padding: 9px 11px;
            box-sizing: border-box;
            .el-select{
                width: 100%;
            }
        }
        .content{
            ul{
                padding: 10px;
                li{
                    width: 100%;
                    height: 86px;
                    background: #F6F9FC;
                    border-radius: 3px;
                    margin-bottom: 10px;
                    padding: 10px;
                    box-sizing: border-box;
                    .temple-title{
                        height: 30px;
                        display: flex;
                        h5{
                            flex: 1;
                            text-align: left;
                            font-size: 14px;
                            font-weight: bold;
                            color: #1A1A1A;
                            line-height: 21px;

                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        span{
                            display: inline-block;
                            width: 42px;
                            height: 20px;
                            font-size: 14px;
                            color: #0082FF;
                            border: 1px solid #0082FF;
                            border-radius: 2px;
                            cursor: pointer;
                        }
                    }
                    .temple-content{
                        height: 36px;
                        text-align: left;
                        font-size: 14px;
                        font-weight: 400;
                        color: #666666;
                        line-height: 18px;
                        text-indent: 12px;

                        // overflow: hidden;
                        // white-space: wrap;
                        // text-overflow: ellipsis;
                    
                    }
                }
            }
        }
    }

    // 弹窗样式
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
}
</style>