<template>
    <!-- 首页 -->
    <div class="index">

        <div class="header">
            <Head></Head>

             <!-- :separator-icon="ArrowRight" -->
            <el-breadcrumb>
                <el-breadcrumb-item :to="{ path: '/' }">剧本管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { ref } from "vue"
import Head from "../components/header.vue"
export default {
    name: "Index",
    components:{ Head },
    setup() {
        return {};
    },
};
</script>

<style lang="less" scoped>
.index{
    width: 100%;
    height: 100vh;
    .header{
        width: 100%;
        height: 74px;
        .el-breadcrumb{
            height: calc(100% - 44px);
            border-bottom: 1px solid rgba(223, 223, 223, 1);
            box-sizing: border-box;
            .el-breadcrumb__item{
                font-size: 12px;
                font-weight: bold;
                color: #999999;
            }
        }
    }
    .main{
        width: 100%;
        height: calc(100% - 74px);
    }
}
</style>