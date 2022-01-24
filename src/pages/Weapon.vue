<template>
    <!-- 武器 -->
    <div class="weapon">
        <div class="weapon-list standard-box">
            <div class="_title">
                <h3>武器库<span>共{{ total }}条</span></h3>
                <div class="icon">
                    <el-tooltip
                        class="item"
                        effect="light"
                        content="删除武器"
                        placement="top-start"
                        :show-after="800">
                        <div class="del" @click="delWeapon"></div>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="light"
                        content="武器下载"
                        placement="top-start"
                        :show-after="800">
                        <div class="download" @click="downloadWeapon"></div>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="light"
                        content="新增武器"
                        placement="top-start"
                        :show-after="800">
                        <div class="add" @click="addWeapon"></div>
                    </el-tooltip>
                </div>
            </div>
            <div class="_filter">
                <h3>这里是请求参数</h3>

                <!-- <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>武器库</template>
                    </el-input>
                </div>
                <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>漏洞编号</template>
                    </el-input>
                </div>
                <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>受影响产品</template>
                    </el-input>
                </div>
                <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>A类型</template>
                    </el-input>
                </div>
                <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>危害等级</template>
                    </el-input>
                </div>
                <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>利用难度</template>
                    </el-input>
                </div>
                <div class="filter-type">
                    <el-input v-model="input1" placeholder="请输入" size="mini" clearable>
                        <template #prepend>平台</template>
                    </el-input>
                </div>

                <div class="filter-button">
                    <el-button type="primary" @click="Filter" size="mini">查询</el-button>
                    <el-button @click="FilterNone" size="mini">清空</el-button>
                </div> -->

            </div>
            <div class="_list">
                <el-row class="list-title">
                    <el-col :span="1"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox></el-col>
                    <el-col v-for="(item,index) in titleList" :key="index" :span="item.width">{{ item.name || '--' }}</el-col>
                </el-row>
                <div class="content-list" v-if="contentList.length">
                    <el-scrollbar style="height:100%" class="scrollbar-for">
                        <el-row v-for="(item,index) in contentList" :key="index">
                            <el-col :span="1"><el-checkbox v-model="item.check" @change="checkCollect"></el-checkbox></el-col>
                            <el-col :span="1">{{ index+1+pageSize*(pageIndex-1) }}</el-col>
                            <el-tooltip
                                class="item"
                                effect="light"
                                :content="item.payloadName||'--'"
                                placement="top-start"
                                :show-after="800">
                                <el-col :span="4" class="skip" @click="weaponDetail(item.id)">{{ item.payloadName||'--' }}</el-col>
                            </el-tooltip>
                            
                            <el-tooltip
                                class="item"
                                effect="light"
                                :content="item.payloadType||'--'"
                                placement="top-start"
                                :show-after="800">
                                <el-col :span="3">{{ item.payloadType || '--' }}</el-col>
                            </el-tooltip>

                            <el-col :span="2">{{ item.topType || '--' }}</el-col>
                            <el-col :span="2">{{ item.vulnerabilityNo || '--' }}</el-col>
                            <el-col :span="2">{{ item.riskLevel || '--' }}</el-col>
                            <el-col :span="2">{{ item.diffLevel || '--' }}</el-col>
                            <el-col :span="2">{{ item.platform.toString() || '--' }}</el-col>
                            <el-col :span="3">{{ item.appName || '--' }}</el-col>
                            <el-col :span="2" class="operate">
                                <el-tooltip
                                class="item"
                                effect="light"
                                content="查看武器详情"
                                placement="top-start"
                                :show-after="800">
                                    <div class="detail" @click="weaponDetail(item.id)"></div>
                                </el-tooltip>
                                <el-tooltip
                                class="item"
                                effect="light"
                                content="删除武器"
                                placement="top-start"
                                :show-after="800">
                                    <div class="del" @click="delWeapon"></div>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </el-scrollbar>
                </div>
                <div class="content-list" v-else>
                    <el-empty description="暂无武器库列表数据"></el-empty>
                </div>
                <div class="page" v-if="contentList.length">
                    <el-pagination background layout="total, prev, pager, next" 
                    :total="total" 
                    :page-size="pageSize"
                    v-model:currentPage="pageIndex"
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </div>

        <!-- : 是传递参数    @是传递父级的方法 -->
        <Dialog :dialogVisible="dialogVisible" @show="showDialog" @Info="WeaponInfo"></Dialog>
    </div>
</template>

<script>
import Dialog from "../components/drama/weaponDialog.vue"

import { ref, toRef, toRefs, reactive, onMounted, onBeforeUnmount, onUpdated } from 'vue';

