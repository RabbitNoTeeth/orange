<template>
    <div>
        我是主页
    </div>
</template>

<script>
    import { readConfig } from './../util/ConfigFileUtils'
    export default {
        name: "Home",
        mounted () {
            // 页面准备完成后，加载本地配置文件
            readConfig();
        }
    }
</script>

<style scoped>

</style>
