<template>
    <!-- 知识图谱 -->
    <div class="topo-2d">

        <!-- 内容部分 -->
        <div class="knowledge-graph right-container-card" id="knowledge-graph">

			<img  class="close" src="../../assets/image/knowledge/clsoe.png" alt="close" @click="Close">
			<img  class="open" src="../../assets/image/knowledge/open.png" alt="open" @click="Open">

			<!-- 侧边栏 -->
			<div class="knowledge-graph-slider">

				<div class="public-box">
					<ul class="type-tab">
						<li :class="activeType == 'ba'?'active':''" @click="changeType('ba')">基础攻击子图</li>
						<li :class="activeType == 'ca'?'active':''" @click="changeType('ca')">复杂攻击子图</li>
					</ul>
					<div class="knowledge-graph-filter">
						<el-input placeholder="中文/英文名称" v-model="filterName" @keydown.enter="SreachList">
							<template #suffix>
								<el-icon class="el-input__icon" @click="SreachList"><Search /></el-icon>
							</template>
						</el-input>

						<el-upload
							:show-file-list="false"
							action
							:http-request="fileUpload"
						>
						<el-tooltip content="上传子图" placement="top" :show-after="1000">
							<img src="../../assets/image/knowledge/import.png" alt="import">
						</el-tooltip>
						</el-upload>

						<img @click="downLoad" src="../../assets/image/knowledge/download.png" alt="download">

					</div>
				</div>

				<!-- 基础攻击列表 -->
				<div class="knowledge-graph-list" v-if="activeType == 'ba'">
					<ul class="ba-title">

						<!-- 探测型 ：ba-1，破坏型：ba-2，控制型：ba-3，资源消耗型：ba-4 -->
						<li :class="baType=='ba-1'?'active':''" @click="changeBaType('ba-1')">探测型</li>
						<li :class="baType=='ba-2'?'active':''" @click="changeBaType('ba-2')">破坏型</li>
						<li :class="baType=='ba-3'?'active':''" @click="changeBaType('ba-3')">控制型</li>
						<li :class="baType=='ba-4'?'active':''" @click="changeBaType('ba-4')">资源消耗型</li>
					</ul>
					<div class="list ba-list">
						<el-scrollbar style="height:100%" class="scrollbar-for">
							<ul>
								<li :class="activeIndex==index?'activeLi':''" v-for="(item,index) in baList" :key="index" @click="checkTopo(item,index)">
									<p>{{ item.ba_zh_name || '--' }}</p>
									<span>{{ item.ba_name || '--' }}</span>
									
									
									<div class="import-info" v-if="item.source == 'import'">
										<img src="../../assets/image/knowledge/new.png" alt=".">
									</div>
									<div class="delete" @click.stop="deleteBa(item)">
										<img src="../../assets/image/knowledge/del.png" alt="del">
									</div>
								</li>
							</ul>
						</el-scrollbar>
					</div>
					<div class="ba-page">
						<el-pagination small background layout="total, prev, pager, next" 
						v-model:page-size="curPageInfo.baSize" :total="curPageInfo.baTotal" @current-change="handleCurrentChangeBa"/>
					</div>
				</div>
				<!-- 复杂攻击列表 -->
				<div class="knowledge-graph-list" v-if="activeType == 'ca'">
					<div class="list ca-list">
						<el-scrollbar style="height:100%" class="scrollbar-for">
							<ul>
								<li :class="activeIndex==index?'activeLi':''" v-for="(item,index) in caList" :key="index" @click="checkTopo(item,index)">
									<p>{{ item.ca_zh_name || '--' }}</p>
									<span>{{ item.ca_name || '--' }}</span>

									<div class="delete" @click.stop="deleteCa(item)">
										<img src="../../assets/image/knowledge/del.png" alt="del">
									</div>
								</li>
							</ul>
						</el-scrollbar>
					</div>
					<div class="ca-page">
						<el-pagination small background layout="total, prev, pager, next" 
						v-model:page-size="curPageInfo.caSize" :total="curPageInfo.caTotal" @current-change="handleCurrentChangeCa"/>
					</div>
				</div>

			</div>

			<!-- 图例 -->
			<div class="knowledge-graph-legend">
				<h5>图例</h5>
				<ul>
					<li v-for="(item,index) in legendList" :key="index">
						<img :src="`/src/assets/image/knowledge/legend/${item.value}.png`" alt=".">
						<p>{{ item.name }}</p>
					</li>
				</ul>
			</div>

			<!-- 力导图 -->
			<div id="knowledge-graph-container">
				 <!-- v-if="isGraphData" -->
				<TopoGraph ref="topo"></TopoGraph>
			</div>
		</div>

		<el-dialog
                v-model="dialogVisible"
                width="400px"
				title="导入攻击子图"
                :close-on-click-modal="false"
                custom-class="show-import"
                :before-close="handleClose"
            >

                <!-- <template #title>
                    <h3>导入攻击子图</h3>
                </template> -->

                <!-- 内容 -->
                <div class="impot-box">
                    <p>共{{ dialogData.failCount + dialogData.repeatCount + dialogData.successCount || '--' }}条数据：</p>
                    <ul>
                        <li>成功<span class="success">{{ dialogData.successCount }}</span>条</li>
                        <li>重复<span class="repeat">{{ dialogData.repeatCount }}</span>条</li>
                        <li>失败<span class="fail">{{ dialogData.failCount }}</span>条</li>
                    </ul>

                    <span class="check" @click="dialogDetailShow = true" v-if="dialogDetailShow==false">查看详情</span>
                    <span class="check" @click="dialogDetailShow = false" v-else>收起详情</span>
                </div>

                <div class="detail-box" v-if="dialogDetailShow == true">
                    <div>
                        <h5>重复数据：</h5>
                        <div>{{ dialogData.failIds || '--' }}</div>
                    </div>

                    <div>
                        <h5>导入失败：</h5>
                        <div>{{ dialogData.failMsg || '--' }}</div>
                    </div>
                </div>
            </el-dialog>
    </div>
