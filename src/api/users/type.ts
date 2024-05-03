export interface loginForm{
    username: string,
    password: string,
    role: string
}
export interface dataType extends loginForm{
    token: string,
    id: number,
    avatar: string,
}
export interface loginResponseData{
    flag: boolean,
    data: dataType | null,
    msg: string,
}

export interface UserState {
    token: string | null,
    userInfos: dataType | null,
}
