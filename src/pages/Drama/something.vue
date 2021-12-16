<template>
    <div class="drama-edit">
        <h1>剧本编排界面<button @click="down">下载</button></h1>

        <div id="container"></div>
    </div>
</template>

<script>
import { ref, reactive , toRefs, onMounted, onUnmounted } from "vue"

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
        // 创建节点
        const rect1 = new Shape.Rect({
            x: 280,
            y: 200,
            width: 120,
            height: 120,
            angle: 30,
            
            attrs: {
                body: {
                    fill: 'rgba(255,255,255,0.5)',
                },
                label: {
                    text: 'Hello',
                    fill: '',
                },
            },
        })
        const rect2 = new Shape.Rect({
            x: 520,
            y: 200,
            width: 120,
            height: 120,
            angle: 30,
            
            attrs: {
                body: {
                    fill: 'rgba(255,255,255,0.5)',
                    rx: 10,
                    ry: 10
                },
                label: {
                    text: 'Hello',
                    fill: '',
                },
            },
        })

        
        
        
        // 创建边
        const edge = new Shape.Edge({
            source: rect1,
            target: rect2,
        })

        

        let graph;  // 定义的x6图表
        const id = route.query.id;  // 该剧本的id
        let graphData = ref();

        async function getDramaScenario(){
            let res = await dramaScenario.getScenarioInfo(id);
            console.log(res);
            graphData.value = res.data.flow;
            console.log(graphData);

            // res.data.flow.filter()
            
        }

        function Init(){
            getDramaScenario();
        }

        Init();
        

        onMounted(()=>{

            graph = new Graph({
                panning: true,
                
                container: document.getElementById('container'),
                width: document.getElementById('container').style.width,
                height: document.getElementById('container').style.height,
                background: {
                    color: '#fffbe6', // 设置画布背景颜色
                },
                grid: {
                    size: 10,      // 网格大小 10px
                    visible: true, // 渲染网格背景
                },
            });
            graph.fromJSON(data);
            // 添加到画布
            graph.addNode(rect1)
            graph.addNode(rect2)
            // 添加到画布
            graph.addEdge(edge)

            graph.centerContent();  // 将画布内容中心与视口中心对齐
        })

        function down(){
        }
        
        onUnmounted(()=>{
            console.log(999);
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


                // 边
                // graphData.edges.push({
                //     source: item.srcNodeId, // String，必须，起始节点 id
                //     target: item.dstNodeId, // String，必须，目标节点 id
                // })


                graph.addEdge(edge)