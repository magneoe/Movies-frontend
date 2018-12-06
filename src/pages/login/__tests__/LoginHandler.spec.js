import React from 'react';

import Enzyme, { shallow, mount } from 'enzyme';
import ShallowRenderer from 'react-test-renderer/shallow';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { LoginHandler } from '../LoginHandler';

beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
});
beforeEach(() => {

});

describe("LoginHandler component", () => {

    describe("The Display unit", () => {
        it("Should render successfully", () => {
            const wrapper = shallow(<LoginHandler />);
            expect(wrapper).toMatchSnapshot();
        });
    });
    describe("IsInputValid function", () => {
        it("Should be valid input", () => {
            let formData = new FormData();
            formData.append('email', 'test@testmail.com');
            formData.append('password', 'testpassword');

            const wrapper = shallow(<LoginHandler />);
            expect(wrapper.instance().isInputValid(formData)).toBe(true);
        });
        it("Should be invalid input", () => {
            //No email
            let formData = new FormData();
            formData.append('password', 'testpassword');

            const wrapper = shallow(<LoginHandler />);
            expect(wrapper.instance().isInputValid(formData)).toBe(false);

            //No email set
            formData = new FormData();
            formData.append('email', '');
            formData.append('password', 'testpassword');

            expect(wrapper.instance().isInputValid(formData)).toBe(false);

            //No @ in email
            formData = new FormData();
            formData.append('email', 'test.com');
            formData.append('password', 'testpassword');

            expect(wrapper.instance().isInputValid(formData)).toBe(false);

            //No password set
            formData = new FormData();
            formData.append('email', 'test@test.com');
            formData.append('password', '');

            expect(wrapper.instance().isInputValid(formData)).toBe(false);
        });
    });

    describe("Simulate login submit", () => {
        it("Should successfully dispatch the action on valid inputs", () => {
            const spy = sinon.spy();
            const wrapper = mount(<LoginHandler actions={{login: spy}}/>, { attachTo: document.body });

            wrapper.find('#email').instance().value = "Test@test.com";
            wrapper.find('#password').instance().value = "Test";
            
            wrapper.find('#loginSubmit').simulate('click',  
                { preventDefault() {} } );

            expect(spy.callCount).toBe(1);

        });

        it("Should not dispatch the action on invalid inputs", () => {
            //No password set
            const spy = sinon.spy();
            const wrapper = mount(<LoginHandler actions={{login: spy}}/>, { attachTo: document.body });
            wrapper.find('#email').value = "Test";
            wrapper.find('#loginSubmit').simulate('click', 
                { preventDefault() {} });

            expect(spy.callCount).toBe(0);
        });
    })

});


