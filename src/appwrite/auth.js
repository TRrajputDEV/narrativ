import conf from '../config/config';

import { Client, Account, ID, Client } from 'appwrite';

export class AuthService {
    client = new Client(); 
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try {
        const useraccount = await this.account.create(ID.unique(), email,password,name);
        if (useraccount){
             // call another method agr account bana toh pahucha do login pr
            
        }else{
            return useraccount
        }
        } catch (error) {
            throw error;
        }
    }


    async login ({email, password}){
        try {
            await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            await this.account.get();
        } catch (error) {
            throw error
        }


        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            throw error
        }
    }



}

const authService = new AuthService();

export default authService;