import { ElMessageBox, ElMessage } from 'element-plus'
import weaponApi from "../API/weaponApi"
import auth from "../assets/js/auth.js"
import { useRouter } from 'vue-router'
export default {
    name: "Weapon",
    components:{ Dialog },
    setup() {

        let router = useRouter();   //路由

        // 新增弹窗的出现与隐藏
        let dialog = reactive({
            dialogVisible: false,
        })
        // 是否展示弹窗
        function showDialog(value){
            dialog.dialogVisible = value;
        }
        // 武器列表的标题
        let titleList = reactive([
            { name:"序号", width: 1 },
            { name:"武器名称", width: 4 },
            { name:"武器类型", width: 3 },
            { name:"一级列别", width: 2 },
            { name:"漏洞编号", width: 2 },
            { name:"危害等级", width: 2 },
            { name:"利用难度", width: 2 },
            { name:"平台", width: 2 },
            { name:"受影响产品", width: 3 },
            { name:"操作", width: 2 },
        ])
        // 危险等级下拉选项
        const riskList = reactive([
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
        ])
        // 利用难度下拉选项
        const diffList = reactive([
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
        // 武器列表相关的参数信息
        let weaponInfo = reactive({
            pageIndex: 1,
            pageSize: 20,
            param: '',
            total: 0,

            checkAll: false,    // 是否全选
            isIndeterminate: false, // 是否多选
        })
        // 武器列表的内容
        let contentList = ref([]);
        

        // 删除武器
        const delWeapon = () => {
            ElMessageBox.confirm( '是否删除该武器?', '提示',
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
        // 武器下载
        function downloadWeapon(){
            //
        }   
        // 新增武器
        function addWeapon(){
            dialog.dialogVisible = true;
        }
        // 是否点击全选
        function handleCheckAllChange(val){
            weaponInfo.isIndeterminate = false;
            weaponInfo.checkAll = val;    // 将值赋给全选框
            contentList.value.forEach(item => {
                item.check = val;
            })
        }
        // 是否选中
        function checkCollect(val){
            let arr = [];
            contentList.value.forEach(i => {
                if(i.check) arr.push(i);
            })
            // 全选展示
            weaponInfo.checkAll = (arr.length == contentList.value.length);
            // isIndeterminate展示
            weaponInfo.isIndeterminate = (arr.length != 0 && !weaponInfo.checkAll);
        }

        function init(){
            WeaponInfo();
        }
        async function WeaponInfo(){
            let res = await weaponApi.getWeaponInfo(weaponInfo.pageIndex,weaponInfo.pageSize);
            if(res.code == '200'){
                res.data.list.forEach((d,i)=>{
                    // 危害等级的转换
                    if(d.threatLevel){
                        riskList.forEach(x=>{
                            if(x.value == d.threatLevel){
                                d.riskLevel = x.name;
                            }
                        })
                    }
                    // 利用难度的转换
                    if(d.difficulty){
                        diffList.forEach(x=>{
                            if(x.value == d.difficulty){
                                d.diffLevel = x.name;
                            }
                        })
                    }
                })
                res.data.list.forEach(item => {
                    item.check = false;
                })
                contentList.value = res.data.list;
                weaponInfo.total = res.data.total;
            }
        }
        // 跳转到武器详情界面
        function weaponDetail(id){
            router.push({
                path: '/Weapon/weaponDetail',
                query:{
                    id
                }
            })
        }
        init()

        // 设置每页多少条
        function handleSizeChange(val){
            weaponInfo.pageSize = val;
            weaponInfo.pageIndex = 1;    // 改变后，回到第一页
            WeaponInfo();
        }
        // 设置当前多少页
        function handleCurrentChange(val){
            weaponInfo.pageIndex = val;
            WeaponInfo();
        }
        // 界面跳转
        function skip(){
            // let path = param ? '/Drama/dramaRun' : '/Drama/dramaEdit';
            // router.push({
            //     path: path,
            // })
        }


        // // 页面滚动时，清除tooltip气泡
        // function handleScroll(){
        //     console.log("调用了这个方法");
        //     return
        //     let tooltips = document.getElementsByClassName('el-tooltip__popper')
        //     console.log(tooltips);
        //     if (tooltips.length > 0) {
        //         tooltips[tooltips.length - 1].style.display = 'none'
        //     }
        // }
        // // mounted 方法,挂载在全局
        // onMounted(()=>{
        //     window.addEventListener('scroll',handleScroll)
        // })
        // // onBeforeUnmount方法, 在页面关闭前移除掉该方法
        // onBeforeUnmount(()=>{
        //     window.removeEventListener('scroll',handleScroll)    
        // })
        
        return {
            titleList,
            ...toRefs(weaponInfo),
            ...toRefs(dialog),
            contentList,
            // 方法
            checkCollect,
            handleCheckAllChange,
            delWeapon,
            downloadWeapon,
            addWeapon,
            weaponDetail,
            
            WeaponInfo,
            handleSizeChange,
            handleCurrentChange,
            skip,
            showDialog
        };
    },
};
</script>

<style lang="less" scoped>
.weapon{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(245, 245, 245, 1);
    .weapon-list{
        width: 100%;
        height: 100%;
        ._title{
            height: 49px;
            border-bottom: 1px solid rgba(162, 189, 220, 0.25);
            .icon{
                >div{
                    width: 22px;
                    height: 22px;
                    background-size: cover;
                    cursor: pointer;
                }
                .add{
                    background-image: url(../assets/image/script-maage/add.png);
                }
                .del{
                    background-image: url(../assets/image/script-maage/del.png);
                }
                .download{
                    background-image: url(../assets/image/arsenal/in.png);
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
                height: calc(100% - 96px);
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
                    .skip{
                        color: rgba(0, 130, 255, 1) !important;
                        cursor: pointer;
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
                        .detail{
                            background-image: url(../assets/image/arsenal/look.png);
                        }
                        .del{
                            margin-left: 20px;
                            background-image: url(../assets/image/script-maage/red-del.png);
                        }
                    }
                }
                .el-row:nth-of-type(2n){
                    background-color: rgba(0, 130, 255, 0.04);
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
    
}
</style>