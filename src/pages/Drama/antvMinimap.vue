<template>
    <div class="antv-minimap">

        <div id="container"></div>

        <div id="minimapContainer"></div>
    </div>
</template>

<script>
import { ref, reactive, toRefs, toRaw, onMounted, onUnmounted } from "vue";

import { Cell, Graph, Shape } from '@antv/x6';   // 引入antv/x6 依赖
export default {
    setup(){
        let graph;  // 定义的x6图表
        let container;   // 获得containerdom
        let minimapContainer;   // 获得containerdom
        
        function miniMap(){
            graph = new Graph({
                panning: true,
                mousewheel: true,

                container: container,
                background: {
                    color: 'rgba(245, 245, 245, 1)', // 设置画布背景颜色
                },
                grid: {
                    size: 10,      // 网格大小 10px
                    visible: true, // 渲染网格背景
                },
                // scroller: {
                //     enabled: true,
                // },
                minimap: {
                    enabled: true,
                    container: minimapContainer,
                    width: 200,
                    height: 160,
                    padding: 10,
                }
            })

            graph.addNode({
                x: 200,
                y: 100,
                width: 100,
                height: 40,
                label: 'Rect',
            })

            const source = graph.addNode({
                x: 32,
                y: 32,
                width: 100,
                height: 40,
                label: 'Hello',
            })

            const target = graph.addNode({
                shape: 'circle',
                x: 160,
                y: 180,
                width: 60,
                height: 60,
                label: 'World',
            })

            graph.addEdge({
                source,
                target,
            })

            graph.zoomTo(1.8)

        }

        onMounted(()=>{
            container = document.getElementById('container');
            minimapContainer = document.getElementById('minimapContainer');

            setTimeout(()=>{
                miniMap();
            },1000)
        })

        return{
            // 变量
            graph,

            // 函数

            miniMap,    // 构造缩略图
        }
    },
};
</script>

<style lang="less">
.antv-minimap{
    .x6-graph-scroller{
        // .x6-graph-scroller 大小由#container-padding决定，
        border: 10px solid red;
        box-sizing: border-box;
        .x6-graph-scroller-content{
            // 不知道为什么默认宽度是2790*2790
            // width: 100% !important;
            // height: 100% !important;

            // .x6-graph-scroller 大小由#container-padding决定，
            #container{}
            #minimapContainer{}

        }
        
    }
}
</style>
<style lang="less" scoped>
.antv-minimap {
    position: relative;
    width: 100%;
    height: 100%;
    // border: 10px solid orange;
    box-sizing: border-box;
    #container{
        // border: 10px solid red;
        box-sizing: border-box;
        // width: 800px;
        // height: 800px;
        width: 100%;
        height: 100%;
    }
    #minimapContainer{

        position: absolute;
        right: 20px;
        bottom: 20px;
        box-sizing: border-box;
    }
    
}
</style>