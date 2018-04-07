const pages = {}

pages.login = r => require.ensure([], () => r(require('../../page/Login')), 'Login'); 
pages.home = r => require.ensure([], () => r(require('../../page/Home')), 'Home'); 
pages.user = r => require.ensure([], () => r(require('../../page/User')), 'User'); 
pages.charRoom = r => require.ensure([], () => r(require('../../page/CharRoom')), 'CharRoom'); 

export default pages;