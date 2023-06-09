import NavigationBarComponent from './index';

import {
    INavigationBarComponent
} from './types';

export default {
    component: NavigationBarComponent,
    title: 'Navigation Bar'
};

const Template = (args: INavigationBarComponent) => <NavigationBarComponent {...args} />;

export const Default = Template.bind({});
