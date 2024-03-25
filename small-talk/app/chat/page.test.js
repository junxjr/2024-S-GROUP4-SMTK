import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../chat/page.js';
import socket from '../../util/socket';

// Mock socket.io module
jest.mock('../../util/socket', () => ({
    auth: null,
    connect: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    id: 'mockedSocketID'
}));

// create all the test cases for what is currently up in the page.js, can add more for future functionality 
describe('Chat Component', () => {
    // once each test case is done, clear it so the next test case is run off a fresh implementation
    afterEach(() => {
        jest.clearAllMocks();
    });

    // check that the chat page loads without crashing or taking too long
    it('renders without crashing', () => {
        render(<Chat />);
    });

    // simulate the button being clicked in order to connect to the socket
    it('connects to socket on button click', async () => {
        // render chat
        const { getByText } = render(<Chat />);
        // by using text, find the Connect button
        const connectButton = getByText('Connect');
        // using fireEvent, simulate a push of a button
        fireEvent.click(connectButton);
        await waitFor(() => {
            expect(socket.connect).toHaveBeenCalled();
        });
    });

    //last test checks that the socket is listening and updating the different states correctly. 
    it('listens for socket events and updates state accordingly', async () => {
        // create a mock with 2 users
        const mockUsers = [
            { userID: '1', username: 'user1' },
            { userID: '2', username: 'user2' }
        ];
    
        // render the chat
        const { container } = render(<Chat />);
        // following code will simulate the different events we have so far.
    
        // mock socket events
        const socketOnMock = jest.spyOn(socket, 'on');
    
        // simulate "users" event
        const usersEventHandler = socketOnMock.mock.calls.find(call => call[0] === 'users')[1];
        usersEventHandler(mockUsers);
    
        // get the user state from the chat
        const usersElement = await waitFor(() => container.querySelector('.user-list'));
        const usersTextContent = usersElement.textContent;
        // check if the state is correctly updated
        // so when button is clicked there should be a text on the screen where it says the users name, look for it
        expect(usersTextContent).toContain('user1');
        expect(usersTextContent).toContain('user2');
    
        // simulate "user connected" event
        const connectedUser = { userID: '3', username: 'newUser' };
        const userConnectedEventHandler = socketOnMock.mock.calls.find(call => call[0] === 'user connected')[1];
        userConnectedEventHandler(connectedUser);
    
        // get the updated user state from the chat
        const updatedUsersElement = await waitFor(() => container.querySelector('.user-list'));
        const updatedUsersTextContent = updatedUsersElement.textContent;
    
        // check if the connected user is added to the list of users 
        expect(updatedUsersTextContent).toContain('newUser');
    });
    
});