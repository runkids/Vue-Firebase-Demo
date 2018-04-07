import firebase, { database } from 'firebase'
import config from '../config/firebase'

firebase.initializeApp(config);
const db = firebase.database();

export const firebase_auth = firebase.auth();

//註冊
export const singUp = async (userData) => {
    let data = {}
    try {
        const res = await firebase.auth().createUserWithEmailAndPassword(userData.account, userData.password);
        data.message = "success";
        firebase.auth().languageCode = 'zh-tw';
        await firebase.auth().currentUser.sendEmailVerification(); //發送驗證信
    } catch (error) {
        switch (error.code) {
            case 'auth/email-already-in-use': {
                data.message = '此帳號已被註冊！'
                break;
            }
            case 'auth/invalid-email': {
                data.message = '帳號格式有誤！'
                break;
            }
            case 'auth/weak-password': {
                data.message = '密碼強度不足！'
                break;
            }
            default: { data.message = error.message }
        }
    }
    return data;
}

//登入
export const singIn = async (userData) => {
    let data = {}
    try {
        const res = await firebase.auth().signInWithEmailAndPassword(userData.account, userData.password);
        if (!res.emailVerified) { //若帳號沒有驗證過就不可以登入
            data.message = '請先到信箱驗證您的帳號！'
            return data;
        }
        //有勾選『保持登入』的話就設Storage為LOCAL否則為SESSION
        firebase.auth().setPersistence(userData.rememberLogin ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
        data = {
            message: "success",
            uid: res.uid,
            account: userData.account,
            displayName: res.displayName
        }
    } catch (error) {
        switch (error.code) {
            case 'auth/invalid-email': {
                data.message = '無效的帳號格式！'
                break;
            }
            case 'auth/user-disabled': {
                data.message = '此帳號已被禁用！'
                break;
            }
            case 'auth/user-not-found': {
                data.message = '查無此帳號！'
                break;
            }
            case 'auth/wrong-password': {
                data.message = '帳號或密碼錯誤！'
                break;
            }
            default: { data.message = error.message }
        }
        return data;
    }
    return data;
}

//重置密碼
export const resetPassword = async (email) => {
    let data = {}
    try {
        const res = await firebase.auth().sendPasswordResetEmail(email || firebase.auth().currentUser.email);
        data.message = '請到您的信箱驗證您的帳號！'
    } catch (error) {
        switch (error.code) {
            case 'auth/user-not-found': {
                data.message = '查無此帳號！'
                break;
            }
            default: { data.message = error.message }
        }
        return data;
    }
    return data;
}

//登出
export const signOut = async () => {
    try {
        return await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
}

//取得登入者資訊
export const getUserInfo = () => {
    return firebase.auth().currentUser;
}

//更新登入者資訊
export const updateUserInfo = async (data) => {
    let obj = {
        displayName: data.displayName,
        photoURL: data.photoURL
    }
    try {
        return await firebase.auth().currentUser.updateProfile(obj);
    } catch (e) {
        console.log(e);
    }
}

//線上人數
export const onlineMember = () => {
    return db.ref('/OnlineMember/');
}

export const updateOnlineMember = async (val) => {
    const onlineMember =  db.ref('/OnlineMember/');
    await new Promise((res)=>{
        onlineMember.set({userName:!val?'一位匿名會員':val});
        res(val);
     });
}

export const getCharRoomInfo = ()=>{
    return db.ref('/CharRoom/');
}

export const saveNewMsg = async (msgObj) => {
    return await getCharRoomInfo().push(msgObj);
}
