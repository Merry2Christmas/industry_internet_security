<template>
    <div id="topo">

        <!-- defs通用标签 -->
        <svg width="500" class="svg-model" height="500" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
            
                <!-- <pattern id="avatar" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="http://userimg.yingyonghui.com/head/24/1458708838143/5426424.png-thumb"/>
                </pattern> -->
            
                <pattern id="avatarCA" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/CA.png"/>
                </pattern>

                <pattern id="avatarBA" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/BA.png"/>
                </pattern>

                <pattern id="avatarAE" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/AE.png"/>
                </pattern>

                <pattern id="avatarVulnerability" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/Vulnerability.png"/>
                </pattern>

                <pattern id="avatarWeakness" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/Weakness.png"/>
                </pattern>

                <pattern id="avatarHardware" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/Hardware.png"/>
                </pattern>

                <pattern id="avatarSoftware" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/Software.png"/>
                </pattern>

                <pattern id="avatarOS" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <image width="1" height="1" xlink:href="/src/assets/image/knowledge/OS.png"/>
                </pattern>
            
                <!-- <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="6"
                    refY="6" orient="auto">
                    <path d="M2,2 L10,6 L2,10 L2,2" style="fill: rgba(153, 153, 153, 1);" />
                </marker> -->

                <marker id="arrow" markerUnits="strokeWidth" markerWidth="48" markerHeight="48" viewBox="0 0 48 48" refX="27"
                    refY="6" orient="auto">
                    <path d="M2,2 L10,6 L2,10 L2,2" style="fill: rgba(153, 153, 153, 1);" />
                </marker>
            </defs>
        </svg>


        <!-- left: 500px;
            top: 200px; -->
        <div class="cccc" v-show="showDetail" style="
            position: absolute;
            width: 400px;
            background: #FFFFFF;
            box-shadow: 0px 8px 15px 0px rgba(34,34,34,0.4);
            border-radius: 6px;">
            <div>
                <h5>攻击步骤</h5>
                <el-row v-for="(item,index) in detailData.attack_step" :key="index">
                    <el-col :span="4">{{ index+1 }}</el-col>
                    <el-col :span="12">{{ item.ba_name || '--' }}</el-col>
                    <el-col :span="8">{{ item.ba_id || '--' }}</el-col>
                </el-row>
            </div>

            <div>
                <h5>空间关系</h5>
                <p class="normal" v-for="(item,index) in detailData.spatial_relationship" :key="index">{{ item || '--' }}</p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { reactive, ref, markRaw, onMounted } from "vue";
import * as d3 from "d3"
// import func from '@/assets/topo.js'


// 获得复杂攻击节点信息
// import { DetailCa } from "@/api/knowledgeGraphApi.js";

const activeType = ref('ba')
let topoDom;    // #topo的dom
let topoChart;  // 知识图谱
let width;      // 知识图谱宽度
let height;     // 知识图谱高度
let svg;        // svg标签

// 图标半径大小
let radius = 35;
// 图片半径大小
let imgRadius = 16;

// topo数据
let data;

// 是否展开详情弹窗
let showDetail = ref(false);
// 详情数据
let detailData = reactive({});

// 详情弹窗坐标
let detailX;
let detailY;

// 不同类型标签的背景颜色
let nodeColor = {
    // 威胁类
    'BA': 'rgba(255, 87, 87, 1)',
    'CA': 'rgba(255, 87, 87, 1)',
    'AE': 'rgba(255, 87, 87, 1)',
    // 脆弱类
    'Vulnerability': 'rgba(255, 196, 48, 1)',
    'Weakness': 'rgba(255, 196, 48, 1)',
    // 资产类
    'OS': 'rgba(58, 170, 237, 1)',
    'Software': 'rgba(58, 170, 237, 1)',
    'Hardware': 'rgba(58, 170, 237, 1)',
}


// 获得topo数据
const getMsg = (value,type) => {
    value.links.forEach((d,i)=>{
        d.source = d.src;
        d.target = d.dst;
    })
    data = value;

    activeType.value = type;

    if(svg){
        // 移除
        svg.remove();
    }
    

    setTimeout(()=>{
        topoDom = document.getElementById('topo');
        width = topoDom.clientWidth;
        height = topoDom.clientHeight;

        // 生成svg
        createBox(value);
    },0)
}

