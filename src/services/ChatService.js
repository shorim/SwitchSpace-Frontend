"use strict";
import HttpService from "./HttpService";

export default class ChatService {
    constructor() {}

    static baseURL() {
        return "/chat";
    }

    static getChatHistory(otherUserId) {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${ChatService.baseURL()}/${otherUserId}`,
                function (data) {
                    resolve(data);
                },
                function (data) {
                    reject(data);
                }
            );
        });
    }

    static getChatList() {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${ChatService.baseURL()}/`,
                function (data) {
                    resolve(data);
                },
                function (data) {
                    reject(data);
                }
            );
        });
    }

    static getUnreadChats() {
        return new Promise((resolve, reject) => {
            HttpService.get(
                `${ChatService.baseURL()}/unreadChats`,
                function (data) {
                    resolve(data);
                },
                function (data) {
                    reject(data);
                }
            );
        });
    }
}
