import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import mutations from './mutations'
import actions from './actions'
import {captchaKey} from '../config/captchaKey'

Vue.use(Vuex)

const state = {
    captchaKey ,
    isLoading:false,
    userInfo:{},  //登入者資訊
}

const getters = {
    captchaKey :(state)=>state.captchaKey,
    isLoading :(state)=>state.isLoading,
    userInfo:(state)=>state.userInfo,
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})