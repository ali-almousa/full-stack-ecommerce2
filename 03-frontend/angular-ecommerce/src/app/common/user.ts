export class User {

    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public mobileNumber: string;
    public role: string;
    public statusCd: string;
    public statusMsg: string;
    public authStatus: string;

    constructor(id?: number, name?: string, email?: string, password?: string, mobileNumber?: string,
         role?: string, statusCd?: string, statusMsg?: string, authStatus?: string) {
             this.id = id!;
             this.name = name!;
             this.email = email!;
             this.password = password!;
             this.mobileNumber = mobileNumber!;
             this.role = role!;
             this.statusCd = statusCd!;
             this.statusMsg = statusMsg!;
             this.authStatus = authStatus!;

         }
             

}
