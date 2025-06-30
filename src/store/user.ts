
import { defineStore } from "pinia";


export const userStore = defineStore("userStore", {
  actions: {
    changeUserName(value: string) {
      if(value && value.length < 10){
        this.username = value
      }
    }
  },
  getters: {
    getUsername(): string{
      return this.username
    }
  },
  state() {
    return {
      username: "--",
    };
  }
})
