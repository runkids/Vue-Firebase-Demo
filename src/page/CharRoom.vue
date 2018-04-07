<template>
  <div class='charRommContain'>
        <div class="msgbox">
            <div  v-for="item in allMsgs" :key="item.timestamp"> 
                <div v-if="item.uid != userInfo.uid " class="msgCard">
                    <img  class="msgphoto" :src="item.photoURL" :alt="item.userName">
                    <div v-if="item.uid != userInfo.uid " class="otherMsg">{{item.message}}</div>
                </div>
                <div v-else style='float:none;' class="msgCard">
                    <div class="selfMsg">{{item.message}}</div>
                </div>
            </div>
        </div>
        <div class="typpingBox">
            <el-input class="inputMsgBox" type="textarea" :autosize="{ minRows: 3, maxRows: 3}" resize="none" placeholder="請輸入訊息" v-model="newMsg.message"></el-input>
            <el-button class="inputMsgBtn" type="primary" icon="el-icon-back" circle @click="addMsg" :disabled="disabled"></el-button>
        </div>
        <audio id="bgMusic">
            <source src="../sound/dingdone.mp3" type="audio/mp3">
        </audio>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {saveNewMsg,getCharRoomInfo} from '../api/firebase'
export default {
  data(){
     return {
         newMsg:{
            message:'',
            timestamp:'',
            userName:'',
            uid:'',
            photoURL:''
        },
        allMsgs:[]
     } 
  },
  methods:{
      async addMsg(){
            this.newMsg.userName = this.userInfo.displayName;
            this.newMsg.uid = this.userInfo.uid;
            this.newMsg.photoURL=this.userInfo.photoURL;
            this.newMsg.timestamp = Math.floor(Date.now() / 1000);
            await saveNewMsg(this.newMsg);
            this.newMsg.message='';
      }
  },
  computed: {
        ...mapGetters(['userInfo']),
        disabled(){
            return this.newMsg.message==='';
        }
  },
  mounted(){
      getCharRoomInfo().orderByChild("timestamp").on('value',(data)=>{
          let firebaseData= data.val() ;
            let msgArr=[];
            for(var item in firebaseData){
                //msgArr.unshift(firebaseData[item]);
                msgArr.push(firebaseData[item]);
            }
            this.allMsgs= msgArr;
            if(this.allMsgs[msgArr.length-1].uid!=this.userInfo.uid){
                document.getElementById("bgMusic").play();
            }
      });
  }
}
</script>
<style>
.charRommContain{
    box-sizing: border-box;
}
.typpingBox{
    position: relative;
    height: 20%;
    margin-top: 10px;
}
.inputMsgBox{
    position: absolute;
    display: inline-block;
    width: 80%;
    left:4%;
    margin-bottom:2%;
}
.inputMsgBtn{
    position: absolute;
    right:5%;
    width: 10%;
    height: 45%;
}
.msgbox{
    height: 80%;
    margin-left: auto;
    margin-right: auto;
    overflow-y: scroll;
    overflow-x: auto;
}
.msgCard{
   display: flex;
   align-items: center;
   margin-top: 1%;
}
.msgphoto{
    width: 4%;
    height: 4%;
    border-radius: 100%; 
    margin-right: 1% ;
    margin-left: 2% ;
}
.selfMsg{
    position: relative;
    align-items: center;
    height: 5%;
    background-color:#eee;
    border-radius: 5px;
    right: -80%;
    padding: 5px;
    max-width: 200px;
    word-break: break-all;
}
.otherMsg{
    max-width: 200px;
    word-break: break-all;
    background-color:#eee;
    border-radius: 5px;
    padding: 5px;
}

@media (max-width: 480px) {
	.selfMsg{
        right: -60%;
        max-width: 120px;
    }
    .otherMsg{
        max-width: 120px;
    }
    .msgphoto{
        width: 15%;
        height: 15%;
        margin-right: 1% ;
        margin-left: 3% ;
    }
    .inputMsgBox{
        width: 70%;
    }
    .inputMsgBtn{
        width: 16%;
        height: 50%;
    }
}
</style>
