<template>
    
    <!-- 剧本管理 -->
    <div class="drama" id="drama">
        
        <!-- 左侧状态及列表 -->
        <div class="drama-left">
            <ul class="drama-type">
                <li class="standard-box">
                    <div class="dramaImg total"></div>
                    <div class="dramaData">
                        <p>剧本总数</p>
                        <h3 class="blue">{{ dramaList.total }}</h3>
                    </div>
                </li>
                <li class="standard-box">
                    <div class="dramaImg planning"></div>
                    <div class="dramaData">
                        <p>待发布</p>
                        <h3 class="gray">{{ dramaList.planning }}</h3>
                    </div>
                </li>
                <li class="standard-box">
                    <div class="dramaImg running"></div>
                    <div class="dramaData">
                        <p>已发布</p>
                        <h3 class="green">{{ dramaList.running }}</h3>
                    </div>
                </li>

            </ul>
            <div class="drama-content standard-box">
                <div class="drama-list">
                    <div class="_title">
                        <h3>剧本列表<span>共{{ total }}条</span></h3>

                        <div class="icon">
                            <!-- <el-tooltip
                                class="item"
                                effect="light"
                                content="删除剧本"
                                placement="top-start"
                                :show-after="800">
                                <div class="del"></div>
                            </el-tooltip> -->
                            <el-tooltip
                                class="item"
                                effect="light"
                                content="新增剧本"
                                placement="top-start"
                                :show-after="800">
                                <div class="add" @click="addDrama"></div>
                            </el-tooltip>
                            
                        </div>
                    </div>
                    <div class="_filter">
                        <h3>这里是请求参数</h3>
                        <!-- <div class="filter-type">
                            <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                                <template #prepend>{{ aa }}</template>
                            </el-input>
                        </div>
                        <div class="filter-select">
                            <span class="type">{{ bb }}</span>
                            <el-select size="mini"></el-select>
                        </div>

                        <div class="filter-time">
                            <span class="type">{{ cc }}</span>
                            <el-date-picker
                                type="datetimerange"
                                range-separator="To"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                size="mini" clearable>
                            </el-date-picker>
                        </div>
                        <div class="filter-time">
                            <span class="type">{{ dd }}</span>
                            <el-date-picker
                                type="datetimerange"
                                range-separator="To"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                size="mini" clearable>
                            </el-date-picker>
                        </div>
                        <div class="filter-button">
                            <el-button type="primary" @click="Filter" size="mini">查询</el-button>
                            <el-button @click="FilterNone" size="mini">清空</el-button>
                        </div> -->


                        <!-- <div class="filter-type">
                            <el-input v-model="aa" :disabled="true" class="type1"></el-input>
                            <el-input class="type2"></el-input>
                        </div>

                        <div class="filter-type">
                            <el-input v-model="bb" :disabled="true" class="type1"></el-input>
                            <el-select class="type2"></el-select>
                        </div>

                        <div class="filter-time">
                            <el-input v-model="cc" :disabled="true" class="type1"></el-input>
                            <el-date-picker
                                class="type2"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptionsEnd">
                        </el-date-picker>
                        </div>

                        <div class="filter-time">
                            <el-input v-model="dd" :disabled="true" class="type1"></el-input>
                            <el-date-picker
                                class="type2"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptionsEnd">
                            </el-date-picker>
                        </div> -->

                    </div>
                    <div class="_list">
                        <el-row class="list-title">
                            <el-col v-for="(item,index) in titleList" :key="index" :span="item.width">{{ item.name || '--' }}</el-col>
                        </el-row>
                        <div class="content-list" v-if="contentList.length">
                            <el-scrollbar style="height:100%" class="scrollbar-for">
                                <el-row v-for="(item,index) in contentList" :key="index">
                                    <el-col :span="2">{{ index+1+(pageIndex-1)*pageSize }}</el-col>
                                    <!-- <el-col :span="1"><span class="status">{{ item.status == '0'?'编排':'运行' }}</span></el-col> -->
                                    <el-col :span="5">
                                        <span class="skip" @click="skip(item.status,item._id)">{{ item.name || '--' }} ></span>
                                        <span class="mini-map" @click="miniMap(item._id)">缩略图></span>
                                    </el-col>
                                    <el-col :span="4">{{ item.createTime || '--' }}</el-col>
                                    <el-col :span="5">{{ item.publishTime || '--' }}</el-col>
                                    <el-col :span="2">{{ item.runNum || '0' }}</el-col>
                                    <el-col :span="3" :style="`color: ${item.status=='1'?'rgba(4, 199, 126, 1)':'rgba(153, 153, 153, 1)'}`">{{ statusList[item.status] }}</el-col>
                                    <el-col :span="3" class="operate">
                                        <el-tooltip
                                            class="item"
                                            effect="light"
                                            content="删除剧本"
                                            placement="top-start"
                                            :show-after="800">
                                            <div class="del" @click="delDrama(item._id)"></div>
                                        </el-tooltip>
                                        <el-tooltip
                                            class="item"
                                            effect="light"
                                            content="修改剧本"
                                            placement="top-start"
                                            :show-after="800">
                                            <div class="edit" @click="editDrama(item)"></div>
                                        </el-tooltip>
                                        <el-tooltip
                                            class="item"
                                            effect="light"
                                            content="重新编排"
                                            placement="top-start"
                                            :show-after="800"
                                            v-if="item.status">
                                            <div class="refresh" @click="reFresh"></div>
                                        </el-tooltip>
                                        
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </div>
                        <div class="content-list" v-else>
                            <el-empty description="暂无剧本列表数据"></el-empty>
                        </div>
                    </div>
                </div>
                
                <div class="page"  v-if="contentList.length">
                    <el-pagination background layout="total, prev, pager, next" 
                        :total="total" 
                        :page-size="pageSize"
                        v-model:currentPage="pageIndex"
                        @size-change="handleSizeChange" 
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
            
        </div>
        
        <!-- 右侧模板 -->
        <div class="drama-right standard-box">
            <div class="_title">
                <h3>剧本模板<span>共23条</span></h3>
            </div>
            <div class="filter">
                <el-select v-model="search" filterable placeholder="搜索"></el-select>
            </div>
            <div class="content" v-if="templetList.length">
                <el-scrollbar style="height:100%" class="scrollbar-for">
                    <ul>
                        <li v-for="(item,index) in templetList" :key="index">
                            <div class="temple-title">
                                <h5>{{index +1 }} {{item.name}}</h5>
                                <span @click="addDrama">应用</span>
                            </div>
                            <div class="temple-content">{{ item.description || '暂无描述' }}</div>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="content" v-else>
                <el-empty description="暂无剧本模板数据"></el-empty>
            </div>
        </div>

        <!-- @绑定的自定义事件 -->
        <!-- idAdd 种类是新增还是修改 -->
        <Dialog :dialogVisible="dialogVisible" @show="showDialog" @Info="Info"></Dialog>

    </div>