</template>

<script setup>
import TopoGraph from "@/components/Topo/2D/TopoGraph.vue"
import { List, Search } from '@element-plus/icons-vue'


import { reactive, ref, markRaw } from "vue";
import { onMounted, onUnmounted } from "vue";

import { ElMessageBox, ElMessage } from "element-plus";

import List1 from '@/assets/json/topo-2d/baList.json'	// 基础攻击列表
import List2 from '@/assets/json/topo-2d/caList.json'	// 复杂攻击列表
import List3 from '@/assets/json/topo-2d/legendList.json'	// 图例列表

import List4 from '@/assets/json/topo-2d/baTopo1.json'	// 基础攻击子图数据1
import List5 from '@/assets/json/topo-2d/baTopo2.json'	// 基础攻击子图数据2
import List6 from '@/assets/json/topo-2d/caTopo1.json'	// 复杂攻击子图数据1
import List7 from '@/assets/json/topo-2d/caTopo2.json'	// 复杂攻击子图数据2


// topo子组件值
const topo = ref(null);
// 当前选中为基础攻击/复杂攻击
const activeType = ref('ba');

// 基础/复杂选中的索引
const activeIndex = ref(0);

// 基础攻击列表
const baList = reactive([])
// 复杂攻击列
const caList = reactive([])
// 分页数据
const curPageInfo = reactive({
	baIndex:1,
	baSize: 20,
	baTotal: 0,

	caIndex:1,
	caSize: 20,
	caTotal: 0,
})

// 用于筛选查询的名称
const filterName = ref('');


// 目前是哪种基础攻击
const baType = ref('ba-1');

// 力导图数据id
const graphId = ref('')

// 是有力导图数据
const isGraphData = ref(false);
// 力导图数据
const graphData = reactive({});
// 力导图图例数据
const legendList = ref([])

