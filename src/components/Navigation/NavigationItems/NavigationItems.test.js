import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationsItems from './NavigationItems';
import NavigationsItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<NavigationsItems />);
    });

    it('deve renderizar <NavigationItem />{2} se não isAuthenticated', () => {
        expect(wrapper.find(NavigationsItem)).toHaveLength(2);
    });

    it('deve renderizar <NavigationItem />{3} se isAuthenticated', () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.find(NavigationsItem)).toHaveLength(3);
    });

    it('deve renderizar <NavigationItem />{3} se isAuthenticated', () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.contains(<NavigationsItem link="/logout">Logout</NavigationsItem>)).toEqual(true);
    });
});