</template>

<script>
import { ref, toRef, toRefs, reactive, onMounted, onUpdated } from 'vue';
import { defineComponent } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import test from "../API/test.js"
import daramApi from "../API/dramaApi"
import auth from "../assets/js/auth.js"
import Dialog from "../components/drama/dramaDialog.vue"
import tem from "../assets/json/drama/dramaTempleteInfo.json"
import stat from "../assets/json/drama/statusInfo.json"
export default {
    name: "Drama",
    components:{ Dialog },
    setup() {

        let aa = '剧本名称';
        let bb = '剧本状态';
        let cc = '开始时间';
        let dd = '最近发布时间';
        
        let router = useRouter();   //路由
        // 剧本总数，待发布，已发布的三个状态
        let dramaList = reactive({
            total: 0,
            planning: 0,
            running: 0
        });

        // 剧本列表的标题头部数据
        const titleList = reactive([
            { name:"序号", width: 2 },
            { name:"剧本名称", width: 4 },
            { name:"创建时间", width: 5 },
            { name:"最近发布时间", width: 5 },
            { name:"发布次数", width: 2 },
            { name:"当前状态", width: 3 },
            { name:"操作", width: 3 },
        ])
        // 发布状态下拉框
        let statusList = {
            0:'未发布',
            1:'已发布'
        }
        // 新增弹窗的出现与隐藏
        let dialog = reactive({
            dialogVisible: false,
        })
        
        // let contentList = reactive([]);  // 这里reactive的锅我真的是要打人
        // 一直赋值不上去，我以为是异步的问题，结果是reactive在接受后端变量的时候，proxy对象转为了数组，导致无法实现响应式，在前端自定义数据中，最好用ref（以先阶段粗浅的理解），reative支持修改和删除
        // let contentList = ref([]);


        // 剧本列表相关的参数信息
        let dramaInfo = reactive({
            pageIndex: 1,   // 页码
            pageSize: 15,   // 每页条数(当前页)
            param: '',      // 筛选参数
            total: 0,       // 总条数
            search:'',      // 搜索内容
            contentList:[],    // 剧本列表内容数据
            templetList:[],    // 剧本模板内容数据
        });

        // 获得信息
        async function Info(){
            // 筛选参数     -->     页码  (每页)条数
            let res = await daramApi.getDramaInfo(dramaInfo.pageIndex,dramaInfo.pageSize);
            // let res = tem;
            if(res.code == '200'){
                // 将创建时间和发布时间由时间戳转为正常时间
                res.data.list.forEach((d,i)=>{
                    d.createTime  = d.createTime ? auth.getDateTime(d.createTime): '';
                    d.publishTime  = d.publishTime ? auth.getDateTime(d.publishTime): '';
                })
                dramaInfo.contentList = res.data.list
                dramaInfo.total = res.data.total;   // 剧本总数
            }
        }
        // 获得状态信息
        async function StatusInfo(){
            let res = await daramApi.getStatusInfo();
            // let res = stat;  // json文件数据
            if(res.code == '200'){
                dramaList.total = res.data.total;
                dramaList.planning = res.data.planning;
                dramaList.running = res.data.running;
            }

        }
        // 获得模板信息
        async function TempleInfo(){
            let param = {
                name: ''
            }
            let res = await daramApi.getDramaTempletInfo(param);
            if(res.code == '200'){
                dramaInfo.templetList = res.data;
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
        // 对列表进行筛选
        function Filter(){}
        // 清空筛选，对列表重新加载
        function FilterNone(){}
        // 添加剧本
        function addDrama(){
            dialog.dialogVisible=true;
        }
        
        // 删除剧本
        const delDrama = (param) => {
            ElMessageBox.confirm( '是否删除该剧本?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: "common-box",
                    type: 'warning',
                }
            ).then(async () => {
                let res = await daramApi.delDrama(param);
                if(res.code == '200'){
                    ElMessage({
                        message: res.msg,
                        type: res.code == '200' ? 'success' : 'error',
                        appendTo: document.getElementById('drama'),
                    })
                    Info();
                }
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消删除',
                })
            })
        }
        // 编辑剧本
        const editDrama = (param) => {
            console.log("编辑剧本",param);
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
        

        // 界面跳转  ----> 进入编排/执行界面
        function skip(param,id){
            let path = param ? '/Drama/dramaArrange' : '/Drama/dramaRunNew';
            router.push({
                path: path,
                query:{
                    id
                }
            })
        }

        // 界面跳转进入缩略图界面
        function miniMap(id){
            router.push({
                path: '/Drama/miniMap',
                query:{
                    id
                }
            })
        }

        // 是否展示弹窗
        function showDialog(value){
            dialog.dialogVisible = value;
        }

        return {
            aa,
            bb,
            cc,
            dd,

            dramaList,
            titleList,
            statusList,
            ...toRefs(dramaInfo),
            ...toRefs(dialog),
            // 方法
            Info,
            handleSizeChange,
            handleCurrentChange,
            Filter,
            FilterNone,
            addDrama,
            editDrama,
            delDrama,
            reFresh,
            skip,
            miniMap,
            showDialog
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
                        line-height: 25px;

                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .blue{
                        color: #0082FF;
                    }
                    .gray{
                        color: #858585;
                    }
                    .green{
                        color: #41c3b3;
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
                height: calc(100% - 50px);
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
                    width: 100%;
                    height: 64px;
                    line-height: 64px;
                    display: flex;
                    padding: 0 19px;
                    box-sizing: border-box;

                    h3{
                        flex: 1;
                        text-align: center;
                    }
                    .filter-button{
                        padding: 19px 0;
                    }
                }
                ._list{
                    height: calc(100% - 114px);
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
                        height: calc(100% - 46px);
                        .el-row{
                            width: 100%;
                            height: 44px;
                            padding-left: 22px;
                            box-sizing: border-box;
                            .status{
                                font-size: 12px;
                                color: rgba(0, 130, 255, 1);
                                padding: 2px 2px;
                                border: 1px solid rgba(0, 130, 255, 1);
                                border-radius: 8px;
                            }
                            .skip{
                                color: rgba(0, 130, 255, 1) !important;
                                cursor: pointer;
                            }
                            .mini-map{
                                margin-left: 10px;
                                font-size: 12px;
                                color: #e13232 !important;
                                cursor: pointer;
                            }
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
                                    margin-right: 20px;
                                    flex: 1;
                                    width: 22px;
                                    height: 22px;
                                    background-repeat: no-repeat;
                                    background-size: contain;
                                    vertical-align: middle;
                                    cursor: pointer;
                                }
                                .del{
                                    
                                    background-image: url(../assets/image/script-maage/red-del.png);
                                }
                                .edit{
                                    background-image: url(../assets/image/script-maage/edit.png);
                                }
                                .refresh{
                                    margin-right: 0;
                                    background-image: url(../assets/image/script-maage/rest-status.png);
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
        max-width: 20%;
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
            height: calc(100% - 98px);
            padding-bottom: 10px;
            box-sizing: border-box;
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