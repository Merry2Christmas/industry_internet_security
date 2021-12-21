<template>
    <!-- 剧本执行界面 -->
    <div class="drama-run">

        <!-- 左侧目录栏 -->
        <div class="drama-run-left demo-collapse">

            <el-collapse v-model="activeNames" @change="handleChange" v-for="item in nodesList" :key="item.id">
                <el-collapse-item :title="item.name" :name="item.id">
                    <div v-for="items in item.child" :key="items.id"><img :src="`/src/assets/image/script-maage/${items.imageSrc}`">{{ items.name }}</div>
                </el-collapse-item>
            </el-collapse>
        </div>

        <!-- 右侧状态流程 -->
        <div class="drama-run-right">

            <!-- 内容主体 -->
            <div class="drama-run-container">

                <!-- 流程标题   流程概览以及结果图谱的界面切换 -->
                <div class="drama-run-title">
                    <div class="_title">
                        <h3>{{ name || 'JBNAME-20211109JUBEN' }}<span>{{ runStatus=='1'?'已发布':'待发布' }}</span></h3>

                        <div class="icon" v-if="activeId == '0'">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="发布"
                                placement="top"
                                :show-after="800">
                                <div class="release" @click="release"></div>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="保存"
                                placement="top"
                                :show-after="800">
                                <div class="save" @click="save"></div>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="保存模板"
                                placement="top"
                                :show-after="800">
                                <div class="save-template" @click="saveTemplate"></div>
                            </el-tooltip>
                        </div>

                        <div class="icon" v-else>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="重新编排"
                                placement="top"
                                :show-after="800">
                                <div class="refresh" @click="refresh"></div>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="保存模板"
                                placement="top"
                                :show-after="800">
                                <div class="save-template" @click="saveTemplate"></div>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="title">
                        <ul>
                            <li v-for="item in titleList" :key="item.id" :class="item.id==activeId?'active':''" @click="changeActive(item.id)">{{ item.name }}</li>
                        </ul>
                    </div>
                    

                </div>

                <!-- 流程概览主体 -->
                <div id="container"></div>

                <!-- 执行日志 -->
                <!-- <div class="drama-run-log">
                    <div class="log">
                        <div class="_title">
                            <h3>执行日志</h3>
                        </div>
                        <div class="content">
                            <el-row>
                                <el-col :span="item.width" v-for="(item,index) in logTitleList" :key="index">{{ item.name }}</el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="export">
                        <div class="_title">
                            <h3>节点输出</h3>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive , toRefs, toRaw, onMounted, onUnmounted } from "vue"

import { Graph, Shape } from '@antv/x6';   // 引入antv/x6 依赖
import { useRoute,useRouter } from 'vue-router'

import auth from "../../assets/js/auth.js"
import dramaScenario from "../../API/dramaScenario.js";

