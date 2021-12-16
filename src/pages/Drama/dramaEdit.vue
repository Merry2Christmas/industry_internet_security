<template>
    <div class="drama-edit">
        <h1>剧本编排界面<button @click="down">下载</button></h1>
        <!-- <p>{{ graphData }}</p> -->

        <div id="container"></div>
    </div>
</template>

<script>
import { ref, reactive , toRefs, toRaw, onMounted, onUnmounted } from "vue"

import { Graph, Shape } from '@antv/x6';   // 引入antv/x6 依赖
import { useRoute,useRouter } from 'vue-router'

import dramaScenario from "../../API/dramaScenario.js";
export default {
    name: "DramaEdit",
    setup() {
        let route = useRoute(); //路由参数
        let router = useRouter();

        // console.log(route);
        // console.log(router);
        
        const data = reactive(
            {
                // 节点
                nodes: [
                    {
                        id: 'node1', // String，可选，节点的唯一标识
                        x: 40,       // Number，必选，节点位置的 x 值
                        y: 40,       // Number，必选，节点位置的 y 值
                        width: 80,   // Number，可选，节点大小的 width 值
                        height: 40,  // Number，可选，节点大小的 height 值
                        label: 'hello', // String，节点标签
                    },
                    {
                        id: 'node2', // String，节点的唯一标识
                        x: 160,      // Number，必选，节点位置的 x 值
                        y: 180,      // Number，必选，节点位置的 y 值
                        width: 80,   // Number，可选，节点大小的 width 值
                        height: 40,  // Number，可选，节点大小的 height 值
                        label: 'world', // String，节点标签
                    },
                ],
                // 边
                edges: [
                    {
                        source: 'node1', // String，必须，起始节点 id
                        target: 'node2', // String，必须，目标节点 id
                    },
                ],
            }
        )
        
        

        let graph;  // 定义的x6图表
        const id = route.query.id;  // 该剧本的id
        let graphData = reactive({
            nodes:[],
            edges:[]
        });
        

        async function getDramaScenario(){
            let res = await dramaScenario.getScenarioInfo(id);

            graph = new Graph({
                panning: true,
                mousewheel: true,
                // panning: {
                //     enabled: true,
                //     eventTypes: ['mouseWheel']
                // },

                container: document.getElementById('container'),
                width: document.getElementById('container').style.width,
                height: document.getElementById('container').style.height,
                // markup: [
                //     {
                //         tagName: 'rect',
                //         selector: 'body',
                //         attrs: {
                //             fill: '#fff',
                //             stroke: '#000',
                //             strokeWidth: 2,
                //         }
                //     }, 
                // ],
                background: {
                    color: 'rgba(245, 245, 245, 1)', // 设置画布背景颜色
                },
                grid: {
                    size: 10,      // 网格大小 10px
                    visible: true, // 渲染网格背景
                },
            });

            res.data.flow.nodes.forEach(item => {
                // 节点
                // graphData.nodes.push({
                //     // shape: 'rect', // 使用 rect 渲染
                //     id: item.nodeId, // String，可选，节点的唯一标识
                //     x: item.nodeX,       // Number，必选，节点位置的 x 值
                //     y: item.nodeY,       // Number，必选，节点位置的 y 值

                //     width: 200,   // Number，可选，节点大小的 width 值
                //     height: 180,  // Number，可选，节点大小的 height 值
                //     label: item.nodeContentType == 'start' ? '开始' : item.nodeContentType == 'end' ? '结束' : item.nodeContentType, // String，节点标签
                // })
                let react;      // 定义节点
                // 判断该节点是否为起始点
                if(item.nodeContentType == 'start' || item.nodeContentType == 'end'){
                    // 创建节点
                    react = new Shape.Rect({
                        id: item.nodeId, // String，可选，节点的唯一标识
                        x: item.nodeX,       // Number，必选，节点位置的 x 值
                        y: item.nodeY,       // Number，必选，节点位置的 y 值

                        width: 104,   // Number，可选，节点大小的 width 值
                        height: 52,  // Number，可选，节点大小的 height 值
                        label: item.nodeContentType == 'start' ? '开始' : '结束', // String，节点标签
                        // 节点样式
                        attrs: {
                            body: {
                                fill: 'rgba(255, 255, 255, 1)', // 填充颜色
                                stroke: '#DCDCDC',              // border颜色
                                strokeWidth: 2,                 // border宽度
                                rx: 5,                          // 圆角范围
                                ry: 5,                          // 圆角范围
                            }
                        }
                    })
                }else{
                    // 创建节点
                    react = new Shape.Rect({
                        id: item.nodeId, // String，可选，节点的唯一标识
                        x: item.nodeX,       // Number，必选，节点位置的 x 值
                        y: item.nodeY,       // Number，必选，节点位置的 y 值

                        width: 258,   // Number，可选，节点大小的 width 值
                        height: 180,  // Number，可选，节点大小的 height 值
                        label: item.nodeContentType, // String，节点标签
                        attrs: {
                            body: {
                                fill: 'rgba(255, 255, 255, 1)', // 填充颜色
                                stroke: '#DCDCDC',              // border颜色
                                strokeWidth: 2,                 // border宽度
                                rx: 5,                          // 圆角范围
                                ry: 5,                          // 圆角范围
                            }
                        }
                    })
                }
                // 添加节点到graph里面去
                graph.addNode(react)
            })
            res.data.flow.links.forEach(item => {
                // 边
                // graphData.edges.push({
                //     source: item.srcNodeId, // String，必须，起始节点 id
                //     target: item.dstNodeId, // String，必须，目标节点 id
                // })
                // 定义并创建连线
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
                    // router: {
                    //     name: 'manhattan',
                    //     args: { 
                    //         startDirections: ['top'],
                    //         endDirections: ['bottom'],
                    //     },
                    // },
                    // router: {
                    //     name: 'oneSide',
                    //     args: { side: 'left' },
                    // },
                })
                // 添加线条到graph里面
                graph.addEdge(edge)
            })

            graph.centerContent();  // 将画布内容中心与视口中心对齐
        }

        function Init(){
            getDramaScenario();
        }

        Init();
        

        onMounted(()=>{

            // graph = new Graph({
            //     panning: true,
            //     container: document.getElementById('container'),
            //     width: document.getElementById('container').style.width,
            //     height: document.getElementById('container').style.height,
            //     background: {
            //         color: '#fffbe6', // 设置画布背景颜色
            //     },
            //     grid: {
            //         size: 10,      // 网格大小 10px
            //         visible: true, // 渲染网格背景
            //     },
            // });
            // // graph.fromJSON(data);

            // // graph.fromJSON(data);
            // console.log(graphData);
            // graph.fromJSON(graphData);
            

            // graph.centerContent();  // 将画布内容中心与视口中心对齐
        })

        function down(){
        }
        
        onUnmounted(()=>{
            graph.dispose();    //  画布的销毁以及资源的回收
        })


        return {
            data,
            graphData,
            // 方法
            graph,
            down
        };
    },
};
</script>

<style lang="less" scoped>
.drama-edit{
    width: 100%;
    height: 100%;
    background: orange;
    h1{
        height: 50px;
        line-height: 50px;
    }
    #container{
        width: 100%;
        height: calc(100% - 50px);
    }
}
</style>