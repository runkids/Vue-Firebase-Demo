const mutations = {
    signout(state){
        state.userInfo={};
    },
    rememberAccount(state,data){
        let item = window.localStorage.getItem('rememberAccount');
        if(data.remember&&!item){
            window.localStorage.setItem('rememberAccount',data.account);
        }
        if(!data.remember&&item){
            window.localStorage.removeItem('rememberAccount');
        }
    },
    loading(state){
        state.isLoading=!state.isLoading;
    },
    setUserInfo(state,userData){
        state.userInfo = userData;
    }
}

export default mutations;