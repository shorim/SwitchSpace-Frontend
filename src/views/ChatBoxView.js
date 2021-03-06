"use strict";
// React
import React from "react";
import PropTypes from "prop-types";
// Components
import ChatBox from "../components/Chat/ChatBox";
// Services
import ChatService from "../services/ChatService";
import UserAuthService from "../services/UserAuthService";
import HttpService from "../services/HttpService";
// Socket io
import io from "socket.io-client";

export default class ChatBoxView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // userId is referring to the logged-in user
            userId: "",
            // otherUserId is referring to the other participant which the logged-in user is chatting with
            otherUserId: "",
            otherUserName: "",
            otherUserPicture: {},
            messages: [],
            // messageInput state is stored here instead of ChatBox component to be able to clear its value after sending a message
            messageInput: "",
            messageInputValid: false,
        };

        this.closeChat = this.closeChat.bind(this);
        this.onChatMsgHandler = this.onChatMsgHandler.bind(this);
        this.createMessage = this.createMessage.bind(this);
        this.createHistoryMessages = this.createHistoryMessages.bind(this);
        this.getChatHistory = this.getChatHistory.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageInputChange = this.onMessageInputChange.bind(this);
    }

    static get propTypes() {
        return {
            // receiverIdFromPost is not a required prop
            receiverIdFromPost: PropTypes.string,
            receiverIdFromMenu: PropTypes.string.isRequired,
            setUnreadChats: PropTypes.func.isRequired,
            onNotify: PropTypes.func.isRequired,
        };
    }

    componentDidMount() {
        // if a normal user is logged-in, then create a socket connection
        if (UserAuthService.isNormalUser()) {
            const token = window.localStorage["jwtToken"];
            this.socket = io(`${HttpService.apiURL()}?token=${token}`);
            this.socket.on("chat message", this.onChatMsgHandler);
        }

        const user = UserAuthService.getCurrentUser();
        this.setState({
            userId: user.id,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.receiverIdFromPost && this.props.receiverIdFromPost !== prevProps.receiverIdFromPost) {
            this.getChatHistory(this.props.receiverIdFromPost);
        }

        if (this.props.receiverIdFromMenu && this.props.receiverIdFromMenu !== prevProps.receiverIdFromMenu) {
            this.getChatHistory(this.props.receiverIdFromMenu);
        }
    }

    componentWillUnmount() {
        // close socket connection if existed (which means that a normal user was logged-in)
        if (this.socket) {
            this.socket.close();
        }
    }

    closeChat() {
        this.setState({
            otherUserId: "",
        });
    }

    sendMessage() {
        if (!this.state.messageInputValid) {
            return;
        }
        const data = {
            receiverId: this.state.otherUserId,
            content: this.state.messageInput,
        };
        this.socket.emit("chat message", data, ack => {
            if (ack.success) {
                const message = this.createMessage("right", this.state.messageInput, new Date());
                let messages = this.state.messages;
                messages.push(message);
                this.setState({
                    messages: messages,
                    messageInput: "",
                    messageInputValid: false,
                });
            } else {
                this.props.onNotify(ack.message, "error");
            }
        });
    }

    async onChatMsgHandler(data) {
        if (this.state.otherUserId !== data.senderId) {
            // if the sender is a different user than the one you are currently chatting with,
            // then fetch the history of chat with this new sender
            this.getChatHistory(data.senderId);
        } else {
            // if you are already chatting with the user who has sent the message,
            // then just add this message to the current messages array
            const message = this.createMessage("left", data.content, new Date());
            let messages = this.state.messages;
            messages.push(message);
            this.setState({
                messages: messages,
            });
        }
    }

    async getChatHistory(otherUserId) {
        try {
            const chatHistoryResp = await ChatService.getChatHistory(otherUserId);
            const chatHistory = chatHistoryResp.data.data;
            const messagesFormatted = this.createHistoryMessages(chatHistory.messages);
            this.setState({
                otherUserId: otherUserId,
                otherUserName: chatHistory.otherUserName,
                otherUserPicture: chatHistory.otherUserPicture,
                messages: messagesFormatted,
            });
            this.props.setUnreadChats();
        } catch (err) {
            this.props.onNotify(err, "error");
        }
    }

    createHistoryMessages(historyMessages) {
        let historyMessagesFormatted = [];
        for (const historyMessage of historyMessages) {
            const position = historyMessage.senderId === this.state.userId ? "right" : "left";
            const message = this.createMessage(position, historyMessage.content, new Date(historyMessage.createdAt));
            historyMessagesFormatted.push(message);
        }
        return historyMessagesFormatted;
    }

    createMessage(position, content, date) {
        const message = {
            position: position,
            type: "text",
            text: content,
            date: date,
        };
        return message;
    }

    onMessageInputChange(event) {
        const value = event.target.value;
        let messageInputValid = false;
        // check if the length of the message is greater than 0 after removing trailing white spaces
        // NOTE: \s matches whitespaces
        if (value.replace(/\s+$/, "").length > 0) {
            messageInputValid = true;
        }
        this.setState({
            messageInput: value,
            messageInputValid: messageInputValid,
        });
    }

    render() {
        if (this.state.otherUserId) {
            // ChatBox should only appear if otherUserId has a value
            return (
                <React.Fragment>
                    <ChatBox
                        otherUserId={this.state.otherUserId}
                        otherUserPicture={this.state.otherUserPicture}
                        otherUserName={this.state.otherUserName}
                        messages={this.state.messages}
                        closeChat={this.closeChat}
                        sendMessage={this.sendMessage}
                        messageInput={this.state.messageInput}
                        onMessageInputChange={this.onMessageInputChange}
                    />
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
}
