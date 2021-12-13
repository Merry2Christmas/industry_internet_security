<template>
	<div id="app">
		<div id="nav">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style lang="less" scoped>
#app{
	#nav{
		min-width: 1000px;
	}
}
</style>