// 导入弹窗是否展示
const dialogVisible = ref(false);
const dialogData = reactive({})
// 详情弹窗的详情是否展开
const dialogDetailShow = ref(false);
// 弹窗关闭
const handleClose = (done) => {
	done();
}
// 折叠
const Close = () => {
	let dom = document.getElementsByClassName('knowledge-graph-slider')[0];
	document.getElementsByClassName('close')[0].style.display = 'none';
	document.getElementsByClassName('open')[0].style.display = 'block';

	dom.style.left = '-600px';

}
// 展开
const Open = () => {
	let dom = document.getElementsByClassName('knowledge-graph-slider')[0];
	document.getElementsByClassName('close')[0].style.display = 'block';
	document.getElementsByClassName('open')[0].style.display = 'none';

	dom.style.left = '20px';
}
const SreachList = () => {
	if(activeType.value == 'ba'){
		getBaList();
	}else{
		getCaList();
	}
}
// 切换复杂&攻击列表
const changeType = (param) => {
	activeType.value = param;
	filterName.value = '';
	if(param == 'ba'){
		getBaList();
	}else{
		getCaList();
	}
}
// 切换基础列表
const changeBaType = (param) => {
	baType.value = param;
	getBaList();
}

// 获得复杂攻击子图 -> 节点详情
const getDeatail = async (item) => {
	let param = {
		ca_id: item.ca_id
	};
	const res = await DetailCa(param);
}

// 获得要查询的图例数据 （基础子图 & 复杂子图）
const getLegend = async () => {

	legendList.value = List3.data;
	return

	let param = {
		id: graphId.value
	}
	if(activeType.value == 'ba'){
		const res = await legendBa(param);
		legendList.value = res.data;
	}else{
		const res = await legendCa(param);
		legendList.value = res.data;
	}
}

// 获得要查询的力导图数据
const getGraphData = async() => {
	let data;
	if(activeType.value == 'ba'){
		// ba数据为List4和List5, 随机生成
		data = Math.round(Math.random()) ? List4.data : List5.data;
	}else{
		// ca数据为List6和List7, 随机生成
		data = Math.round(Math.random()) ? List6.data : List7.data;
	}
	// 告诉子组件topo数据
	setTimeout(()=>{
		// 因为是json数据，数据加载在dom之前，需要做一下异步
		topo.value.getMsg(data,activeType.value)
	})
	return;

	let param = {
		id: graphId.value
	}
	if(activeType.value == 'ba'){

		const res = await knowGraphBa(param);
		if(res.code == '200'){
			isGraphData.value = true;
			Object.assign(graphData, markRaw(res.data))
	
			// 告诉子组件topo数据
			// topo.value.getMsg(graphData)
			topo.value.getMsg(res.data,activeType.value)

		}
	}else{
		const res = await knowGraphCa(param);
		if(res.code == '200'){
			isGraphData.value = true;
			Object.assign(graphData, markRaw(res.data))
	
			// 告诉子组件topo数据
			topo.value.getMsg(graphData,activeType.value)
		}
	}

	// initGraph()
}
// 绘制力导图
const initGraph = (item) => {
	
}