// 生成svgbox
const createBox = (value) => {

    svg = d3.select('#topo')
        .append('svg')
        .attr('width',width)
        .attr('height',height)
        // .attr('class','ddddd')
        .attr("class", "container")

    initGraph(value);
}

// 创建图谱
const initGraph = (data) => {

    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link",d3.forceLink()
            .id(function(d) {
                return d.id;
            })
            .distance(200)
        );

    // 创建连线标签
    // var link = svg.append('g').attr('class','link')
    //     .attr("stroke", 'rgba(153, 153, 153, 0.4)')
    //     .attr("stroke-width", '2')
    //     .selectAll("line")
    //     .data(data.links)
    //     .enter()
    //     .append("line")
    //     .attr("marker-end", "url(#arrow)" );//根据箭头标记的id号标记箭头

    var link = svg.append('g').attr('class','link5555')
        .attr("stroke", 'rgba(153, 153, 153, 0.4)')
        .attr("stroke-width", '2')
        .selectAll("path")
        .data(data.links)
        .enter()
        .append("path")
        .attr('id',function(d,i){ return 'edgepath'+i })
        .attr("marker-end", "url(#arrow)" );//根据箭头标记的id号标记箭头


    // 创建节点标签
    var nodeCircle = svg
            .append("g")
            .attr("class", "nodesCircle")
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("fill", function(d) { return nodeColor[d.type] || 'rgba(255, 87, 87, 1)' })
            .attr("id", (d) => d.id)
            .on('click', d=>{
                console.log(d);
                getDetailData(d)
            })

            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );


    // 节点图案
    var nodeImg = svg
            .append("g")
            .attr("class", "nodesImage")
            .selectAll("rect")
            .data(data.nodes)
            .enter()
            .append("rect")
            .attr('width', imgRadius*2)
            .attr('height',imgRadius*2)
            .attr("fill", d=>`url(#avatar${d.type})`)
            .on('click', d=>{
                console.log(d);
                getDetailData(d)
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

    // 创建连线文字标签
    // var lintText = svg
    //         .append("g")
    //         .attr("class", "linetexts")
    //         .selectAll("text")
    //         .data(data.links)
    //         .enter()
    //         .append("text")
    //         .attr("font-size", "12px")
    //         .attr("fill", 'rgba(153, 153, 153, 0.4)')
    //         .text((d) => {
    //             return d.tag;
    //         });


    // 创建连线文字标签
    var lintText = svg
            .append("g")
            .attr("class", "linetexts")
            .selectAll("text")
            .data(data.links)
            .enter()
            .append("text")

    lintText.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
        .style("pointer-events", "none")
        .style("font-size", 12)
        .attr("fill", 'rgba(153,153,153,0.4)')

        // text居中对齐
        .attr("text-anchor", "middle")
        // 调整其实位置，startOffset为百分数时，起始位置 = startOffset * 总长度。startOffset为具体数字时，起始位置 = startOffset + 的起始位置。
        //利用startOffset和text-anchor，可以实现文字居中摆放。
        .attr('startOffset','50%')

        // .attr('fill','red')
        .text(function(d,i){
            return d.tag;
        })

    // 创建节点文字标签
    var text = svg
            .append("g")
            .attr("class", "nodetexts")
            .selectAll("text")
            .data(data.nodes)
            .enter()
            .append("text")
            .attr("font-size", "12px")
            .style("fill", "#1A1A1A")
            //   .attr("fill", function (d) {
            //     return color(d.group);
            //   })
            .attr("name", function(d) {
                return d.id;
            })
            .text(function(d) {
                return d.id;
            })
            // .attr('user-select','none')
            .attr("text-anchor", "middle");

    
    simulation.nodes(data.nodes).on("tick", ticked()); //tick监听绑定动作，来绘制图形
    simulation.force("link").links(data.links);

    var nodeWidth = null;
    var nodeHeight = null;
    // var nodeImg = null;

    function ticked() {
        return () => {
            // 每次tick计时到时，连接线的响应动作
            // 设置连接线两端的节点的位置
            // link
            //     .attr("x1", function(d) {
            //         return d.source.x;
            //     })
            //     .attr("y1", function(d) {
            //         return d.source.y;
            //     })
            //     .attr("x2", function(d) {
            //         return d.target.x;
            //     })
            //     .attr("y2", function(d) {
            //         return d.target.y;
            //     });
            link.attr("d", d => {
                return 'M '+d.source.x+' '+d.source.y+' L '+ (d.target.x) +' '+ (d.target.y);
            })
            // 每次tick计时到时，节点的响应动作
            // 设置节点的圆心坐标
            nodeCircle
                .attr("cx", function(d) {
                    if (!nodeWidth) {
                        nodeWidth = document
                            .getElementById(d.id)
                            .getBoundingClientRect().width;
                    }

                    if (!nodeHeight) {
                        nodeHeight = document
                            .getElementById(d.id)
                            .getBoundingClientRect().height;
                    }
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });


            
            // nodeImg.attr("xlink:href", null);
            // nodePath.attr("d", null);
            nodeImg
                .attr("x", function(d) { return d.x - imgRadius; })
                .attr("y", function(d) { return d.y - imgRadius; });

            //连线文字
            // lintText
            //     .attr("dx", function(d) {
            //         return (d.source.x + d.target.x) / 2;
            //     })
            //     .attr("dy", function(d) {
            //         return (d.source.y + d.target.y) / 2;
            //     });
            lintText
                .attr("x", function(d) { return d.x })
                .attr("y", function(d) { return d.y });

            //节点文字
            text
                .attr("dx", function(d) {
                    return d.x;
                })
                .attr("dy", function(d) {
                    return d.y + nodeHeight / 2 + 15;
                });
        };
    }

    // 开始拖拽
    function dragstarted(d) {

        // 隐藏详情弹窗
        showDetail.value = false;

        if (!d.active) {
            simulation.alphaTarget(0.3).restart();
        }
        // d.subject.fx = d.subject.x;
        // d.subject.fy = d.subject.y;
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    // 拖拽中
    function dragged(d) {

        // 隐藏详情弹窗
        showDetail.value = false;

        // d.subject.fx = d.x;
        // d.subject.fy = d.y;
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    // 拖拽完成
    function dragended(d) {

        // 隐藏详情弹窗
        showDetail.value = false;

        if (!d.active) {
            simulation.alphaTarget(0);
        }
        // d.subject.fx = null;
        // d.subject.fy = null;

        d.fx = null;
        d.fy = null;
    }
}

// 获得复杂子图节点详情
const getDetailData = async (val) => {

    // 如果是状态是ba，则不查看详情
    if(activeType.value == 'ba'){
        return;
    }

    var param = val.name;
    detailX = val.x;
    detailY = val.y;

    const res = await DetailCa(param);
    if(res.code == '200'){
	    Object.assign(detailData, markRaw(res.data))

        showDetail.value = true;
        document.getElementsByClassName('cccc')[0].style.left = detailX + 'px';
        document.getElementsByClassName('cccc')[0].style.top = detailY + 'px';
    }
}


onMounted(()=>{
    // 点击任意地方，详情弹窗消失
    window.addEventListener('click',()=>{
        showDetail.value = false;
    })
})


//从父级获得的参数
const props = defineProps({
})
// 从父级获得的函数
// const em = defineEmits([])

// 暴露给父级的函数
defineExpose({ getMsg })

</script>

<style lang="less" scoped>
#topo{
    position: relative;
    width: 100%;
    height: 100%;
    // background: rgba(0, 130, 255, 0.15);
    .svg-model{
        position: absolute;
        top: -1000px;
        left: -1000px;

    }
    .cccc{
        padding: 20px;
        box-sizing: border-box;
        >div{
            margin-bottom: 15px;
            h5{
                height: 20px;
                font-size: 14px;
                font-family: SourceHanSansCN-Bold, SourceHanSansCN;
                font-weight: bold;
                color: #1A1A1A;
                line-height: 14px;
            }
            .el-row{
                display: flex;
                width: 100%;
                border-bottom: 1px solid rgba(162, 189, 220, 0.1800);
                background-color: rgba(247, 248, 250, 1);
                .el-col{
                    width: 100%;
                    height: 30px;
                    padding:0 10px ;
                    box-sizing: border-box;
                    
                    font-size: 14px;
                    line-height: 30px;
                    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
                    font-weight: 400;
                    color: #666666;

                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .el-row:last-of-type{
                border: none;
            }
            .normal{
                height: 22px;
                font-size: 14px;
                font-family: SourceHanSansCN-Regular, SourceHanSansCN;
                font-weight: 400;
                color: #666666;
                line-height: 22px;
            }
        }
        >div:last-of-type{
            margin: 0;
        }
    }
}
</style>