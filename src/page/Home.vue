<template>
    <div class="home_contain">
        <el-row style="height: 100%;">
            <el-col class="menu_el" :span="4" style="height:100%; background-color: #324057;">
                <el-menu class="menu" style="height:100%;" 
                        :default-active='defaultActive'
                        :collapse='collapse'
                        background-color="#324057" 
                        text-color="#fff" 
                        active-text-color="#ffd04b" 
                        router>
                    <el-menu-item index="runkids.io"><i class="el-icon-menu"></i><span>首頁</span></el-menu-item>
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-setting"></i><span>設定</span></template>
                        <el-menu-item index="user">個人資訊</el-menu-item>
                        <el-menu-item index="1-2">DEMO2</el-menu-item>
                        <el-menu-item index="1-3">DEMO3</el-menu-item>
                        <el-submenu index="1-4">
                            <template slot="title">DEMO4</template>
                            <el-menu-item index="1-4-1">DEMO4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <Head></Head>
            </el-col>
            <el-col :span="20" style="height: 100%;overflow: auto;">
                <keep-alive>
                    <router-view class="showContain" />
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Head from '@/components/Head'
import {mapGetters,mapActions} from 'vuex'
export default {
    components:{
        Head,
    },
    data(){
        return {
            userInfo : {},
            collapse:false
        }
    },
    methods:{
        ...mapActions(['getUserInfo'])
    },
    computed: {
        defaultActive: function(){
            return this.$route.path.replace('/', '');
        }
    },
    mounted(){
        if(window.screen.availWidth<768){
            this.collapse=true;
        }
    }
}
</script>
<style>
.home_contain{
   min-width: 100%;
    height: 100%;
}
.showContain{
    height: 100%;
    overflow:auto;
}
@media (min-width: 300px) and (max-width: 500px) {
    .menu{
        min-width: 73px;
    }
}
</style>

