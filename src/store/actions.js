import { singUp, singIn, signOut, resetPassword, getUserInfo, updateUserInfo, updateOnlineMember } from '../api/firebase'

const actions = {
    async loginCheck({ commit, state }, userData) { //檢查登入資訊
        commit('loading');
        const res = await singIn(userData);
        if (res.message === 'success') {
            await updateOnlineMember(res.displayName);
        }
        commit('loading');
        return res;
    },
    async registerNewAccount({ commit }, userData) { //註冊新帳號
        commit('loading');
        const res = await singUp(userData);
        commit('loading');
        return res;
    },
    async userLogout({ commit, state }) {  //登出
        commit('loading');
        await signOut();
        commit('signout');
        commit('loading');
    },
    async resetPassword({ commit }, email) { //重置密碼
        const res = await resetPassword(email);
        return res;
    },
    async getUserInfo({ commit }) { //取得登入者資訊
        const res = await getUserInfo();
        commit('setUserInfo', res);
        return res;
    },
    async updateUserInfo({ commit }, data) { //更新登入者資訊
        commit('loading');
        await updateUserInfo(data);
        commit('setUserInfo', await getUserInfo());
        commit('loading');
        return "success";
    },
    rememberAccount({ commit }, data) { //記住帳號
        commit('rememberAccount', data);
    },
}

export default actions;