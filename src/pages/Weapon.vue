<template>
    <!-- 武器 -->
    <div class="weapon">
        <div class="weapon-list standard-box">
            <div class="_title">
                <h3>武器库</h3>
                <div class="icon">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除武器"
                        placement="top-start"
                        :show-after="800">
                        <div class="del" @click="delWeapon"></div>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="武器下载"
                        placement="top-start"
                        :show-after="800">
                        <div class="download" @click="downloadWeapon"></div>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="新增武器"
                        placement="top-start"
                        :show-after="800">
                        <div class="add" @click="addWeapon"></div>
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

                            <el-col :span="1">{{ index+1+pageSize*(currentPage-1) }}</el-col>
                            <el-col :span="4">{{ item.payloadName||'--' }}</el-col>
                            <el-col :span="2">{{ item.payloadType || '--' }}</el-col>
                            <el-col :span="2">{{ item.topType || '--' }}</el-col>
                            <el-col :span="2">{{ item.vulnerabilityNo || '--' }}</el-col>
                            <el-col :span="2">{{ item.riskLevel || '--' }}</el-col>
                            <el-col :span="2">{{ item.diffLevel || '--' }}</el-col>
                            <el-col :span="3">{{ item.platform.toString() || '--' }}</el-col>
                            <el-col :span="3">{{ item.appName || '--' }}</el-col>
                            <el-col :span="3" class="operate">
                                <div class="detail" @click="weaponDetail"></div>
                                <div class="del" @click="delWeapon"></div>
                            </el-col>
                        </el-row>
                    </el-scrollbar>
                </div>
                <div class="page">
                    <!-- {{ total3 }} -->
                    <el-pagination background layout="prev, pager, next" :total="total"
                     v-model:currentPage="currentPage"
                     @size-change="handleSizeChange" 
                     @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { ref, toRef, toRefs, reactive, onMounted, onUpdated } from 'vue';

import weaponApi from "../API/weaponApi"
import auth from "../assets/js/auth.js"
export default {
    name: "Weapon",
    setup() {
        // 武器列表的标题
        let titleList = reactive([
            { name:"序号", width: 1 },
            { name:"武器名称", width: 4 },
            { name:"武器类型", width: 2 },
            { name:"一级列别", width: 2 },
            { name:"漏洞编号", width: 2 },
            { name:"危害等级", width: 2 },
            { name:"利用难度", width: 2 },
            { name:"平台", width: 3 },
            { name:"受影响产品", width: 3 },
            { name:"操作", width: 3 },
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
        // 利用难度下拉
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
            pageSize: 10,
            param: '',
            total: 0,
            currentPage: 1
        })
        let total3 = ref(parseInt(9));
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
            //
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
                            d.riskLevel = x.value == d.threatLevel ? x.name: '';
                        })
                    }
                    // 利用难度的转换
                    if(d.difficulty){
                        diffList.forEach(x=>{
                            d.diffLevel = x.value == d.difficulty ? x.name: '';
                        })
                    }
                })
                contentList.value = res.data.list;
                weaponInfo.total = res.data.total;
            }
        }
        function weaponDetail(){}
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
        
        return {
            titleList,
            total3,
            ...toRefs(weaponInfo),
            contentList,
            // 方法
            delWeapon,
            downloadWeapon,
            addWeapon,
            weaponDetail,
            
            handleSizeChange,
            handleCurrentChange
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
            height: 64px;
            line-height: 64px;
        }
        ._list{
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