export default {
    name: "DramaRun",
    setup() {
        let route = useRoute(); //路由参数
        let router = useRouter();

        const id = route.query.id;  // 该剧本的id

        let activeNames  = ref(['0','1']);  // 默认展开选项
        // 点击展开时返回参数
        const handleChange = (val) => {
            // console.log(val)
        }
        
        // 左侧目录栏展示的信息
        let nodesList = reactive([
            {
                name:'执行节点', id:'0' ,
                child:[ 
                    { name:'扫描攻击',id:'0-1',imageSrc:'scanning.png' },
                    { name:'攻击突破',id:'0-2',imageSrc:'attack.png' },
                    { name:'远程控制',id:'0-3',imageSrc:'remote.png' },
                    { name:'窃取利用',id:'0-4',imageSrc:'steal.png' }, ]
            },
            {
                name:'逻辑节点', id:'1' ,
                child:[ 
                    { name:'连线',id:'1-1',imageSrc:'link.png' },
                    { name:'起点',id:'1-2',imageSrc:'start.png' },
                    { name:'终点',id:'1-3',imageSrc:'end.png' } ]
            },
        ])

        // 用于在主体界面展示标题栏信息
        let titleList = reactive([
            { name: '流程概览', id: 0},
            { name: '结果图谱', id: 1}
        ])

        // 用于在主体界面展示标题栏激活项id
        let activeId = ref(0);

        // 剧本信息，用于在主体界面展示
        let script = reactive({
            name:'',        // 姓名
            runStatus: 0,  // 状态
        })
        
        let graph;  // 定义的x6图表

        // 展示在主体的图表数据定义
        let graphData = reactive({
            nodes:[],
            edges:[]
        });
        
        // 图片地址
        const image = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fci.xiaohongshu.com%2F2c4c8059-3011-118f-8d30-96fc6ce10212%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fci.xiaohongshu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642229954&t=762327cebb75b43800ead24e05e2b2b3';
        const image2 = 'https://img0.baidu.com/it/u=588804034,2803303514&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'

        // 执行日志的标题
        const logTitleList = reactive([
            { name: '执行步骤', width: 5},
            { name: '执行脚本', width: 3},
            { name: '执行结果', width: 3},
            { name: '执行时长', width: 3},
            { name: '开始执行时间', width: 5},
            { name: '结束执行时间', width: 5}
        ])
        
        //--------------------------------函数方法----------------------------------------------


        async function getDramaScenario(){
            let res = await dramaScenario.getScenarioInfo(id);
            script.name = res.data.name;
            script.runStatus = res.data.runStatus;
            
            // 定义graph
            graph = new Graph({
                panning: true,
                mousewheel: true,

                container: document.getElementById('container'),
                width: document.getElementById('container').style.width,
                height: document.getElementById('container').style.height,
                background: {
                    color: 'rgba(245, 245, 245, 1)', // 设置画布背景颜色
                },
                grid: {
                    size: 10,      // 网格大小 10px
                    visible: true, // 渲染网格背景
                },
            });
            // 自定义react节点样式
            // https://antv-x6.gitee.io/zh/docs/tutorial/intermediate/custom-node/#%E4%BE%BF%E6%8D%B7%E6%96%B9%E6%B3%95%E4%BA%8C

            
            // Graph.registerNode('custom-rect', {
            //     inherit: 'rect', // 继承自 Shape.Rect
            //     width: 258, // 默认宽度
            //     height: 180, // 默认高度
            //     attrs: {
            //         body: {
            //             fill: 'rgba(255, 255, 255, 1)', // 填充颜色
            //             stroke: '#DCDCDC',              // border颜色
            //             strokeWidth: 2,                 // border宽度
            //             rx: 5,                          // 圆角矩形
            //             ry: 5,                          // 圆角矩形
            //         },
            //         label: {
            //             fontSize: 16,
            //             refX: 10, // x 轴偏移，类似 css 中的 margin-left
            //             textAnchor: 'left', // 左对齐
            //         }
            //     },
            // })


            // 使用html来渲染节点
            // https://x6.antv.vision/zh/docs/tutorial/advanced/react#%E6%B8%B2%E6%9F%93-html-%E8%8A%82%E7%82%B9


            // 添加一个detail属性，将要在节点展示的内容信息集合到detail属性上
            res.data.flow.nodes.forEach(d => {
                if(d.nodeContentType != 'start' && d.nodeContentType != 'end'){
                    d.detail = d.stepNode.weaponObj.cmd || '--';
                    d.stepNode.weaponObj.params.forEach(x=>{
                        d.detail += x.name;
                        d.detail += ' -- ' + x.val;
                    })
                }
            })


            //#region

            // 遍历数组，将对应节点添加到界面
            res.data.flow.nodes.forEach(item => {
                
                let react;      // 定义节点

                // 判断该节点是起始节点还是流程节点，两种节点添加的html节点样式不同
                if(item.nodeContentType == 'start' || item.nodeContentType == 'end'){
                    graph.addNode({
                        id: item.nodeId,
                        x: item.nodeX,
                        y: item.nodeY,
                        width: 104,
                        height: 52,
                        shape:'html',   // 节点为自己创建的html元素
                        html(){
                            const wrap = document.createElement('div');
                            wrap.className = 'node-wrap-start';
                            wrap.style.width = '100%'
                            wrap.style.height = '100%'
                            wrap.style.background = 'rgba(255, 255, 255, 1)'
                            wrap.style.display = 'flex'
                            wrap.style.justifyContent = 'center'
                            wrap.style.alignItems = 'center'
                            wrap.style.borderRadius = '5px'
                            wrap.style.boxShadow = '0px 1px 4px 0px rgba(0, 59, 129, 0.15)'
                            wrap.innerText = item.nodeContentType == 'start'?'开始':'结束'

                            const wrapImg = document.createElement('div');
                            wrapImg.className = 'node-wrap-img'
                            wrap.appendChild(wrapImg)
                            
                            return wrap
                        }
                    })
                }
                else{
                    graph.addNode({
                        id: item.nodeId,
                        x: item.nodeX,
                        y: item.nodeY,
                        width: 258,
                        height: 180,
                        shape:'html',   // 节点为自己创建的html元素
                        html(){
                            const wrap = document.createElement('div');
                            wrap.className = 'node-wrap';
                            wrap.style.width = '100%'
                            wrap.style.height = '100%'
                            wrap.style.background = 'rgba(255, 255, 255, 1)'
                            wrap.style.display = 'flex'
                            wrap.style.justifyContent = 'center'
                            wrap.style.alignItems = 'center'
                            wrap.style.borderRadius = '5px'
                            wrap.style.boxShadow = '0px 1px 4px 0px rgba(0, 59, 129, 0.15)'
                            // wrap.innerText = item.nodeContentType

                            // 在wrap里面添加头部标题
                            const wrapHead = document.createElement('div');
                            wrapHead.className = 'node-wrap-head'
                            // 添加标题文本
                            var textnode=document.createTextNode(item.nodeContentType);
                            wrapHead.appendChild(textnode);
                            wrap.appendChild(wrapHead)

                            // 在头部标题添加图片
                            const wrapImgSmall = document.createElement('div');
                            wrapImgSmall.className = 'node-wrap-img-small'
                            wrapHead.appendChild(wrapImgSmall)

                            // 在wrap里面添加内容主体
                            const wrapContent = document.createElement('div');
                            wrapContent.className = 'node-wrap-content'
                            wrap.appendChild(wrapContent)

                            // 在内容主体中添加名称文本
                            const wrapContentName = document.createElement('div');
                            wrapContentName.className = 'node-wrap-content-name'
                            wrapContent.appendChild(wrapContentName)
                            const hNmae = document.createElement('h3')
                            hNmae.className = 'node-name';
                            hNmae.innerText = '武器名称:';
                            wrapContentName.appendChild(hNmae)

                            const hDes = document.createElement('p')
                            hDes.className = 'node-desc';
                            hDes.innerText = item.nodeContentType;
                            wrapContentName.appendChild(hDes)


                            // 在内容主体中添加名称文本
                            const wrapContentText = document.createElement('div');
                            wrapContentText.className = 'node-wrap-content-text'
                            wrapContent.appendChild(wrapContentText)
                            const hOrder = document.createElement('h3')
                            hOrder.className = 'node-oder';
                            hOrder.innerText = '执行命令:';
                            wrapContentText.appendChild(hOrder)

                            const hDep = document.createElement('p')
                            hDep.className = 'node-dep';
                            hDep.innerText = item.detail;
                            wrapContentText.appendChild(hDep)

                            return wrap
                        }
                    })
                }
            })
            //#endregion

            //#region 
            // 遍历数组，将对应连线添加到界面
            res.data.flow.links.forEach(item => {
                // 定义并创建连线
                // #region 
                let edge = new Shape.Edge({
                    source: item.srcNodeId,     // 源节点
                    target: item.dstNodeId,     // 目标节点
                    zIndex: 1,                  // 所在层级
                    // 线条所在样式参数
                    attrs: {
                        line: {
                            stroke: 'orange',   // 颜色
                            strokeDasharray: 5,    // 虚线的样式参数
                            targetMarker: 'classic',
                        },
                    },
                    // 路由 router 将对 vertices 进一步处理，并在必要时添加额外的点，然后返回处理后的点。例如，经过 orth 路由处理后，边的每一条链接线段都是水平或垂直的。
                    router: {
                        name: 'orth',
                        args: {
                            padding: {
                                left: 50,
                            }
                        }
                    },
                })
                // 添加线条到graph里面
                graph.addEdge(edge)
            })
            //#endregion
            
            graph.zoom(0.1)
            graph.centerContent();  // 将画布内容中心与视口中心对齐
        }

        function Init(){
            getDramaScenario();
        }

        Init();

        // 发布
        function release(){}
        // 保存
        function save(){}
        // 重新编排
        function refresh(){}
        // 保存模板
        function saveTemplate(){}
        // 切换active
        function changeActive(id){
            activeId.value = id;
        }
        
        onUnmounted(()=>{
            graph.dispose();    //  画布的销毁以及资源的回收
        })


        return {
            titleList,
            activeId,
            logTitleList,   // 执行日志的标题
            ...toRefs(script),
            //------
            graph,
            id,
            graphData,
            //-----------------

            // 函数方法

            release,        // 发布
            save,           // 保存
            refresh,        // 重新编排
            saveTemplate,   // 保存模板
            changeActive,   // 切换active


            activeNames,
            nodesList,
            handleChange,
        };
    },
};
</script>

