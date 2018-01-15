<template>
  <div>
    <el-form :model="registerForm" :rules="registerRules" ref="registerForm" class="registerForm">
        <el-form-item prop="account">
            <el-input type="text" placeholder="E-MAIL" v-model.lazy="registerForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" placeholder="密碼" v-model.lazy="registerForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="checkpass">
            <el-input type="password" placeholder="確認密碼" v-model.lazy="registerForm.checkpass" auto-complete="off"></el-input>
        </el-form-item>
        <Recaptcha ref="recaptcha" @verify="doRecaptcha"></Recaptcha>
        <el-form-item>
            <el-button style="margin-top: 10px;" class="btnGroup" type="primary" @click="submitForm('registerForm')"  
                        v-loading.fullscreen.lock="isLoading"
                        element-loading-text="註冊中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
            >註冊</el-button>
            <el-button style="margin-top: 10px;" class="btnGroup" @click="changeToLogin">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions,mapGetters } from 'vuex'
import Recaptcha from '@/components/Recaptcha'
export default {
    model:{
        prop:'isRegister'
    },
    props:{
        isRegister : Boolean
    },
    components:{
        Recaptcha
    },
    data(){
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
        var validateCheckpass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('請再輸入一次密碼'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('密碼不一致!'));
            } else {
                callback();
            }
        };
        return {
            registerForm :{
                account:'',
                password:'',
                checkpass:''
            },
            registerRules: {
                account: [{ validator: validateAcc, trigger: "blur" }],
                password: [{ validator: validatePass, trigger: "blur" }],
                checkpass: [{ validator: validateCheckpass, trigger: "blur" }],
            },
            recaptchaCheck:null
        }
    },
    methods:{
        ...mapActions(['registerNewAccount']),
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
                    const state = await this.registerNewAccount(this.registerForm);
                    if(state.message==='success'){
                        this.$message({
                            showClose: true,
                            message: '註冊成功！請到您的信箱進行驗證再登入！',
                            type: 'success'
                        });
                        this.changeToLogin();
                    }else{
                        this.$notify.error({
                            title: '註冊失敗',
                            message: state.message,
                            duration: 8000
                        });
                        this.initForm();
                        this.reSetRecaptcha();
                    }
                } else {
                    return false;
                }
            });
        },
        initForm(){
            this.registerForm = {
                account:'',
                password:'',
                checkpass:''
            }
        },
        changeToLogin(){ //返回登入畫面
            this.$emit('changeToLogin');
        },
        doRecaptcha (res) { //機器人驗證結果
            this.recaptchaCheck=res;
        },
        reSetRecaptcha(){ //重置機器人驗證勾勾
            this.recaptchaCheck = null;
            this.$refs.recaptcha.reset();
        }
    },
    computed:{
        ...mapGetters(['isLoading'])
    }
}
</script>
<style>
.btnGroup{
    display: inline-block;
    width: 100px;
}
</style>

