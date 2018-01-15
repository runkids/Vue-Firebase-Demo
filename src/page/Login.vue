<template>
    <div class="login_contain main_contain">
        <div :class="{afterLoading:cssChange,berforLoading:!cssChange}">
            <p class="login_title">Vue + Firebase Demo</p>
            <div class="login_page" v-if="!isRegister">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="loginForm">
                    <el-form-item prop="account">
                        <el-input type="text" placeholder="E-MAIL" v-model.lazy="loginForm.account" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密碼" v-model.lazy="loginForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <Recaptcha ref="recaptcha" @verify="doRecaptcha"></Recaptcha>
                    <el-checkbox class='loginCheckbox' label="記住帳號" v-model="rememberAcc"></el-checkbox>
                    <el-checkbox class='loginCheckbox' label="保持登入" v-model="loginForm.rememberLogin"></el-checkbox>
                    <el-form-item>
                        <el-button style="margin-top: 15px;" class="loginBtn" type="success" @click="submitForm('loginForm')"  
                                    v-loading.fullscreen.lock="isLoading"
                                    element-loading-text="驗證中"
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                        >登入</el-button>
                        <el-button type="text" @click="forgetPass">忘記密碼？</el-button>
                    </el-form-item>
                        <el-button type="text" @click="isRegister=!isRegister">沒有帳號嗎？立刻註冊新帳號！</el-button>
                </el-form>
            </div>
            <div class="login_page" v-else>
                <Register v-model="isRegister" @changeToLogin="isRegister=!isRegister"></Register>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex'
import Recaptcha from '@/components/Recaptcha'
import Register from '@/components/Register'

export default {
    data() {
        let validateAcc = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("請輸入帳號"));
            } else {
                callback();
            }
        };
        let validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("請輸入密碼"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                account: '',
                password: "",
                rememberLogin:false
            },
            loginRules: {
                account: [{ validator: validateAcc, trigger: "blur" }],
                password: [{ validator: validatePass, trigger: "blur" }],
            },
            isRegister:false,
            resetPassAcc:'',
            recaptchaCheck:null,
            rememberAcc:false,
            cssChange:false
        };
    },
    components:{
        Recaptcha,
        Register
    },
    methods:{
        ...mapActions(['loginCheck','rememberAccount','resetPassword']),
        submitForm(form){
            this.$refs[form].validate( async (valid) => {
                if (valid) {
                    if(this.recaptchaCheck===null){
                        this.$message({
                            showClose: true,
                            message: '請勾選我不是機器人！',
                            type: 'error'
                        });
                        return false;
                    }
                    const res = await this.loginCheck(this.loginForm); //驗證帳號密碼是否正確
                    if(res.message==='success'){
                        //有勾記住帳號，並登入成功就存到localStorage
                        this.rememberAccount({account:this.loginForm.account,remember:this.rememberAcc});
                        this.$router.replace('runkids.io'); //登入成功轉到首頁
                    }else{
                        this.$notify.error({
                            title: '登入失敗',
                            message: res.message
                        });
                        this.loginForm.password=""; //登入失敗，清空帳號密碼
                        this.reSetRecaptcha();
                    }
                } else {
                    return false;
                }
            });
        },
        doRecaptcha (res) {  //機器人驗證回傳結果
            this.recaptchaCheck=res;
        },
        reSetRecaptcha() { //機器人驗證重置
            this.recaptchaCheck = null;
            this.$refs.recaptcha.reset();
        },
        forgetPass(){
            const h = this.$createElement;
            this.$prompt('請輸入您的帳號：', '忘記密碼', {
                confirmButtonText: '發送重置密碼信件',
                cancelButtonText: '取消',
                inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: '信箱格式有誤！'
            }).then( async ({ value }) => {
                const res = await this.resetPassword(value);
                this.$message({
                    type: 'warning',
                    message: res.message
                });
            }).catch(() => {
            });
        }
    },
    computed:{
        ...mapGetters(['captchaKey','isLoading']),
    },
    mounted(){
        let item = window.localStorage.getItem('rememberAccount'); //有勾記住帳號的話，帶出帳號至欄位上
        if(item){
            this.loginForm.account = item;
            this.rememberAcc=true;
        }
        setTimeout(()=>{
            this.cssChange=!this.cssChange;
        },500);
    },
    beforeDestroy(){
        this.reSetRecaptcha();
    }
};
</script>
<style>
.login_page{
    width: 302px;
    height: 310px;
    margin-left:auto;
    margin-right:auto;
    margin-top: 10px;
    padding:30px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
}
.loginBtn{
    width: 302px;
}
.loginBtn:hover{
    transition-duration: 1s;
    background-color: rgba(7, 131, 44, 0.774);
}
.login_contain{
    position: absolute;
    background-color: #324057;
}
.login_title{
    text-align: center;
    color: #fff;
    font-size: 30px;
    margin-top: 100px;
}
.loginCheckbox{
    margin-top: 10px;
}
.berforLoading{
    opacity: 0;
    transform: translate3d(0, -50px, 0);
}
.afterLoading{
    transition: all 1s;
}
</style>