// 获得子图谱数据
const checkTopo = (item,index) => {
	graphId.value = item.id;
	activeIndex.value = index;

	getGraphData();
	getLegend();
}
// 获得基础攻击列表数据
const getBaList = async () => {

	// 获得基础攻击数据
	Object.assign(baList, markRaw(List1.data.list))
	// 获得基础攻击总数
	curPageInfo.baTotal = List1.data.total;
	getGraphData();
	getLegend();
	return;
	

	let param = {
		name: filterName.value,
		pageIndex: curPageInfo.baIndex,
		pageSize: curPageInfo.baSize,
		type: baType.value
	}
	const res = await knowBaList(param);
	
	// 获得基础攻击数据
	Object.assign(baList, markRaw(res.data.list))
	// 获得基础攻击总数
	curPageInfo.baTotal = res.data.total;

	if(baList.length){
		// 初始化、翻页，得到该条列表第一条数据，获得要查询的力导图id
		graphId.value = baList[0].id;
		getGraphData();
		getLegend();
	}
}
// 获得复杂攻击列表数据
const getCaList = async () => {

	// 获得复杂攻击数据
	Object.assign(caList, markRaw(List2.data.list))
	// 获得复杂攻击总数
	curPageInfo.caTotal = List2.data.total;
	getGraphData();
	getLegend();
	return;


	let param = {
		keyword: filterName.value,
		pageIndex: curPageInfo.caIndex,
		pageSize: curPageInfo.caSize
	}
	const res = await knowCaList(param);
	// 获得基础攻击数据
	Object.assign(caList, markRaw(res.data.list))
	// 获得基础攻击总数
	curPageInfo.caTotal = res.data.total;

	if(caList.length){
		// 初始化、翻页，得到该条列表第一条数据，获得要查询的力导图id
		graphId.value = caList[0].id;
		getGraphData();
		getLegend();
	}
}
// 删除该条ba数据
const deleteBa = async (item) => {

	ElMessageBox.confirm(
		'是否确认删除该攻击子图?',
		'提示',
		{
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type:'warning',
        	customClass: 'confirmbox-delete',
		}
	).then(async(item) =>{
		let param = {
			id: item.id
		}
		const res = await delBa(param);
	
		ElMessage({
		    appendTo: document.getElementById('knowledge-graph'),
		    message: res.msg,
		    type: res.code == '200'?'success':'error',
		})
		if(res.code == '200'){
			// 删除成功，刷新类别
			getBaList();
		}
	})
	.catch(() => {
    })
}
const deleteCa = async (item) => {
	ElMessageBox.confirm(
		'是否确认删除该攻击子图?',
		'提示',
		{
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			// customClass: 'normal'
			type:'warning',
        	customClass: 'confirmbox-delete',
		}
	).then(async(item) =>{
		let param = {
			id: item.id
		}
		const res = await delCa(param);
	
		ElMessage({
			appendTo: document.getElementById('knowledge-graph'),
			message: res.msg,
			type: res.code == '200'?'success':'error',
		})
		if(res.code == '200'){
			// 删除成功，刷新类别
			getCaList();
		}
	})
	.catch(() => {
    })
}
const handleCurrentChangeBa = (val) => {
	curPageInfo.baIndex = val;
	// 刷新列表
	getBaList();
}
const handleCurrentChangeCa = (val) => {
	curPageInfo.caIndex = val;
	// 刷新列表
	getCaList();
}


// 上传 基础攻击子图 / 复杂攻击子图
const fileUpload  = async (files) => {
	let form = new FormData();
	form.append('file',files.file)
	console.log(55555,importBa);

	if(activeType.value == 'ba'){

		const res = await importBa(form);
	
		ElMessage({
			appendTo: document.getElementById('knowledge-graph'),
			message: res.msg,
			type: res.code == '200'?'success':'error',
		})
		if(res.code == '200'){
			
			Object.assign(dialogData, markRaw(res.data))
			// 展开弹窗，展示成功、失败、重复数据
        	dialogVisible.value = true;

			// 上传成功，刷新列表
			getBaList();
		}
	}else{
		const res = await importCa(form);
	
		ElMessage({
			appendTo: document.getElementById('knowledge-graph'),
			message: res.msg,
			type: res.code == '200'?'success':'error',
		})
		if(res.code == '200'){

			Object.assign(dialogData, markRaw(res.data))
			// 展开弹窗，展示成功、失败、重复数据
			dialogVisible.value = true;
			
			// 上传成功，刷新列表
			getCaList();
		}
	}

}
// 基础 & 复杂文件下载
const downLoad = async() => {
	if(activeType.value == 'ba'){
		const res = await donwnloadBa();
		
		var data = JSON.stringify(res.data)
		//encodeURIComponent解决中文乱码
		let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);
		//通过创建a标签实现
		let link = document.createElement("a");
		link.href = uri;
		//对下载的文件命名
		link.download = "基础攻击子图导入模板.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

	}else{
		const res = await donwnloadCa();

		var data = JSON.stringify(res.data)
		//encodeURIComponent解决中文乱码
		let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);
		//通过创建a标签实现
		let link = document.createElement("a");
		link.href = uri;
		//对下载的文件命名
		link.download = "复杂攻击子图导入模板.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

