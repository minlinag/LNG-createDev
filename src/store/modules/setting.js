
const setting = {
    namespaced:true,
    getters:{
        menuArr(state){
            return state
        }
    },
    state:{
        menuList:[]
    },
    mutations:{
    
    },
    actions:{
        menuListSet(state,value){
            state.menuList = value
        }
    }
}   
export default setting
