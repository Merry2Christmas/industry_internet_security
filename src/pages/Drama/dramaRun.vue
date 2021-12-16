<template>
    <!-- 剧本执行界面 -->
    <div class="drama-run">

        <!-- 左侧目录栏 -->
        <div class="drama-run-left">
            
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

        // console.log(8888,'dramaRun');
        let titleList = reactive([
            { name: '流程概览', id: 0},
            { name: '结果图谱', id: 1}
        ])
        let scriptName = ref('');
        // 剧本信息
        let script = reactive({
            name:'',        // 姓名
            scriptName: 0,  // 状态
        })
        let activeId = ref(0);

        let graph;  // 定义的x6图表
        const id = route.query.id;  // 该剧本的id
        let graphData = reactive({
            nodes:[],
            edges:[]
        });
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


        async function getDramaScenario(){
            let res = await dramaScenario.getScenarioInfo(id);
            console.log(res);
            scriptName.value = res.data.name;
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

            Graph.registerNode('custom-rect', {
                inherit: 'rect', // 继承自 Shape.Rect
                width: 258, // 默认宽度
                height: 180, // 默认高度
                markup:[
                    // react节点样式
                    {
                        tagName: 'rect',
                        selector: 'body',
                    },
                    // 图片样式
                    {
                        tagName: 'image',
                        selector: 'avatar',
                    },
                    // 标题样式
                    {
                        tagName: 'text',
                        selector: 'rank',
                    },
                    // 内容文本样式
                    {
                        tagName: 'text',
                        selector: 'name',
                    },
                ],
                attrs:{
                    body:{
                        fill: 'rgba(255, 255, 255, 1)', // 填充颜色
                        stroke: '#DCDCDC',              // border颜色
                        strokeWidth: 2,                 // border宽度
                        rx: 5,                          // 圆角矩形
                        ry: 5,                          // 圆角矩形
                    },
                    avatar: {
                        // width: 168,
                        // height: 168,
                        width: 168,
                        height: 168,
                        refX: 8,
                        refY: 6,
                    },
                    rank: {
                        refX: 0.7,  // 距离左侧百分之七十
                        refY: 0.15,  // 距离上方百分之十五
                        fontFamily: 'Courier New',
                        fontSize: 14,
                        fontWeight: '800',
                        // textAnchor: 'end',
                        // textDecoration: 'underline',
                        textAnchor: 'left', // 左对齐
                    },
                    name: {
                        refX: 0.9,
                        refY: 0.6,
                        fontFamily: 'Courier New',
                        fontSize: 14,
                        // fontWeight: '800',
                        textAnchor: 'end',
                    },
                }
            },true)
            
            Graph.registerNode('custom-rect-end', {
                inherit: 'rect', // 继承自 Shape.Rect
                width: 104, // 默认宽度
                height: 52, // 默认高度
                markup:[
                    // react节点样式
                    {
                        tagName: 'rect',
                        selector: 'body',
                    },
                    // 图片样式
                    {
                        tagName: 'image',
                        selector: 'avatar',
                    },
                    // 标题样式
                    {
                        tagName: 'text',
                        selector: 'rank',
                    },
                    // 内容文本样式
                    {
                        tagName: 'text',
                        selector: 'name',
                    },
                ],
                attrs:{
                    body:{
                        fill: 'rgba(255, 255, 255, 1)', // 填充颜色
                        stroke: '#DCDCDC',              // border颜色
                        strokeWidth: 2,                 // border宽度
                        rx: 5,                          // 圆角矩形
                        ry: 5,                          // 圆角矩形
                    },
                    avatar: {
                        width: 40,
                        height: 40,
                        refX: 8,
                        refY: 6,
                    },
                    rank: {
                        refX: 0.6,  // 距离左侧百分之六十
                        refY: 0.5,  // 距离上方百分之三十
                        fontFamily: 'Courier New',
                        fontSize: 14,
                        // textAnchor: 'end',
                        fontWeight: '800',
                        textAnchor: 'left', // 左对齐
                        // textDecoration: 'underline',
                    },
                    name: {
                        refX: 0.9,
                        refY: 0.6,
                        fontFamily: 'Courier New',
                        fontSize: 14,
                        fontWeight: '800',
                        textAnchor: 'end',
                    },
                }
            },true)
            
            // Graph.registerNode('custom-rect-start', {
            //     inherit: 'rect', // 继承自 Shape.Rect
            //     width: 104, // 默认宽度
            //     height: 52, // 默认高度
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


            res.data.flow.nodes.forEach(d => {
                if(d.nodeContentType != 'start' && d.nodeContentType != 'end'){
                    d.detail = d.stepNode.weaponObj.cmd || '--';
                    d.stepNode.weaponObj.params.forEach(x=>{
                        console.log(x);
                        d.detail += x.name;
                        d.detail += ' -- ' + x.val;
                    })
                }
                
            })
            //#region 
            res.data.flow.nodes.forEach(item => {
                
                let react;      // 定义节点
                // 判断该节点是否为起始点
                graphData.nodes.push({
                    id: item.nodeId, // String，可选，节点的唯一标识
                })
                if(item.nodeContentType == 'start' || item.nodeContentType == 'end'){
                    
                    graph.addNode({
                        id: item.nodeId, // String，可选，节点的唯一标识
                        x: item.nodeX,       // Number，必选，节点位置的 x 值
                        y: item.nodeY,
                        shape: 'custom-rect-end',
                        attrs:{
                            avatar: {
                                'xlink:href': image,   // 图片地址
                            },
                            rank: {
                                text: item.nodeContentType == 'start' ? '开始' : '结束', // String，节点标签
                                // fill: 'red',
                                wordSpacing: '500px',// 单词间距
                                fontSize: 16,       // 字号
                                letterSpacing: 0,   // 文字间距
                                
                            },
                            name: {
                                fill: 'green',
                                fontSize: 13,
                                fontFamily: 'Arial',
                                letterSpacing: 0,
                            },
                        }
                    })
                }else{
                    graph.addNode({
                        id: item.nodeId, // String，可选，节点的唯一标识
                        x: item.nodeX,       // Number，必选，节点位置的 x 值
                        y: item.nodeY,
                        shape: 'custom-rect',
                        attrs:{
                            avatar: {
                                'xlink:href': image2,   // 图片地址
                            },
                            rank: {
                                text: item.nodeContentType,
                                // fill: 'red',
                                wordSpacing: '500px',// 单词间距
                                fontSize: 16,       // 字号
                                letterSpacing: 0,   // 文字间距
                                
                            },
                            name: {
                                // text: '武器名称：'+item.nodeContentType,
                                text: item.detail,
                                fontFamily: 'Arial',
                                letterSpacing: 0,
                            },
                        }
                    })
                }
                

                //#region 
                // if(item.nodeContentType == 'start' || item.nodeContentType == 'end'){
                //     // 创建节点
                //     react = new Shape.Rect({
                //         id: item.nodeId, // String，可选，节点的唯一标识
                //         x: item.nodeX,       // Number，必选，节点位置的 x 值
                //         y: item.nodeY,       // Number，必选，节点位置的 y 值

                //         width: 104,   // Number，可选，节点大小的 width 值
                //         height: 52,  // Number，可选，节点大小的 height 值
                //         label: item.nodeContentType == 'start' ? '开始' : '结束', // String，节点标签
                //         // 节点样式
                //         attrs: {
                //             body: {
                //                 fill: 'rgba(255, 255, 255, 1)', // 填充颜色
                //                 stroke: '#DCDCDC',              // border颜色
                //                 strokeWidth: 2,                 // border宽度
                //                 rx: 5,                          // 圆角范围
                //                 ry: 5,                          // 圆角范围
                //             }
                //         }
                //     })
                // }else{
                //     // 创建节点
                //     react = new Shape.Rect({
                //         id: item.nodeId, // String，可选，节点的唯一标识
                //         x: item.nodeX,       // Number，必选，节点位置的 x 值
                //         y: item.nodeY,       // Number，必选，节点位置的 y 值

                //         width: 258,   // Number，可选，节点大小的 width 值
                //         height: 180,  // Number，可选，节点大小的 height 值
                //         label: item.nodeContentType, // String，节点标签
                //         attrs: {
                //             body: {
                //                 fill: 'rgba(255, 255, 255, 1)', // 填充颜色
                //                 stroke: '#DCDCDC',              // border颜色
                //                 strokeWidth: 2,                 // border宽度
                //                 rx: 5,                          // 圆角范围
                //                 ry: 5,                          // 圆角范围
                //             },
                //             label:{
                //                 fontSize: 16,    // 文字大小
                //             },
                //             // line: {
                //             //     fill: 'none',
                //             //     strokeLinejoin: 'round',
                //             //     strokeWidth: '2',
                //             //     stroke: '#4b4a67',
                //             //     sourceMarker: null,
                //             //     targetMarker: null,
                //             // },
                //         }
                //     })
                // }
                //#endregion
                // 添加节点到graph里面去

                graph.addNode({
                    id: item.nodeId, // String，可选，节点的唯一标识
                    x: item.nodeX,       // Number，必选，节点位置的 x 值
                    y: item.nodeY,
                    shape: 'custom-rect',
                    label: item.nodeContentType, // label 继承于基类的自定义选项
                })
                
            })
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
                // #endregion
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

        onUnmounted(()=>{
            graph.dispose();    //  画布的销毁以及资源的回收
        })


        return {
            scriptName,     // 该剧本名称
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
        };
    },
};
</script>

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