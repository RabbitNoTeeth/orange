<template>
    <div>
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main>
                <Task v-for="item in tasks" :task="item"></Task>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Task from "./Task";
    import Header from "./Header";

    export default {
        name: "Home",
        components: {Header, Task},
        data() {
            return {}
        },
        computed: {
            tasks() {
                return this.$store.state.Task.main
            }
        }
    }
</script>

<style scoped>

</style>
