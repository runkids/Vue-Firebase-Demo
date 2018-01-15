<template>
  <div class="userInfo_contain">
	  <el-row class="elrow1" style="">
		<el-col :span="24" style="display: inline-block;">
			<label for="file-upload" class="custom-file-upload">
				<img class="showUserImg" :src="userInfoForm.photoURL"/>
			</label>
			<input id="file-upload" @change="fileSelected" type="file"/>
			<div class="status" style="display: inline-block;">
				<div>驗證狀態：<span style="color:red;">{{userInfo.emailVerified?"已驗證":"未驗證"}}</span></div>
				<div>
					帳號建立時間：{{creationTime}}
				</div>
				<div class=''>
					最後登入時間：{{lastSignInTime}}
				</div>
			</div>
		</el-col>
	  </el-row>
	  <el-row>
		<el-col :span="24">
			<el-form label-width="80px" :model="userInfoForm" v-loading="isLoading"  :rules="userInfoRules" status-icon ref="userInfoForm" class="userInfoForm">
				<el-form-item label="帳號" prop="email">
					<el-input type="email" v-model="userInfo.email" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="暱稱" prop="displayName">
					<el-input type="text" placeholder="如果沒輸入也會更新暱稱喔！" v-model="userInfoForm.displayName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('userInfoForm')">更新資料</el-button>
					<el-button type="info" @click="resetPass(userInfo.email)">重設密碼</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
  </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex'
export default {
    data(){
		var validateDisplayName = (rule, value, callback) => {
            if (value.length>20) {
                callback(new Error('名稱過長！'));
			} else {
                callback();
            }
        };
		return{
			lastSignInTime:'',
			creationTime:'',
			userInfoForm:{},
			userInfoRules: {
                displayName: [{ validator: validateDisplayName, trigger: "blur" }],
            },
		}
    },
    methods:{
        ...mapActions(['resetPassword','getUserInfo','updateUserInfo','resetPassword','userLogout']),
        fileSelected(event){
			const file = event.target.files.item(0); //取得File物件
			const reader = new FileReader(); //建立FileReader 監聽 Load 事件
			reader.addEventListener('load',this.imageLoader);
			reader.readAsDataURL(file);
        },
        imageLoader(event){
          	this.userInfoForm.photoURL=event.target.result;
		},
		resetPass(mail){
			this.$confirm('即將發送重置密碼信件，且將返回登入畫面，是否繼續?', '提示', {
				confirmButtonText: '確認重置密碼',
				cancelButtonText: '取消',
				type: 'warning'
			}).then( async () => {
				const res = await this.resetPassword(mail);
				this.$message({
					type: 'warning',
					message: res.message
				});
				await this.userLogout();
				this.$router.push('/');
			}).catch(() => {
			});
		},
        submitForm(form){
            this.$refs[form].validate( async (valid) => {
                if (valid) {
                    const res = await this.updateUserInfo(this.userInfoForm); //更新個人資訊
                    if(res==='success'){
						this.$notify.success({
                            title: '通知！',
                            message: '個人資訊修改成功！'
                        });
                    }else{
                        this.$notify.error({
                            title: '通知！',
                            message: '個人資訊修改失敗！'
                        });
                    }
                } else {
                    return false;
                }
            });
		},
		formateDate(time){
			const date = new Date(time);
			return `${date.getFullYear()}/${this.formatNum(date.getMonth()+1)}/${this.formatNum(date.getDate())} ${this.formatNum(date.getHours())}:${this.formatNum(date.getMinutes())}`;
		},
		formatNum(num){
			if(num>=10) {
				return num;
			}else{
				return "0"+num;
			}
		}
    },
    computed:{
      	...mapGetters(['userInfo','isLoading'])
    },
    async created(){
	  await this.getUserInfo();
	  this.lastSignInTime = this.formateDate(this.userInfo.metadata.lastSignInTime);
	  this.creationTime = this.formateDate(this.userInfo.metadata.creationTime);
      this.userInfoForm = {
          displayName: this.userInfo.displayName?this.userInfo.displayName:'匿名',
          photoURL: this.userInfo.photoURL?this.userInfo.photoURL:'https://goo.gl/bydiLS'
      }
    }
}
</script>
<style>
input[type="file"] {
  border:1px solid;
    position: absolute;
    width: 0%;
    height: 0%;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
}
.custom-file-upload {
    display: inline-block;
    cursor: pointer;
	position: relative;
	margin-left: 1%;
}
.showUserImg{
    border: 1px dashed rgba(204, 204, 204, 0.925);
	border-radius: 10%;
    vertical-align: middle;
	max-width: 40%;
	margin-left: 25%;
}
.custom-file-upload:hover::before{
	content: '上傳相片';
	position: absolute;
	color: rgba(204, 204, 204, 0.925);
	top: 40%;
	left:40%;
}
.showUserImg:hover{
	border: 1px solid rgba(14, 12, 177, 0.925);
  	opacity: 0;
  	transition-duration: 2.0s;
}
.userInfoForm{
	position: absolute;
	min-width:50%;
	padding-top:1%;
	padding-left:20%;
}
.elrow1{
	margin-top:2%;
	min-width:50%;
	min-height:20%;
	padding-left:20%;
}
.status{
	position: absolute;
	padding-top: 2%;
	margin-left: -5%;
}
@media (min-width: 300px) and (max-width: 1024px) {
	.elrow1{
		font-size: 10px;
	}
	.userInfoForm{
		min-width:70%;
		padding-left:0%;
	}
	.showUserImg{
		margin-left:3%;
		max-width: 30%;
	}
	.status{
		position: relative;
		margin: 5% 0 0 0;
		margin-left:25%;
		margin-right:1%;
		margin-top:15%;
	}
	.custom-file-upload:hover::before{
		top: 40%;
		left:15%;
	}
	.custom-file-upload {
		position: absolute;
		left:0%;
		margin-top:7%;
	}	
}
@media (max-width: 390px) {
	.showUserImg{
		margin-left:5%;
		max-width: 35%;
	}
}
</style>

