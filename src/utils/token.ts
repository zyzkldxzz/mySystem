export const SET_TOKEN = (token:string)=>{
    sessionStorage.setItem('TOKEN',token)
}
export const GET_TOKEN = ()=>{
    return sessionStorage.getItem('TOKEN')
}
export const REMOVE_TOKEN = ()=>{
    sessionStorage.removeItem('TOKEN')
}