<template>
    
    <!-- 剧本管理 -->
    <div class="drama">
        <div class="drama-left">
            <ul class="drama-type">
                <li v-for="(item,index) in dramaList" :key="index" class="standard-box">
                    <div class="dramaImg"></div>
                    <div class="dramaData">
                        <p>{{ item.name }}</p>
                        <h3>{{ item.total }}</h3>
                    </div>
                </li>
            </ul>
            <div class="drama-list standard-box">
                <div class="_title">
                    <h3>剧本列表<span>共233条</span></h3>
                </div>
                <div class="_filter">这里是请求参数</div>
                <div class="_list">
                    <el-row class="list-title">
                        <el-col v-for="(item,index) in titleList" :key="index" :span="item.width">{{ item.name || '--' }}</el-col>
                    </el-row>
                </div>
            </div>
        </div>


        <div class="drama-right standard-box">
            <div class="_title">
                <h3>剧本模板<span>共23条</span></h3>
            </div>
        </div>

    </div>

</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import test from "../API/test.js"
export default {
    name: "Drama",
    setup() {
        let dramaList = reactive([
            {name:'剧本总数',total:12345},{name:'待发布',total:123456},{name:'已发布',total:12345}
        ]);

        // 列表头数据
        const titleList = reactive([
            { name:"序号", width: 3 },
            { name:"序号", width: 3 },
            { name:"剧本时间", width: 3 },
            { name:"创建时间", width: 3 },
            { name:"最近发布时间", width: 3 },
            { name:"发布次数", width: 3 },
            { name:"当前状态", width: 3 },
            { name:"操作", width: 3 },
        ])
        // 列表内容数据
        const contentList = reactive([]);

        // 列表参数信息
        let dramaInfo = reactive({
            pageIndex: 1,
            pageSize: 10,
            param: '',
            total: '',
        });

        // 页面请求参数
        // dramaInfo.param = '?pageIndex=' + dramaInfo.pageIndex + "&pageSize=" + dramaInfo.pageSize;
        // dramaApi.getDramaInfo(dramaInfo.param)

        // dom加载完成时调用的数据
        onMounted(async ()=>{
            var vv = await test.hhh();
            console.log(5555,vv);
            
        })

        return {
            dramaList,
            titleList,
            dramaInfo
        };
    },
};
</script>

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
                flex: 1;
                margin-right: 20px;
                box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
                display: flex;
                .dramaImg{
                    margin: 10px;
                    width: 84px;
                    height: 72px;
                    background: url("../assets/image/script-maage/juben.png");
                }
                .dramaData{
                    flex: 1;
                    p{
                        font-size: 14px;
                        font-weight: 400;
                        color: #1A1A1A;
                        line-height: 21px;
                    }
                    h3{
                        font-size: 30px;
                        font-weight: bold;
                        color: #0082FF;
                        line-height: 20px;
                    }
                }
            }
            li:last-of-type{
                margin: 0;
            }
        }
        .drama-list{
            margin-top: 20px;
            width: 100%;
            height: 100px;
            height: calc(100% - 113px);
            ._title{
                height: 50px;
            }
            ._filter{
                height: 64px;
            }
            ._list{
                height: calc(100% - 114px);
                .list-title{
                    width: 100%;
                    height: 46px;
                    background-color: rgba(0, 130, 255, 0.04);
                    .el-col{
                        height: 46px;
                        font-size: 14px;
                        line-height: 46px;
                        font-weight: bold;
                        color: #1A1A1A;
                    }
                }
            }
        }
    }
    .drama-right{
        flex: 2;
        background: white;
    }
}
</style>