<style lang="less">
.node-wrap-start{
    text-indent: 32px;
    position: relative;
    display: inline-block;
}
.node-wrap{
    position: relative;
    display: inline-block;
}
.node-wrap-img{
    position: absolute;
    left: 16px;
    display: inline-block;
    width: 30px;
    height: 16px;
    background-image: url("/src/assets/image/script-maage/start-node.png");
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
}
.node-wrap-head{
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 258px;
    height: 39px;
    border-bottom: 1px solid #EEEEEE;
    line-height: 40px;
    text-align: left;
    text-indent: 40px;
    .node-wrap-img-small{
        position: absolute;
        left: 5px;
        top: 5px;
        display: inline-block;
        width: 30px;
        height: 30px;
        // background-image: url("/src/assets/image/script-maage/scanning.png");
        background-image: url('https://img2.baidu.com/it/u=2978608128,97714912&fm=26&fmt=auto');
        background-size: contain;
        background-repeat: no-repeat;
        vertical-align: middle;
    }
}
.node-wrap-content{
    position: absolute;
    top: 40px;
    left: 0;
    display: inline-block;
    width: 258px;
    height: 140px;
    .node-wrap-content-name{
        width: 258px;
        height: 50px;
        padding: 5px 10px;
        box-sizing: border-box;
        .node-name{
            font-size: 14px;
            font-weight: 400;
            color: #1A1A1A;
            line-height: 21px;
            text-align: left;
        }
        .node-desc{
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 21px;
            text-align: left;
            margin: 0;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .node-wrap-content-text{
        width: 258px;
        height: 80px;
        padding: 5px 10px;
        box-sizing: border-box;
        .node-oder{
            font-size: 14px;
            font-weight: 400;
            color: #1A1A1A;
            line-height: 21px;
            text-align: left;
        }
        .node-dep{
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 21px;
            text-align: left;
            margin: 0;

            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;

        }
    }
}

</style>

<style lang="less" scoped>
.drama-run{
    width: 100%;
    height: 100%;
    background-color: rgba(245, 245, 245, 1);
    display: flex;
    .drama-run-left{
        width: 160px;
        height: 100%;
        background: #FFFFFF;
        box-shadow: 3px 0px 6px 0px rgba(28, 33, 41, 0.1);
        z-index: 99;
    }
    .demo-collapse{
        .el-collapse{
            /deep/.el-collapse-item__header{
                padding-left: 20px;
                box-sizing: border-box;

                width: 100%;
                height: 36px;
                background: #F3F5F7;
            }
            /deep/.el-collapse-item__content{
                // background-color: orange;
                padding: 10px;
                box-sizing: border-box;
                >div{
                    width: 100%;
                    height: 36px;
                    line-height: 36px;
                    background: rgba(255, 255, 255, 0.99);
                    border-radius: 3px;
                    border: 1px solid #DFDFDF;
                    margin-bottom: 10px;
                    cursor: pointer;
                    text-align: left;
                    padding-left: 10px;
                    box-sizing: border-box;
                    vertical-align: middle;
                    img{
                        width: 22px;
                        height: 22px;
                        margin-right: 10px;
                        margin-bottom: 4px;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
    .drama-run-right{
        flex: 1;
        .drama-run-container{
            position: relative;
            width: 100%;
            height: 100%;
            padding: 20px 20px 0;
            box-sizing: border-box;
            .drama-run-title{
                position: relative;
                width: 100%;
                height: 50px;
                background: #FFFFFF;
                box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
                border-radius: 3px;
                z-index: 99;

                ._title{
                    span{
                        font-size: 12px;
                        padding: 3px 9px;
                        border-radius: 11px;
                        border: 1px solid #979797;
                    }
                    .icon{
                        >div{
                            width: 22px;
                            height: 22px;
                            cursor: pointer;
                        }
                        .release{
                            background-image: url(../../assets/image/script-maage/release.png);
                        }
                        .save{
                            background-image: url(../../assets/image/script-maage/save.png);
                        }
                        .refresh{
                            background-image: url(../../assets/image/script-maage/rest-status.png);
                            background-size: cover;
                        }
                        .save-template{
                            background-image: url(../../assets/image/script-maage/save-model.png);
                        }
                    }
                }
                .title{
                    position: absolute;
                    top: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 212px;
                    height: 26px;
                    border-radius: 3px;
                    border: 1px solid #0082FF;
                    ul{
                        display: flex;
                        li{
                            flex: 1;
                            line-height: 26px;
                            color: rgba(0, 130, 255, 1);
                            cursor: pointer;
                        }
                        li.active{
                            color: white;
                            background: #0082FF;
                        }
                    }
                }
            }
            #container{
                width: 100%;
                height: calc(100% - 50px);
                // height: calc(100% - 50px - 308px);
                
            }
            .drama-run-log{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 308px;
                background: #FFFFFF;
                box-shadow: 0px 1px 4px 0px rgba(0, 59, 129, 0.15);
                border-radius: 3px;
                display: flex;
                .log{
                    flex: 10;
                    border-right: 1px solid rgba(162, 189, 220, 0.25);
                    ._title{
                        border-bottom: 1px solid rgba(162, 189, 220, 0.25);
                    }
                    .content{
                        .el-row{
                            width: 100%;
                            height: 35px;
                            background-color: rgba(0, 130, 255, 0.04);
                            .el-col{
                                font-size: 14px;
                                font-weight: bold;
                                color: #1A1A1A;
                                line-height: 35px;

                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                }
                .export{
                    flex: 7;
                    ._title{
                        border-bottom: 1px solid rgba(162, 189, 220, 0.25);
                    }
                }
            }
        }
    }
}
</style>