// 获得基础攻击列表数据
getBaList();






</script>

<style lang="less" scoped>
.topo-2d{
    width: 100%;
	height: 100%;
}
.knowledge-graph {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: rgba(245, 245, 245, 1);
	
	.close{
		position: absolute;
		top: 50%;
		left: 408px;
		// display: none;
		z-index: 99;
	}
	.open{
		position: absolute;
		top: 50%;
		left: 18px;
		display: none;
		z-index: 99;
	}
		
	.knowledge-graph-slider{
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 99;
		// display: none;

		width: 390px;
		height: calc(100% - 40px);
		background: #FFFFFF;
		box-shadow: 0px 1px 4px 0px rgba(0,59,129,0.15);
		border-radius: 3px;
		
		.public-box{
			padding: 20px 20px 0;
			box-sizing: border-box;
		}
		.type-tab{
			width: 100%;
			height: 32px;
			padding: 2px;
			// border: 1px solid red;
			background-color: #f2f3f5;
			box-sizing: border-box;
			line-height: 28px;
			border-radius: 3px;
			display: flex;
			li{
				flex: 1;
				text-align: center;
				font-size: 16px;
				font-family: SourceHanSansCN-Regular, SourceHanSansCN;
				font-weight: 400;
				color: #4D4D4D;
				background-color: rgba(242, 243, 245, 1);
				cursor: pointer;
			}
			li:first-of-type{
				border-top-left-radius: 3px;
				border-bottom-left-radius: 3px;
			}
			li:last-of-type{
				border-top-right-radius: 3px;
				border-bottom-right-radius: 3px;
			}
			.active{
				color: #0082FF;
				font-weight: bold;
				background-color: rgba(255,255,255,0.99);
			}
		}

		.knowledge-graph-filter{
			width: 100%;
			height: 30px;
			border-radius: 3px;
			margin: 20px 0;
			display: flex;
			:deep(.el-input){
				width: 260px;
				height: 100%;
				background: #FAFAFA;
				margin-right: 10px;
				.el-input__wrapper{
					background: rgba(245, 245, 245, 1);
					box-shadow: none;
				}
				.el-input__inner{
					height: 30px;
				}
			}
			.el-input__icon{
				cursor: pointer;
			}
			img{
				margin-left: 10px;
				cursor: pointer;
			}
		}

		.knowledge-graph-list{
			width: 100%;
			height: calc(100% - 122px);
			.ba-title{
				width: 100%;
				height: 34px;
				line-height: 34px;
				padding: 0 20px;
				box-sizing: border-box;
				display: flex;
				// box-shadow: 0px 1px 4px 0px rgba(0,59,129,0.15);
				li{
					// flex: 1;
					font-size: 16px;
					font-family: SourceHanSansCN-Regular, SourceHanSansCN;
					font-weight: 400;
					color: #999999;
					line-height: 24px;
					margin-right: 40px;
					cursor: pointer;
				}
				li:last-of-type{
					margin: 0;
				}
				.active{
					font-weight: bold;
					color: #1A1A1A;
					border-bottom: 3px solid #0082FF;
				}
			}
			.list{
				width: 100%;
				height: calc(100% - 34px - 44px);
				ul{
					li{
						position: relative;
						width: 100%;
						// height: 60px;
						background: #ffffff;
						padding: 13px 50px 13px 20px;

						box-sizing: border-box;
						p{
							font-size: 14px;
							font-family: SourceHanSansCN-Regular, SourceHanSansCN;
							font-weight: 400;
							color: #1A1A1A;
							line-height: 18px;
						}
						span{
							display: inline-block;
							width: 80%;
							// border: 1px solid red;
							font-size: 14px;
							font-family: SourceHanSansCN-Regular, SourceHanSansCN;
							font-weight: 400;
							color: #999999;
							line-height: 14px;
						}
						.import-info{
							position: absolute;
							top: 15px;
							right: 30px;
							// width: 16px;
							// height: 17px;
							// background-image: url("../assets/image/knowledge/new.png");
						}
						.delete{
							position: absolute;
							// top: 15px;
							// right: 20px;
							top: 50%;
							right: 60px;
							transform: translate(0, -50%);

							width: 30px;
							height: 30px;
							border-radius: 50%;
							background: #FFFFFF;
							box-shadow: 0px 2px 4px 0px rgba(162,189,220,0.25);
							cursor: pointer;
							display: none;
							img{
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
							}
						}
					}
					li:nth-of-type(2n+1){
						background-color: #F8F9FA;
					}
					li:hover{
						background-color: rgba(0, 130, 255, 0.15);
						.delete{
							display: inline-block;
						}
					}
					.activeLi{
						background-color: rgba(0, 130, 255, 0.15) !important;
					}
				}
			}
			.ba-page{
				width: 100%;
				height: 44px;
				padding: 0 20px;
				box-sizing: border-box;
				display: flex;
				align-items: center;
			}

			.ca-list{
				width: 100%;
				height: calc(100% - 44px);
			}
			.ca-page{
				width: 100%;
				height: 44px;
				padding: 0 20px;
				box-sizing: border-box;
				display: flex;
				align-items: center;
			}
		}
	}

	.knowledge-graph-legend{
		position: absolute;
		bottom: 20px;
		right: 20px;
		z-index: 99;

		width: 116px;
		// height: 260px;
		background: #FFFFFF;
		box-shadow: 0px 1px 4px 0px rgba(0,59,129,0.15);
		border-radius: 3px;
		padding: 20px 15px;
		box-sizing: border-box;
		h5{
			height: 32px;
			font-size: 12px;
			text-align: center;
			font-family: SourceHanSansCN-Regular, SourceHanSansCN;
			font-weight: 400;
			color: #1A1A1A;
			line-height: 22px;
		}
		ul{
			li{
				width: 100%;
				display: flex;
				height: 14px;
				margin-bottom: 15px;
				img{
					width: 16px;
					height: 16px;
				}
				p{
					height: 12px;
					font-size: 12px;
					font-family: SourceHanSansCN-Regular, SourceHanSansCN;
					font-weight: 400;
					color: rgba(77, 77, 77, 0.8);
					line-height: 14px;
					margin-left: 14px;
				}
			}
		}
	}

	#knowledge-graph-container{
		width: 100%;
		height: 100%;
	}
}
.show-import{
	border-radius: 6px;
    .el-dialog__body{
        padding: 20px !important;
        box-sizing: border-box;
    }
    .impot-box{
        p{
            color: #1A1A1A;
            margin-bottom: 20px;
        }
        ul{
            padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            margin-bottom: 20px;
            li{
                flex: 1;
                position: relative;
                text-align: center;
                &::after{
                    display: inline-block;
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 1px;
                    height: 20px;
                    background-color: rgba(223, 223, 223, 1);
                }
                .success{
                    font-weight: bold;
                    color: rgba(0, 180, 43, 1);
                }
                .repeat{
                    font-weight: bold;
                    color: rgba(243, 141, 0, 1);
                }
                .fail{
                    font-weight: bold;
                    color: rgba(245, 63, 63, 1);
                }
            }
            li:last-of-type{
                &::after{
                    width: 0;
                }
            }
        }
        .check{
            color: rgba(0, 130, 255, 1);
            cursor: pointer;
        }
    }
    .detail-box{
        margin-top: 20px;
        >div{
            h5{
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                font-family: SourceHanSansCN-Bold, SourceHanSansCN;
                font-weight: bold;
                color: #1A1A1A;
            }
            p{
                line-height: 21px;
            }
        }
        >div:first-of-type{
            margin-bottom: 20px;
        }
    }
}
</style>